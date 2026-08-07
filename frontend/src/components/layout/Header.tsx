import {
    Bell,
    Search,
} from "lucide-react";

export default function Header() {

    return (

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">

            <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-8">

                <div>

                    <h1 className="text-2xl font-bold text-slate-900">

                        Enterprise Workspace

                    </h1>

                    <p className="text-sm text-slate-500">

                        AI Powered Knowledge Platform

                    </p>

                </div>

                <div className="flex items-center gap-5">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            placeholder="Search..."
                            className="w-80 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:bg-white"
                        />

                    </div>

                    <button className="rounded-xl border border-slate-200 p-3 hover:bg-slate-100">

                        <Bell size={19} />

                    </button>

                </div>

            </div>

        </header>

    );

}