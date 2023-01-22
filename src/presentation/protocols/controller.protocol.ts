import { HttpResponse } from '.';

interface Controller<T> {
  exec(request: T): Promise<HttpResponse>;
}
export { Controller };
