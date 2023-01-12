import { AddAccount } from '../../../domain/use-cases';
import { InvalidParamError } from '../../errors/invalid-param.error';
import { MissingParamError } from '../../errors/missing-param.error';
import {
  badRequest,
  serverError,
  successCreatedResource
} from '../../helpers/http-response-factory.helper';
import { EmailValidator, HttpResponse, Validation } from '../../protocols';
import {
  HttpRequest,
  BodySignupRequest
} from '../../protocols/http-request.protocol';
import { Controller } from '../controller.protocol';

class SignupController implements Controller<HttpRequest<BodySignupRequest>> {
  private requiredFields: string[] = [];
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {
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

  async exec({ body }: HttpRequest<BodySignupRequest>): Promise<HttpResponse> {
    try {
      this.validation.validate(body);
      const requiredFields = this.validateRequest(body);
      if (!requiredFields.isValid || !body) {
        return badRequest(new MissingParamError(requiredFields.missingParam));
      }
      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'));
      }
      const { password, passwordConfirmation, email, username } = body;
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }
      const accountCreated = await this.addAccount.exec({
        email,
        password,
        username
      });
      return successCreatedResource(accountCreated);
    } catch (error: Error | any) {
      return serverError(error);
    }
  }
}

export { SignupController };
