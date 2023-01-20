import { InvalidParamError } from '../errors/invalid-param.error';
import { Validation } from '../protocols';
import { CompareFieldsValidation } from './compare-fields-validation';

interface SystemUnderTest {
  sut: Validation;
}

const makeSut = (): SystemUnderTest => {
  const sut = new CompareFieldsValidation('password', 'passwordConfirmation');
  return {
    sut
  };
};
describe('CompareFields validation', () => {
  it('Should return null if the fields to compare are equal', () => {
    const { sut } = makeSut();
    const response = sut.validate({
      password: 'test1',
      passwordConfirmation: 'test1'
    });
    expect(response.error).toBeNull();
  });
  it('should return an error if the arguments are different', () => {
    const { sut } = makeSut();
    const response = sut.validate({
      password: 'test1',
      passwordConfirmation: 'tes32t1'
    });
    expect(response.error).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });
});
