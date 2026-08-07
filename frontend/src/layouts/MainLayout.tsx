import type { ReactNode } from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({
    children,
}: MainLayoutProps) {

    return (

        <div className="flex h-screen overflow-hidden bg-slate-50">

            <Sidebar />

            <div className="flex min-w-0 flex-1 flex-col">

                <Header />

                <main className="flex-1 overflow-y-auto">

                    <div className="mx-auto w-full max-w-[1440px] px-8 py-8">

                        {children}

                    </div>

                </main>

            </div>

        </div>

    );

}