import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import ConversationSidebar from "./ConversationSidebar";
import {
    listConversations,
    type ConversationSummary,
} from "../../api/conversations";

export type AppShellContext = {
    conversations: ConversationSummary[];
    refreshConversations: () => Promise<void>;
};

export default function AppShell() {
    const [conversations, setConversations] = useState<
        ConversationSummary[]
    >([]);
    const [loadingConversations, setLoadingConversations] = useState(true);

    const refreshConversations = useCallback(async () => {
        try {
            const data = await listConversations();

            setConversations(data);
        } catch {
            // A stale sidebar isn't worth an error toast -- the user
            // will get fresh data on their next successful action.
        } finally {
            setLoadingConversations(false);
        }
    }, []);

    useEffect(() => {
        refreshConversations();
    }, [refreshConversations]);

    return (
        <div className="flex h-screen overflow-hidden bg-bg text-text font-sans">
            <ConversationSidebar
                conversations={conversations}
                loading={loadingConversations}
                onConversationsChange={refreshConversations}
            />

            <div className="flex-1 min-w-0 h-full">
                <Outlet
                    context={
                        {
                            conversations,
                            refreshConversations,
                        } satisfies AppShellContext
                    }
                />
            </div>
        </div>
    );
}
