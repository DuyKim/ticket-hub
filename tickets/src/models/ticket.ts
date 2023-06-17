import mongoose, { model, Document, Model, Schema, Types } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

type TicketAttrs = {
  title: string;
  price: number;
  userId: string;
};

interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface TicketModel extends Model<TicketDoc> {
  build(ticketAttrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema<TicketDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    statics: {
      build(ticketAttrs: TicketAttrs): TicketDoc {
        return new Ticket(ticketAttrs);
      },
    },
    optimisticConcurrency: true,
  }
);

ticketSchema.set('versionKey', 'version');
// ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
