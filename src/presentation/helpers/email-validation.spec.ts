import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { InvalidParamError } from '../errors/invalid-param.error';
import { EmailValidation } from './email-validation';

jest.mock('../../utils/email-validator-adapter', () => {
  return {
    EmailValidatorAdapter: jest.fn().mockImplementation(() => {
      return {
        isValid: function () {
          return true;
        }
      };
    })
  };
});

interface SystemUnderTest {
  sut: EmailValidation;
  emailValidatorAdapter: EmailValidatorAdapter;
}

function makeSut(): SystemUnderTest {
  const mockedValidatorAdapts = new EmailValidatorAdapter();
  const sut = new EmailValidation(mockedValidatorAdapts);
  return {
    sut,
    emailValidatorAdapter: mockedValidatorAdapts
  };
}
describe('EmailValidation', () => {
  it('Should return null if emailValidator returns null', async () => {
    const validEmail = 'emailValid@gmail.com';
    const { sut } = makeSut();
    const response = sut.validate(validEmail);
    expect(response.error).toBeNull();
  });

  it('Should return error if email is not valid', async () => {
    const invalidEmail = 'emailValid!';
    const { sut, emailValidatorAdapter } = makeSut();
    jest.spyOn(emailValidatorAdapter, 'isValid').mockReturnValueOnce(false);
    const response = sut.validate(invalidEmail);
    expect(response.error).toEqual(new InvalidParamError('email'));
  });

  it('Should execute at least one time the emailValidator@isValid if all fields is provided', function () {
    const { sut, emailValidatorAdapter } = makeSut();
    const emailValidatorSpy = jest.spyOn(emailValidatorAdapter, 'isValid');
    sut.validate('anyEmail@gmail.com');
    expect(emailValidatorSpy).toBeCalled();
  });

  it('Should return an error if the email provided is an invalid email', async function () {
    const { sut, emailValidatorAdapter } = makeSut();
    jest.spyOn(emailValidatorAdapter, 'isValid').mockReturnValue(false);
    const response = await sut.validate('##a321l');
    expect(response.error).toEqual(new InvalidParamError('email'));
  });

  it('Should call EmailValidator@isValid with correct argument', function () {
    const { sut, emailValidatorAdapter } = makeSut();
    const spy = jest.spyOn(emailValidatorAdapter, 'isValid');
    sut.validate('##a321l');
    expect(spy).toBeCalled();
    expect(spy).toBeCalledWith('##a321l');
  });
});
