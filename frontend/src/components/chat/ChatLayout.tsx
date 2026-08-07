import type { ReactNode } from "react";

interface ChatLayoutProps {
    header: ReactNode;
    sidebar?: ReactNode;
    children: ReactNode;
    input: ReactNode;
}

export default function ChatLayout({
    header,
    sidebar,
    children,
    input,
}: ChatLayoutProps) {

    return (

        <div className="flex h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Sidebar */}

            {sidebar && (

                <aside className="w-80 border-r border-slate-200 bg-white">

                    {sidebar}

                </aside>

            )}

            {/* Main */}

            <section className="flex min-w-0 flex-1 flex-col bg-slate-50">

                {/* Header */}

                <div className="border-b border-slate-200 bg-white px-8 py-5">

                    {header}

                </div>

                {/* Messages */}

                <div className="flex-1 overflow-y-auto bg-slate-50 px-8 py-8">

                    <div className="mx-auto w-full max-w-5xl">

                        {children}

                    </div>

                </div>

                {/* Input */}

                <div className="border-t border-slate-200 bg-white px-8 py-6">

                    <div className="mx-auto max-w-5xl">

                        {input}

                    </div>

                </div>

            </section>

        </div>

    );

}