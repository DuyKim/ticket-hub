import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@asdfkai/common';

import { getId } from '@utils/getId';
import { Ticket } from '@models/ticket';
import { natsWrapper } from '@root/nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async function () {
  const listeners = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: getId(),
  });

  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: getId(),
    version: 0,
    status: OrderStatus.Created,
    userId: getId(),
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listeners, ticket, data, msg };
};

test('sets the orderId of the ticket', async () => {
  const { listeners, ticket, data, msg } = await setup();

  await listeners.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

test('acks the message', async () => {
  const { listeners, data, msg } = await setup();

  await listeners.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

test('publishes a ticket updated event', async () => {
  const { listeners, data, msg } = await setup();

  await listeners.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toBe(ticketUpdatedData.orderId);
});
