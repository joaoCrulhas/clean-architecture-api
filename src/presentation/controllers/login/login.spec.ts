import { AuthenticationModel } from '../../../domain/models/authentication.model';
import { AuthenticationAccount } from '../../../domain/use-cases/authentication-account.usecase';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { InvalidParamError } from '../../errors/invalid-param.error';
import { MissingParamError } from '../../errors/missing-param.error';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import {
  badRequest,
  serverError,
  unauthorized
} from '../../helpers/http-response-factory.helper';
import { EmailValidator, HttpRequest } from '../../protocols';
import { LoginRequest } from '../../protocols/http-request.protocol';
import { Controller } from '../controller.protocol';
import { LoginController } from './login';
jest.mock('../../../utils/email-validator-adapter', () => {
  return {
    EmailValidatorAdapter: jest.fn().mockImplementation(() => {
      return {
        isValid: jest.fn(() => true)
      };
    })
  };
});

interface SystemUnderTest {
  sut: Controller<HttpRequest<LoginRequest>>;
  emailValidator: EmailValidator;
  authenticator: AuthenticationAccount;
}
const makeAuthenticatorStub = () => {
  class AuthenticationAccountStub implements AuthenticationAccount {
    auth({ password, login }: LoginRequest): Promise<AuthenticationModel> {
      const response: AuthenticationModel = {
        expireAt: new Date(),
        login,
        token: 'tokenTest'
      };
      return Promise.resolve(response);
    }
  }
  return new AuthenticationAccountStub();
};
const makeSut = (): SystemUnderTest => {
  const emailValidator = new EmailValidatorAdapter();
  const authenticator = makeAuthenticatorStub();
  const sut = new LoginController(emailValidator, authenticator);
  return {
    authenticator,
    sut,
    emailValidator
  };
};

const makeHttpLoginRequestWithEmail = () => {
  return {
    body: {
      login: 'validEmail@gmail.com',
      password: 'password123'
    }
  };
};

const makeHttpLoginRequestUsername = () => {
  return {
    body: {
      login: 'validUsername',
      password: 'password123'
    }
  };
};

describe('LoginController', () => {
  it('Should return an error if password is not provided', async () => {
    const { sut } = makeSut();
    const loginRequest: HttpRequest<LoginRequest> = {
      body: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        email: 'test@gmail.com'
      }
    };
    const response = await sut.exec(loginRequest);
    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });
  it('Should return an error if email is not provided', async () => {
    const { sut } = makeSut();
    const loginRequest: HttpRequest<LoginRequest> = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      body: {
        password: 'test@gmail.com'
      }
    };
    const response = await sut.exec(loginRequest);
    expect(response).toEqual(badRequest(new MissingParamError('login')));
  });
  it('Should execute emailValidator if the login provided is a valid email', async () => {
    const { sut, emailValidator } = makeSut();
    const aSpy = jest.spyOn(emailValidator, 'isValid');
    await sut.exec(makeHttpLoginRequestWithEmail());
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith('validEmail@gmail.com');
  });
  it('Should not execute emailValidator if the login provided is a valid Username', async () => {
    const { sut, emailValidator } = makeSut();
    const aSpy = jest.spyOn(emailValidator, 'isValid');
    await sut.exec(makeHttpLoginRequestUsername());
    expect(aSpy).not.toBeCalled();
  });
  it;
  it('Should return a badRequest if the login provided is an invalid email', async () => {
    const { sut, emailValidator } = makeSut();
    jest.spyOn(emailValidator, 'isValid').mockReturnValue(false);
    const request: HttpRequest<LoginRequest> = {
      body: {
        password: 'Password',
        login: 'invalidGmail@any.com'
      }
    };
    const response = await sut.exec(request);
    expect(response).toEqual(badRequest(new InvalidParamError('login')));
  });
  it('should return a internal server error if Emailvalidator throws an error', async () => {
    const { sut, emailValidator } = makeSut();
    const myMockFn = jest.fn().mockImplementationOnce(() => {
      throw new Error('server_error');
    });
    jest.spyOn(emailValidator, 'isValid').mockImplementationOnce(myMockFn);
    const request: HttpRequest<LoginRequest> = {
      body: {
        password: 'Password',
        login: 'invalidGmail@any.com'
      }
    };
    const response = await sut.exec(request);
    expect(response).toEqual(serverError(new Error('server_error')));
  });
  it('should call the Authentication@auth with correct arguments', async () => {
    const { sut, authenticator } = makeSut();
    const aSpy = jest.spyOn(authenticator, 'auth');
    await sut.exec(makeHttpLoginRequestWithEmail());
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith({
      login: 'validEmail@gmail.com',
      password: 'password123'
    });
  });
  it('should return a internal server error if Authentication throws an error', async () => {
    const { sut, authenticator } = makeSut();
    const myMockFn = jest.fn().mockImplementationOnce(() => {
      throw new Error('server_error');
    });
    jest.spyOn(authenticator, 'auth').mockImplementationOnce(myMockFn);
    const request: HttpRequest<LoginRequest> = {
      body: {
        password: 'Password',
        login: 'invalidGmail@any.com'
      }
    };
    const response = await sut.exec(request);
    expect(response).toEqual(serverError(new Error('server_error')));
  });
  it('should return a 401(unauthorized) if the credentials are wrong', async () => {
    const { sut, authenticator } = makeSut();
    const mockImpelmentation = jest.fn().mockImplementationOnce(() => {
      return null;
    });
    jest
      .spyOn(authenticator, 'auth')
      .mockImplementationOnce(mockImpelmentation);
    const response = await sut.exec(makeHttpLoginRequestWithEmail());
    expect(response).toEqual(
      unauthorized(new UnauthorizedError('Credentials invalid'))
    );
  });
});
