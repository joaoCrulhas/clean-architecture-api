import { AuthenticationAccount } from '../../../domain/use-cases/authentication-account.usecase';
import { emailCandidate } from '../../../utils/email-candidate.utils';
import { InvalidParamError } from '../../errors/invalid-param.error';
import { MissingParamError } from '../../errors/missing-param.error';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import {
  badRequest,
  serverError,
  successRequest,
  unauthorized
} from '../../helpers/http-response-factory.helper';
import { EmailValidator, HttpRequest, HttpResponse } from '../../protocols';
import { LoginRequest } from '../../protocols/http-request.protocol';
import { Controller } from '../controller.protocol';

class LoginController implements Controller<HttpRequest<LoginRequest>> {
  private readonly requiredFields: string[] = ['login', 'password'];
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authenticator: AuthenticationAccount
  ) {}

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
    try {
      if (!request.body) {
        return badRequest(new MissingParamError('body'));
      }
      const { isValid, missingParam } = this.validateRequiredFields(request);
      if (!isValid) {
        return badRequest(new MissingParamError(missingParam));
      }
      const { login, password } = request.body;
      if (emailCandidate(login)) {
        // login with email
        const isValidEmail = this.emailValidator.isValid(login);
        if (!isValidEmail) {
          return badRequest(new InvalidParamError('login'));
        }
      }
      const auth = await this.authenticator.auth({
        login,
        password
      });
      if (!auth) {
        return unauthorized(new UnauthorizedError('Credentials invalid'));
      }
      return successRequest({
        expireAt: new Date(),
        token: 'any_token',
        login
      });
    } catch (error: Error | any) {
      return serverError(error);
    }
  }
}

export { LoginController };
