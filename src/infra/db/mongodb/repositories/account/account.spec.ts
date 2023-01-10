import { AddAccountDTO } from '../../../../../domain/use-cases/add-account.usecase';
import { AccountRepositoryMongo } from './account';
import { MongoHelper } from '../../helpers/mongo.helper';
const customDescribeOrSkip = process.env.MONGO_URL ? describe : describe.skip;
console.log('MongoURL', process.env.MONGO_URL);
const makeSut = () => {
  const sut = new AccountRepositoryMongo();
  return {
    sut
  };
};
customDescribeOrSkip('AccountRepository@MongoDB', () => {
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL as string;
    await MongoHelper.connect(mongoUrl);
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  it('should return an account on success', async () => {
    const { sut } = makeSut();
    const accountRequest: AddAccountDTO = {
      email: 'validMail@gmail.com',
      username: 'valid_username',
      password: 'valid_password'
    };
    const account = await sut.add(accountRequest);
    expect(account.email).toEqual('validMail@gmail.com');
    expect(account.id).toBeTruthy();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
});
