import { LoggerErrorRepository } from '../../../../../data/protocols/log-error-repository';
import { MongoHelper } from '../../helpers/mongo.helper';

class LogErrorRepositoryMongoDb implements LoggerErrorRepository {
  async log(stack: string): Promise<void> {
    const logCollection = await MongoHelper.getCollection('logs');
    await logCollection.insertOne({
      stack
    });
  }
}

export { LogErrorRepositoryMongoDb };
