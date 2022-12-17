import { EmailValidator } from '../presentation/protocols';

class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return false;
  }
}
export { EmailValidatorAdapter };
