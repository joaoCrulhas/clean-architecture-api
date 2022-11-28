import { MissingParamError } from '../errors/missing-param.error';
import { HttpRequest, HttpResponse } from '../protocols';
import { Controller } from './controller.protocol';

class SignupController implements Controller {
  exec({ body }: HttpRequest): HttpResponse {
    if (!body.email) {
      return {
        body: new MissingParamError('email'),
        statusCode: 400
      };
    }
    if (!body.username) {
      return {
        body: new MissingParamError('username'),
        statusCode: 400
      };
    }
    return {
      statusCode: 200,
      body: {
        message: 'Account created'
      }
    };
  }
}

export { SignupController };
