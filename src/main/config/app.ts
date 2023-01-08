import express, { Express } from 'express';
import { middlewares } from './middlewares';
import { setupRoutes } from './routes';
const app: Express = express();
middlewares(app);
setupRoutes(app);
export { app };
