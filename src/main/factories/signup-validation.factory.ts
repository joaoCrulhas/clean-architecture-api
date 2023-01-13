import { CompareFieldsValidation } from '../../presentation/helpers/compare-fields-validation';
import { RequiredFieldsValidation } from '../../presentation/helpers/required-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validation-composite';

const makeSignupComposite = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldsValidation('email'),
    new RequiredFieldsValidation('username'),
    new RequiredFieldsValidation('passwordConfirmation'),
    new RequiredFieldsValidation('password'),
    new CompareFieldsValidation('passwordConfirmation')
  ]);
};

export { makeSignupComposite };
