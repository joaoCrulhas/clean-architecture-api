class ServerError extends Error {
  constructor() {
    super(`ServerError`);
    this.name = 'ServerError';
  }
}
export { ServerError };
