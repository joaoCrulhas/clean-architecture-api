import { SignupController } from './signup';

/*
    Requirement:
        1. The controller should receive a request from user and create an account for him.
        2. To create an account the user should provide (username, email, password and passwordConfirmation).
*/

const sut = new SignupController();
describe('SignUp Controller', () => {
  it('Should return a bad request if username is not provided', function () {
    const request = {
      email: 'any_email@gmail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    };
    const { statusCode } = sut.exec(request);
    expect(statusCode).toEqual(400);
  });
});
