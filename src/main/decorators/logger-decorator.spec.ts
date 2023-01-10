import { Controller } from '../../presentation/controllers/controller.protocol';
import { ServerError } from '../../presentation/errors/server-error.error';
import { HTTP_RESPONSE_CODE } from '../../presentation/helpers/http-code.helper';
import { HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LoggerDecorator } from './logger-decorator';

interface SystemUnderTest {
  sut: LoggerDecorator;
  controller: Controller<any>;
}

const makeControllerStub = (): Controller<any> => {
  class ControllerStub implements Controller<HttpRequest<any>> {
    exec(request: HttpRequest<any>): Promise<HttpResponse> {
      console.log(request);
      const response: HttpResponse = {
        statusCode: HTTP_RESPONSE_CODE.created
      };
      return Promise.resolve(response);
    }
  }
  return new ControllerStub();
};

const makeSut = (): SystemUnderTest => {
  const controllerSutb = makeControllerStub();
  const sut = new LoggerDecorator(controllerSutb);
  return { sut, controller: controllerSutb };
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
      data: new ServerError()
    };
    jest.spyOn(controller, 'exec').mockResolvedValueOnce(response);
    await sut.exec({
      body: {
        test: true
      }
    });
    expect(aSpy).toHaveBeenCalled();
  });
});
