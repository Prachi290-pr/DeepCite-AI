from evaluation.evaluate import RAGEvaluator

query = "What architecture does the transformer use?"

docs = [
    {
        "text": "The Transformer follows an encoder-decoder architecture using stacked self-attention layers.",
        "source": "attention_is_all_you_need.pdf",
        "page": 3
    }
]

answer = "The Transformer uses an encoder-decoder architecture with stacked self-attention layers."

evaluator = RAGEvaluator()

context_score = evaluator.context_precision(query, docs)
answer_score = evaluator.answer_relevance(query, answer)
faithfulness_score = evaluator.faithfulness(answer, docs)

scores = {
    "context_precision": context_score,
    "answer_relevance": answer_score,
    "faithfulness": faithfulness_score
}

evaluator.save_results(query, answer, docs, scores)

print(scores)