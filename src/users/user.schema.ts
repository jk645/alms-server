import * as mongoose from 'mongoose';


export const UserSchema = new mongoose.Schema({
  fName: String,
  lName: String,
  email: String,
  password: String,
  active: Boolean,
}, {
  collection: 'users'
});
