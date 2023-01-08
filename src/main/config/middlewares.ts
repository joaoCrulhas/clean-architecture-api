import { Express } from 'express';
import { bodyParser } from '../middlewares/body-parser.middleware';
import { cors } from '../middlewares/cors.middleware';
const middlewares = (app: Express) => {
  app.use(bodyParser);
  app.use(cors);
};
export { middlewares };
