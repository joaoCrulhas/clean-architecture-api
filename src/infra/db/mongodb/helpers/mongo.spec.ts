import { envVariables } from '../../../../main/config/env';
import { MongoHelper as sut } from './mongo.helper';

describe('MongoHelper', () => {
  beforeAll(async () => {
    await sut.connect(envVariables.mongodbUrl);
  });
  it('Should return a collection if the mongoDb is connected', async () => {
    const collection = await sut.getCollection('accounts');
    expect(collection).toBeTruthy();
  });

  it('Should reconnect the mongodb if the connection was lost', async () => {
    await sut.disconnect();
    const collection = await sut.getCollection('accounts');
    expect(collection).toBeTruthy();
  });
  afterAll(async () => {
    await sut.disconnect();
  });
});
