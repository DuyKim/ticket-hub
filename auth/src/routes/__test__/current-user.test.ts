import request from 'supertest';

import { app } from '@root/app';

test('should response with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@example.com');
});

test('should response with an error if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

  expect(response.body).toMatchInlineSnapshot(`
    [
      {
        "message": "Not authorized",
      },
    ]
  `);
});
