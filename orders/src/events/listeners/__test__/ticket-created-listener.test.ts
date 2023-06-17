import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from '@asdfkai/common';

import { getId } from '@utils/getId';
import { natsWrapper } from '@root/nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { Ticket } from '@models/ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: getId(),
    title: 'concert',
    price: 10,
    userId: getId(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

test('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.id).toEqual(data.id);
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

test('acks the message', async () => {
  // TODO
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
