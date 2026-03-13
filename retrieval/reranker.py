from sentence_transformers import CrossEncoder


class Reranker:

    def __init__(self, model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model = CrossEncoder(model_name)

    def rerank(self, query, documents, top_k=5):

        pairs = [(query, doc["text"]) for doc in documents]

        scores = self.model.predict(pairs)

        scored_docs = list(zip(documents, scores))

        ranked = sorted(
            scored_docs,
            key=lambda x: x[1],
            reverse=True
        )

        results = [doc for doc, score in ranked[:top_k]]

        return results