from backend.generation.answer_generator import AnswerGenerator

docs = [
    {
        "source": "attention_is_all_u_need.pdf",
        "page": 3,
        "text": "The Transformer follows an encoder-decoder architecture using stacked self-attention layers."
    }
]

query = "What architecture does the transformer use?"

generator = AnswerGenerator()

answer = generator.generate_answer(query, docs)

print(answer)