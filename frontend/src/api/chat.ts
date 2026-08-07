import api from "./client";

export interface ChatRequest {
    question: string;
}

export interface Source {

    document_id: number;

    document_name: string;

    chunk_id: number;

    chunk_index: number;

    score: number;

}

export interface ChatResponse {

    answer: string;

    sources: Source[];

}

export async function askQuestion(
    question: string,
): Promise<ChatResponse> {

    const response = await api.post(
        "/chat",
        {
            question,
        },
    );

    return response.data;

}

export async function streamQuestion(

    question: string,

    onChunk: (text: string) => void,

) {

    const token = localStorage.getItem("token");

    const response = await fetch(

        "http://127.0.0.1:8000/api/v1/chat/stream",

        {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`,

            },

            body: JSON.stringify({

                question,

            }),

        },

    );

    // IMPORTANT
    if (!response.ok) {

        const error = await response.json();

        throw new Error(error.detail);

    }

    if (!response.body) {

        throw new Error("No response stream.");

    }

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    while (true) {

        const { done, value } = await reader.read();

        if (done) break;

        onChunk(

            decoder.decode(value),

        );

    }

}