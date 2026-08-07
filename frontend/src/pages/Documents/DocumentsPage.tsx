import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Search,
    Trash2,
    Calendar,
    Database,
    HardDrive,
    RefreshCw,
} from "lucide-react";

import { getDocuments, deleteDocument } from "../../api/documents";

interface Document {
    id: number;
    original_filename: string;
    status: string;
    file_size: number;
    created_at?: string;
}

export default function DocumentsPage() {

    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    async function loadDocuments() {

        setLoading(true);

        try {

            const data = await getDocuments();

            setDocuments(data);

        } catch (err) {

            console.error(err);

        }

        setLoading(false);

    }

    async function removeDocument(id: number) {

        if (!confirm("Delete this document?"))
            return;

        try {

            await deleteDocument(id);

            loadDocuments();

        } catch (err) {

            console.error(err);

        }

    }

    useEffect(() => {

        loadDocuments();

    }, []);

    const filtered = documents.filter((doc) =>
        doc.original_filename
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <div className="space-y-8">

            {/* Header */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-10 shadow-2xl"
            >

                <h1 className="text-5xl font-bold">

                    Enterprise Documents

                </h1>

                <p className="mt-4 text-lg text-indigo-100 max-w-3xl">

                    Browse, manage and search all indexed enterprise
                    documents stored inside your Hybrid RAG platform.

                </p>

            </motion.div>

            {/* Toolbar */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="relative w-full lg:w-96">

                    <Search
                        className="absolute left-4 top-4 text-slate-500"
                        size={18}
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search documents..."
                        className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 outline-none focus:border-indigo-500"
                    />

                </div>

                <button
                    onClick={loadDocuments}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 hover:bg-indigo-700 transition"
                >

                    <RefreshCw size={18} />

                    Refresh

                </button>

            </div>

            {/* Loading */}

            {loading && (

                <div className="rounded-3xl bg-slate-900 p-10 text-center">

                    Loading documents...

                </div>

            )}

            {/* Empty */}

            {!loading && filtered.length === 0 && (

                <div className="rounded-3xl border border-dashed border-slate-700 p-20 text-center">

                    <FileText
                        size={70}
                        className="mx-auto text-slate-500"
                    />

                    <h2 className="mt-6 text-3xl font-bold">

                        No Documents Found

                    </h2>

                    <p className="mt-3 text-slate-400">

                        Upload your first enterprise document to start
                        chatting with AI.

                    </p>

                </div>

            )}

            {/* Grid */}

            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

                {filtered.map((doc, index) => (

                    <motion.div

                        key={doc.id}

                        initial={{
                            opacity: 0,
                            y: 20,
                        }}

                        animate={{
                            opacity: 1,
                            y: 0,
                        }}

                        transition={{
                            delay: index * .05,
                        }}

                        className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-xl hover:border-indigo-500 transition"

                    >

                        <div className="flex items-start justify-between">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">

                                <FileText size={30} />

                            </div>

                            <span className="rounded-full bg-green-600/20 px-3 py-1 text-sm text-green-400">

                                {doc.status}

                            </span>

                        </div>

                        <h2 className="mt-6 line-clamp-2 text-xl font-bold">

                            {doc.original_filename}

                        </h2>

                        <div className="mt-6 space-y-3 text-slate-400">

                            <div className="flex items-center gap-3">

                                <HardDrive size={17} />

                                {(doc.file_size / 1024).toFixed(1)} KB

                            </div>

                            <div className="flex items-center gap-3">

                                <Calendar size={17} />

                                {doc.created_at ?? "Today"}

                            </div>

                            <div className="flex items-center gap-3">

                                <Database size={17} />

                                Indexed

                            </div>

                        </div>

                        <button

                            onClick={() =>
                                removeDocument(doc.id)
                            }

                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 transition hover:bg-red-700"

                        >

                            <Trash2 size={18} />

                            Delete

                        </button>

                    </motion.div>

                ))}

            </div>

        </div>

    );

}