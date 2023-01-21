import { RequiredFieldsValidation } from '../../../presentation/helpers/required-fields-validation';
import { ValidationComposite } from '../../../presentation/helpers/validation-composite';
import { makeEmailValidation } from '../signup/signup-validation.factory';

const makeLoginComposite = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldsValidation('login'),
    new RequiredFieldsValidation('password'),
    makeEmailValidation()
  ]);
};

export { makeLoginComposite };
