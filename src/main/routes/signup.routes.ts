import { Router } from 'express';
import { makeSignupController } from '../factories/signup.factory';
import { adapterController } from '../adapters/express-route-adapter';
const signupRoutes = (router: Router) => {
  console.log('signupRoutes');
  const signupController = makeSignupController();
  router.post('/signup', adapterController(signupController));
};

export { signupRoutes };
