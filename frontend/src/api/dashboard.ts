import api from "./client";

/* ----------------------------------------
   Dashboard Statistics
----------------------------------------- */

export interface DashboardStats {

    documents: number;

    chunks: number;

    conversations: number;

    accuracy: number;

}

/* ----------------------------------------
   Recent Uploads
----------------------------------------- */

export interface RecentUpload {

    id: number;

    filename: string;

    status: string;

    size: number;

    created_at: string;

}

/* ----------------------------------------
   Recent Activity
----------------------------------------- */

export interface RecentActivity {

    title: string;

    description: string;

    created_at: string;

    type?: string;

}

/* ----------------------------------------
   System Health
----------------------------------------- */

export interface HealthItem {

    name: string;

    status: string;

}

export interface DashboardResponse {

    stats: DashboardStats;

    recent_uploads: RecentUpload[];

    recent_activity: RecentActivity[];

    system_health: HealthItem[];

}

/* ----------------------------------------
   API
----------------------------------------- */

export async function getDashboard(): Promise<DashboardResponse> {

    const response = await api.get("/dashboard");

    return response.data;

}