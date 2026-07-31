from app.chunking.chunk_generator import ChunkGenerator
from app.parsers.parser_service import ParserService

parser = ParserService()
chunker = ChunkGenerator()

document = parser.parse_document(
    "uploads/pdf/01888fbe-982f-4d1e-9634-f405b04551ba.pdf"
)

chunks = chunker.create_chunks(document)

print("=" * 80)
print(f"Chunks Created : {len(chunks)}")
print("=" * 80)

for chunk in chunks:

    print(f"Chunk #{chunk.chunk_index}")

    print(chunk.start_char, chunk.end_char)

    print(chunk.text[:150])

    print("-" * 80)