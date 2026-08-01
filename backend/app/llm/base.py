from abc import ABC
from abc import abstractmethod


class LLMProvider(ABC):
    """
    Base interface for all LLM providers.
    """

    @abstractmethod
    def generate(
        self,
        prompt: str,
    ) -> str:
        pass