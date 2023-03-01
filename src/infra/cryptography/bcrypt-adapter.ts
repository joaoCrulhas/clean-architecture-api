import { Hasher } from '../../data/protocols/cryptography/hasher';
import bcrypt from 'bcrypt';
class BcryptAdapter implements Hasher {
  constructor(private readonly round: number) {}
  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.round);
  }
}
export { BcryptAdapter };
