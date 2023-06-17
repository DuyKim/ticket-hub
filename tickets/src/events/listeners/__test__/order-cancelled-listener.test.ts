import { OrderCancelledEvent } from '@asdfkai/common';

import { getId } from '@utils/getId';
import { Ticket } from '@models/ticket';
import { natsWrapper } from '@root/nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async function () {
  const listeners = new OrderCancelledListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: getId(),
  });

  const orderId = getId();
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: getId(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listeners, ticket, data, msg, orderId };
};

test('updates the ticket, publishes an event, and acks the message', async () => {
  const { msg, data, ticket, listeners } = await setup();

  await listeners.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();

  const paramTicket = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(paramTicket!.id).toEqual(updatedTicket!.id);
});
