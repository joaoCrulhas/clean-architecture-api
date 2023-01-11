import { LoggerErrorRepository } from '../../data/protocols/log-error-repository';
import { Controller } from '../../presentation/controllers/controller.protocol';
import { ServerError } from '../../presentation/errors/server-error.error';
import { HTTP_RESPONSE_CODE } from '../../presentation/helpers/http-code.helper';
import { HttpRequest, HttpResponse } from '../../presentation/protocols';

class LoggerDecorator implements Controller<HttpRequest<any>> {
  protected controller: Controller<HttpRequest<any>>;
  protected logErrorRepository: LoggerErrorRepository;

  constructor(
    controller: Controller<HttpRequest<any>>,
    logErrorRepository: LoggerErrorRepository
  ) {
    this.controller = controller;
    this.logErrorRepository = logErrorRepository;
  }
  async exec(request: HttpRequest<any>): Promise<HttpResponse> {
    const { statusCode, data } = await this.controller.exec(request);
    if (statusCode === HTTP_RESPONSE_CODE.serverError) {
      console.error(
        `Status code =${statusCode}, error = ${JSON.stringify(data)}`
      );
      const errorData = data as ServerError;
      await this.logErrorRepository.log(
        errorData.stack || 'stack_not_provided'
      );
    }
    return {
      statusCode,
      data
    };
  }
}

export { LoggerDecorator };
