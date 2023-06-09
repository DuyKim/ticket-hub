import request from 'supertest';

import { app } from '@root/app';

test('should return a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password',
    })
    .expect(201);
});

test('should return a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'invalidemail',
      password: 'password',
    })
    .expect(400);
});

test('should return a 400 with an empty password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: '',
    })
    .expect(400);
});

test('should return a 400 with a password has strength is shorter than 8 characters', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 't',
    })
    .expect(400);
});

test('should return a 400 with a password that has strength is longer than 20 characters', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'password that its strength is longer than 20 characters',
    })
    .expect(400);
});

test('should return a 400 status code with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'testpassword',
    })
    .expect(400);
});

test('should disallow duplicate email addresses', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'testpassword',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'testpassword',
    })
    .expect(400);
});

test('should set a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'testpassword',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
