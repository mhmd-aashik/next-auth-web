export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);

    this.name = "ApiError";
  }
}

interface ErrorResponse {
  message?: string | string[];
}

export async function createApiError(response: Response): Promise<ApiError> {
  let message = "Something went wrong";

  try {
    const data = (await response.json()) as ErrorResponse;

    if (Array.isArray(data.message)) {
      message = data.message.join(", ");
    } else if (data.message) {
      message = data.message;
    }
  } catch {
    // Response may not contain JSON.
  }

  return new ApiError(message, response.status);
}
