from app.dependencies.services import (
    get_retriever,
)
from app.retrieval.context_builder import (
    ContextBuilder,
)

retriever = get_retriever()

builder = ContextBuilder()

response = retriever.retrieve(
    "How can I apply for PNB?"
)

context = builder.build(response)

print("=" * 80)

print(context)

print("=" * 80)