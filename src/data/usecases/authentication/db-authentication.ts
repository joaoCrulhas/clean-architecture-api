import { AuthenticationModel } from '../../../domain/models/authentication.model';
import { AuthenticationAccount } from '../../../domain/use-cases/authentication-account.usecase';
import { LoginRequest } from '../../../presentation/protocols/http-request.protocol';
import { HashCompare } from '../../protocols/cryptography/hash-compare';
import { TokenGenerator } from '../../protocols/cryptography/token-generator';
import { LoadAccount } from '../../protocols/db/load-account-repository';

class DbAuthentication implements AuthenticationAccount {
  constructor(
    private readonly loadAccount: LoadAccount,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator
  ) {}
  async auth({
    login,
    password
  }: LoginRequest): Promise<AuthenticationModel | null> {
    const account = await this.loadAccount.load(login);
    if (!account) {
      return Promise.resolve(null);
    }
    const { id, email, username, password: hashedPassword } = account;
    const isCorrect = await this.hashCompare.compare(password, hashedPassword);
    if (!isCorrect) {
      return null;
    }
    const { token, expireAt } = await this.tokenGenerator.generate(id);
    const mockedAuthenticationModel: AuthenticationModel = {
      login,
      token,
      expireAt
    };
    return Promise.resolve(mockedAuthenticationModel);
  }
}

export { DbAuthentication };
