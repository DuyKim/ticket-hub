import request from 'supertest';

import { app } from '@root/app';
import { natsWrapper } from '@root/nats-wrapper';
import { Order, OrderStatus } from '@models/order';
import { buildTicketHelper } from '@root/tests/helper/buildTicket';

test('should fetch all orders for an particular user', async () => {
  const firstTicket = await buildTicketHelper();
  const secondTicket = await buildTicketHelper();
  const thirdTicket = await buildTicketHelper();

  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: firstTicket.id })
    .expect(201);

  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: secondTicket.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: thirdTicket.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0]).toMatchObject(orderOne);
  expect(response.body[1]).toMatchObject(orderTwo);
});
