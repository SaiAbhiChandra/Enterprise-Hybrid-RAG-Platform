import { FileText, Loader2, Trash2 } from "lucide-react";
import type { Document } from "../../api/documents";

type Props = {
    document: Document;
    onDelete: (id: number) => void;
    deleting: boolean;
};

const STATUS_STYLES: Record<string, string> = {
    completed: "bg-accent-2/10 text-accent-2",
    processing: "bg-accent/10 text-accent",
    pending: "bg-surface-alt text-text-muted",
    failed: "bg-danger/10 text-danger",
};

export default function DocumentRow({
    document,
    onDelete,
    deleting,
}: Props) {
    const statusClass =
        STATUS_STYLES[document.status?.toLowerCase()] ??
        "bg-surface-alt text-text-muted";

    return (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-alt text-text-muted">
                <FileText size={16} />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">
                    {document.original_filename}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                    {new Date(document.created_at).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short", day: "numeric" },
                    )}
                </p>
            </div>

            <span
                className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wide ${statusClass}`}
            >
                {document.status}
            </span>

            <button
                onClick={() => onDelete(document.id)}
                disabled={deleting}
                title="Delete document"
                className="shrink-0 rounded-lg p-2 text-text-muted transition hover:bg-danger/10 hover:text-danger disabled:opacity-40"
            >
                {deleting ? (
                    <Loader2 size={15} className="animate-spin" />
                ) : (
                    <Trash2 size={15} />
                )}
            </button>
        </div>
    );
}
