import os from 'os';

import express from 'express';
import { json } from 'body-parser';

import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';

const app = express();
app.use(json());

// Routers
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(currentUserRouter);
app.get('/', (req, res) => {
  res.send('hi there');
});

app.listen(3000, () => {
  const networkInterfaces = os.networkInterfaces();
  console.log(networkInterfaces);
  console.log('Listening on port 3000');
});
