import { AccountModel } from '../../../domain/models/account.model';
import { LoginRequest } from '../../../presentation/protocols/http-request.protocol';
import { LoadAccount } from '../../protocols/db/load-account-repository';
import { DbAuthentication } from './db-authentication';
import { HashCompare } from '../../protocols/cryptography/hash-compare';
import { TokenGenerator } from '../../protocols/cryptography/token-generator';
import { AuthenticationModel } from '../../../domain/models/authentication.model';
import {
  UpdateAccessTokenDTO,
  UpdateAccessTokenRepository
} from '../../protocols/db/update-access-token-repository';
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

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    generate(id: string): Promise<AuthenticationModel> {
      console.log(id);
      const mockedResponse: AuthenticationModel = {
        login: 'fake-login',
        token: 'fake-token',
        expireAt: new Date('2020-10-10')
      };
      return Promise.resolve(mockedResponse);
    }
  }
  return new TokenGeneratorStub();
};

const makeHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    compare(value: string, hashedValue: string): Promise<boolean> {
      console.log(hashedValue, value);
      return Promise.resolve(true);
    }
  }
  return new HashCompareStub();
};
const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    update(args: any): Promise<any> {
      return Promise.resolve(args);
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};
const makeSut = (): {
  sut: DbAuthentication;
  loadAccountRepository: LoadAccount;
  hashCompare: HashCompare;
  tokenGenerator: TokenGenerator;
  updateAccessTokenRepository: UpdateAccessTokenRepository;
} => {
  const updateAccessTokenRepository = makeUpdateAccessTokenRepositoryStub();
  const loadAccountRepository = new LoadAccountRepositoryStub();
  const hashCompare = makeHashCompare();
  const tokenGeneratorStub = makeTokenGeneratorStub();
  const sut = new DbAuthentication(
    loadAccountRepository,
    hashCompare,
    tokenGeneratorStub,
    updateAccessTokenRepository
  );
  return {
    tokenGenerator: tokenGeneratorStub,
    sut,
    loadAccountRepository,
    hashCompare,
    updateAccessTokenRepository
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
  it('should call token generator with correct id', async () => {
    const { sut, tokenGenerator } = makeSut();
    const aSpy = jest.spyOn(tokenGenerator, 'generate');
    await sut.auth(makeHttLoginRequest());
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith('fake-id');
  });

  it('should throw an exception if loadAccountRepository@load throws', async () => {
    const { sut, tokenGenerator } = makeSut();
    jest.spyOn(tokenGenerator, 'generate').mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.auth(makeHttLoginRequest());
    expect(promise).rejects.toThrow();
  });

  it('should return success token if all data are provided', async () => {
    const { sut } = makeSut();
    const response = await sut.auth(makeHttLoginRequest());
    expect(response?.token).toEqual('fake-token');
  });
  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepository } = makeSut();
    const aSpy = jest.spyOn(updateAccessTokenRepository, 'update');
    await sut.auth(makeHttLoginRequest());
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith({
      id: 'fake-id',
      token: 'fake-token',
      expireAt: new Date('2020-10-10')
    });
  });

  it('should throw an exception if loadAccountRepository@load throws', async () => {
    const { sut, updateAccessTokenRepository } = makeSut();
    jest
      .spyOn(updateAccessTokenRepository, 'update')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const promise = sut.auth(makeHttLoginRequest());
    expect(promise).rejects.toThrow();
  });
});
