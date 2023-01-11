import { MissingParamError } from '../../errors/missing-param.error';
import { badRequest } from '../../helpers/http-response-factory.helper';
import { HttpRequest, HttpResponse } from '../../protocols';
import { LoginRequest } from '../../protocols/http-request.protocol';
import { Controller } from '../controller.protocol';
import { LoginController } from './login';

interface SystemUnderTest {
  sut: Controller<HttpRequest<LoginRequest>>;
}

const makeSut = (): SystemUnderTest => {
  const sut = new LoginController();
  return {
    sut
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
});
