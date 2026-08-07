import { useState } from "react";

import { askQuestion, streamQuestion } from "../../api/chat";
import type { Source } from "../../api/chat";

import ChatLayout from "../../components/chat/ChatLayout";
import ChatHeader from "../../components/chat/ChatHeader";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatMessages from "../../components/chat/ChatMessages";
import ChatInput from "../../components/chat/ChatInput";

interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    sources?: Source[];
}

export default function ChatPage() {

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [question, setQuestion] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    function currentTime() {

        return new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

    }

    async function sendMessage(customQuestion?: string) {

        const finalQuestion =
            customQuestion ?? question.trim();

        if (!finalQuestion || loading)
            return;

        const assistantId = Date.now() + 1;

        setQuestion("");

        setMessages(prev => [
            ...prev,
            {
                id: Date.now(),
                role: "user",
                content: finalQuestion,
                timestamp: currentTime(),
            },
            {
                id: assistantId,
                role: "assistant",
                content: "",
                timestamp: currentTime(),
                sources: [],
            },
        ]);

        setLoading(true);

        try {

            await streamQuestion(
                finalQuestion,
                (chunk) => {

                    setMessages(prev =>
                        prev.map(message =>
                            message.id === assistantId
                                ? {
                                      ...message,
                                      content:
                                          message.content + chunk,
                                  }
                                : message
                        )
                    );

                }
            );

            const ragResponse =
                await askQuestion(finalQuestion);

            setMessages(prev =>
                prev.map(message =>
                    message.id === assistantId
                        ? {
                              ...message,
                              sources: ragResponse.sources,
                          }
                        : message
                )
            );

        }

        catch {

            setMessages(prev =>
                prev.map(message =>
                    message.id === assistantId
                        ? {
                              ...message,
                              content:
                                  "Unable to connect to Enterprise AI.",
                          }
                        : message
                )
            );

        }

        finally {

            setLoading(false);

        }

    }

    function handlePrompt(prompt: string) {

        setQuestion(prompt);

        sendMessage(prompt);

    }

    return (

        <div className="h-[calc(100vh-170px)]">

            <ChatLayout

                header={

                    <ChatHeader />

                }

                sidebar={

                    <ChatSidebar />

                }

                input={

                    <ChatInput

                        value={question}

                        loading={loading}

                        onChange={setQuestion}

                        onSend={() => sendMessage()}

                    />

                }

            >

                <ChatMessages

                    messages={messages}

                    loading={loading}

                    onPromptClick={handlePrompt}

                />

            </ChatLayout>

        </div>

    );

}