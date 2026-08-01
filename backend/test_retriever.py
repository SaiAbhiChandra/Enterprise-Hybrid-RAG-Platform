from app.dependencies.services import get_retriever

retriever = get_retriever()

results = retriever.retrieve(
    "How can I apply for PNB?"
)

print("=" * 80)

print("Results:", len(results))

print("=" * 80)

for result in results:

    print(result.score)

    print(result.payload["chunk_index"])

    print(result.payload["text"][:250])

    print("-" * 80)