import { baseURL } from "./client";
import type { Source } from "./conversations";

export interface ChatMetaEvent {
    conversation_id: number;
    conversation_title: string;
    user_message_id: number;
    sources: Source[];
}

export interface StreamChatHandlers {
    onMeta?: (meta: ChatMetaEvent) => void;
    onToken?: (text: string) => void;
    onDone?: (assistantMessageId: number | null) => void;
}

/**
 * Shared consumer for the backend's Server-Sent Events chat stream,
 * used by both streamChat and regenerateChat -- they hit different
 * endpoints but produce identical event shapes.
 *
 * Uses the native fetch + ReadableStream API rather than axios --
 * axios's streaming support doesn't work reliably in the browser,
 * only in Node. Events arrive as blank-line-delimited
 * "event: X\ndata: Y" blocks per the SSE spec.
 */
async function consumeSSE(
    path: string,
    body: Record<string, unknown>,
    handlers: StreamChatHandlers,
    signal?: AbortSignal,
): Promise<void> {
    const token = localStorage.getItem("token");

    const response = await fetch(`${baseURL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        signal,
    });

    if (!response.ok || !response.body) {
        const detail = await safeReadError(response);

        throw new Error(
            detail ?? `Request failed with status ${response.status}`,
        );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });

        let boundary = buffer.indexOf("\n\n");

        while (boundary !== -1) {
            const rawEvent = buffer.slice(0, boundary);

            buffer = buffer.slice(boundary + 2);

            processEvent(rawEvent, handlers);

            boundary = buffer.indexOf("\n\n");
        }
    }
}

export async function streamChat(
    question: string,
    conversationId: number | null,
    handlers: StreamChatHandlers,
    signal?: AbortSignal,
): Promise<void> {
    return consumeSSE(
        "/chat/stream",
        { question, conversation_id: conversationId },
        handlers,
        signal,
    );
}

export async function regenerateChat(
    conversationId: number,
    messageId: number,
    handlers: StreamChatHandlers,
    signal?: AbortSignal,
): Promise<void> {
    return consumeSSE(
        "/chat/regenerate",
        { conversation_id: conversationId, message_id: messageId },
        handlers,
        signal,
    );
}

function processEvent(
    rawEvent: string,
    handlers: StreamChatHandlers,
): void {
    const lines = rawEvent.split("\n");

    let eventName = "message";
    let data = "";

    for (const line of lines) {
        if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
            data += line.slice(5).trim();
        }
    }

    if (!data) {
        return;
    }

    let parsed: any;

    try {
        parsed = JSON.parse(data);
    } catch {
        return;
    }

    if (eventName === "meta") {
        handlers.onMeta?.(parsed as ChatMetaEvent);
    } else if (eventName === "token") {
        handlers.onToken?.(parsed.text as string);
    } else if (eventName === "done") {
        handlers.onDone?.(parsed.assistant_message_id ?? null);
    }
}

async function safeReadError(response: Response): Promise<string | null> {
    try {
        const data = await response.json();

        return data.detail ?? null;
    } catch {
        return null;
    }
}
