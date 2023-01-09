import request from 'supertest';
import { app } from '../config/app';
import { BodySignupRequest } from '../../presentation/protocols/http-request.protocol';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper';
import { HTTP_RESPONSE_CODE } from '../../presentation/helpers/http-code.helper';

const PATH = '/api/signup';
describe('Signup routes', () => {
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL as string;
    await MongoHelper.connect(mongoUrl);
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
  it('Should call POST /api/signup', async () => {
    const signupRequest: BodySignupRequest = {
      email: 'joao@gmail.com',
      password: '123password',
      passwordConfirmation: '123password',
      username: 'joaotest'
    };
    await request(app)
      .post(PATH)
      .send(signupRequest)
      .expect(HTTP_RESPONSE_CODE.created);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
});
