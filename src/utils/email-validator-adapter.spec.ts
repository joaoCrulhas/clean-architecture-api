import { EmailValidator } from '../presentation/protocols';
import { EmailValidatorAdapter } from './email-validator-adapter';
import * as validator from 'email-validator';

jest.mock('email-validator', () => ({
  validate: jest.fn()
}));

interface SystemUnderTest {
  sut: EmailValidator;
}

const makeSut = (): SystemUnderTest => {
  const sut = new EmailValidatorAdapter();
  return {
    sut: sut
  };
};

describe('Email validator adapter', () => {
  it('Should return false if validator returns false', function () {
    const { sut } = makeSut();
    jest.spyOn(validator, 'validate').mockReturnValue(false);
    const response = sut.isValid('#123.com');
    expect(response).toEqual(false);
  });

  it('Should return true if validator returns false', function () {
    const { sut } = makeSut();
    jest.spyOn(validator, 'validate').mockReturnValue(true);
    const response = sut.isValid('emailValid@gmail.com');
    expect(response).toEqual(true);
  });

  it('Should call the email-validator@validate with correct argument', function () {
    const { sut } = makeSut();
    const aSpy = jest.spyOn(validator, 'validate');
    sut.isValid('emailValid@gmail.com');
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith('emailValid@gmail.com');
  });
});
