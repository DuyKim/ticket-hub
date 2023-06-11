import mongoose, { model, Document, Model, Schema, Types } from 'mongoose';

type TicketAttrs = {
  title: string;
  price: number;
  userId: Types.ObjectId;
};

interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: Types.ObjectId;
}

interface TicketModel extends Model<TicketDoc> {
  build(ticketAttrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema<TicketDoc, TicketModel>(
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
      type: Schema.Types.ObjectId,
      required: true,
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
  }
);

ticketSchema.statics.build = (ticketAttrs: TicketAttrs) => {
  return new Ticket(ticketAttrs);
};

const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
