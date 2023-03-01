import { AccountModel } from '../../../domain/models/account.model';
import { AddAccount } from '../../../domain/use-cases';
import { AddAccountDTO } from '../../../domain/use-cases/add-account.usecase';
import { AddAccountRepository } from '../../protocols/db/add-account-repository';
import { Hasher } from '../../protocols/cryptography/hasher';

class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}
  async exec({
    email,
    password,
    username
  }: AddAccountDTO): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.hash(password);
    return await this.addAccountRepository.add({
      email,
      password: encryptedPassword,
      username
    });
  }
}
export { DbAddAccount };
