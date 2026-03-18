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
You are a research assistant AI.

STRICT RULES:
1. Answer ONLY using the provided context.
2. If answer is partially available, try to infer carefully.
3. If answer is NOT present, say:
   "This information is not available in the provided documents."
4. ALWAYS follow the user’s instruction (format, table, bullet points, etc.)
5. Be clear, structured, and complete.

FORMAT RULES:
- If user asks for table → return table
- If user asks for summary → return concise summary
- If comparison → use structured format

Do NOT say "I don't know" unless absolutely necessary.
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