import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
    FileText,
    LogOut,
    MessageSquarePlus,
    MoreHorizontal,
    Pencil,
    Settings,
    Trash2,
} from "lucide-react";

import FusionMark from "../brand/FusionMark";
import { useAuth } from "../../auth/useAuth";
import {
    deleteConversation,
    renameConversation,
    type ConversationSummary,
} from "../../api/conversations";

type Props = {
    conversations: ConversationSummary[];
    loading: boolean;
    onConversationsChange: () => Promise<void>;
};

function groupByRecency(
    conversations: ConversationSummary[],
): [string, ConversationSummary[]][] {
    const now = Date.now();

    const buckets: Record<string, ConversationSummary[]> = {
        Today: [],
        Yesterday: [],
        "Previous 7 days": [],
        Older: [],
    };

    for (const conversation of conversations) {
        const updated = new Date(conversation.updated_at).getTime();
        const diffDays = Math.floor((now - updated) / 86_400_000);

        if (diffDays <= 0) {
            buckets.Today.push(conversation);
        } else if (diffDays === 1) {
            buckets.Yesterday.push(conversation);
        } else if (diffDays <= 7) {
            buckets["Previous 7 days"].push(conversation);
        } else {
            buckets.Older.push(conversation);
        }
    }

    return Object.entries(buckets).filter(
        ([, items]) => items.length > 0,
    );
}

export default function ConversationSidebar({
    conversations,
    loading,
    onConversationsChange,
}: Props) {
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const { user, logout } = useAuth();

    const [menuOpenFor, setMenuOpenFor] = useState<number | null>(null);
    const [renamingId, setRenamingId] = useState<number | null>(null);
    const [renameValue, setRenameValue] = useState("");

    const grouped = groupByRecency(conversations);

    async function handleDelete(id: number) {
        setMenuOpenFor(null);

        await deleteConversation(id);
        await onConversationsChange();

        if (Number(conversationId) === id) {
            navigate("/chat");
        }
    }

    function startRename(conversation: ConversationSummary) {
        setMenuOpenFor(null);
        setRenamingId(conversation.id);
        setRenameValue(conversation.title);
    }

    async function commitRename(id: number) {
        const title = renameValue.trim();

        setRenamingId(null);

        if (!title) return;

        await renameConversation(id, title);
        await onConversationsChange();
    }

    return (
        <aside className="flex h-full w-72 shrink-0 flex-col border-r border-border bg-surface-alt/60">
            <div className="flex items-center gap-2 px-4 pt-5 pb-3">
                <FusionMark size={26} />
                <span className="font-display text-[17px] font-semibold tracking-tight">
                    Cortex
                </span>
            </div>

            <div className="px-3">
                <button
                    onClick={() => navigate("/chat")}
                    className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-text shadow-sm transition hover:border-accent/40 hover:bg-accent/5"
                >
                    <MessageSquarePlus size={16} className="text-accent" />
                    New chat
                </button>
            </div>

            <nav className="mt-4 flex-1 overflow-y-auto px-3 pb-2">
                {loading && (
                    <p className="px-2 py-3 text-xs text-text-muted">
                        Loading conversations…
                    </p>
                )}

                {!loading && conversations.length === 0 && (
                    <p className="px-2 py-3 text-xs leading-relaxed text-text-muted">
                        No conversations yet. Ask something to get started.
                    </p>
                )}

                {grouped.map(([label, items]) => (
                    <div key={label} className="mb-3">
                        <p className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-text-muted">
                            {label}
                        </p>

                        {items.map((conversation) => {
                            const active =
                                Number(conversationId) === conversation.id;

                            return (
                                <div
                                    key={conversation.id}
                                    className={`group relative flex items-center rounded-lg px-2 py-1.5 text-sm transition ${
                                        active
                                            ? "bg-accent/10 text-text"
                                            : "text-text hover:bg-surface"
                                    }`}
                                >
                                    {renamingId === conversation.id ? (
                                        <input
                                            autoFocus
                                            value={renameValue}
                                            onChange={(e) =>
                                                setRenameValue(
                                                    e.target.value,
                                                )
                                            }
                                            onBlur={() =>
                                                commitRename(conversation.id)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    commitRename(
                                                        conversation.id,
                                                    );
                                                } else if (
                                                    e.key === "Escape"
                                                ) {
                                                    setRenamingId(null);
                                                }
                                            }}
                                            className="w-full rounded border border-accent/50 bg-surface px-1.5 py-0.5 text-sm outline-none"
                                        />
                                    ) : (
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/chat/${conversation.id}`,
                                                )
                                            }
                                            className="min-w-0 flex-1 truncate text-left"
                                            title={conversation.title}
                                        >
                                            {conversation.title}
                                        </button>
                                    )}

                                    {renamingId !== conversation.id && (
                                        <div className="relative shrink-0">
                                            <button
                                                onClick={() =>
                                                    setMenuOpenFor(
                                                        menuOpenFor ===
                                                            conversation.id
                                                            ? null
                                                            : conversation.id,
                                                    )
                                                }
                                                className="rounded p-1 text-text-muted opacity-0 transition hover:bg-border/60 group-hover:opacity-100"
                                            >
                                                <MoreHorizontal size={15} />
                                            </button>

                                            {menuOpenFor ===
                                                conversation.id && (
                                                <div className="absolute right-0 top-7 z-10 w-36 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
                                                    <button
                                                        onClick={() =>
                                                            startRename(
                                                                conversation,
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text hover:bg-surface-alt"
                                                    >
                                                        <Pencil size={13} />
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                conversation.id,
                                                            )
                                                        }
                                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-danger hover:bg-danger/5"
                                                    >
                                                        <Trash2 size={13} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="border-t border-border px-3 py-3">
                <NavLink
                    to="/documents"
                    className={({ isActive }) =>
                        `mb-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                            isActive
                                ? "bg-accent/10 text-text"
                                : "text-text-muted hover:bg-surface hover:text-text"
                        }`
                    }
                >
                    <FileText size={16} />
                    Documents
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                            isActive
                                ? "bg-accent/10 text-text"
                                : "text-text-muted hover:bg-surface hover:text-text"
                        }`
                    }
                >
                    <Settings size={16} />
                    Settings
                </NavLink>

                <div className="flex items-center gap-2 rounded-lg px-2 py-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent font-display text-xs font-semibold text-white">
                        {(user?.full_name ?? user?.email ?? "?")
                            .charAt(0)
                            .toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-text">
                            {user?.full_name ?? "Account"}
                        </p>
                        <p className="truncate text-[11px] text-text-muted">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        title="Log out"
                        className="rounded p-1.5 text-text-muted transition hover:bg-danger/10 hover:text-danger"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
