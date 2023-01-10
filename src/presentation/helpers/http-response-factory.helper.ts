import { MissingParamError } from '../errors/missing-param.error';
import { ServerError } from '../errors/server-error.error';
import { HttpResponse } from '../protocols';
import { HTTP_RESPONSE_CODE } from './http-code.helper';

const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: HTTP_RESPONSE_CODE.badRequest,
    data: error
  };
};

const successCreatedResource = (resource: any): HttpResponse => {
  return {
    statusCode: HTTP_RESPONSE_CODE.created,
    data: resource
  };
};

const serverError = (error: Error): HttpResponse => {
  const stackError = error.stack || 'stack_not_provided';
  return {
    statusCode: HTTP_RESPONSE_CODE.serverError,
    data: new ServerError(stackError)
  };
};

export { badRequest, successCreatedResource, serverError };
