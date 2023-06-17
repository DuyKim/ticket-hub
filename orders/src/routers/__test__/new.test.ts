import request from 'supertest';

import { app } from '@root/app';
import { getId } from '@utils/getId';
import { Ticket, TicketDoc } from '@models/ticket';
import { natsWrapper } from '@root/nats-wrapper';
import { Order, OrderStatus } from '@models/order';
import { buildTicketHelper } from '@root/tests/helper/buildTicket';

test('should return an error if the ticket does not exist', async () => {
  const ticketId = getId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

test('should return an error if the ticket is already in use', async () => {
  const ticket = await buildTicketHelper();

  const order = Order.build({
    ticket: ticket,
    userId: getId(),
    expiresAt: new Date(),
    status: OrderStatus.Created,
  });

  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

test('should reserve a ticket successfully', async () => {
  const ticket = await buildTicketHelper();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

test('should emit an order created event', async () => {
  const ticket = await buildTicketHelper();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
