import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";

type Props = {
    onSend: (question: string) => void;
    onStop?: () => void;
    disabled?: boolean;
    streaming?: boolean;
};

export default function Composer({
    onSend,
    onStop,
    disabled,
    streaming,
}: Props) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }, [value]);

    function submit() {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;

        onSend(trimmed);
        setValue("");
    }

    return (
        <div className="border-t border-border bg-bg px-4 pb-5 pt-3">
            <div className="mx-auto flex max-w-[760px] items-end gap-2 rounded-2xl border border-border bg-surface px-3 py-2 shadow-sm transition focus-within:border-accent/50">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            submit();
                        }
                    }}
                    rows={1}
                    placeholder="Ask anything about your documents…"
                    className="max-h-[200px] flex-1 resize-none bg-transparent py-1.5 text-[15px] text-text placeholder:text-text-muted focus:outline-none"
                />

                {streaming ? (
                    <button
                        onClick={onStop}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-text text-bg transition hover:opacity-85"
                        title="Stop generating"
                    >
                        <Square size={13} fill="currentColor" />
                    </button>
                ) : (
                    <button
                        onClick={submit}
                        disabled={disabled || !value.trim()}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white transition enabled:hover:bg-accent-hover disabled:opacity-30"
                        title="Send"
                    >
                        <ArrowUp size={16} />
                    </button>
                )}
            </div>

            <p className="mx-auto mt-2 max-w-[760px] text-center text-[11px] text-text-muted">
                Cortex can make mistakes. Check important information against
                your source documents.
            </p>
        </div>
    );
}
