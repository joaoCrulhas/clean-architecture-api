import { AuthenticationModel } from '../../../domain/models/authentication.model';

interface TokenGenerator {
  generate(id: string): Promise<AuthenticationModel>;
}
export { TokenGenerator };
