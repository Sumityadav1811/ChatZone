import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    roomid: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    content: { type: String, required: true },
    status: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
