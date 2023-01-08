import { Express, Router } from 'express';
import { signupRoutes } from '../routes/signup.routes';

const setupRoutes = (app: Express) => {
  const router = Router();
  app.use('/api', router);
  signupRoutes(router);
  console.log();
};
export { setupRoutes };
