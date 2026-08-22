"""
Auto-generates a retrieval evaluation set from your already-uploaded
documents, using your own local LLM (Ollama) to write realistic
questions from real chunk text.

Writing 15-20 evaluation questions by hand is tedious enough that
most people (reasonably) skip it -- but evaluate_retrieval.py's
numbers are only meaningful if the eval set actually reflects your
real documents. This script does the mechanical work of reading your
content and drafting questions; you should still skim the output
afterward (see the note printed at the end) since an LLM-drafted
question is a strong starting point, not a guarantee of quality.

Usage:
    python generate_eval_set.py
    python generate_eval_set.py --per-document 4 --output eval_set.json
"""

import argparse
import json

from app.db.session import SessionLocal
from app.dependencies.services import get_chunk_repository, get_llm_service
from app.repositories.document_repository import DocumentRepository


QUESTION_PROMPT = """You will be shown a short excerpt from a document. Write ONE realistic question that a user could ask, where this excerpt would be the correct answer.

Rules:
- Output ONLY the question text, nothing else -- no preamble, no quotes, no "Question:" prefix.
- The question should be answerable specifically from this excerpt, not generic.
- Write it the way a real person would type it into a chat box -- natural, not formal.

Excerpt:
{text}

Question:"""


def pick_sample_chunks(chunks, per_document):
    """
    Spreads the sample across the whole document rather than only
    taking the first few chunks -- otherwise the eval set would be
    biased toward whatever topic happens to open the document.
    """

    if len(chunks) <= per_document:
        return chunks

    step = len(chunks) / per_document
    return [chunks[int(i * step)] for i in range(per_document)]


def generate_question(llm, chunk_text: str) -> str:
    prompt = QUESTION_PROMPT.format(text=chunk_text.strip()[:1500])
    question = llm.generate(prompt).strip()

    # Some models wrap the answer in quotes despite instructions not to.
    return question.strip('"').strip()


def main():
    parser = argparse.ArgumentParser(
        description="Auto-generate a retrieval eval set from your uploaded documents."
    )
    parser.add_argument(
        "--per-document",
        type=int,
        default=3,
        help="How many questions to generate per document (default: 3)",
    )
    parser.add_argument(
        "--output",
        default="eval_set.json",
        help="Output file path (default: eval_set.json)",
    )
    args = parser.parse_args()

    db = SessionLocal()
    document_repository = DocumentRepository()
    chunk_repository = get_chunk_repository()
    llm = get_llm_service()

    documents = document_repository.get_all(db=db)

    if not documents:
        print("No documents found. Upload some documents first.")
        db.close()
        return

    eval_set = []
    skipped_empty = 0

    for document in documents:
        chunks = chunk_repository.get_by_document_id(
            db=db,
            document_id=document.id,
        )

        # "Has chunks" is used instead of checking document.status --
        # documents uploaded before this script existed may still
        # show a stale status value, but if chunks exist, indexing
        # genuinely succeeded and the document is safe to sample from.
        if not chunks:
            skipped_empty += 1
            continue

        sample = pick_sample_chunks(chunks, args.per_document)

        print(f"\n{document.original_filename} ({len(chunks)} chunks, sampling {len(sample)})")

        for chunk in sample:
            question = generate_question(llm, chunk.text)

            if not question or len(question) < 8:
                continue

            print(f"  - {question}")

            eval_set.append(
                {
                    "question": question,
                    "expected_document": document.original_filename,
                }
            )

    with open(args.output, "w") as f:
        json.dump(eval_set, f, indent=2)

    print("\n" + "=" * 72)
    print(f"Wrote {len(eval_set)} questions to {args.output}")
    if skipped_empty:
        print(f"Skipped {skipped_empty} document(s) with no chunks (upload may have failed).")
    print("=" * 72)
    print(
        "\nReview these before running evaluate_retrieval.py -- LLM-drafted\n"
        "questions are a strong starting point but occasionally too generic,\n"
        "or echo the source text too closely to be realistic. Reword or\n"
        "delete any that don't feel like something a real user would type,\n"
        "and consider adding a few hand-written tricky ones -- questions\n"
        "using synonyms, or that could plausibly match two documents --\n"
        "since that's exactly where hybrid retrieval is supposed to earn\n"
        "its keep over dense-only search."
    )

    db.close()


if __name__ == "__main__":
    main()
