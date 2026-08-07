import {
    Bot,
    BrainCircuit,
    Database,
    ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";

export default function ChatHeader() {

    return (

        <motion.div

            initial={{
                opacity: 0,
                y: -10,
            }}

            animate={{
                opacity: 1,
                y: 0,
            }}

            transition={{
                duration: 0.35,
            }}

            className="flex items-center justify-between"

        >

            {/* Left */}

            <div className="flex items-center gap-5">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">

                    <Bot
                        size={28}
                        className="text-indigo-600"
                    />

                </div>

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">

                        Enterprise AI Assistant

                    </h1>

                    <p className="mt-1 text-sm text-slate-500">

                        Private Hybrid Retrieval-Augmented Generation Workspace

                    </p>

                </div>

            </div>

            {/* Right */}

            <div className="hidden items-center gap-3 xl:flex">

                <StatusBadge
                    icon={<BrainCircuit size={15} />}
                    title="Llama 3.1"
                />

                <StatusBadge
                    icon={<Database size={15} />}
                    title="Qdrant"
                />

                <StatusBadge
                    icon={<ShieldCheck size={15} />}
                    title="Private RAG"
                />

            </div>

        </motion.div>

    );

}

interface StatusBadgeProps {

    icon: React.ReactNode;

    title: string;

}

function StatusBadge({

    icon,

    title,

}: StatusBadgeProps) {

    return (

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">

            <span className="text-indigo-600">

                {icon}

            </span>

            <span className="text-sm font-medium text-slate-700">

                {title}

            </span>

        </div>

    );

}