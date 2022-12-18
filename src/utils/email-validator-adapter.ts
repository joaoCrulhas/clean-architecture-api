import { EmailValidator } from '../presentation/protocols';
import * as validator from 'email-validator';

class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return validator.validate(email);
  }
}
export { EmailValidatorAdapter };
