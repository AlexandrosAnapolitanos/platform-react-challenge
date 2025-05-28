import { AppError } from "@/errorHandling/AppError";
import { ErrorCodes } from "@/errorHandling/constants";
import FailedToFetchFavoritesError from "@/errorHandling/FailedToFetchFavoritesError";

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, options);

  const resValue = await res.json();
  const { data } = resValue;

  if ("code" in data) {
    switch (data.code) {
      case ErrorCodes.FAILED_TO_FETCH_FAVORITES:
        throw new FailedToFetchFavoritesError(data.cause);
      default:
        throw new AppError({
          status: res.status,
          message: data?.message || "unexpected error",
          cause: data?.cause,
        });
    }
  }

  if (!res.ok) {
    throw new AppError({
      status: res.status,
      message: data?.message || "unexpected error",
      cause: data?.cause,
    });
  }

  return resValue;
}
