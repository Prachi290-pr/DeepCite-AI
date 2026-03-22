from pathlib import Path
from pypdf import PdfReader


class DocumentLoader:

    def __init__(self, folder_path):
        self.folder_path = folder_path

    def load_documents(self):

        documents = []

        for pdf_file in Path(self.folder_path).glob("*.pdf"):

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