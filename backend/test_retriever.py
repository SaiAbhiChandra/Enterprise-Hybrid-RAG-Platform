from app.dependencies.services import get_retriever

retriever = get_retriever()

response = retriever.retrieve(
    "How can I apply for PNB?"
)

print("=" * 80)

print("Query:", response.query)
print("Results:", len(response.chunks))

print("=" * 80)

for chunk in response.chunks:

    print(chunk.score)

    print(chunk.chunk_index)

    print(chunk.text[:250])

    print("-" * 80)
