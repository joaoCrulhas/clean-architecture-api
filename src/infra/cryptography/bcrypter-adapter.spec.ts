import { Hasher } from '../../data/protocols/cryptography/hasher';
import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const makeSut = (): { sut: BcryptAdapter } => {
  const sut = new BcryptAdapter(12);
  return {
    sut
  };
};

describe('Bcrypte-adpater', () => {
  it('should call bcrypt@compare with correct arguments', async () => {
    const aSpy = jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
    const { sut } = makeSut();
    const response = await sut.compare('any_value', 'any_hash');
    expect(aSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    expect(response).toBeTruthy();
  });

  it('should call bcryptAdapater@compare return false if bcrypt returns false', async () => {
    const aSpy = jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      return Promise.resolve(false);
    });
    const { sut } = makeSut();
    const response = await sut.compare('any_value', 'any_hash');
    expect(aSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    expect(response).toBeFalsy();
  });

  it('should call bcrypte@hash adpter with correct arguments', async () => {
    const aSpy = jest.spyOn(bcrypt, 'hash');
    const { sut } = makeSut();
    await sut.hash('current_password');
    expect(aSpy).toBeCalledWith('current_password', 12);
  });

  it('Should return a hashed string if bcrypt works', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.resolve('hashed_string');
    });
    const { sut } = makeSut();
    const hashedKey = await sut.hash('current_password');
    expect(hashedKey).toEqual('hashed_string');
  });

  it('Should throws if bcrypt thros an excpetion', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.reject(new Error());
    });
    const { sut } = makeSut();
    const promise = sut.hash('current_password');
    expect(promise).rejects.toThrow();
  });
});
