const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function parseResponse(response) {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const details = payload?.errors?.map((error) => error.message).join(", ");
    throw new Error(details || payload?.message || payload?.error || "Request failed");
  }

  return payload;
}

export async function apiFetch(path, options = {}) {
  const { headers, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  return parseResponse(response);
}

export async function authFetch(path, getToken, options = {}) {
  const token = await getToken();

  return apiFetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}
