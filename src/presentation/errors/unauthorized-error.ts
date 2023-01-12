class UnauthorizedError extends Error {
  constructor(msg: string) {
    super(`UnauthorizedError`);
    this.name = 'Unauthorized';
    this.message = msg;
  }
}
export { UnauthorizedError };
