import request from 'supertest';

import { app } from '@root/app';

const createTicket = () => {
  const payload = {
    title: 'a valid ticket',
    price: 10,
  };
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(payload);
};

test('should fetch all tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(3);
});
