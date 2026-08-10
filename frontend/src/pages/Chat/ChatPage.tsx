import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import MessageBubble, {
    type ChatMessage,
} from "../../components/chat/MessageBubble";
import Composer from "../../components/chat/Composer";
import EmptyState from "../../components/chat/EmptyState";
import { getConversation } from "../../api/conversations";
import { streamChat } from "../../api/chat";
import type { AppShellContext } from "../../components/layout/AppShell";

export default function ChatPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { refreshConversations } =
        useOutletContext<AppShellContext>();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Load message history when opening an existing conversation.
    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        setLoadingHistory(true);
        setError(null);

        getConversation(Number(conversationId))
            .then((data) => {
                setMessages(
                    data.messages.map((m) => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                        sources: m.sources,
                    })),
                );
            })
            .catch(() => {
                setError("Couldn't load this conversation.");
            })
            .finally(() => setLoadingHistory(false));
    }, [conversationId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function handleStop() {
        abortRef.current?.abort();
        setStreaming(false);
    }

    async function handleSend(question: string) {
        setError(null);

        const userMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: question,
        };

        const assistantId = `assistant-${Date.now()}`;

        setMessages((prev) => [
            ...prev,
            userMessage,
            {
                id: assistantId,
                role: "assistant",
                content: "",
                streaming: true,
            },
        ]);

        setStreaming(true);

        const controller = new AbortController();
        abortRef.current = controller;

        let currentConversationId = conversationId
            ? Number(conversationId)
            : null;

        try {
            await streamChat(
                question,
                currentConversationId,
                {
                    onMeta: (meta) => {
                        if (!currentConversationId) {
                            currentConversationId = meta.conversation_id;
                            // Move from /chat to /chat/:id without
                            // remounting -- the messages we already
                            // have in state stay put.
                            navigate(`/chat/${meta.conversation_id}`, {
                                replace: true,
                            });
                        }

                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === assistantId
                                    ? { ...m, sources: meta.sources }
                                    : m,
                            ),
                        );
                    },
                    onToken: (text) => {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === assistantId
                                    ? { ...m, content: m.content + text }
                                    : m,
                            ),
                        );
                    },
                    onDone: () => {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === assistantId
                                    ? { ...m, streaming: false }
                                    : m,
                            ),
                        );
                        refreshConversations();
                    },
                },
                controller.signal,
            );
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                setError(
                    "Something went wrong generating a response. Please try again.",
                );
            }

            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantId ? { ...m, streaming: false } : m,
                ),
            );
        } finally {
            setStreaming(false);
        }
    }

    const showEmptyState = !conversationId && messages.length === 0;

    return (
        <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto">
                {loadingHistory ? (
                    <div className="flex h-full items-center justify-center text-sm text-text-muted">
                        Loading conversation…
                    </div>
                ) : showEmptyState ? (
                    <EmptyState onPick={handleSend} />
                ) : (
                    <div className="mx-auto max-w-[900px] py-4">
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}

                        {error && (
                            <p className="px-4 py-2 text-sm text-danger">
                                {error}
                            </p>
                        )}

                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            <Composer
                onSend={handleSend}
                onStop={handleStop}
                streaming={streaming}
                disabled={loadingHistory}
            />
        </div>
    );
}
