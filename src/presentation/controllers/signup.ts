import { MissingParamError } from '../errors/missing-param.error';
import {
  badRequest,
  successCreatedResource
} from '../helpers/http-response-factory.helper';
import { HttpRequest, HttpResponse } from '../protocols';
import { Controller } from './controller.protocol';

class SignupController implements Controller {
  exec({ body }: HttpRequest): HttpResponse {
    if (!body.email) {
      return badRequest(new MissingParamError('email'));
    }
    if (!body.username) {
      return badRequest(new MissingParamError('username'));
    }
    return successCreatedResource('account');
  }
}

export { SignupController };
