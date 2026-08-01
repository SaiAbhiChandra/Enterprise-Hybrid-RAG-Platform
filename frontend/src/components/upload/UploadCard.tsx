import { useRef, useState } from "react";
import { uploadDocument } from "../../api/documents";

export default function UploadCard() {
    const inputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    async function handleUpload(
        file: File,
    ) {

        setLoading(true);

        setMessage("");

        try {

            const result = await uploadDocument(file);

            setMessage(
                `✅ ${result.original_filename} uploaded successfully`
            );

        }

        catch (err: any) {

            setMessage(
                err.response?.data?.detail ??
                "Upload failed."
            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="rounded-xl bg-slate-900 p-8">

            <h2 className="text-2xl font-semibold">

                Upload PDF

            </h2>

            <p className="mt-2 text-slate-400">

                Select a document to build your knowledge base.

            </p>

            <input

                ref={inputRef}

                hidden

                type="file"

                accept=".pdf"

                onChange={(e) => {

                    if (e.target.files?.length) {

                        handleUpload(
                            e.target.files[0],
                        );

                    }

                }}

            />

            <button

                onClick={() => inputRef.current?.click()}

                disabled={loading}

                className="mt-8 rounded-lg bg-indigo-600 px-6 py-3 hover:bg-indigo-700"

            >

                {

                    loading

                    ?

                    "Uploading..."

                    :

                    "Choose PDF"

                }

            </button>

            {

                message &&

                <div className="mt-6 rounded bg-slate-800 p-3">

                    {message}

                </div>

            }

        </div>

    );

}