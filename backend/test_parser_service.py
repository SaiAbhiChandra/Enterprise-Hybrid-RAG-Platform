from app.parsers.parser_service import ParserService

service = ParserService()

result = service.parse_document(
    "uploads/pdf/01888fbe-982f-4d1e-9634-f405b04551ba.pdf"
)

print("=" * 80)
print(result.metadata)
print("=" * 80)
print(result.text[:1000])