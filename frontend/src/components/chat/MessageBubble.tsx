import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, FileCheck2, Pencil } from "lucide-react";

import FusionMark from "../brand/FusionMark";
import SourcesPanel from "./SourcesPanel";
import type { Source } from "../../api/conversations";

export type ChatMessage = {
    id: string | number;
    role: "user" | "assistant" | "system";
    content: string;
    sources?: Source[] | null;
    streaming?: boolean;
};

type Props = {
    message: ChatMessage;
    onEdit?: (messageId: string | number, newContent: string) => void;
};

export default function MessageBubble({ message, onEdit }: Props) {
    const [copied, setCopied] = useState(false);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(message.content);

    function handleCopy() {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    function commitEdit() {
        const trimmed = draft.trim();
        setEditing(false);

        if (trimmed && trimmed !== message.content && onEdit) {
            onEdit(message.id, trimmed);
        }
    }

    if (message.role === "system") {
        return (
            <div className="flex justify-center px-4 py-2">
                <div className="flex items-center gap-2 rounded-full border border-border bg-surface-alt px-3 py-1.5 text-xs text-text-muted">
                    <FileCheck2 size={13} className="text-accent-2" />
                    {message.content}
                </div>
            </div>
        );
    }

    const isUser = message.role === "user";

    if (isUser) {
        if (editing) {
            return (
                <div className="flex justify-end px-4 py-2">
                    <div className="w-full max-w-[720px]">
                        <textarea
                            autoFocus
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    commitEdit();
                                } else if (e.key === "Escape") {
                                    setEditing(false);
                                    setDraft(message.content);
                                }
                            }}
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-accent/50 bg-surface px-4 py-2.5 text-[15px] leading-relaxed text-text outline-none"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setEditing(false);
                                    setDraft(message.content);
                                }}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted hover:bg-surface-alt"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={commitEdit}
                                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-hover"
                            >
                                Save &amp; submit
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="group flex justify-end px-4 py-2">
                <div className="flex max-w-[720px] flex-col items-end">
                    <div className="rounded-2xl rounded-br-md bg-accent px-4 py-2.5 text-[15px] leading-relaxed text-white">
                        {message.content}
                    </div>

                    <div className="mt-1 flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                            onClick={handleCopy}
                            title="Copy"
                            className="rounded-md p-1.5 text-text-muted hover:bg-surface-alt hover:text-text"
                        >
                            {copied ? (
                                <Check size={13} />
                            ) : (
                                <Copy size={13} />
                            )}
                        </button>

                        {onEdit && (
                            <button
                                onClick={() => setEditing(true)}
                                title="Edit"
                                className="rounded-md p-1.5 text-text-muted hover:bg-surface-alt hover:text-text"
                            >
                                <Pencil size={13} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group flex gap-3 px-4 py-3">
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

                {!message.streaming && message.content && (
                    <div className="mt-1.5 flex gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                            onClick={handleCopy}
                            title="Copy"
                            className="rounded-md p-1.5 text-text-muted hover:bg-surface-alt hover:text-text"
                        >
                            {copied ? (
                                <Check size={13} />
                            ) : (
                                <Copy size={13} />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
