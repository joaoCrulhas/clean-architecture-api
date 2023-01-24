import { AuthenticationModel } from '../../../domain/models/authentication.model';
import { AuthenticationAccount } from '../../../domain/use-cases/authentication-account.usecase';
import { LoginRequest } from '../../../presentation/protocols/http-request.protocol';
import { LoadAccount } from '../../protocols/load-account-repository';

class DbAuthentication implements AuthenticationAccount {
  constructor(private readonly loadAccount: LoadAccount) {}
  async auth({ login }: LoginRequest): Promise<AuthenticationModel> {
    await this.loadAccount.load(login);
    const mockedAuthenticationModel: AuthenticationModel = {
      login,
      token: '',
      expireAt: new Date()
    };
    return Promise.resolve(mockedAuthenticationModel);
  }
}

export { DbAuthentication };
