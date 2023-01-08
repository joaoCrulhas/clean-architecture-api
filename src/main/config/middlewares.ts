import { Express } from 'express';
import { bodyParser } from '../middlewares/body-parser.middleware';
const middlewares = (app: Express) => {
  app.use(bodyParser);
};
export { middlewares };
