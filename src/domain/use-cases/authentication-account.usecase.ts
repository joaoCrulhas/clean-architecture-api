import { LoginRequest } from '../../presentation/protocols/http-request.protocol';
import { AuthenticationModel } from '../models/authentication.model';

export interface AuthenticationAccount {
  auth(login: LoginRequest): Promise<AuthenticationModel>;
}
