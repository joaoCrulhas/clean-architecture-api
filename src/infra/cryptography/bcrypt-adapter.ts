import { Encrypter } from '../../data/protocols/encrypter';
import bcrypt from 'bcrypt';
class BcryptAdapter implements Encrypter {
  constructor(private readonly round: number) {}
  async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.round);
  }
}
export { BcryptAdapter };
