from app.schemas.retrieval import RetrievalResponse


class ContextBuilder:
    """
    Builds LLM-ready context.
    """

    def build(
        self,
        response: RetrievalResponse,
    ) -> str:

        context = []

        for chunk in response.chunks:

            context.append(

                f"""
Context {chunk.chunk_index}

Score:
{chunk.score:.4f}

Content:
{chunk.text}
"""
            )

        return "\n\n----------------------------------\n".join(
            context
        )