import { natsWrapper } from '@root/nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Order } from '@models/order';
import { getId } from '@utils/getId';
import { OrderCancelledEvent, OrderStatus } from '@asdfkai/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: getId(),
    status: OrderStatus.Created,
    price: 10,
    userId: getId(),
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: getId(),
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, order, msg };
};

test('should update the status of the order', async () => {
  const { listener, data, order, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
});

test('should ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
