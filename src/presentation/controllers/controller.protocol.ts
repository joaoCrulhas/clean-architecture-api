import { HttpResponse } from '../protocols';

interface Controller<T> {
  exec(request: T): Promise<HttpResponse>;
}
export { Controller };
