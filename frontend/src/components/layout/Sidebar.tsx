import {
    Brain,
    FileText,
    Home,
    LogOut,
    MessageSquare,
    Settings,
    Upload,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
    { title: "Dashboard", icon: Home, path: "/" },
    { title: "AI Chat", icon: MessageSquare, path: "/chat" },
    { title: "Upload", icon: Upload, path: "/upload" },
    { title: "Documents", icon: FileText, path: "/documents" },
    { title: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

            <div className="border-b border-slate-200 px-6 py-7">

                <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">

                        <Brain size={22} />

                    </div>

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Enterprise AI
                        </h2>

                        <p className="text-xs text-slate-500">
                            Hybrid RAG Platform
                        </p>

                    </div>

                </div>

            </div>

            <nav className="flex-1 px-4 py-6">

                <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Workspace
                </p>

                <div className="space-y-2">

                    {menu.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`
                                }
                            >

                                <Icon size={19} />

                                {item.title}

                            </NavLink>

                        );

                    })}

                </div>

            </nav>

            <div className="border-t border-slate-200 p-5">

                <div className="mb-5 flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
                        S
                    </div>

                    <div>

                        <h3 className="text-sm font-semibold text-slate-900">
                            Sai Abhi
                        </h3>

                        <p className="text-xs text-slate-500">
                            AI Engineer
                        </p>

                    </div>

                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-medium hover:bg-slate-100">

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </aside>
    );
}