import { Publisher, Subjects, TicketCreatedEvent } from '@asdfkai/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
