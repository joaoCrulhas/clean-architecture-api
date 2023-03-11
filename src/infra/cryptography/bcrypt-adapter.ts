import { HashCompare } from '../../data/protocols/cryptography/hash-compare';
import { Hasher } from '../../data/protocols/cryptography/hasher';
import bcrypt from 'bcrypt';
class BcryptAdapter implements Hasher, HashCompare {
  constructor(private readonly round: number) {}

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return await bcrypt.compare(value, hashedValue);
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.round);
  }
}
export { BcryptAdapter };
