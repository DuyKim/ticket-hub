import { natsWrapper } from '@root/nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { OrderCreatedEvent, OrderStatus } from '@asdfkai/common';
import { getId } from '@utils/getId';
import { Message } from 'node-nats-streaming';
import { Order } from '@models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: getId(),
    version: 0,
    expiresAt: new Date().toISOString(),
    userId: getId(),
    status: OrderStatus.Created,
    ticket: {
      id: getId(),
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

test('should replicate the order infor', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
