// modules from awesome forks
import request from 'supertest';

import { app } from '@root/app';
import { getId } from '@utils/getId';

test('should return a 404 if the ticket is not found', async () => {
  const id = getId();
  await request(app).post(`/api/tickets/${id}`).send().expect(404);
});

test('should return the ticket if the ticket is found', async () => {
  const payload = {
    title: 'a valid title',
    price: 20,
  };

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send(payload)
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body).toMatchObject(payload);
});
