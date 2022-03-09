const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  users: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  admin: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  stack: [String],
  title: {
    type: String,
    required: true,
  },
  kanban: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      task: {
        type: String,
      },
      status: {
        type: String,
      },
    },
  ],
  desc: {
    type: String,
    required: true,
  },
  files: [String],
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("post", PostSchema);
