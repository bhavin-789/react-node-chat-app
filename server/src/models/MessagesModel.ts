import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      required: true,
    },
    content: {
      type: String,
      required: function () {},
    },
  },
  { timestamps: true }
);

const MessageModel =
  mongoose.models.User || mongoose.model("Message", messagesSchema);

export default MessageModel;
