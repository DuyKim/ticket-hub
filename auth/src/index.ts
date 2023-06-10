import http from 'node:http';

import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is required');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
  }

  const server = http.createServer(app);

  server.listen(3000, () => {
    // const networkInterfaces = os.networkInterfaces();
    // console.log(networkInterfaces);

    console.log('Listening on port 3000!!!');
  });
};

start();
