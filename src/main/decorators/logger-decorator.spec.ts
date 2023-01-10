import { LoggerErrorRepository } from '../../data/protocols/log-error-repository';
import { Controller } from '../../presentation/controllers/controller.protocol';
import { ServerError } from '../../presentation/errors/server-error.error';
import { HTTP_RESPONSE_CODE } from '../../presentation/helpers/http-code.helper';
import { HttpRequest, HttpResponse } from '../../presentation/protocols';
import { BodySignupRequest } from '../../presentation/protocols/http-request.protocol';
import { LoggerDecorator } from './logger-decorator';

interface SystemUnderTest {
  sut: LoggerDecorator;
  controller: Controller<any>;
  logErrorRepository: LoggerErrorRepository;
}

const makeControllerStub = (): Controller<any> => {
  class ControllerStub implements Controller<HttpRequest<any>> {
    exec(request: HttpRequest<any>): Promise<HttpResponse> {
      const response: HttpResponse = {
        statusCode: HTTP_RESPONSE_CODE.created
      };
      return Promise.resolve(response);
    }
  }
  return new ControllerStub();
};
const makeLogErrorRepository = (): LoggerErrorRepository => {
  class LogErrorRepositoryStub implements LoggerErrorRepository {
    log(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new LogErrorRepositoryStub();
};

const makeSut = (): SystemUnderTest => {
  const controllerSutb = makeControllerStub();
  const logErrorRepository = makeLogErrorRepository();
  const sut = new LoggerDecorator(controllerSutb, logErrorRepository);
  return { sut, controller: controllerSutb, logErrorRepository };
};

describe('Logger Decorator', () => {
  it('Should call the Controller@exec with correct arguments', async () => {
    const { sut, controller } = makeSut();
    const aSpy = jest.spyOn(controller, 'exec');
    await sut.exec({
      body: {
        test: true
      }
    });
    expect(aSpy).toHaveBeenCalled();
    expect(aSpy).toBeCalledWith({
      body: {
        test: true
      }
    });
  });

  it('Should not execute console.error if the request return success', async () => {
    const aSpy = jest.spyOn(console, 'error');
    const { sut } = makeSut();
    await sut.exec({
      body: {
        test: true
      }
    });
    expect(aSpy).not.toHaveBeenCalled();
  });

  it('Should execute log error if controller return an excpetion', async () => {
    const { sut, controller } = makeSut();
    const aSpy = jest.spyOn(console, 'error');
    const response: HttpResponse = {
      statusCode: 500,
      data: new ServerError('server error mock')
    };
    jest.spyOn(controller, 'exec').mockResolvedValueOnce(response);
    await sut.exec({
      body: {
        test: true
      }
    });
    expect(aSpy).toHaveBeenCalled();
  });

  it('Should decorator return the same value that is returned into controller', async () => {
    const { sut, controller } = makeSut();
    const aSpy = jest.spyOn(controller, 'exec');
    const response = await sut.exec({
      body: {
        test: true
      }
    });
    const getApiResult = (): Promise<HttpResponse> =>
      aSpy.mock.results[0].value;
    const controllerResponse = await getApiResult();
    expect(response.statusCode).toEqual(controllerResponse.statusCode);
  });

  it('Should call LogRepositoryRepository if controller return a server error', async () => {
    const { sut, controller, logErrorRepository } = makeSut();
    const httpResponse: HttpResponse = {
      statusCode: HTTP_RESPONSE_CODE.serverError,
      data: new ServerError('serverError')
    };
    const httpRequest: HttpRequest<BodySignupRequest> = {
      body: {
        email: 'valid@gmail.com',
        password: '123',
        passwordConfirmation: '123',
        username: 'validUsernae'
      }
    };
    jest.spyOn(controller, 'exec').mockResolvedValueOnce(httpResponse);
    const aSpy = jest.spyOn(logErrorRepository, 'log');
    await sut.exec(httpRequest);
    expect(aSpy).toBeCalled();
  });
});
