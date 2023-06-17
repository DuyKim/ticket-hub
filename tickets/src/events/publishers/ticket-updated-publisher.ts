import { Publisher, Subjects, TicketUpdatedEvent } from '@asdfkai/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
