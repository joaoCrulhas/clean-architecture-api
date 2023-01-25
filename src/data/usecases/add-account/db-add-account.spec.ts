import { AccountModel } from '../../../domain/models/account.model';
import {
  AddAccount,
  AddAccountDTO
} from '../../../domain/use-cases/add-account.usecase';
import { AddAccountRepository } from '../../protocols/db/add-account-repository';
import { Encrypter } from '../../protocols/cryptography/encrypter';
import { DbAddAccount } from './db-add-account';

interface SystemUnderTest {
  sut: AddAccount;
  encrypter: Encrypter;
  addAccountRepository: AddAccountRepository;
}

const makeAddAccountRepository = () => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    add(accountDTO: AddAccountDTO): Promise<AccountModel> {
      return Promise.resolve({
        email: accountDTO.email,
        id: 'hashedId',
        password: accountDTO.password,
        username: 'username'
      });
    }
  }
  const addRepository = new AddAccountRepositoryStub();
  return addRepository;
};
const makeSut = (): SystemUnderTest => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('encrypted_string');
    }
  }
  const encrypter = new EncrypterStub();
  const addAccountRepository = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypter, addAccountRepository);
  return {
    sut,
    encrypter,
    addAccountRepository
  };
};

describe('DbAccount', () => {
  it('should call encrypter with correct password before store the password into DB', async () => {
    const request: AddAccountDTO = {
      email: 'valid_emaal@gmail.com',
      username: 'username',
      password: 'valid_password'
    };
    const { sut, encrypter } = makeSut();
    const aSpy = jest.spyOn(encrypter, 'encrypt');
    await sut.exec(request);
    expect(aSpy).toBeCalled();
    expect(aSpy).toBeCalledWith('valid_password');
  });

  it('should call AddAccountRepository with correct arguments', async () => {
    const request: AddAccountDTO = {
      email: 'valid_emaal@gmail.com',
      username: 'username',
      password: 'valid_password'
    };
    const { sut, encrypter, addAccountRepository } = makeSut();
    const aSpy = jest.spyOn(addAccountRepository, 'add');
    jest.spyOn(encrypter, 'encrypt').mockResolvedValueOnce('encryptedPassword');
    await sut.exec(request);
    expect(aSpy).toBeCalledWith({
      email: 'valid_emaal@gmail.com',
      username: 'username',
      password: 'encryptedPassword'
    });
  });
  it('Should throws an execpiton if encypter throws', async () => {
    const request: AddAccountDTO = {
      email: 'valid_emaal@gmail.com',
      username: 'username',
      password: 'valid_password'
    };
    const { sut, encrypter } = makeSut();
    jest.spyOn(encrypter, 'encrypt').mockImplementationOnce(() => {
      return Promise.reject(new Error('Encrypt_Error'));
    });

    try {
      await sut.exec(request);
    } catch (e: any) {
      expect(e.message).toEqual('Encrypt_Error');
    }
  });

  it('Should throws an execpiton if addAccountRepo throws', async () => {
    const request: AddAccountDTO = {
      email: 'valid_emaal@gmail.com',
      username: 'username',
      password: 'valid_password'
    };
    const { sut, addAccountRepository } = makeSut();
    jest.spyOn(addAccountRepository, 'add').mockImplementationOnce(() => {
      return Promise.reject(new Error('addAccountRepository_error'));
    });
    try {
      await sut.exec(request);
    } catch (e: any) {
      expect(e.message).toEqual('addAccountRepository_error');
    }
  });

  it('Should return the created account if everything works fine', async function () {
    const request: AddAccountDTO = {
      email: 'valid_emaal@gmail.com',
      username: 'username',
      password: 'valid_password'
    };
    const response: AccountModel = {
      id: 'hashedId',
      email: 'valid_emaal@gmail.com',
      username: 'username',
      password: 'valid_password'
    };
    const { sut, addAccountRepository, encrypter } = makeSut();
    jest.spyOn(encrypter, 'encrypt').mockResolvedValueOnce('encryptedPassword');
    jest.spyOn(addAccountRepository, 'add').mockResolvedValueOnce(response);
    const accountCretead = await sut.exec(request);
    expect(accountCretead).toStrictEqual(response);
  });
});
