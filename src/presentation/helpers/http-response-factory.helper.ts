import { ServerError } from '../errors/server-error.error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { HttpResponse } from '../protocols';
import { HTTP_RESPONSE_CODE } from './http-code.helper';

const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: HTTP_RESPONSE_CODE.badRequest,
    data: error
  };
};

const unauthorized = (error: UnauthorizedError): HttpResponse => {
  return {
    statusCode: HTTP_RESPONSE_CODE.unauthorized,
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

const successRequest = (resource: any): HttpResponse => {
  return {
    statusCode: HTTP_RESPONSE_CODE.created,
    data: resource
  };
};

export {
  badRequest,
  successCreatedResource,
  serverError,
  successRequest,
  unauthorized
};
