from app.llm.base import LLMProvider


class MockLLMProvider(LLMProvider):
    """
    Temporary provider used while building the pipeline.
    """

    def generate(
        self,
        prompt: str,
    ) -> str:

        return (
            "LLM RESPONSE\n\n"
            "Prompt received successfully.\n\n"
            + prompt[:600]
        )