const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

async function unwrap(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError("INVALID_RESPONSE", "Phản hồi từ server không hợp lệ.");
  }
  if (!response.ok || body.error) {
    const error = body.error ?? {};
    throw new ApiError(error.code ?? "UNKNOWN_ERROR", error.message ?? "Đã có lỗi xảy ra.", error.details);
  }
  return body.data;
}

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  return unwrap(response);
}

export async function apiPost(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return unwrap(response);
}

export async function apiPatch(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  return unwrap(response);
}
