let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  // A refresh is already running.
  // Reuse the same Promise instead of starting another.
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  // 1. Try the original request.
  let response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  // 2. No authentication problem.
  if (response.status !== 401) {
    return response;
  }

  // 3. Access token may have expired.
  const refreshed = await refreshAccessToken();

  // 4. Refresh session is also invalid.
  if (!refreshed) {
    return response;
  }

  // 5. Retry original request once.
  response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  return response;
}
