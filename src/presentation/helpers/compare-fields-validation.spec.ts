import { InvalidParamError } from '../errors/invalid-param.error';
import { Validation } from '../protocols';
import { CompareFieldsValidation } from './compare-fields-validation';

interface SystemUnderTest {
  sut: Validation;
}

const makeSut = (): SystemUnderTest => {
  const sut = new CompareFieldsValidation('password');
  return {
    sut
  };
};
describe('CompareFields validation', () => {
  it('Should return null if the fields to compare are equal', () => {
    const { sut } = makeSut();
    const validFields = ['passwordValue', 'passwordValue'];
    const response = sut.validate(validFields);
    expect(response.error).toBeNull();
  });
  it('should return an error if the arguments are different', () => {
    const { sut } = makeSut();
    const validFields = ['wrong!', 'passwordValue'];
    const response = sut.validate(validFields);
    expect(response.error).toEqual(new InvalidParamError('password'));
  });
});
