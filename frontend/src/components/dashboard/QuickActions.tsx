import {
    ArrowRight,
    BrainCircuit,
    FileText,
    Search,
    Upload,
} from "lucide-react";

import { Link } from "react-router-dom";

const actions = [
    {
        title: "Upload Documents",
        icon: Upload,
        to: "/upload",
    },
    {
        title: "AI Chat",
        icon: BrainCircuit,
        to: "/chat",
    },
    {
        title: "Documents",
        icon: FileText,
        to: "/documents",
    },
    {
        title: "Search",
        icon: Search,
        to: "/chat",
    },
];

export default function QuickActions() {

    return (

        <section>

            <div className="mb-5">

                <h2 className="text-xl font-semibold text-slate-900">

                    Quick Actions

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Frequently used enterprise tools

                </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {actions.map((action) => {

                    const Icon = action.icon;

                    return (

                        <Link
                            key={action.title}
                            to={action.to}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md"
                        >

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                                <Icon size={22} />

                            </div>

                            <h3 className="mt-5 font-semibold text-slate-900">

                                {action.title}

                            </h3>

                            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-indigo-600">

                                Open

                                <ArrowRight
                                    size={16}
                                    className="transition group-hover:translate-x-1"
                                />

                            </div>

                        </Link>

                    );

                })}

            </div>

        </section>

    );

}