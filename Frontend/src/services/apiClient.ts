const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
  /\/$/,
  "",
);

type ApiRequestOptions = RequestInit;

export async function apiFetch<T>(
  path: string,
  { headers, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const finalHeaders = new Headers(headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !finalHeaders.has("Content-Type")
  ) {
    finalHeaders.set("Content-Type", "application/json");
  }

  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");

  if (token && !finalHeaders.has("Authorization")) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_BASE}${normalizedPath}`, {
    ...options,
    cache: "no-store",
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

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
