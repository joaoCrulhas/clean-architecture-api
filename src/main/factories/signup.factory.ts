import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter';
import { AccountRepositoryMongo } from '../../infra/db/mongodb/repositories/account/account';
import { SignupController } from '../../presentation/controllers/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

const makeSignupController = (): SignupController => {
  const emailValidator = new EmailValidatorAdapter();
  const bcrypterAdapter = new BcryptAdapter(12);
  const accountRepository = new AccountRepositoryMongo();
  const dbAddAccount = new DbAddAccount(bcrypterAdapter, accountRepository);
  return new SignupController(emailValidator, dbAddAccount);
};

export { makeSignupController };
