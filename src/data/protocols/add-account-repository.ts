import { AccountModel } from '../../domain/models/account.model';
import { AddAccountDTO } from '../../domain/use-cases/add-account.usecase';

interface AddAccountRepository {
  add(accountDTO: AddAccountDTO): Promise<AccountModel>;
}
export { AddAccountRepository };
