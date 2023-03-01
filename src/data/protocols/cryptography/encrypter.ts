import { AuthenticationModel } from '../../../domain/models/authentication.model';

interface TokenGenerator {
  encrypt(value: string): Promise<AuthenticationModel>;
}
export { TokenGenerator };
