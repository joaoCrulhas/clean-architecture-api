import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';
import { InvalidParamError } from '../../errors/invalid-param.error';
import { MissingParamError } from '../../errors/missing-param.error';
import { badRequest } from '../../helpers/http-response-factory.helper';
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
}

const makeSut = (): SystemUnderTest => {
  const emailValidator = new EmailValidatorAdapter();
  const sut = new LoginController(emailValidator);
  return {
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
  //1) To do a Login the user should provide the email(or username) and the password
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
});
