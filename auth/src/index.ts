// import os from 'os';

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

// Routers
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';

// Error handlers
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

const app = express();
app.use(json());

// Routers
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(currentUserRouter);

// Error handlers
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  // const networkInterfaces = os.networkInterfaces();
  // console.log(networkInterfaces);
  console.log('Listening on port 3000');
});
