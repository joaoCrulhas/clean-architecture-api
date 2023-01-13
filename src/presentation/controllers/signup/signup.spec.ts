import { AccountModel } from '../../../domain/models/account.model';
import { AddAccount } from '../../../domain/use-cases';
import { AddAccountDTO } from '../../../domain/use-cases/add-account.usecase';
import { InvalidParamError } from '../../errors/invalid-param.error';
import { ServerError } from '../../errors/server-error.error';
import { HTTP_RESPONSE_CODE } from '../../helpers/http-code.helper';
import { EmailValidator, Validation } from '../../protocols';
import { ValidationResponse } from '../../protocols/validation.protocol';
import { SignupController } from './signup';

/*
    Requirement:
        1. The controller should receive a request from user and create an account for him.
        2. To create an account the user should provide (username, email, password and passwordConfirmation).
*/
interface SystemUnderTest {
  sut: SignupController;
  emailValidator: EmailValidator;
  addAccountStub: AddAccount;
  validation: Validation;
}
const makeValidation = () => {
  class ValidationStub implements Validation {
    validate(args: number): ValidationResponse {
      return {
        error: null
      };
    }
  }
  return new ValidationStub();
};

const makeSut = (): SystemUnderTest => {
  class AddAccountStub implements AddAccount {
    async exec(account: AddAccountDTO): Promise<AccountModel> {
      return Promise.resolve({
        email: account.email,
        password: account.password,
        username: account.username,
        id: 'hashId'
      });
    }
  }
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const addAccountStub = new AddAccountStub();
  const validation = makeValidation();
  const sut = new SignupController(
    emailValidatorStub,
    addAccountStub,
    validation
  );
  return {
    validation,
    sut,
    emailValidator: emailValidatorStub,
    addAccountStub
  };
};
describe('SignUp Controller', () => {
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

  it('Should return an error if the email provided is an invalid email', async function () {
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
    const { statusCode, data } = await sut.exec(request);
    expect(statusCode).toEqual(HTTP_RESPONSE_CODE.badRequest);
    expect(data).toEqual(new InvalidParamError('email'));
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

  it('Should return an error if EmailValidator@isValid throws an error', async function () {
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
    const { statusCode, data } = await sut.exec(request);
    expect(statusCode).toEqual(HTTP_RESPONSE_CODE.serverError);
    expect(data).toEqual(new ServerError('ServerErrror'));
  });

  it('should return an error if passwordConfirmation is different than password', async () => {
    const { sut, validation } = makeSut();
    const request = {
      body: {
        email: 'mail@gmail.com',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password_error'
      }
    };
    jest.spyOn(validation, 'validate').mockReturnValueOnce({
      error: new InvalidParamError('passwordConfirmation')
    });
    const { statusCode, data } = await sut.exec(request);
    expect(statusCode).toEqual(HTTP_RESPONSE_CODE.badRequest);
    expect(data).toEqual(new InvalidParamError('passwordConfirmation'));
  });

  it('Should execute the addAccount with correct arguments', function () {
    const { sut, addAccountStub } = makeSut();
    const aSpy = jest.spyOn(addAccountStub, 'exec');
    const request = {
      body: {
        email: 'mail@gmail.com',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    sut.exec(request);
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith({
      email: 'mail@gmail.com',
      username: 'any_username',
      password: 'any_password'
    });
  });

  it('Should throw an error if AddAccount throws', async function () {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'exec').mockImplementationOnce(() => {
      return Promise.reject(new Error('serverError'));
    });
    const request = {
      body: {
        email: 'mail@gmail.com',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const response = await sut.exec(request);
    expect(response.statusCode).toEqual(500);
    expect(response.data).toEqual(new ServerError('serverError'));
  });

  it('Should return 200 if addAccount executed successfully', async function () {
    const { sut } = makeSut();
    const request = {
      body: {
        email: 'mail@gmail.com',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    const response = await sut.exec(request);
    expect(response).toEqual({
      statusCode: 201,
      data: {
        email: 'mail@gmail.com',
        password: 'any_password',
        username: 'any_username',
        id: 'hashId'
      }
    });
  });
  it('should call validation with correct arguments', async () => {
    const { sut, validation } = makeSut();
    const aSpy = jest.spyOn(validation, 'validate');
    const request = {
      body: {
        email: 'mail@gmail.com',
        username: 'any_username',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    await sut.exec(request);
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith({
      email: 'mail@gmail.com',
      username: 'any_username',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    });
  });
});
