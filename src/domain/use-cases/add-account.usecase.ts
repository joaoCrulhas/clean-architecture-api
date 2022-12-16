import { AccountModel } from '../models/account.model';

export interface AddAccountDTO {
  email: string;
  username: string;
  password: string;
}
export interface AddAccount {
  exec(account: AddAccountDTO): AccountModel;
}
