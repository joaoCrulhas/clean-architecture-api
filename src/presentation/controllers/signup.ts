import { InvalidParamError } from '../errors/invalid-param.error';
import { MissingParamError } from '../errors/missing-param.error';
import { ServerError } from '../errors/server-error.error';
import { HTTP_RESPONSE_CODE } from '../helpers/http-code.helper';
import {
  badRequest,
  successCreatedResource
} from '../helpers/http-response-factory.helper';
import { EmailValidator, HttpRequest, HttpResponse } from '../protocols';
import { Controller } from './controller.protocol';

class SignupController implements Controller {
  private requiredFields: string[] = [];
  constructor(private readonly emailValidator: EmailValidator) {
    this.requiredFields = [
      'email',
      'password',
      'passwordConfirmation',
      'username'
    ];
  }

  private validateRequest(body: any): {
    isValid: boolean;
    missingParam: string;
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
    try {
      const requiredFields = this.validateRequest(body);
      if (!requiredFields.isValid) {
        return badRequest(new MissingParamError(requiredFields.missingParam));
      }
      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'));
      }
      return successCreatedResource('account');
    } catch (error: any) {
      return {
        statusCode: HTTP_RESPONSE_CODE.serverError,
        body: new ServerError()
      };
    }
  }
}

export { SignupController };
