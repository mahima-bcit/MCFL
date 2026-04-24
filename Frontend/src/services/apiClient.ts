const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

type ApiRequestOptions = RequestInit;

export async function apiFetch<T>(
  path: string,
  { headers, ...options }: ApiRequestOptions = {}
): Promise<T> {
  const finalHeaders = new Headers(headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !finalHeaders.has("Content-Type")
  ) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_BASE}${normalizedPath}`, {
    ...options,
    headers: finalHeaders,
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}