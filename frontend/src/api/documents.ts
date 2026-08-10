import api from "./client";

export interface Document {
    id: number;
    filename: string;
    original_filename: string;
    mime_type: string;
    file_size: number;
    status: string;
    owner_id: number;
    created_at: string;
    updated_at: string;
}

export async function uploadDocument(file: File): Promise<Document> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post("/documents/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}

export async function getDocuments(): Promise<Document[]> {
    const response = await api.get("/documents");

    return response.data;
}

export async function deleteDocument(id: number): Promise<void> {
    await api.delete(`/documents/${id}`);
}
