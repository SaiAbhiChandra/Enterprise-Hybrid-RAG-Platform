from app.dependencies.services import get_retriever
from app.retrieval.context_builder import ContextBuilder
from app.llm.prompt_builder import PromptBuilder
from app.llm.provider import MockLLMProvider
from app.llm.service import LLMService

question = "How can I apply for PNB?"

retriever = get_retriever()

response = retriever.retrieve(question)

context = ContextBuilder().build(response)

prompt = PromptBuilder().build(
    question=question,
    context=context,
)

llm = LLMService(
    provider=MockLLMProvider(),
)

answer = llm.generate(prompt)

print("=" * 100)
print(answer)
print("=" * 100)