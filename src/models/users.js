const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    nama: { type: String, required: true },
    nip: { type: String, required: true },
    email: {
      type: String,
      unique: [true, 'email already exists in database!'],
      lowercase: true,
      required: [true, 'email not provided'],
    },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ['rnd', 'prod'],
      required: [true, 'Please specify user role'],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
