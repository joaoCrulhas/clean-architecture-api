import { MissingParamError } from '../errors/missing-param.error';
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

export { badRequest, successCreatedResource };
