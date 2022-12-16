interface Controller<T> {
  exec(request: T): Promise<any>;
}
export { Controller };
