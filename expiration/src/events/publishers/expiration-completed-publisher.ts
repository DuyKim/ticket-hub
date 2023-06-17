import { Publisher, Subjects, ExpirationCompletedEvent } from '@asdfkai/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}
