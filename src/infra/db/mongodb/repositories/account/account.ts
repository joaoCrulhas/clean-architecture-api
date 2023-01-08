import { AddAccountRepository } from '../../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../../domain/models/account.model';
import { AddAccountDTO } from '../../../../../domain/use-cases/add-account.usecase';
import { AccountRepository } from './account.protocols';

class AccountRepositoryMongo implements AddAccountRepository {
  add({ email, password, username }: AddAccountDTO): Promise<AccountModel> {
    return Promise.resolve({
      id: 'any_id',
      email,
      password,
      username
    });
  }
}
export { AccountRepositoryMongo };
