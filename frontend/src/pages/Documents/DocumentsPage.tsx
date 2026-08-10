import { useEffect, useState } from "react";

import UploadZone from "../../components/documents/UploadZone";
import DocumentRow from "../../components/documents/DocumentRow";
import {
    deleteDocument,
    getDocuments,
    uploadDocument,
    type Document,
} from "../../api/documents";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function refresh() {
        try {
            const data = await getDocuments();
            setDocuments(data);
        } catch {
            setError("Couldn't load documents.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    async function handleUpload(file: File) {
        setUploading(true);
        setError(null);

        try {
            await uploadDocument(file);
            await refresh();
        } catch {
            setError("Upload failed. Please try a different file.");
        } finally {
            setUploading(false);
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id);

        try {
            await deleteDocument(id);
            setDocuments((prev) => prev.filter((d) => d.id !== id));
        } catch {
            setError("Couldn't delete that document.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="mx-auto max-w-3xl px-6 py-10">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-text">
                    Documents
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                    Upload the documents Cortex should answer questions from.
                </p>

                <div className="mt-6">
                    <UploadZone
                        onUpload={handleUpload}
                        uploading={uploading}
                    />
                </div>

                {error && (
                    <p className="mt-4 text-sm text-danger">{error}</p>
                )}

                <div className="mt-8">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
                        {loading
                            ? "Loading…"
                            : `${documents.length} document${
                                  documents.length !== 1 ? "s" : ""
                              }`}
                    </p>

                    <div className="flex flex-col gap-2">
                        {documents.map((document) => (
                            <DocumentRow
                                key={document.id}
                                document={document}
                                onDelete={handleDelete}
                                deleting={deletingId === document.id}
                            />
                        ))}

                        {!loading && documents.length === 0 && (
                            <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-text-muted">
                                No documents yet. Upload one to start
                                chatting with it.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
