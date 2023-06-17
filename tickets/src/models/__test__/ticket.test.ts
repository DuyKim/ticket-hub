import { Ticket } from '@models/ticket';
import { getId } from '@utils/getId';

test('should implement optimistic locking', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: getId().toString(),
  });

  await ticket.save();

  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  firstTicket!.set({ price: 10 });
  secondTicket!.set({ price: 15 });

  await firstTicket!.save();

  try {
    await secondTicket!.save();
  } catch (error) {
    return;
  }

  throw new Error('Should not reach this point');
});

test('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'Ticket',
    price: 20,
    userId: getId().toString(),
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  ticket.price = 25;
  await ticket.save();
  expect(ticket.version).toEqual(1);

  ticket.price = 30;
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
