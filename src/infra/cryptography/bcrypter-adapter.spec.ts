import { Encrypter } from '../../data/protocols/encrypter';
import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const makeSut = (): { sut: Encrypter } => {
  const sut = new BcryptAdapter(12);
  return {
    sut
  };
};

describe('Bcrypte-adpater', () => {
  it('should call bcrypte adpter with correct arguments', async () => {
    const aSpy = jest.spyOn(bcrypt, 'hash');
    const { sut } = makeSut();
    await sut.encrypt('current_password');
    expect(aSpy).toBeCalledWith('current_password', 12);
  });

  it('Should return a hashed string if bcrypt works', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.resolve('hashed_string');
    });
    const { sut } = makeSut();
    const hashedKey = await sut.encrypt('current_password');
    expect(hashedKey).toEqual('hashed_string');
  });

  it('Should throws if bcrypt thros an excpetion', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      return Promise.reject(new Error());
    });
    const { sut } = makeSut();
    const promise = sut.encrypt('current_password');
    expect(promise).rejects.toThrow();
  });
});
