const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
console.log("API Base URL, process.env.NEXT_PUBLIC_API_URL:", BASE_URL);

export type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T = undefined>(
  path: string,
  { body, token, headers, ...init }: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.message ?? "Unknown error");
  }

  return json;
}
