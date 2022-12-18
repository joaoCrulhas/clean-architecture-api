import { AccountModel } from '../../domain/models/account.model';
import { AddAccountDTO } from '../../domain/use-cases/add-account.usecase';

interface AddAccountRepository {
  exec(accountDTO: AddAccountDTO): Promise<AccountModel>;
}
export { AddAccountRepository };
