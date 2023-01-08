import { AccountModel } from '../../../../../domain/models/account.model';
import { AddAccountDTO } from '../../../../../domain/use-cases/add-account.usecase';
import { AccountRepository } from './account.protocols';

class AccountRepositoryMongo implements AccountRepository {
  add(account: AddAccountDTO): Promise<AccountModel> {
    return Promise.resolve({
      email: account.email,
      id: 'any_id',
      password: account.password,
      username: account.username
    });
  }
}
export { AccountRepositoryMongo };
