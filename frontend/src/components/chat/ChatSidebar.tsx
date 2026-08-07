import {
    Clock3,
    MessageSquare,
    Plus,
    Search,
} from "lucide-react";

import { motion } from "framer-motion";

const conversations = [
    {
        group: "Today",
        items: [
            "Summarize HR Policy",
            "Compare Annual Reports",
        ],
    },
    {
        group: "Yesterday",
        items: [
            "Explain Transformer",
            "Generate Questions",
        ],
    },
];

export default function ChatSidebar() {

    return (

        <div className="flex h-full flex-col bg-white">

            {/* Header */}

            <div className="border-b border-slate-200 p-6">

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">

                    <Plus size={18} />

                    New Chat

                </button>

                <div className="relative mt-5">

                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        placeholder="Search conversations..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white"
                    />

                </div>

            </div>

            {/* Conversations */}

            <div className="flex-1 overflow-y-auto px-4 py-5">

                {conversations.map((section) => (

                    <div
                        key={section.group}
                        className="mb-8"
                    >

                        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">

                            {section.group}

                        </p>

                        {section.items.map((item) => (

                            <motion.button

                                key={item}

                                whileHover={{
                                    x: 4,
                                }}

                                whileTap={{
                                    scale: 0.98,
                                }}

                                className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-indigo-50"

                            >

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

                                    <MessageSquare
                                        size={17}
                                        className="text-indigo-600"
                                    />

                                </div>

                                <span className="truncate text-sm font-medium text-slate-700">

                                    {item}

                                </span>

                            </motion.button>

                        ))}

                    </div>

                ))}

            </div>

            {/* Footer */}

            <div className="border-t border-slate-200 p-5">

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">

                        <Clock3
                            size={18}
                            className="text-indigo-600"
                        />

                    </div>

                    <div>

                        <p className="text-sm font-semibold text-slate-800">

                            Enterprise Mode

                        </p>

                        <p className="text-xs text-slate-500">

                            Hybrid Retrieval Enabled

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}