import os
from openai import OpenAI


class AnswerGenerator:

    def __init__(self):

        self.client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=os.getenv("HF_TOKEN")
        )

        self.model = "meta-llama/Meta-Llama-3-8B-Instruct"


    def build_context(self, documents):

        context = ""

        for i, doc in enumerate(documents):

            context += f"""
SOURCE {i+1}
Paper: {doc['source']}
Page: {doc['page']}

{doc['text']}

----------------
"""

        return context


    def generate_answer(self, query, documents):

        context = self.build_context(documents)

        prompt = f"""
You are an AI research assistant.

Answer ONLY using the provided sources.
If the answer is not present in the sources, say you don't know.

Always cite the paper name and page number.

Sources:
{context}

Question:
{query}
"""

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.2
        )

        return response.choices[0].message.content