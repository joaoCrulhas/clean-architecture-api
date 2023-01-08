import { AddAccountDTO } from '../../../../../domain/use-cases/add-account.usecase';

interface AccountRepository {
  add(account: AddAccountDTO): Promise<any>;
}
export { AccountRepository };
