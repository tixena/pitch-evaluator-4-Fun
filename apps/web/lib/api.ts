//helper base para fetch

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export async function apiFetch<T>(path: string, init?:RequestInit): Promise<T> {
    const res = await fetch(`${BACKEND_URL}${path}`, {
        ...init,
        credentials: "include",//hace que se envien cookies
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {})//si el usuario mandar headers extra, agregalo
        },
    });

    if (!res.ok){
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message ?? "Request failed");
    }

    return res.json() as Promise<T>;//convierte a json
}

export async function apiFetchBlob(path: string, init?: RequestInit): Promise<Blob> {
    const res = await fetch(`${BACKEND_URL}${path}`, {
        ...init,
        credentials: "include",
    })

    if (!res.ok) {
        const errorBody = await res.json().catch(() => null);
        throw new Error(errorBody?.message ?? "Request failed");
    }

    return res.blob()
}