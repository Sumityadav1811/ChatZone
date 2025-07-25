import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String },
});

export default mongoose.model("User", userSchema);
