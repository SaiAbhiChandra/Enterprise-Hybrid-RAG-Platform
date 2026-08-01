import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { register } from "../../api/auth";

export default function RegisterPage() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleRegister(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            await register({

                full_name: fullName,

                email,

                password,

            });

            navigate("/login");

        } catch (err: any) {

            const detail = err.response?.data?.detail;

            if (Array.isArray(detail)) {
                setError(detail[0].msg);
            } else if (typeof detail === "string") {
                setError(detail);
            } else {
                setError("Registration failed.");
            }

        } finally {

            setLoading(false);

        }
    }

    return (

        <div className="min-h-screen bg-slate-950 flex items-center justify-center">

            <div className="w-full max-w-md rounded-xl bg-slate-900 p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-white">

                    Create Account

                </h1>

                <p className="text-slate-400 mt-2">

                    Register a new user

                </p>

                {error && (

                    <div className="mt-4 rounded bg-red-700 p-3 text-white">

                        {error}

                    </div>

                )}

                <form
                    onSubmit={handleRegister}
                    className="mt-8 space-y-5"
                >

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                        className="w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
                        required
                    />

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

                        {loading
                            ? "Registering..."
                            : "Register"}

                    </button>

                </form>

                <p className="mt-6 text-center text-slate-400">

                    Already have an account?

                    <Link
                        to="/login"
                        className="ml-2 text-indigo-400"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );
}