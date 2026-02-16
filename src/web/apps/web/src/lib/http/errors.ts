export class FetcherError extends Error {
  status: number;
  body?: unknown;

  constructor(status: number, body?: unknown) {
    super(`Request failed: ${status}`);
    this.name = 'FetcherError';
    this.status = status;
    this.body = body;
  }
}
