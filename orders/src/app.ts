// import os from 'os';

import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

// Error handlers
import { NotFoundError, currentUser, errorHandler } from '@asdfkai/common';

import { createOrderRouter } from '@routers/new';
import { showOrderRouter } from '@routers/show';
import { indexOrderRouter } from './routers';
import { deleteOrderRouter } from '@routers/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

// Routers
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

// Error handlers
app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
