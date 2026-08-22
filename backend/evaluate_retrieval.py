"""
Retrieval evaluation harness for the hybrid RAG pipeline.

Compares three retrieval configurations against a hand-labeled set of
question -> expected-document pairs, so retrieval quality claims are
backed by a real number instead of "it seemed to work when I tried
it":

    1. Dense only          -- semantic/embedding search via Qdrant
    2. Hybrid               -- dense + sparse RRF fusion, no reranking
    3. Hybrid + Reranked     -- the full production pipeline

For each question, this checks whether a chunk from the expected
document actually appears in the retrieved results, and at what
rank -- exactly what a recruiter or interviewer would ask "how do you
know it works" about.

Usage:
    python evaluate_retrieval.py eval_set.json
    python evaluate_retrieval.py eval_set.json --top-k 3

eval_set.json format:
[
  {
    "question": "What is the refund policy for late requests?",
    "expected_document": "refund_policy.pdf"
  },
  {
    "question": "How do I apply for a personal loan?",
    "expected_document": "loan_guide.docx"
  }
]

"expected_document" must exactly match the original_filename of a
document you've already uploaded through the app -- see
eval_set.example.json for a template, and the note at the bottom of
this file for how to build a real one from your own documents.
"""

import argparse
import json

from app.db.session import SessionLocal
from app.dependencies.services import (
    get_chunk_deduplicator,
    get_context_merger,
    get_context_optimizer,
    get_reranker_service,
    get_retriever,
    get_sparse_retriever,
)
from app.repositories.document_repository import DocumentRepository
from app.schemas.retrieval import RetrievalResponse


def load_eval_set(path: str) -> list[dict]:
    with open(path) as f:
        return json.load(f)


def resolve_document_name(db, document_repository, document_id, cache):
    if document_id not in cache:
        doc = document_repository.get_by_id(db=db, obj_id=document_id)
        cache[document_id] = doc.original_filename if doc else None
    return cache[document_id]


def run_dense_only(retriever, question, top_k):
    return retriever.retrieve(query=question, top_k=top_k).chunks


def run_hybrid(retriever, sparse_retriever, merger, deduplicator, db, question, top_k):
    dense = retriever.retrieve(query=question, top_k=top_k)
    sparse = sparse_retriever.retrieve(db=db, query=question, top_k=top_k)
    merged = merger.merge([dense, sparse])
    deduped = deduplicator.deduplicate(merged)
    return deduped.chunks[:top_k]


def run_hybrid_reranked(
    retriever,
    sparse_retriever,
    merger,
    deduplicator,
    reranker,
    optimizer,
    db,
    question,
    top_k,
    candidate_k=15,
):
    dense = retriever.retrieve(query=question, top_k=candidate_k)
    sparse = sparse_retriever.retrieve(db=db, query=question, top_k=candidate_k)
    merged = merger.merge([dense, sparse])
    deduped = deduplicator.deduplicate(merged)
    reranked = reranker.rerank(
        RetrievalResponse(query=question, chunks=deduped.chunks)
    )
    optimized = optimizer.optimize(reranked, max_chunks=top_k)
    return optimized.chunks


def score(chunks_per_question, eval_set, db, document_repository, verbose=False):
    """
    Recall@k: fraction of questions where a chunk from the expected
    document appeared anywhere in the retrieved results.

    MRR (Mean Reciprocal Rank): average of 1/rank of the first chunk
    from the expected document (0 if it never appears). Rewards
    finding the right document *near the top*, not just somewhere in
    the results -- which matters, since only the top few chunks
    actually make it into the LLM's context after optimization.
    """

    cache = {}
    hits = 0
    reciprocal_ranks = []

    for case, chunks in zip(eval_set, chunks_per_question):
        expected = case["expected_document"]
        found_rank = None

        for rank, chunk in enumerate(chunks, start=1):
            name = resolve_document_name(
                db, document_repository, chunk.document_id, cache
            )
            if name == expected:
                found_rank = rank
                break

        if found_rank:
            hits += 1
            reciprocal_ranks.append(1.0 / found_rank)
        else:
            reciprocal_ranks.append(0.0)

        if verbose:
            status = f"rank {found_rank}" if found_rank else "MISS"
            marker = "  " if found_rank == 1 else ("⚠ " if found_rank else "✗ ")
            print(f"    {marker}[{status:>7}] {case['question'][:70]}")

    n = len(eval_set)
    recall_at_k = hits / n if n else 0.0
    mrr = sum(reciprocal_ranks) / n if n else 0.0

    return recall_at_k, mrr


def main():
    parser = argparse.ArgumentParser(
        description="Evaluate hybrid retrieval quality against a labeled question set."
    )
    parser.add_argument(
        "eval_set", help="Path to a JSON file of {question, expected_document} pairs"
    )
    parser.add_argument(
        "--top-k", type=int, default=5, help="How many chunks each config returns"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print per-question hit/miss detail, not just aggregate scores",
    )
    args = parser.parse_args()

    eval_set = load_eval_set(args.eval_set)

    if not eval_set:
        print("Eval set is empty -- nothing to evaluate.")
        return

    db = SessionLocal()
    document_repository = DocumentRepository()

    retriever = get_retriever()
    sparse_retriever = get_sparse_retriever()
    merger = get_context_merger()
    deduplicator = get_chunk_deduplicator()
    reranker = get_reranker_service()
    optimizer = get_context_optimizer()

    configs = {
        "Dense only": lambda q: run_dense_only(retriever, q, args.top_k),
        "Hybrid (dense+sparse)": lambda q: run_hybrid(
            retriever, sparse_retriever, merger, deduplicator, db, q, args.top_k
        ),
        "Hybrid + Reranked": lambda q: run_hybrid_reranked(
            retriever,
            sparse_retriever,
            merger,
            deduplicator,
            reranker,
            optimizer,
            db,
            q,
            args.top_k,
        ),
    }

    print("=" * 72)
    print(f"Retrieval Evaluation -- {len(eval_set)} questions, top_k={args.top_k}")
    print("=" * 72)

    results_table = []

    for name, run_fn in configs.items():
        chunks_per_question = [run_fn(case["question"]) for case in eval_set]

        print(f"\n{name}")

        recall, mrr = score(
            chunks_per_question, eval_set, db, document_repository, verbose=args.verbose
        )
        results_table.append((name, recall, mrr))

        print(f"  Recall@{args.top_k}: {recall:.1%}")
        print(f"  MRR:        {mrr:.3f}")

    print("\n" + "=" * 72)
    print("Summary")
    print("=" * 72)
    header = f"{'Configuration':<25}{'Recall@' + str(args.top_k):<15}{'MRR':<10}"
    print(header)
    print("-" * len(header))
    for name, recall, mrr in results_table:
        print(f"{name:<25}{recall:<15.1%}{mrr:<10.3f}")

    db.close()


if __name__ == "__main__":
    main()
