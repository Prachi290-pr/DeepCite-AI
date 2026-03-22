import json
from datetime import datetime
from sentence_transformers import SentenceTransformer, util


class RAGEvaluator:

    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")


    def context_precision(self, query, retrieved_docs):

        query_embedding = self.model.encode(query, convert_to_tensor=True)

        scores = []

        for doc in retrieved_docs:
            emb = self.model.encode(doc["text"], convert_to_tensor=True)
            score = util.cos_sim(query_embedding, emb).item()
            scores.append(score)

        return sum(scores) / len(scores)


    def answer_relevance(self, query, answer):

        query_embedding = self.model.encode(query, convert_to_tensor=True)
        answer_embedding = self.model.encode(answer, convert_to_tensor=True)

        score = util.cos_sim(query_embedding, answer_embedding).item()

        return score


    def faithfulness(self, answer, retrieved_docs):

        answer_embedding = self.model.encode(answer, convert_to_tensor=True)

        scores = []

        for doc in retrieved_docs:
            emb = self.model.encode(doc["text"], convert_to_tensor=True)
            score = util.cos_sim(answer_embedding, emb).item()
            scores.append(score)

        return max(scores)


    def save_results(self, query, answer, docs, scores):

        result = {
            "timestamp": str(datetime.now()),
            "query": query,
            "answer": answer,
            "sources": [doc["source"] for doc in docs],
            "context_precision": scores["context_precision"],
            "answer_relevance": scores["answer_relevance"],
            "faithfulness": scores["faithfulness"]
        }

        with open("evaluation/results.json", "a") as f:
            json.dump(result, f)
            f.write("\n")