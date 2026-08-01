from app.llm.base import LLMProvider


class LLMService:

    def __init__(
        self,
        provider: LLMProvider,
    ):
        self.provider = provider

    def generate(
        self,
        prompt: str,
    ) -> str:

        return self.provider.generate(
            prompt
        )
        
    def stream(
        self,
        prompt: str,
    ):
        """
        Stream generated tokens.
        """

        return self.provider.stream(
            prompt,
        )