import { Order, OrderStatus } from '@models/order';
import { TicketDoc } from '@models/ticket';
import { getId } from '@utils/getId';

export const buildOrderHelper = async (ticket: TicketDoc) => {
  const order = Order.build({
    status: OrderStatus.Created,
    userId: getId(),
    expiresAt: new Date(),
    ticket,
  });

  await order.save();
  return order;
};
