from app.schemas.retrieval import RetrievalResponse, RetrievedChunk


class ChunkDeduplicator:
    """
    Removes exact and near-duplicate chunks from a retrieval response.

    Recursive/overlapping chunking strategies frequently return chunks
    that share 80-90% of their text (e.g. chunk N and chunk N+1
    overlapping at a sliding-window boundary). Passing both to the LLM
    wastes context budget and biases the model toward whatever content
    happens to be duplicated. This stage catches that case in addition
    to true exact duplicates.

    Near-duplicate detection uses Jaccard similarity over word
    shingles rather than embeddings -- it needs to run synchronously,
    in-process, on every request, so it deliberately avoids another
    model call or DB round trip.
    """

    def __init__(
        self,
        near_duplicate_threshold: float = 0.85,
    ):
        self.near_duplicate_threshold = near_duplicate_threshold

    def deduplicate(
        self,
        response: RetrievalResponse,
    ) -> RetrievalResponse:

        unique_chunks: list[RetrievedChunk] = []
        seen_texts: set[str] = set()
        seen_shingles: list[set[str]] = []

        for chunk in response.chunks:

            normalized = self._normalize(chunk.text)

            if normalized in seen_texts:
                continue

            shingles = self._shingles(normalized)

            if self._is_near_duplicate(shingles, seen_shingles):
                continue

            seen_texts.add(normalized)
            seen_shingles.append(shingles)
            unique_chunks.append(chunk)

        response.chunks = unique_chunks

        return response

    def _normalize(self, text: str) -> str:
        return " ".join(text.strip().lower().split())

    def _shingles(self, text: str, size: int = 5) -> set[str]:
        words = text.split()

        if len(words) < size:
            return {text}

        return {
            " ".join(words[i : i + size])
            for i in range(len(words) - size + 1)
        }

    def _is_near_duplicate(
        self,
        shingles: set[str],
        seen_shingles: list[set[str]],
    ) -> bool:

        if not shingles:
            return False

        for other in seen_shingles:

            if not other:
                continue

            intersection = len(shingles & other)
            union = len(shingles | other)

            if union == 0:
                continue

            jaccard = intersection / union

            if jaccard >= self.near_duplicate_threshold:
                return True

        return False
