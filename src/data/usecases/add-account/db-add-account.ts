import { AccountModel } from '../../../domain/models/account.model';
import { AddAccount } from '../../../domain/use-cases';
import { AddAccountDTO } from '../../../domain/use-cases/add-account.usecase';
import { AddAccountRepository } from '../../protocols/add-account-repository';
import { Encrypter } from '../../protocols/encrypter';

class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  async exec({
    email,
    password,
    username
  }: AddAccountDTO): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(password);
    return await this.addAccountRepository.exec({
      email,
      password: encryptedPassword,
      username
    });
  }
}
export { DbAddAccount };
