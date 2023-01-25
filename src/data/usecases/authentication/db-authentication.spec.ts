jest.mock('../../../infra/cryptography/bcrypt-adapter'); // <= auto-mock the module
import { AccountModel } from '../../../domain/models/account.model';
import { LoginRequest } from '../../../presentation/protocols/http-request.protocol';
import { Encrypter } from '../../protocols/cryptography/encrypter';
import { LoadAccount } from '../../protocols/db/load-account-repository';
import { DbAuthentication } from './db-authentication';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter';
import { HashCompare } from '../../protocols/cryptography/hash-compare';
class LoadAccountRepositoryStub implements LoadAccount {
  load(login: string): Promise<AccountModel | null> {
    const account: AccountModel = {
      id: 'fake-id',
      email: 'fake-email',
      username: 'fake-username',
      password: 'fake-password'
    };
    return Promise.resolve(account);
  }
}

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    compare(value: string, hashedValue: string): Promise<boolean> {
      console.log(hashedValue, value);
      return Promise.resolve(true);
    }
  }
  return new HashCompareStub();
};

const makeSut = (): {
  sut: DbAuthentication;
  loadAccountRepository: LoadAccount;
  hashCompare: HashCompare;
} => {
  const loadAccountRepository = new LoadAccountRepositoryStub();
  const hashCompare = makeHashCompare();
  const sut = new DbAuthentication(loadAccountRepository, hashCompare);
  return {
    sut,
    loadAccountRepository,
    hashCompare
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

  it('should return null if the login value provided by customer not exist', async () => {
    const { sut, loadAccountRepository } = makeSut();
    jest.spyOn(loadAccountRepository, 'load').mockResolvedValueOnce(null);
    const response = await sut.auth(makeHttLoginRequest());
    expect(response).toBeNull();
  });

  it('should call the HashedPassword compare with correct values', async () => {
    const { sut, hashCompare } = makeSut();
    const aSpy = jest.spyOn(hashCompare, 'compare');
    await sut.auth(makeHttLoginRequest());
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith(
      makeHttLoginRequest().password,
      'fake-password'
    );
  });

  it('should return null if the password is different', async () => {
    const { sut, hashCompare } = makeSut();
    jest.spyOn(hashCompare, 'compare').mockResolvedValueOnce(false);
    const response = await sut.auth(makeHttLoginRequest());
    expect(response).toBeNull();
  });

  it('should throw an exception if loadAccountRepository@load throws', async () => {
    const { sut, hashCompare } = makeSut();
    jest.spyOn(hashCompare, 'compare').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(makeHttLoginRequest());
    expect(promise).rejects.toThrow();
  });
});
