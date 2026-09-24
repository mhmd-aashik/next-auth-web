export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  // First attempt
  let response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  // Token is still valid
  if (response.status !== 401) {
    return response;
  }

  // Access token may have expired.
  const refreshResponse = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  });

  // Refresh token/session is also invalid.
  if (!refreshResponse.ok) {
    return response;
  }

  // Access token has now been replaced.
  // Retry original request.
  response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  return response;
}
