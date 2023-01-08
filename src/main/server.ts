import { app } from './config/app';

const port = 5000;
app.listen(port, () => {
  console.log(`Running ${port}`);
});
console.log(1);
