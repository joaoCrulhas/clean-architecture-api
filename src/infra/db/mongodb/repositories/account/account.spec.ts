import { AddAccountDTO } from '../../../../../domain/use-cases/add-account.usecase';
import { AccountRepositoryMongo } from './account';
import { Db, MongoClient } from 'mongodb';

const customDescribeOrSkip = process.env.MONGO_URL ? describe : describe.skip;
console.log('MongoURL', process.env.MONGO_URL);
const makeSut = () => {
  const sut = new AccountRepositoryMongo();
  return {
    sut
  };
};
customDescribeOrSkip('AccountRepository@MongoDB', () => {
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL as string;
    connection = await MongoClient.connect(mongoUrl);
    db = connection.db();
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
  });

  afterAll(async () => {
    await connection.close();
  });
});
