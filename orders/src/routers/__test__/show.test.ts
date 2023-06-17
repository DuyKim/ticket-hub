import request from 'supertest';

import { app } from '@root/app';
import { Ticket } from '@models/ticket';
import { buildTicketHelper } from '@root/tests/helper/buildTicket';

test('should fetch the order', async () => {
  const ticket = await buildTicketHelper();

  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder).toEqual(order);
});

test("returns an error if one user tries to fetch another user's order", async () => {
  const ticket = await buildTicketHelper();

  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
