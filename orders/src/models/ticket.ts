import { Model, Document, model, Schema } from 'mongoose';

import { Order, OrderStatus } from './order';

const OFFSET_VERSION = 1;

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new Schema<TicketDoc, TicketModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    optimisticConcurrency: true,
    statics: {
      build(attrs: TicketAttrs): TicketDoc {
        // this is technical debt
        return new Ticket({
          _id: attrs.id,
          title: attrs.title,
          price: attrs.price,
        });
      },
      findByEvent(data: {
        id: string;
        version: number;
      }): Promise<TicketDoc | null> {
        return Ticket.findOne({
          _id: data.id,
          version: data.version - OFFSET_VERSION,
        });
      },
    },
  }
);

ticketSchema.set('versionKey', 'version');
// ticketSchema.pre('save', function (done) {
//   // @ts-ignore
//   this.$where = {
//     version: this.get('version') - OFFSET_VERSION,
//   };
//   done();
// });

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.AwaitingPayment,
        OrderStatus.Created,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
