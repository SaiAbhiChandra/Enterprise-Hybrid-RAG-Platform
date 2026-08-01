from app.llm.prompt_builder import PromptBuilder

builder = PromptBuilder()

prompt = builder.build(
    question="How can I apply for PNB?",
    context="Candidates can apply online through the official PNB website.",
)

print("=" * 80)
print(prompt)
print("=" * 80)