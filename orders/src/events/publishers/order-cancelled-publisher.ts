import { OrderCancelledEvent, Publisher, Subjects } from '@asdfkai/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
