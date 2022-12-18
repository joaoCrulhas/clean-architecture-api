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
});
