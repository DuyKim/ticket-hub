import { Publisher, Subjects, OrderCreatedEvent } from '@asdfkai/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
