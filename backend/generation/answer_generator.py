import os
from openai import OpenAI

class AnswerGenerator:
    def __init__(self):
        # Using environment variables for security
        self.client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=os.getenv("HF_TOKEN")
        )
        self.model = "meta-llama/Meta-Llama-3-8B-Instruct"

    def _build_context(self, documents):
        """
        Private helper to wrap each document chunk with clear delimiters.
        """
        context_parts = []
        for i, doc in enumerate(documents):
            block = f"--- DOCUMENT {i+1} START ---\n"
            block += f"SOURCE_FILE: {doc['source']}\n"
            block += f"PAGE_REFERENCE: {doc['page']}\n"
            block += f"CONTENT: {doc['text']}\n"
            block += f"--- DOCUMENT {i+1} END ---\n"
            context_parts.append(block)
        
        return "\n".join(context_parts)

    def generate_answer(self, query, documents):
        context = self._build_context(documents)

        # 1. System Prompt: Defining Persona & Strict Protocols
        system_prompt = """You are 'DeepCite AI', a professional research analyst. 
Your sole purpose is to synthesize information from the provided technical context to answer user queries with high scientific accuracy.

CRITICAL PROTOCOLS:
1. GROUNDING: Answer ONLY using the provided context blocks. Do not use internal knowledge or assumptions.
2. CITATION STYLE: You MUST attribute every claim using the format: [Source X, Page Y]. 
3. UNCERTAINTY: If the context does not contain the answer, explicitly state: "This information is not available in the indexed documents."
4. STRUCTURE: 
   - Use Markdown headers (###) for sections.
   - Use **bolding** for key technical terms.
   - For comparisons: Always use a Markdown table.
   - For processes: Use numbered lists.
5. NEUTRALITY: Maintain a formal, academic tone. Avoid conversational filler like "I hope this helps."
"""

        # 2. User Prompt: Injecting the Task and Data
        user_prompt = f"""### TASK:
Analyze the following context and answer the query: "{query}"

### CONTEXT BLOCKS:
{context}

### INSTRUCTIONS:
Provide a detailed, grounded response. If the query asks for a specific format (table/summary), prioritize that format. Ensure citations are placed immediately after the factual claim they support."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                # Increased tokens for detailed tables/summaries
                max_tokens=800, 
                # Low temperature (0.1) is vital for factual consistency in RAG
                temperature=0.1 
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"SYSTEM ERROR: Failed to generate response. {str(e)}"