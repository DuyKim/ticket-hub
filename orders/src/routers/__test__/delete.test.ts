import request from 'supertest';
import { app } from '@root/app';
import { buildTicketHelper } from '@root/tests/helper/buildTicket';
import { Order, OrderStatus } from '@models/order';
import { natsWrapper } from '@root/nats-wrapper';

test('marks an order as cancelled', async () => {
  const ticket = await buildTicketHelper();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
});

test('emits an order cancelled event', async () => {
  const ticket = await buildTicketHelper();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
