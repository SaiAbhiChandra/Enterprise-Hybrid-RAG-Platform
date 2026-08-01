import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../api/auth";
import { useAuth } from "../../auth/useAuth";

export default function LoginPage() {
    const navigate = useNavigate();

    const { login: saveToken } = useAuth();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleLogin(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setError("");

        setLoading(true);

        try {
            const response = await login({
                username: email,
                password: password,
            });

            saveToken(response.access_token);

            navigate("/");
        } catch (err: any) {
            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(detail[0].msg);
            } else if (typeof detail === "string") {
                setError(detail);
            } else {
                setError("Login failed.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">

            <div className="w-full max-w-md rounded-xl bg-slate-900 p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-white">
                    Welcome Back
                </h1>

                <p className="text-slate-400 mt-2">
                    Login to Enterprise Hybrid RAG
                </p>

                {error && (
                    <div className="mt-4 rounded bg-red-700 p-3 text-white">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleLogin}
                    className="mt-8 space-y-5"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-indigo-600 py-3 text-white hover:bg-indigo-700 transition"
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                </form>

                <p className="mt-6 text-center text-slate-400">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="ml-2 text-indigo-400"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}