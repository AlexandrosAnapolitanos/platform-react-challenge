export class AppError extends Error {
  status: number;
  code?: string;
  cause?: unknown;

  constructor({
    message,
    status,
    code,
    cause,
  }: {
    message: string;
    status: number;
    code?: string;
    cause?: unknown;
  }) {
    super(message);
    this.name = new.target.name;
    this.status = status;
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype); // fixes instanceof
  }
}
