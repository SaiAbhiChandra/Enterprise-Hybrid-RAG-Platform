import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

type Props = {
    onUpload: (file: File) => Promise<void>;
    uploading: boolean;
};

export default function UploadZone({ onUpload, uploading }: Props) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    async function handleFiles(files: FileList | null) {
        const file = files?.[0];
        if (!file) return;

        await onUpload(file);
    }

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFiles(e.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                dragActive
                    ? "border-accent bg-accent/5"
                    : "border-border bg-surface hover:border-accent/40"
            }`}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                <UploadCloud size={20} />
            </div>

            <p className="mt-3 text-sm font-medium text-text">
                {uploading
                    ? "Uploading and indexing…"
                    : "Drop a file here or click to upload"}
            </p>
            <p className="mt-1 text-xs text-text-muted">
                PDF, DOCX, or TXT
            </p>
        </div>
    );
}
