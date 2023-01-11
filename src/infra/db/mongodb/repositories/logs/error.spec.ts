import { Collection } from 'mongodb';
import { MongoHelper } from '../../helpers/mongo.helper';
import { LogErrorRepositoryMongoDb } from './error';

interface SystemUnderTest {
  sut: LogErrorRepositoryMongoDb;
}

const makeSut = (): SystemUnderTest => {
  const sut = new LogErrorRepositoryMongoDb();
  return { sut };
};
describe('LogErrorRepositoryMongoDb', () => {
  let logCollection: Collection;
  beforeAll(async () => {
    const mongoUrl = process.env.MONGO_URL as string;
    await MongoHelper.connect(mongoUrl);
  });

  beforeEach(async () => {
    logCollection = await MongoHelper.getCollection('logs_errors');
    await logCollection.deleteMany({});
  });

  it('Should call insertOne with correct arguments', async () => {
    const { sut } = makeSut();
    await sut.log('fakeLoggStack');
    const logs = await logCollection.find().toArray();
    const hasElements = logs.length > 0;
    expect(hasElements).toEqual(true);
    expect(logs[0].stack).toEqual('fakeLoggStack');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
});
