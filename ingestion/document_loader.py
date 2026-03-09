from pathlib import Path
from pypdf import PdfReader


def load_papers(folder_path):

    documents = []

    for pdf_file in Path(folder_path).glob("*.pdf"):

        reader = PdfReader(pdf_file)

        for page_num, page in enumerate(reader.pages):

            text = page.extract_text()

            if text:

                documents.append({
                    "text": text,
                    "source": pdf_file.name,
                    "page": page_num + 1
                })

    return documents