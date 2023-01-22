import { AuthenticationModel } from '../../../domain/models/authentication.model';
import { AuthenticationAccount } from '../../../domain/use-cases/authentication-account.usecase';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { InvalidParamError } from '../../errors/invalid-param.error';
import { MissingParamError } from '../../errors/missing-param.error';
import { UnauthorizedError } from '../../errors/unauthorized-error';
import { HTTP_RESPONSE_CODE } from '../../helpers/http-code.helper';
import {
  badRequest,
  serverError,
  unauthorized
} from '../../helpers/http-response-factory.helper';
import { EmailValidator, HttpRequest, Validation } from '../../protocols';
import { LoginRequest } from '../../protocols/http-request.protocol';
import { ValidationResponse } from '../../protocols/validation.protocol';
import { Controller } from '../../protocols/controller.protocol';
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
  validation: Validation;
}
const makeAuthenticatorStub = () => {
  class AuthenticationAccountStub implements AuthenticationAccount {
    auth({ login }: LoginRequest): Promise<AuthenticationModel> {
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
const makeValidators = (): Validation => {
  class ValidatorsStub implements Validation {
    validate(args: any): ValidationResponse {
      console.log(args);
      return {
        error: null
      };
    }
  }
  return new ValidatorsStub();
};

const makeSut = (): SystemUnderTest => {
  const emailValidator = new EmailValidatorAdapter();
  const authenticator = makeAuthenticatorStub();
  const validation = makeValidators();
  const sut = new LoginController(emailValidator, authenticator, validation);
  return {
    authenticator,
    sut,
    emailValidator,
    validation
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
  it('should return an error if validations find an error', async () => {
    const { sut, validation } = makeSut();
    const aSpy = jest.spyOn(validation, 'validate').mockReturnValueOnce({
      error: new Error('test')
    });
    const { statusCode, data } = await sut.exec(
      makeHttpLoginRequestWithEmail()
    );
    expect(aSpy).toHaveBeenCalled();
    expect(data).toEqual(new Error('test'));
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
  it('should return a 200 if authentiacation works successfully', async () => {
    const { sut } = makeSut();
    const response = await sut.exec(makeHttpLoginRequestWithEmail());
    expect(response.data.token).toEqual('any_token');
    expect(response.data.login).toEqual('validEmail@gmail.com');
    expect(response.statusCode).toEqual(200);
  });

  it('should return a missing param error if body is not provided', async () => {
    const { sut } = makeSut();
    const response = await sut.exec({
      body: undefined
    });
    expect(response).toEqual(badRequest(new MissingParamError('body')));
  });
});
