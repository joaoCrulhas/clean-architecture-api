import { InvalidParamError } from '../../errors/invalid-param.error';
import { MissingParamError } from '../../errors/missing-param.error';
import {
  badRequest,
  successCreatedResource
} from '../../helpers/http-response-factory.helper';
import { EmailValidator, HttpRequest, HttpResponse } from '../../protocols';
import { LoginRequest } from '../../protocols/http-request.protocol';
import { Controller } from '../controller.protocol';

class LoginController implements Controller<HttpRequest<LoginRequest>> {
  private readonly requiredFields: string[] = ['login', 'password'];
  constructor(private readonly emailValidator: EmailValidator) {}

  private validateRequiredFields({ body }: HttpRequest<LoginRequest>): {
    isValid: boolean;
    missingParam: string;
  } {
    let isValid = true;
    let missingParam = '';

    this.requiredFields.forEach((requiredField) => {
      if (!Object.prototype.hasOwnProperty.call(body, requiredField)) {
        isValid = false;
        missingParam = requiredField;
      }
    });
    return {
      isValid,
      missingParam
    };
  }
  async exec(request: HttpRequest<LoginRequest>): Promise<HttpResponse> {
    const { isValid, missingParam } = this.validateRequiredFields(request);
    if (!isValid) {
      return badRequest(new MissingParamError(missingParam));
    }
    if (!request.body) {
      return badRequest(new MissingParamError('body'));
    }
    const { login } = request.body;
    const isValidEmail = this.emailValidator.isValid(login);
    if (!isValidEmail) {
      return badRequest(new InvalidParamError('login'));
    }
    return successCreatedResource(true);
  }
}

export { LoginController };
