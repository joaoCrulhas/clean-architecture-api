import { LoginRequest } from '../../presentation/protocols/http-request.protocol';
import { AuthenticationModel } from '../models/authentication.model';

export interface AuthenticationAccount {
  exec(login: LoginRequest): Promise<AuthenticationModel>;
}
