import mongoose from 'mongoose';

export function getId() {
  return new mongoose.Types.ObjectId().toString();
}
