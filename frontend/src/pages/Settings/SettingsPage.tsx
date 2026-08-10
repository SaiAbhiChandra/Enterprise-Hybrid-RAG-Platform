import { LogOut } from "lucide-react";
import { useAuth } from "../../auth/useAuth";

export default function SettingsPage() {
    const { user, logout } = useAuth();

    return (
        <div className="h-full overflow-y-auto">
            <div className="mx-auto max-w-2xl px-6 py-10">
                <h1 className="font-display text-2xl font-semibold tracking-tight text-text">
                    Settings
                </h1>
                <p className="mt-1 text-sm text-text-muted">
                    Manage your account.
                </p>

                <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Account
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-display text-base font-semibold text-white">
                            {(user?.full_name ?? user?.email ?? "?")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text">
                                {user?.full_name ?? "—"}
                            </p>
                            <p className="text-xs text-text-muted">
                                {user?.email ?? "—"}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-danger transition hover:border-danger/30 hover:bg-danger/5"
                >
                    <LogOut size={15} />
                    Log out
                </button>
            </div>
        </div>
    );
}
