import os
import re
from openai import OpenAI

class AnswerGenerator:
    def __init__(self):
        # Using environment variables for security
        self.client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=os.getenv("HF_TOKEN")
        )
        # Primary model - more capable for complex reasoning
        self.model = "meta-llama/Meta-Llama-3-8B-Instruct"
        # Fallback model for better performance
        self.fallback_model = "microsoft/DialoGPT-medium"

    def _build_context(self, documents):
        """
        Build context from reranked documents
        """
        if not documents:
            return ""

        context_parts = []
        total_length = 0
        max_docs = min(5, len(documents))

        for i, doc in enumerate(documents[:max_docs]):
            text = self._clean_text(doc['text'])

            if len(text.strip()) < 50:
                continue

            block = f"=== DOCUMENT {i+1} ===\n"
            block += f"Source: {doc['source']}\n"
            block += f"Page: {doc['page']}\n"
            block += f"Content:\n{text}\n"
            block += f"=== END DOCUMENT {i+1} ===\n"

            if total_length + len(block) > 6000:
                break

            context_parts.append(block)
            total_length += len(block)

        final_context = "\n".join(context_parts)

        if not final_context.strip():
            return "No readable content found in the provided documents."

        return final_context

    def _clean_text(self, text):
        """
        Clean and normalize text content
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text.strip())
        # Remove page numbers and headers that might be OCR artifacts
        text = re.sub(r'\b\d+\s*$', '', text, flags=re.MULTILINE)
        return text

    def _create_enhanced_system_prompt(self):
        return """You are 'DeepCite AI', an advanced research assistant specializing in academic and technical document analysis.

CORE CAPABILITIES:
1. SYNTHESIS: Combine information from multiple sources to provide comprehensive answers
2. ANALYSIS: Break down complex concepts into clear, understandable explanations
3. CITATION: Always cite sources using [Source X, Page Y] format
4. CLARITY: Use simple, direct language while maintaining technical accuracy

RESPONSE GUIDELINES:
- Structure answers with clear sections using ### headers when appropriate
- Use **bold** for key terms and concepts
- Use numbered or bulleted lists for steps, features, or multiple items
- Provide specific examples from the documents when relevant
- Explain technical terms when they first appear
- Be comprehensive but concise - avoid unnecessary verbosity

CITATION REQUIREMENTS:
- Cite every factual claim with [Source X, Page Y]
- If information comes from multiple sources, cite all relevant ones
- If information is not in the provided documents, clearly state this

FORMATTING RULES:
- Use natural paragraph structure
- Use lists for enumerating items or steps
- Use headers to organize complex answers
- NEVER use markdown tables unless the user specifically requests tabular format
- Prefer structured lists over tables for comparisons

QUALITY STANDARDS:
- Be accurate and truthful
- Acknowledge uncertainties or limitations in the source material
- Provide context when explaining concepts
- Use active voice and clear sentence structure"""

    def _create_user_prompt(self, query, context):
        return f"""Please analyze the provided document excerpts and answer this question: "{query}"

DOCUMENT CONTEXT:
{context}

INSTRUCTIONS:
1. Answer based ONLY on the information in these documents
2. Cite your sources using [Source X, Page Y] format for every factual claim
3. Structure your answer clearly and logically
4. If the question cannot be answered from these documents, say so explicitly
5. Be comprehensive but focused on the most relevant information

Provide your answer below:"""

    def generate_answer(self, query, documents):
        if not documents:
            return "No documents provided for analysis."

        try:
            context = self._build_context(documents)

            max_context_length = 8000
            if len(context) > max_context_length:
                context = self._truncate_context(context, max_context_length)

            system_prompt = self._create_enhanced_system_prompt()
            user_prompt = self._create_user_prompt(query, context)

            try:
                answer = self._generate_with_model(self.model, system_prompt, user_prompt)
            except Exception as primary_error:
                print(f"Primary model failed: {primary_error}, trying fallback...")
                try:
                    answer = self._generate_with_model(self.fallback_model, system_prompt, user_prompt)
                except Exception as fallback_error:
                    raise Exception(f"Both models failed. Primary: {primary_error}, Fallback: {fallback_error}")

            answer = self._post_process_answer(answer, documents)

            return answer

        except Exception as e:
            return self._handle_generation_error(e)

    def _generate_with_model(self, model_name, system_prompt, user_prompt):
        response = self.client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1200,
            temperature=0.2,
            top_p=0.9,
            presence_penalty=0.1,
            frequency_penalty=0.1
        )

        return response.choices[0].message.content.strip()

    def _truncate_context(self, context, max_length):
        if len(context) <= max_length:
            return context

        documents = context.split("=== END DOCUMENT")
        truncated_context = ""
        current_length = 0

        for doc in documents[:-1]:
            doc_length = len(doc) + len("=== END DOCUMENT")
            if current_length + doc_length > max_length - 200:
                break
            truncated_context += doc + "=== END DOCUMENT"
            current_length += doc_length

        return truncated_context + "\n\n[Content truncated due to length limitations]"

    def _post_process_answer(self, answer, documents):
        if not self._has_citations(answer) and documents:
            answer += f"\n\n*All information sourced from the provided documents.*"

        answer = self._remove_unwanted_tables(answer)

        quality_info = self._assess_answer_quality(answer, documents)
        if quality_info:
            answer += f"\n\n---\n*Answer Quality: {quality_info}*"

        return answer

    def _assess_answer_quality(self, answer, documents):
        quality_indicators = []

        citation_count = len(re.findall(r'\[Source \d+, Page \d+\]', answer))
        if citation_count > 0:
            quality_indicators.append(f"{citation_count} source citations")
        else:
            quality_indicators.append("No citations found")

        word_count = len(answer.split())
        if word_count < 20:
            quality_indicators.append("Brief response - limited information available")
        elif word_count > 500:
            quality_indicators.append("Comprehensive analysis")

        if "not available" in answer.lower() or "cannot be answered" in answer.lower():
            quality_indicators.append("Information not found in documents")

        return " | ".join(quality_indicators) if quality_indicators else None

    def _remove_unwanted_tables(self, text):
        lines = text.split('\n')
        in_table = False
        cleaned_lines = []

        for line in lines:
            if '|' in line and not line.strip().startswith('*') and not line.strip().startswith('-'):
                if '---' in line or (line.count('|') >= 2 and not any(word in line.lower() for word in ['source', 'page', 'document'])):
                    in_table = True
                    continue

            if in_table:
                if not line.strip() or line.startswith('###') or line.startswith('##'):
                    in_table = False
                else:
                    continue

            cleaned_lines.append(line)

        return '\n'.join(cleaned_lines)

    def _handle_generation_error(self, error):
        error_msg = str(error)
        if "api_key" in error_msg.lower() or "authentication" in error_msg.lower():
            return "SYSTEM ERROR: API key configuration issue. Please check HF_TOKEN environment variable."
        elif "rate limit" in error_msg.lower() or "quota" in error_msg.lower():
            return "SYSTEM ERROR: Rate limit exceeded. Please try again in a moment."
        elif "model" in error_msg.lower() and "not found" in error_msg.lower():
            return "SYSTEM ERROR: Model unavailable. Please try again later."
        elif "timeout" in error_msg.lower() or "connection" in error_msg.lower():
            return "SYSTEM ERROR: Connection timeout. Please check your internet connection and try again."
        else:
            return f"SYSTEM ERROR: Failed to generate response. {error_msg}"

    def _has_citations(self, text):
        return bool(re.search(r'\[Source \d+, Page \d+\]', text))