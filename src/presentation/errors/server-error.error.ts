class ServerError extends Error {
  constructor(stack: string) {
    super(`ServerError`);
    this.name = 'ServerError';
    this.stack = stack;
  }
}
export { ServerError };
