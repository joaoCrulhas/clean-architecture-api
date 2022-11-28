import { MissingParamError } from '../errors/missing-param.error';
import {
  badRequest,
  successCreatedResource
} from '../helpers/http-response-factory.helper';
import { HttpRequest, HttpResponse } from '../protocols';
import { Controller } from './controller.protocol';

class SignupController implements Controller {
  private requiredFields: string[] = [];
  constructor() {
    this.requiredFields = [
      'email',
      'password',
      'passwordConfirmation',
      'username'
    ];
  }

  private validateRequest(body: any): {
    isValid: boolean;
    missingParam?: string;
  } {
    let isValid = true;
    let missingParam = '';
    this.requiredFields.forEach((requiredFiled) => {
      const hasProperty = Object.prototype.hasOwnProperty.call(
        body,
        requiredFiled
      );
      if (!hasProperty) {
        isValid = false;
        missingParam = requiredFiled;
      }
    });
    return {
      isValid,
      missingParam
    };
  }

  exec({ body }: HttpRequest): HttpResponse {
    if (!body.email) {
      return badRequest(new MissingParamError('email'));
    }
    if (!body.username) {
      return badRequest(new MissingParamError('username'));
    }
    if (!body.password) {
      return badRequest(new MissingParamError('password'));
    }
    if (!body.passwordConfirmation) {
      return badRequest(new MissingParamError('passwordConfirmation'));
    }
    return successCreatedResource('account');
  }
}

export { SignupController };
