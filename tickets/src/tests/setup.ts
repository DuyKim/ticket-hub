import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { randomBytes } from 'node:crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { app } from '../app';
import { getId } from '@utils/getId';

let mongo: any;
beforeAll(async () => {
  // setup env variables
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  try {
    await mongoose.connect(mongoUri, {});
  } catch (error) {
    console.log('Error connecting to mongoose', error);
  }
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  const payload = {
    id: getId(),
    email: 'test@example.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
