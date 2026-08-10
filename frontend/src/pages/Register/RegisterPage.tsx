import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { register } from "../../api/auth";
import FusionMark from "../../components/brand/FusionMark";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleRegister(e: React.FormEvent) {
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
        <div className="flex min-h-screen items-center justify-center bg-bg px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center">
                    <FusionMark size={36} />
                    <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text">
                        Create your account
                    </h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Get started with Cortex
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                    {error && (
                        <div className="mb-4 rounded-lg bg-danger/10 px-3 py-2.5 text-sm text-danger">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-3.5">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                Full name
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Jane Doe"
                                required
                                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text outline-none transition focus:border-accent/50"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                required
                                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text outline-none transition focus:border-accent/50"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-muted">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text outline-none transition focus:border-accent/50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
                        >
                            {loading && (
                                <Loader2 size={14} className="animate-spin" />
                            )}
                            {loading ? "Creating account…" : "Create account"}
                        </button>
                    </form>
                </div>

                <p className="mt-5 text-center text-sm text-text-muted">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-accent hover:text-accent-hover"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
