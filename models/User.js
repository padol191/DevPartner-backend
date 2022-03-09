const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  github: {
    type: String,
  },
  stackoverflow: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  bio: {
    type: String,
  },
  projects: [
    {
      post: {
        type: Schema.Types.ObjectId,
        ref: "post",
      },
    },
  ],
  skills: {
    type: [String],
  },
  resume: {
    type: String,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
