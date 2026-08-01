from ollama import Client

from app.core.config import settings
from app.llm.base import LLMProvider


class OllamaProvider(LLMProvider):
    """
    Enterprise Ollama Provider.
    """

    def __init__(self):

        self.client = Client(
            host="http://localhost:11434",
        )

        self.model = settings.OLLAMA_MODEL

    def generate(
        self,
        prompt: str,
    ) -> str:

        response = self.client.generate(
            model=self.model,
            prompt=prompt,
        )

        return response["response"]
    
    def stream(
        self,
        prompt: str,
    ):
        """
        Stream tokens from Ollama.
        """

        stream = self.client.generate(
            model=self.model,
            prompt=prompt,
            stream=True,
        )

        for chunk in stream:

            yield chunk["response"]