import express, { Express, Request, Response } from 'express';
const app: Express = express();
const port = 5000;
app.listen(port, () => {
  console.log(`Running ${port}`);
});
console.log(1);
