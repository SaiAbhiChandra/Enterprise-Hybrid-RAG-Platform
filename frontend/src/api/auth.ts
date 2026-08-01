import api from "./client";

export interface RegisterRequest {
    full_name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export async function register(
    data: RegisterRequest,
) {
    const response = await api.post(
        "/auth/register",
        data,
    );

    return response.data;
}

export async function login(
    data: LoginRequest,
) {
    const form = new URLSearchParams();

    form.append("username", data.username);
    form.append("password", data.password);

    const response = await api.post(
        "/auth/login",
        form,
        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
        },
    );

    return response.data;
}