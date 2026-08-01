import api from "./client";

export async function uploadDocument(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/documents/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        },
    );

    return response.data;
}

export async function getDocuments() {
    const response = await api.get("/documents");

    return response.data;
}

export async function deleteDocument(id: number) {
    return api.delete(`/documents/${id}`);
}