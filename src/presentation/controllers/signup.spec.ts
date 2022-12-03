import { InvalidParamError } from '../errors/invalid-param.error';
import { MissingParamError } from '../errors/missing-param.error';
import { ServerError } from '../errors/server-error.error';
import { HTTP_RESPONSE_CODE } from '../helpers/http-code.helper';
import { EmailValidator } from '../protocols';
import { SignupController } from './signup';

/*
    Requirement:
        1. The controller should receive a request from user and create an account for him.
        2. To create an account the user should provide (username, email, password and passwordConfirmation).
*/

interface SystemUnderTest {
  sut: SignupController;
  emailValidator: EmailValidator;
}

const makeSut = (): SystemUnderTest => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  return {
    sut: new SignupController(emailValidatorStub),
    emailValidator: emailValidatorStub
  };
};
describe('SignUp Controller', () => {
  it('Should return a bad request if username is not provided', function () {
    const request = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const { sut } = makeSut();
    const { statusCode } = sut.exec(request);
    expect(statusCode).toEqual(400);
  });
  it('Should return the missing field in the response body', function () {
    const request = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const { sut } = makeSut();
    const { statusCode, body } = sut.exec(request);
    expect(statusCode).toEqual(400);
    expect(body).toEqual(new MissingParamError('username'));
  });

  it('Should return an error message if email is not provided', function () {
    const request = {
      body: {
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const { sut } = makeSut();
    const { statusCode, body } = sut.exec(request);
    expect(statusCode).toEqual(400);
    expect(body).toEqual(new MissingParamError('email'));
  });

  it('Should return an error message if password is not provided', function () {
    const request = {
      body: {
        email: 'anyEmail@gmail.com',
        username: 'any_username',
        passwordConfirmation: 'any_password'
      }
    };
    const { sut } = makeSut();
    const { statusCode, body } = sut.exec(request);
    expect(statusCode).toEqual(400);
    expect(body).toEqual(new MissingParamError('password'));
  });

  it('Should return an error message if passwordConfirmation is not provided', function () {
    const request = {
      body: {
        email: 'anyEmail@gmail.com',
        username: 'any_username',
        password: 'any_password'
      }
    };
    const { sut } = makeSut();
    const { statusCode, body } = sut.exec(request);
    expect(statusCode).toEqual(400);
    expect(body).toEqual(new MissingParamError('passwordConfirmation'));
  });

  it('Should execute at least one time the emailValidator@isValid if all fields is provided', function () {
    const { sut, emailValidator } = makeSut();
    const request = {
      body: {
        email: 'anyEmail@gmail.com',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const emailValidatorSpy = jest.spyOn(emailValidator, 'isValid');
    sut.exec(request);
    expect(emailValidatorSpy).toBeCalled();
  });

  it('Should return an error if the email provided is an invalid email', function () {
    const { sut, emailValidator } = makeSut();
    const request = {
      body: {
        email: '##a321l',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    jest.spyOn(emailValidator, 'isValid').mockReturnValue(false);
    const { statusCode, body } = sut.exec(request);
    expect(statusCode).toEqual(HTTP_RESPONSE_CODE.badRequest);
    expect(body).toEqual(new InvalidParamError('email'));
  });

  it('Should call EmailValidator@isValid with correct argument', function () {
    const { sut, emailValidator } = makeSut();
    const spy = jest.spyOn(emailValidator, 'isValid');

    const request = {
      body: {
        email: '##a321l',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    sut.exec(request);
    expect(spy).toBeCalled();
    expect(spy).toBeCalledWith('##a321l');
  });

  it('Should return an error if EmailValidator@isValid throws an error', function () {
    const { sut, emailValidator } = makeSut();
    jest.spyOn(emailValidator, 'isValid').mockImplementation(() => {
      throw new Error('ServerErrror');
    });
    const request = {
      body: {
        email: '##a321l',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const { statusCode, body } = sut.exec(request);
    expect(statusCode).toEqual(HTTP_RESPONSE_CODE.serverError);
    expect(body).toEqual(new ServerError());
  });
});
