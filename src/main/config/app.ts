import express, { Express, Request, Response } from 'express';
import { middlewares } from './middlewares';
const app: Express = express();
middlewares(app);
export { app };
