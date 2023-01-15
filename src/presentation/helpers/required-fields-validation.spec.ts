import { MissingParamError } from '../errors/missing-param.error';
import { HttpRequest } from '../protocols';
import { BodySignupRequest } from '../protocols/http-request.protocol';
import { RequiredFieldsValidation } from './required-fields-validation';

function makeSut(): { sut: RequiredFieldsValidation } {
  const sut = new RequiredFieldsValidation('username');
  return {
    sut
  };
}

describe('RequiredFieldsValidation', () => {
  it('Should return an error if property is missing', () => {
    const { sut } = makeSut();
    const request: HttpRequest<BodySignupRequest> = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      body: {
        email: 'test@gmail.com',
        password: 'password',
        passwordConfirmation: 'password'
      }
    };
    const { error } = sut.validate(request.body);
    expect(error).toEqual(new MissingParamError('username'));
  });
});
