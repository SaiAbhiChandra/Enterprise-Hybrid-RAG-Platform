from abc import ABC, abstractmethod


class VectorStoreProvider(ABC):
    """
    Base interface for vector stores.
    """

    @abstractmethod
    def create_collection(self):
        pass

    @abstractmethod
    def upsert(
        self,
        ids,
        vectors,
        payloads,
    ):
        pass

    @abstractmethod
    def search(
        self,
        vector,
        limit: int = 5,
    ):
        pass

    @abstractmethod
    def delete(
        self,
        ids,
    ):
        pass