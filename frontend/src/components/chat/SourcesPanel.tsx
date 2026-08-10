import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import type { Source } from "../../api/conversations";

type Props = {
    sources: Source[];
};

export default function SourcesPanel({ sources }: Props) {
    const [open, setOpen] = useState(false);

    if (sources.length === 0) return null;

    // Multiple chunks often come from the same document -- group so
    // the citation list reads as "3 sources" not "3 nearly-identical
    // rows for the same file".
    const byDocument = new Map<number, { name: string; chunks: Source[] }>();

    for (const source of sources) {
        const existing = byDocument.get(source.document_id);

        if (existing) {
            existing.chunks.push(source);
        } else {
            byDocument.set(source.document_id, {
                name: source.document_name,
                chunks: [source],
            });
        }
    }

    return (
        <div className="mt-2 max-w-[720px]">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-medium text-text-muted transition hover:text-text"
            >
                <FileText size={13} />
                {byDocument.size} source{byDocument.size !== 1 ? "s" : ""}
                <ChevronDown
                    size={13}
                    className={`transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                    {Array.from(byDocument.entries()).map(
                        ([documentId, doc]) => (
                            <div
                                key={documentId}
                                className="rounded-lg border border-border bg-surface-alt/60 px-2.5 py-2"
                            >
                                <p className="truncate text-xs font-medium text-text">
                                    {doc.name}
                                </p>
                                <p className="mt-0.5 font-mono text-[10px] text-text-muted">
                                    {doc.chunks.length} chunk
                                    {doc.chunks.length !== 1 ? "s" : ""} ·
                                    top score{" "}
                                    {Math.max(
                                        ...doc.chunks.map((c) => c.score),
                                    ).toFixed(3)}
                                </p>
                            </div>
                        ),
                    )}
                </div>
            )}
        </div>
    );
}
