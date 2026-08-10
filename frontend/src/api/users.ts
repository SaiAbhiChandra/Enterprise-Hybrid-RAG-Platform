import api from "./client";

export interface UserProfile {
    id: number;
    full_name: string;
    email: string;
    is_active: boolean;
}

export async function getMe(): Promise<UserProfile> {
    const response = await api.get("/users/me");

    return response.data;
}
