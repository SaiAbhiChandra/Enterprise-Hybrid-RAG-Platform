import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import FusionMark from "../brand/FusionMark";
import SourcesPanel from "./SourcesPanel";
import type { Source } from "../../api/conversations";

export type ChatMessage = {
    id: string | number;
    role: "user" | "assistant";
    content: string;
    sources?: Source[] | null;
    streaming?: boolean;
};

type Props = {
    message: ChatMessage;
};

export default function MessageBubble({ message }: Props) {
    const isUser = message.role === "user";

    if (isUser) {
        return (
            <div className="flex justify-end px-4 py-2">
                <div className="max-w-[720px] rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-[15px] leading-relaxed text-white">
                    {message.content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-3 px-4 py-3">
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-alt ring-1 ring-border">
                <FusionMark
                    size={16}
                    animated={message.streaming && message.content === ""}
                />
            </div>

            <div className="min-w-0 max-w-[760px] flex-1">
                <div className="prose-cortex text-[15px] leading-relaxed text-text">
                    {message.content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    ) : (
                        <span className="text-text-muted">Thinking…</span>
                    )}
                </div>

                {!message.streaming &&
                    message.sources &&
                    message.sources.length > 0 && (
                        <SourcesPanel sources={message.sources} />
                    )}
            </div>
        </div>
    );
}
