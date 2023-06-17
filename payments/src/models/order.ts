import mongoose, { Document, Model, Schema } from 'mongoose';
import { OrderStatus } from '@asdfkai/common';

interface OrderAttrs {
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderDoc extends Document {
  status: OrderStatus;
  version: number;
  price: number;
  userId: string;
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new Schema<OrderDoc, OrderModel>(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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
    optimisticConcurrency: true,
    statics: {
      build(attrs: OrderAttrs): OrderDoc {
        return new Order({
          _id: attrs.id,
          version: attrs.version,
          price: attrs.price,
          userId: attrs.userId,
          status: attrs.status,
        });
      },
    },
  }
);

orderSchema.set('versionKey', 'version');

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order, OrderStatus };
