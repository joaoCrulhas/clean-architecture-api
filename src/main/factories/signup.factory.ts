import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountRepositoryMongo } from '../../infra/db/mongodb/repositories/account/account';
import { LoggerDecorator } from '../decorators/logger-decorator';
import { Controller } from '../../presentation/controllers/controller.protocol';
import { SignupController } from '../../presentation/controllers/signup';
import { HttpRequest } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogErrorRepositoryMongoDb } from '../../infra/db/mongodb/repositories/logs/error';

const makeSignupController = (): Controller<HttpRequest<any>> => {
  const logErrorRepository = new LogErrorRepositoryMongoDb();
  const emailValidator = new EmailValidatorAdapter();
  const bcrypterAdapter = new BcryptAdapter(12);
  const accountRepository = new AccountRepositoryMongo();
  const dbAddAccount = new DbAddAccount(bcrypterAdapter, accountRepository);
  const signupController = new SignupController(emailValidator, dbAddAccount);
  return new LoggerDecorator(signupController, logErrorRepository);
};

export { makeSignupController };
