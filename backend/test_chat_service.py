from app.chat.schemas import ChatRequest
from app.dependencies.services import get_chat_service

service = get_chat_service()

response = service.chat(
    ChatRequest(
        question="How can I apply for PNB?"
    )
)

print("=" * 100)
print("ANSWER")
print("=" * 100)

print(response.answer)

print("\n")

print("=" * 100)
print("SOURCES")
print("=" * 100)

for source in response.sources:
    print(source)