interface Controller<T> {
  exec(request: T): any;
}
export { Controller };
