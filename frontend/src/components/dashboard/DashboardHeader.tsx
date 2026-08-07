import {
    ArrowRight,
    BrainCircuit,
    Search,
    Sparkles,
    Upload,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function DashboardHeader() {

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 18
            ? "Good Afternoon"
            : "Good Evening";

    return (

        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* Decorative Background */}

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100 blur-3xl opacity-70" />

            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-100 blur-3xl opacity-70" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}

                <div className="max-w-3xl">

                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">

                        <Sparkles size={16} />

                        {greeting}

                    </div>

                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">

                        Welcome back,

                        <span className="text-indigo-600">

                            {" "}Sai Abhi 👋

                        </span>

                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">

                        Manage enterprise documents, search knowledge instantly,
                        and interact with your private AI assistant powered by
                        Hybrid Retrieval-Augmented Generation.

                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">

                        <Link
                            to="/upload"
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
                        >

                            <Upload size={18} />

                            Upload Documents

                        </Link>

                        <Link
                            to="/chat"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
                        >

                            <BrainCircuit size={18} />

                            Start AI Chat

                            <ArrowRight size={18} />

                        </Link>

                    </div>

                </div>

                {/* Right */}

                <div className="w-full max-w-sm">

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500">

                            <Search size={16} />

                            Quick Search

                        </div>

                        <input
                            placeholder="Search your documents..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-indigo-500"
                        />

                        <div className="mt-5 space-y-2">

                            <button className="w-full rounded-lg bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:bg-indigo-50">

                                📄 Project Proposal.pdf

                            </button>

                            <button className="w-full rounded-lg bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:bg-indigo-50">

                                📘 HR Policy Handbook

                            </button>

                            <button className="w-full rounded-lg bg-white px-4 py-3 text-left text-sm text-slate-700 shadow-sm transition hover:bg-indigo-50">

                                🤖 AI Architecture Guide

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}