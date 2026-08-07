import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ChatMessage from "./ChatMessage";
import EmptyChat from "./EmptyChat";
import SuggestedPrompts from "./SuggestedPrompts";
import TypingIndicator from "./TypingIndicator";

export interface Message {
    id: number;
    role: "user" | "assistant";
    content: string;
    sources?: any[];
}

interface ChatMessagesProps {
    messages: Message[];
    loading: boolean;
    onPromptClick: (prompt: string) => void;
}

export default function ChatMessages({
    messages,
    loading,
    onPromptClick,
}: ChatMessagesProps) {

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages, loading]);

    /* -----------------------------
       Empty State
    ------------------------------ */

    if (messages.length === 0 && !loading) {

        return (

            <div className="flex h-full items-center justify-center">

                <div className="w-full max-w-5xl">

                    <EmptyChat>

                        <SuggestedPrompts

                            onSelect={onPromptClick}

                        />

                    </EmptyChat>

                </div>

            </div>

        );

    }

    /* -----------------------------
       Conversation
    ------------------------------ */

    return (

        <div className="h-full overflow-y-auto">

            <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 py-2">

                <AnimatePresence mode="popLayout">

                    {messages.map((message) => (

                        <motion.div

                            key={message.id}

                            layout

                            initial={{
                                opacity: 0,
                                y: 15,
                            }}

                            animate={{
                                opacity: 1,
                                y: 0,
                            }}

                            exit={{
                                opacity: 0,
                            }}

                            transition={{
                                duration: 0.25,
                            }}

                        >

                            <ChatMessage

                                role={message.role}

                                content={message.content}

                                sources={message.sources}

                            />

                        </motion.div>

                    ))}

                </AnimatePresence>

                {loading && (

                    <TypingIndicator />

                )}

                <div ref={bottomRef} />

            </div>

        </div>

    );

}