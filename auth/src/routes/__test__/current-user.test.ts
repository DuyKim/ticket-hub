import request from 'supertest';

import { app } from '@root/app';

test('should response with details about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body).toMatchInlineSnapshot(`
{
  "currentUser": {
    "email": "test@example.com",
    "iat": 1686253813,
    "id": "648230f5b278fb74635aa325",
  },
}
`);
});

test('should response with an error if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(400);

  expect(response.body).toMatchInlineSnapshot(`
    [
      {
        "message": "Not authorized",
      },
    ]
  `);
});
