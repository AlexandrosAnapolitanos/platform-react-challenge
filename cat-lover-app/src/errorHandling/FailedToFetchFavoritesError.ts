import { AppError } from "./AppError";
import { ErrorCodes, ErrorMessages, HttpStatusCodes } from "./constants";

export class FailedToFetchFavoritesError extends AppError {
  static readonly CODE = ErrorCodes.FAILED_TO_FETCH_FAVORITES;
  static readonly DEFAULT_MESSAGE =
    ErrorMessages[ErrorCodes.FAILED_TO_FETCH_FAVORITES];
  static readonly STATUS =
    HttpStatusCodes[ErrorCodes.FAILED_TO_FETCH_FAVORITES];

  constructor(
    cause: string,
    message = FailedToFetchFavoritesError.DEFAULT_MESSAGE,
    status = 409
  ) {
    super({
      message,
      status,
      code: FailedToFetchFavoritesError.CODE,
      cause,
    });
  }
}

export default FailedToFetchFavoritesError;
