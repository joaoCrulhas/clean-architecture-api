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
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation
  ) {}

  async exec({ body }: HttpRequest<BodySignupRequest>): Promise<HttpResponse> {
    try {
      if (!body) {
        return badRequest(new MissingParamError('body'));
      }
      const { error } = this.validation.validate(body);
      if (error) {
        return badRequest(error);
      }
      if (!this.emailValidator.isValid(body.email)) {
        return badRequest(new InvalidParamError('email'));
      }
      const { password, email, username } = body;
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
