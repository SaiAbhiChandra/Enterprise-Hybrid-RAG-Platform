from app.dependencies.services import get_llm_service

service = get_llm_service()

print("=" * 80)

for token in service.stream(
    "Explain Artificial Intelligence in one paragraph."
):
    print(token, end="", flush=True)

print("\n")
print("=" * 80)