import { AddAccountRepository } from '../../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../../domain/models/account.model';
import { AddAccountDTO } from '../../../../../domain/use-cases/add-account.usecase';
import { MongoHelper } from '../../helpers/mongo.helper';

class AccountRepositoryMongo implements AddAccountRepository {
  async add({
    email,
    password,
    username
  }: AddAccountDTO): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const { insertedId } = await accountCollection.insertOne({
      email,
      password,
      username
    });
    const id = insertedId.toString();
    return Promise.resolve({
      id,
      email,
      password,
      username
    });
  }
}
export { AccountRepositoryMongo };
