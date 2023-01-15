import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountRepositoryMongo } from '../../infra/db/mongodb/repositories/account/account';
import { LoggerDecorator } from '../decorators/logger-decorator';
import { Controller } from '../../presentation/controllers/controller.protocol';
import { SignupController } from '../../presentation/controllers/signup/signup';
import { HttpRequest } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogErrorRepositoryMongoDb } from '../../infra/db/mongodb/repositories/logs/error';
import { makeSignupComposite } from './signup-validation.factory';
import { EmailValidation } from '../../presentation/helpers/email-validation';

const makeSignupController = (): Controller<HttpRequest<any>> => {
  const validation = makeSignupComposite();
  const logErrorRepository = new LogErrorRepositoryMongoDb();
  const bcrypterAdapter = new BcryptAdapter(12);
  const accountRepository = new AccountRepositoryMongo();
  const dbAddAccount = new DbAddAccount(bcrypterAdapter, accountRepository);
  const signupController = new SignupController(dbAddAccount, validation);
  return new LoggerDecorator(signupController, logErrorRepository);
};

export { makeSignupController };
