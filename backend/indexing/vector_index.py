from sentence_transformers import SentenceTransformer
import faiss
import numpy as np


class VectorIndex:

    def __init__(self, model_name="BAAI/bge-small-en"):
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.chunks = []

    def build_index(self, chunks):

        texts = [chunk["text"] for chunk in chunks]

        embeddings = self.model.encode(
            texts,
            show_progress_bar=True
        )

        embeddings = np.array(embeddings).astype("float32")

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(embeddings)

        self.chunks = chunks

    def search(self, query, top_k=5):

        query_embedding = self.model.encode([query])
        query_embedding = np.array(query_embedding).astype("float32")

        distances, indices = self.index.search(query_embedding, top_k)

        results = []

        for idx in indices[0]:
            results.append(self.chunks[idx])

        return results