import { MissingParamError } from '../errors/missing-param.error';
import { HttpResponse } from '../protocols';
import { HTTP_RESPONSE_CODE } from './http-code.helper';

const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: HTTP_RESPONSE_CODE.badRequest,
    body: error
  };
};

const successCreatedResource = (resource: string): HttpResponse => {
  const message = `${resource} created`;
  return {
    statusCode: HTTP_RESPONSE_CODE.created,
    body: {
      message
    }
  };
};

export { badRequest, successCreatedResource };
