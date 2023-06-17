import {
  ExpirationCompletedEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@asdfkai/common';
import { queueGroupName } from './queueGroupName';
import { Message } from 'node-nats-streaming';
import { Order } from '@models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '@root/nats-wrapper';

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  readonly queueGroupName = queueGroupName;
  readonly subject = Subjects.ExpirationCompleted;

  async onMessage(
    data: ExpirationCompletedEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
