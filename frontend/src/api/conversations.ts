import api from "./client";

export interface Source {
    document_id: number;
    document_name: string;
    chunk_id: number;
    chunk_index: number;
    score: number;
}

export interface ConversationSummary {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface MessageResponse {
    id: number;
    role: "user" | "assistant";
    content: string;
    sources: Source[] | null;
    created_at: string;
}

export interface ConversationDetail extends ConversationSummary {
    messages: MessageResponse[];
}

export async function listConversations(): Promise<ConversationSummary[]> {
    const response = await api.get("/conversations");

    return response.data;
}

export async function getConversation(
    id: number,
): Promise<ConversationDetail> {
    const response = await api.get(`/conversations/${id}`);

    return response.data;
}

export async function renameConversation(
    id: number,
    title: string,
): Promise<ConversationSummary> {
    const response = await api.patch(`/conversations/${id}`, { title });

    return response.data;
}

export async function deleteConversation(id: number): Promise<void> {
    await api.delete(`/conversations/${id}`);
}

export async function truncateMessagesFrom(
    conversationId: number,
    messageId: number,
): Promise<void> {
    await api.delete(
        `/conversations/${conversationId}/messages/from/${messageId}`,
    );
}
