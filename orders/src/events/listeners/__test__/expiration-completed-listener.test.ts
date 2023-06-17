import { Order } from '@models/order';
import { natsWrapper } from '@root/nats-wrapper';
import { buildTicketHelper } from '@root/tests/helper/buildTicket';
import { buildOrderHelper } from '@root/tests/helper/buildOrderHelper';
import { ExpirationCompletedEvent, OrderStatus } from '@asdfkai/common';
import { ExpirationCompletedListener } from '../expiration-completed-listener';

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  const ticket = await buildTicketHelper();
  const order = await buildOrderHelper(ticket);

  const data: ExpirationCompletedEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, order };
};

test('updates the order status to cancelled', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

test('should emit an ordercancelled event', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
