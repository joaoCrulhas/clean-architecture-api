import { EmailValidator } from '../presentation/protocols';
import { EmailValidatorAdapter } from './email-validator-adapter';

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
    const response = sut.isValid('#123.com');
    expect(response).toEqual(false);
  });
});
