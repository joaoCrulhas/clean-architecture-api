import request from 'supertest';
import { app } from '../config/app';
import { BodySignupRequest } from '../../presentation/protocols/http-request.protocol';

const PATH = '/api/signup';
describe('Signup routes', () => {
  it('Should call POST /api/signup', async () => {
    const signupRequest: BodySignupRequest = {
      email: 'joao@gmail.com',
      password: '123password',
      passwordConfirmation: '123password',
      username: 'joaotest'
    };
    await request(app).post(PATH).send(signupRequest).expect(200);
  });
});
