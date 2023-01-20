import { InvalidParamError } from '../errors/invalid-param.error';
import { EmailValidator, Validation } from '../protocols';
import { BodySignupRequest } from '../protocols/http-request.protocol';
import { ValidationResponse } from '../protocols/validation.protocol';
class EmailValidation implements Validation {
  constructor(private readonly emailValidator: EmailValidator) {}
  validate(args: any): ValidationResponse {
    const { email } = args as BodySignupRequest;
    if (!this.emailValidator.isValid(email)) {
      return {
        error: new InvalidParamError('email')
      };
    }
    return {
      error: null
    };
  }
}
export { EmailValidation };
