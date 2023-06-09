import request from 'supertest';

import { app } from '@root/app';

test('should clear the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@example.com',
      password: 'testpassword',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(response.get('Set-Cookie')).toMatchInlineSnapshot(`
    [
      "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
    ]
  `);
});
