from app.vectorstores.base import VectorStoreProvider


class QdrantService:

    def __init__(
        self,
        provider: VectorStoreProvider,
    ):
        self.provider = provider

    def initialize(self):

        self.provider.create_collection()

    def upsert(
        self,
        ids,
        vectors,
        payloads,
    ):

        self.provider.upsert(
            ids,
            vectors,
            payloads,
        )

    def search(
        self,
        vector,
        limit=5,
    ):

        return self.provider.search(
            vector,
            limit,
        )

    def delete(
        self,
        ids,
    ):

        self.provider.delete(ids)