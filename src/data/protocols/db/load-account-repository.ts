import { AccountModel } from '../../../domain/models/account.model';

interface LoadAccount {
  load(login: string): Promise<AccountModel | null>;
}
export { LoadAccount };
