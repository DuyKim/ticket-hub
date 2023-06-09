import request from 'supertest';

import { app } from '@root/app';

const user = {
  email: 'user@example.com',
  passowrd: 'password',
};

test('should fail when an email that does not exist is supplied', async () => {
  await request(app).post('/api/users/signin').send(user).expect(400);
});

test('should fail when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'foo@example.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'foo@example.com',
      password: 'asjdkfasjdkfk',
    })
    .expect(400);
});

it('should response with a cookie when given valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'bar@example.com',
      password: 'asjdkfasjdkfk',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'bar@example.com',
      password: 'asjdkfasjdkfk',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
