import { PaymentCreatedEvent, Publisher, Subjects } from '@asdfkai/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
