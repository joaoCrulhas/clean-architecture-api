import { MissingParamError } from '../errors/missing-param.error';
import { SignupController } from './signup';

/*
    Requirement:
        1. The controller should receive a request from user and create an account for him.
        2. To create an account the user should provide (username, email, password and passwordConfirmation).
*/

interface SystemUnderTest {
  sut: SignupController;
}

const makeSut = (): SystemUnderTest => {
  return {
    sut: new SignupController()
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
});
