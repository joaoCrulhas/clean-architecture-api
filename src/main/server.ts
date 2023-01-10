import { MongoHelper } from '../infra/db/mongodb/helpers/mongo.helper';
import { app } from './config/app';
import { envVariables } from './config/env';

const port = envVariables.port;
MongoHelper.connect(envVariables.mongodbUrl)
  .then(() => {
    app.listen(port, () => {
      console.log(`Running ${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
