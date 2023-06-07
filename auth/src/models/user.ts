import mongoose, { Document, Model } from 'mongoose';

const USER_DOCUMENT = 'User';
const USERS_COLLECTION = 'Users';

type UserAttrs = {
  email: string;
  password: string;
};

interface UserDoc extends Document {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(user: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema<UserDoc, UserModel>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: USERS_COLLECTION,
  }
);

userSchema.statics.build = (user: UserAttrs) => {
  return new User(user);
};

const User = mongoose.model<UserDoc, UserModel>(USER_DOCUMENT, userSchema);

export { User };
