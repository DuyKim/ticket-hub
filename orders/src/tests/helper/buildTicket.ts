import { Ticket } from '@models/ticket';
import { getId } from '@utils/getId';

export const buildTicketHelper = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: getId(),
  });

  await ticket.save();
  return ticket;
};
