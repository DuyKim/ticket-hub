import { Order, OrderStatus } from '@models/order';
import { getId } from '@utils/getId';

export const buildOrderHelper = async (userId?: string, price?: number) => {
  const order = Order.build({
    price: price || 10,
    status: OrderStatus.Created,
    userId: userId || getId(),
    version: 0,
    id: getId(),
  });
  await order.save();

  return order;
};
