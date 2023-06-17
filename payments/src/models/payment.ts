import mongoose, { Document, Model, Schema, model } from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends Document {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new Schema<PaymentDoc>(
  {
    orderId: {
      type: String,
      require: true,
    },
    stripeId: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    statics: {
      build(attrs: PaymentAttrs): PaymentDoc {
        return new Payment(attrs);
      },
    },
  }
);

const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
