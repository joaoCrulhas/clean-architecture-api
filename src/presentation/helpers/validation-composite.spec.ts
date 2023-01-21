import { Validation } from '../protocols';
import { ValidationResponse } from '../protocols/validation.protocol';
import { ValidationComposite } from './validation-composite';

const makeValidationsStubs = (): Array<Validation> => {
  class ValidationStub implements Validation {
    validate(args: any): ValidationResponse {
      console.log(args);
      return {
        error: null
      };
    }
  }
  const validationsStub = new ValidationStub();
  return [validationsStub];
};

const makeSut = (): {
  sut: ValidationComposite;
  validators: Array<Validation>;
} => {
  const validators = makeValidationsStubs();
  const sut = new ValidationComposite(validators);
  return { sut, validators };
};

describe('Validation Composite', () => {
  it('should return 1 validation composite after call ValidationComposite@GetValidations', () => {
    const { sut } = makeSut();
    const validators = sut.getValidatos();
    expect(validators.length).toBe(1);
  });
  it('should return null if validators not throw an error', () => {
    const { sut } = makeSut();
    const { error } = sut.validate(['fakeArgument']);
    expect(error).toBeNull();
  });

  it('should return error if validation throw', () => {
    const { sut, validators } = makeSut();
    jest.spyOn(validators[0], 'validate').mockReturnValueOnce({
      error: new Error('fakeError')
    });
    const { error } = sut.validate(['fakeArgument']);
    expect(error).toEqual(new Error('fakeError'));
  });
});
