import { useEffect, useState } from "react";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatsGrid from "../../components/dashboard/StatsGrid";
import RecentActivity from "../../components/dashboard/RecentActivity";
import RecentUploads from "../../components/dashboard/RecentUploads";
import SystemHealth from "../../components/dashboard/SystemHealth";
import QuickActions from "../../components/dashboard/QuickActions";

import { getDashboard } from "../../api/dashboard";
import type { DashboardResponse } from "../../api/dashboard";

export default function Dashboard() {

    const [dashboard, setDashboard] =
        useState<DashboardResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadDashboard() {

            try {

                const data = await getDashboard();

                setDashboard(data);

            }

            catch (error) {

                console.error(error);

            }

            finally {

                setLoading(false);

            }

        }

        loadDashboard();

    }, []);

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="flex flex-col items-center gap-5">

                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

                    <p className="text-sm text-slate-500">

                        Loading your workspace...

                    </p>

                </div>

            </div>

        );

    }

    if (!dashboard) {

        return (

            <div className="rounded-3xl border border-red-200 bg-red-50 p-10">

                <h2 className="text-xl font-semibold text-red-700">

                    Dashboard Unavailable

                </h2>

                <p className="mt-3 text-red-500">

                    Unable to fetch dashboard information from the server.

                </p>

            </div>

        );

    }

    return (

        <div className="mx-auto flex w-full max-w-[1450px] flex-col gap-8">

            {/* Hero */}

            <DashboardHeader />

            {/* Statistics */}

            <StatsGrid

                documents={dashboard.stats.documents}

                chunks={dashboard.stats.chunks}

                chats={dashboard.stats.conversations}

                accuracy={dashboard.stats.accuracy}

            />

            {/* Quick Actions */}

            <QuickActions />

            {/* Main Content */}

            <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">

                {/* Left */}

                <div className="space-y-8">

                    <RecentActivity

                        activities={dashboard.recent_activity}

                    />

                    <RecentUploads

                        uploads={dashboard.recent_uploads}

                    />

                </div>

                {/* Right */}

                <div>

                    <SystemHealth

                        health={dashboard.system_health}

                    />

                </div>

            </div>

        </div>

    );

}