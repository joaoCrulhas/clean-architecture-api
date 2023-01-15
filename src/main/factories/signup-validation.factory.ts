import { CompareFieldsValidation } from '../../presentation/helpers/compare-fields-validation';
import { EmailValidation } from '../../presentation/helpers/email-validation';
import { RequiredFieldsValidation } from '../../presentation/helpers/required-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validation-composite';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

const makeEmailValidation = () => {
  return new EmailValidation(new EmailValidatorAdapter());
};

const makeSignupComposite = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldsValidation('email'),
    new RequiredFieldsValidation('username'),
    new RequiredFieldsValidation('passwordConfirmation'),
    new RequiredFieldsValidation('password'),
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    makeEmailValidation()
  ]);
};

export { makeSignupComposite, makeEmailValidation };
