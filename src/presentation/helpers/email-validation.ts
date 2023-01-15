import { InvalidParamError } from '../errors/invalid-param.error';
import { EmailValidator, Validation } from '../protocols';
import { ValidationResponse } from '../protocols/validation.protocol';
class EmailValidation implements Validation {
  constructor(private readonly emailValidator: EmailValidator) {}
  validate(email: string): ValidationResponse {
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
