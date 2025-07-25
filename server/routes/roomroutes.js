import express from "express";
import Room from "../models/Room.js";

const router = express.Router();
router.post("/createroom", async (req, res) => {
  const { name, userIds } = req.body;
  try {
    const room = new Room({ name, users: userIds });
    await room.save();
    res.status(201).json({ success: true, room });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/getrooms/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Room.find({ users: userId });
    res.json({ groups, message: "Groups fetched successfully", success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Error in server side" });
  }
});

export default router;
