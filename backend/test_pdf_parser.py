from pathlib import Path

from app.parsers.pdf_parser import PDFParser

parser = PDFParser()

result = parser.parse(
    Path("uploads/pdf/01888fbe-982f-4d1e-9634-f405b04551ba.pdf")
)

print("=" * 80)
print("Filename:", result.metadata["filename"])
print("Pages:", result.page_count)
print("=" * 80)
print(result.text[:1000])