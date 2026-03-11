class HybridRetriever:

    def __init__(self, vector_index, bm25_index, k=60):
        self.vector_index = vector_index
        self.bm25_index = bm25_index
        self.k = k

    def retrieve(self, query, top_k=10):

        vector_results = self.vector_index.search(query, top_k)
        bm25_results = self.bm25_index.search(query, top_k)

        scores = {}

        for rank, doc in enumerate(vector_results):
            key = doc["chunk_id"]
            scores[key] = scores.get(key, 0) + 1 / (self.k + rank)

        for rank, doc in enumerate(bm25_results):
            key = doc["chunk_id"]
            scores[key] = scores.get(key, 0) + 1 / (self.k + rank)

        all_docs = {doc["chunk_id"]: doc for doc in vector_results + bm25_results}

        ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        results = [all_docs[doc_id] for doc_id, _ in ranked[:top_k]]

        return results