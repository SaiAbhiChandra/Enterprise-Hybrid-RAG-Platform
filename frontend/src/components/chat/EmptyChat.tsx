import {
    BrainCircuit,
} from "lucide-react";

import type {

    ReactNode,

} from "react";

interface Props {

    children: ReactNode;

}

export default function EmptyChat({

    children,

}: Props) {

    return (

        <div className="flex flex-col items-center justify-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100">

                <BrainCircuit

                    size={38}

                    className="text-indigo-600"

                />

            </div>

            <h1 className="mt-8 text-4xl font-bold text-slate-900">

                Enterprise AI Assistant

            </h1>

            <p className="mt-4 max-w-2xl text-center text-lg leading-8 text-slate-500">

                Search across your enterprise knowledge base,

                summarize documents,

                compare files,

                generate reports,

                and retrieve accurate answers using

                Hybrid Retrieval-Augmented Generation.

            </p>

            <div className="mt-12 w-full">

                {children}

            </div>

        </div>

    );

}