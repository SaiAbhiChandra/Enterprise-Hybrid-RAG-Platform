from pathlib import Path


class PromptBuilder:
    """
    Builds prompts for Retrieval-Augmented Generation.
    """

    def __init__(self):

        prompt_path = (
            Path(__file__)
            .parent.parent
            / "prompts"
            / "rag_prompt.txt"
        )

        self.template = prompt_path.read_text(
            encoding="utf-8"
        )

    def build(
        self,
        question: str,
        context: str,
    ) -> str:

        return (
            self.template
            .replace("{question}", question)
            .replace("{context}", context)
        )