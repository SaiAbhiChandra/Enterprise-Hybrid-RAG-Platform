import { useState } from "react";
import { motion } from "framer-motion";
import {
    FolderOpen,
    ShieldCheck,
    BrainCircuit,
    Database,
} from "lucide-react";

import api from "../../api/client";
import UploadCard from "../../components/upload/UploadCard";

export default function UploadPage() {

    const [loading, setLoading] = useState(false);

    const [uploadedFile, setUploadedFile] =
        useState("");

    async function uploadDocument(file: File) {

        const formData = new FormData();

        formData.append("file", file);

        setLoading(true);

        try {

            await api.post(
                "/documents/upload",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                },
            );

            setUploadedFile(file.name);

        } catch (error) {

            console.error(error);

            alert("Upload failed.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="space-y-10">

            {/* Hero */}

            <motion.div

                initial={{
                    opacity: 0,
                    y: 20,
                }}

                animate={{
                    opacity: 1,
                    y: 0,
                }}

                className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-10 shadow-2xl"

            >

                <h1 className="text-5xl font-bold">

                    Enterprise Document Upload

                </h1>

                <p className="mt-5 max-w-3xl text-lg text-indigo-100">

                    Upload enterprise PDFs and instantly
                    transform them into searchable AI
                    knowledge using embeddings,
                    semantic search,
                    Qdrant,
                    and Llama 3.

                </p>

            </motion.div>

            {/* Upload */}

            <UploadCard

                loading={loading}

                uploadedFile={uploadedFile}

                onFileSelect={uploadDocument}

            />

            {/* Features */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <Feature

                    icon={<FolderOpen size={30} />}

                    title="Smart Parsing"

                    text="Automatically extracts text from enterprise PDFs."

                />

                <Feature

                    icon={<BrainCircuit size={30} />}

                    title="AI Embeddings"

                    text="Generates vector embeddings for semantic retrieval."

                />

                <Feature

                    icon={<Database size={30} />}

                    title="Qdrant Index"

                    text="Indexes every document into the vector database."

                />

                <Feature

                    icon={<ShieldCheck size={30} />}

                    title="Private"

                    text="Your documents stay inside your own infrastructure."

                />

            </div>

        </div>

    );

}

interface FeatureProps {

    icon: React.ReactNode;

    title: string;

    text: string;

}

function Feature({

    icon,

    title,

    text,

}: FeatureProps) {

    return (

        <motion.div

            whileHover={{

                y: -5,

            }}

            className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl"

        >

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">

                {icon}

            </div>

            <h2 className="text-xl font-semibold">

                {title}

            </h2>

            <p className="mt-4 text-slate-400">

                {text}

            </p>

        </motion.div>

    );

}