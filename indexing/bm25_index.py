from rank_bm25 import BM25Okapi


class BM25Index:

    def __init__(self):
        self.bm25 = None
        self.chunks = None

    def build_index(self, chunks):

        self.chunks = chunks

        tokenized_corpus = [
            chunk["text"].split()
            for chunk in chunks
        ]

        self.bm25 = BM25Okapi(tokenized_corpus)

    def search(self, query, top_k=5):

        tokenized_query = query.split()

        scores = self.bm25.get_scores(tokenized_query)

        ranked_indices = sorted(
            range(len(scores)),
            key=lambda i: scores[i],
            reverse=True
        )[:top_k]

        results = [self.chunks[i] for i in ranked_indices]

        return results