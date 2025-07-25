import express from "express";
import User from "../models/user.js";
import Room from "../models/Room.js";
import message from "../models/message.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { user_name } = req.body;
    const user = await User.findOne({ user_name });
    if (user) {
      res.json({ message: "Already Registered with this username" });
    } else {
      const newuser = await User.create(req.body);

      res.json({
        message: "user registered successfully",
        user: newuser,
        success: true,
      });
    }
  } catch (error) {
    console.log("error is", error.message);
    res.json({ message: "error occured at server" });
  }
});
router.post("/signin", async (req, res) => {
  try {
    const user_name = req.body.user_name;
    const userA = await User.findOne({ user_name });

    if (userA) {
      if (userA.password == req.body.password) {
        const { password: _, ...safeUser } = userA._doc;
        res.json({
          user: safeUser,
          success: true,
        });
      } else {
        res.json({ message: "Password Is Incorrect", success: false });
      }
    } else {
      res.json({ message: "No registered User", success: false });
    }
  } catch (error) {
    res.json({
      success: false,
      message: "Error occured in Server",
      error: error.message,
    });
  }
});

router.post("/getusers", async (req, res) => {
  try {
    const userid = req.body.id;
    console.log(userid);
    const data = await User.find({
      _id: { $ne: userid },
    });

    res.json({ message: "users fetched succesfully", data, success: true });
  } catch (error) {
    console.log("in error ", error.message);
    res.json({
      success: false,
      message: "An Error in Server side",
      error: error.message,
    });
  }
});
export default router;
