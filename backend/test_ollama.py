from app.llm.providers.ollama_provider import OllamaProvider

provider = OllamaProvider()

response = provider.generate(
    """
    Say hello in one sentence.
    """
)

print("=" * 80)
print(response)
print("=" * 80)