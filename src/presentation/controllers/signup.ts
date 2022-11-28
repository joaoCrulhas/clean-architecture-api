import { HttpRequest } from '../protocols';
import { Controller } from './controller.protocol';

class SignupController implements Controller {
  exec({ body }: HttpRequest): any {
    if (!body.email) {
      return {
        body: new Error('Missing the param email'),
        statusCode: 400
      };
    }
    if (!body.username) {
      return {
        body: new Error('Missing the param username'),
        statusCode: 400
      };
    }
  }
}

export { SignupController };
