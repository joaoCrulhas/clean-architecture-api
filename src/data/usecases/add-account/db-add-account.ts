import { AccountModel } from '../../../domain/models/account.model';
import { AddAccount } from '../../../domain/use-cases';
import { AddAccountDTO } from '../../../domain/use-cases/add-account.usecase';
import { Encrypter } from '../../protocols/encrypter';

class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}
  async exec(account: AddAccountDTO): Promise<AccountModel> {
    const { email, password, username } = account;
    const encryptedPassword = await this.encrypter.encrypt(password);
    return Promise.resolve({
      email,
      id: 'hasedId',
      password: encryptedPassword,
      username
    });
  }
}
export { DbAddAccount };
