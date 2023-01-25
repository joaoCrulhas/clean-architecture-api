import { AccountModel } from '../../../domain/models/account.model';
import { LoginRequest } from '../../../presentation/protocols/http-request.protocol';
import { LoadAccount } from '../../protocols/db/load-account-repository';
import { DbAuthentication } from './db-authentication';

class LoadAccountRepositoryStub implements LoadAccount {
  load(login: string): Promise<AccountModel> {
    const account: AccountModel = {
      id: 'fake-id',
      email: 'fake-email',
      username: 'fake-username',
      password: 'fake-password'
    };
    return Promise.resolve(account);
  }
}

const makeSut = (): {
  sut: DbAuthentication;
  loadAccountRepository: LoadAccount;
} => {
  const loadAccountRepository = new LoadAccountRepositoryStub();
  const sut = new DbAuthentication(loadAccountRepository);
  return {
    sut,
    loadAccountRepository
  };
};
const makeHttLoginRequest = (): LoginRequest => {
  return {
    login: 'test',
    password: 'test'
  };
};

describe('DbAuthentication UseCase', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountRepository } = makeSut();
    const aSpy = jest.spyOn(loadAccountRepository, 'load');
    await sut.auth(makeHttLoginRequest());
    expect(aSpy).toBeCalled();
    expect(aSpy).toHaveBeenCalledWith(makeHttLoginRequest().login);
  });

  it('should throw an exception if loadAccountRepository@load throws', async () => {
    const { sut, loadAccountRepository } = makeSut();
    jest.spyOn(loadAccountRepository, 'load').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(makeHttLoginRequest());
    expect(promise).rejects.toThrow();
  });
});
