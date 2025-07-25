import express from "express";
import Message from "../models/message.js";

const router = express.Router();

router.post("/getchats", async (req, res) => {
  try {
    const { sender, receiver, roomid } = req.body;
    console.log("chats are retrieving for ", sender, "to", receiver);
    let messages;

    if (roomid) {
      // Group chat
      messages = await Message.find({ roomid }).sort({ timestamp: 1 });
    } else {
      // 1-to-1 chat
      messages = await Message.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      }).sort({ timestamp: 1 });
    }
    res.json({ success: true, messages });
  } catch (error) {
    res.json({
      message: "An error occured at server side",
      error: error.message,
    });
  }
});

router.post("/send", async (req, res) => {
  try {
    const newmessage = await Message.create(req.body);
    res.json({ success: true, message: "message sent" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

export default router;
