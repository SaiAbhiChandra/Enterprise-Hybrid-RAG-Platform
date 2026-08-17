import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import MessageBubble, {
    type ChatMessage,
} from "../../components/chat/MessageBubble";
import Composer from "../../components/chat/Composer";
import EmptyState from "../../components/chat/EmptyState";
import {
    getConversation,
    truncateMessagesFrom,
} from "../../api/conversations";
import { regenerateChat, streamChat } from "../../api/chat";
import { uploadDocument } from "../../api/documents";
import type { AppShellContext } from "../../components/layout/AppShell";

export default function ChatPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { refreshConversations } =
        useOutletContext<AppShellContext>();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [streaming, setStreaming] = useState(false);
    const [attaching, setAttaching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // When we navigate to a freshly-created conversation ourselves
    // (see onMeta below), the resulting conversationId change would
    // otherwise trigger the history-loading effect below, which
    // fetches from the server and overwrites the in-progress
    // streaming message with whatever's persisted so far -- which is
    // only the user's message, since the assistant's reply hasn't
    // finished generating (and therefore hasn't been saved) yet.
    // This flag lets that one specific navigation skip the reload.
    const skipNextLoadRef = useRef(false);

    // Load message history when opening an existing conversation.
    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        if (skipNextLoadRef.current) {
            skipNextLoadRef.current = false;
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

    async function runStream(
        question: string,
        userMessageLocalId: string,
        assistantId: string,
    ) {
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
                            skipNextLoadRef.current = true;
                            // Move from /chat to /chat/:id without
                            // remounting -- the messages we already
                            // have in state stay put.
                            navigate(`/chat/${meta.conversation_id}`, {
                                replace: true,
                            });
                        }

                        setMessages((prev) =>
                            prev.map((m) => {
                                if (m.id === userMessageLocalId) {
                                    // Swap the temporary local id for
                                    // the real database id, so this
                                    // message can be edited/truncated
                                    // correctly even without a page
                                    // reload in between.
                                    return {
                                        ...m,
                                        id: meta.user_message_id,
                                    };
                                }
                                if (m.id === assistantId) {
                                    return { ...m, sources: meta.sources };
                                }
                                return m;
                            }),
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
                    onDone: (assistantMessageId) => {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === assistantId
                                    ? {
                                          ...m,
                                          streaming: false,
                                          id: assistantMessageId ?? m.id,
                                      }
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

    async function handleSend(question: string) {
        setError(null);

        const userMessageId = `user-${Date.now()}`;
        const assistantId = `assistant-${Date.now()}`;

        setMessages((prev) => [
            ...prev,
            {
                id: userMessageId,
                role: "user",
                content: question,
            },
            {
                id: assistantId,
                role: "assistant",
                content: "",
                streaming: true,
            },
        ]);

        await runStream(question, userMessageId, assistantId);
    }

    async function handleEditMessage(
        messageId: string | number,
        newContent: string,
    ) {
        setError(null);

        const index = messages.findIndex((m) => m.id === messageId);
        if (index === -1) return;

        // Truncate on the server first -- the edited message and
        // everything after it (its old answer, and anything sent
        // since) no longer applies once the question has changed.
        if (conversationId && typeof messageId === "number") {
            try {
                await truncateMessagesFrom(
                    Number(conversationId),
                    messageId,
                );
            } catch {
                setError("Couldn't edit that message. Please try again.");
                return;
            }
        }

        const userMessageId = `user-edit-${Date.now()}`;
        const assistantId = `assistant-${Date.now()}`;

        setMessages((prev) => [
            ...prev.slice(0, index),
            {
                id: userMessageId,
                role: "user",
                content: newContent,
            },
            {
                id: assistantId,
                role: "assistant",
                content: "",
                streaming: true,
            },
        ]);

        await runStream(newContent, userMessageId, assistantId);
    }

    async function handleRegenerate(messageId: string | number) {
        // Regenerating requires the assistant message's real database
        // id, which only exists once it's finished streaming at
        // least once -- a message id is still a temporary local
        // string for the few hundred ms it's actively streaming, so
        // there's nothing meaningful to regenerate yet.
        if (!conversationId || typeof messageId !== "number") return;

        setError(null);

        const index = messages.findIndex((m) => m.id === messageId);
        if (index === -1) return;

        const localPlaceholderId = `assistant-regen-${Date.now()}`;

        setMessages((prev) => {
            const next = [...prev];
            next[index] = {
                id: localPlaceholderId,
                role: "assistant",
                content: "",
                streaming: true,
            };
            return next;
        });

        setStreaming(true);

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            await regenerateChat(
                Number(conversationId),
                messageId,
                {
                    onMeta: (meta) => {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === localPlaceholderId
                                    ? { ...m, sources: meta.sources }
                                    : m,
                            ),
                        );
                    },
                    onToken: (text) => {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === localPlaceholderId
                                    ? { ...m, content: m.content + text }
                                    : m,
                            ),
                        );
                    },
                    onDone: (assistantMessageId) => {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === localPlaceholderId
                                    ? {
                                          ...m,
                                          streaming: false,
                                          id: assistantMessageId ?? m.id,
                                      }
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
                    "Something went wrong regenerating the response. Please try again.",
                );
            }

            setMessages((prev) =>
                prev.map((m) =>
                    m.id === localPlaceholderId
                        ? { ...m, streaming: false }
                        : m,
                ),
            );
        } finally {
            setStreaming(false);
        }
    }

    async function handleAttach(file: File) {
        setAttaching(true);
        setError(null);

        try {
            await uploadDocument(file);

            setMessages((prev) => [
                ...prev,
                {
                    id: `system-${Date.now()}`,
                    role: "system",
                    content: `Uploaded "${file.name}" — indexed and ready to reference.`,
                },
            ]);
        } catch {
            setError(
                `Couldn't upload "${file.name}". Please try a different file.`,
            );
        } finally {
            setAttaching(false);
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
                            <MessageBubble
                                key={message.id}
                                message={message}
                                onEdit={
                                    message.role === "user"
                                        ? handleEditMessage
                                        : undefined
                                }
                                onRegenerate={
                                    message.role === "assistant"
                                        ? handleRegenerate
                                        : undefined
                                }
                            />
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
                onAttach={handleAttach}
                streaming={streaming}
                attaching={attaching}
                disabled={loadingHistory}
            />
        </div>
    );
}
