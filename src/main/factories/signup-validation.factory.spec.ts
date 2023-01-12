import { RequiredFieldsValidation } from '../../presentation/helpers/required-fields-validation';
import { ValidationComposite } from '../../presentation/helpers/validation-composite';
import { makeSignupComposite } from './signup-validation.factory';
jest.mock('../../presentation/helpers/validation-composite');
describe('SignupValidator', () => {
  it('should call ValidationComposite with all instances', async () => {
    makeSignupComposite();
    expect(ValidationComposite).toBeCalledWith([
      new RequiredFieldsValidation('email'),
      new RequiredFieldsValidation('username'),
      new RequiredFieldsValidation('passwordConfirmation'),
      new RequiredFieldsValidation('password')
    ]);
  });
});
