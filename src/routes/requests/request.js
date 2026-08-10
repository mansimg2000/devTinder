const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const { userAuth } = require("../../middlewares/auth");
const ConnectionRequest = require('../../models/connectionRequest')

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;
    const status = req.params.status;
     const ALLOWED_REQUEST = ["interested", "ignored"];

    if (!ALLOWED_REQUEST.includes(status)) {
      throw new Error("Incorrect status type!");
    }

    let isRequestExist = await ConnectionRequest.exists({
      $or: [
        { toUserId, fromUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });

    if (isRequestExist) {
      throw new Error("Request already exists!");
    }
    let connectionRequest = new ConnectionRequest({ toUserId, fromUserId, status });
    await connectionRequest.save();
    res.json({
      message: "Request sent successfully!",
      status: true,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: false,
    });
  }
});

router.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const status = req.params.status;
    const loggedInUserId = req.user._id
     const ALLOWED_REQUEST = ["accepted", "rejected"];

    if (!ALLOWED_REQUEST.includes(status)) {
      throw new Error("Incorrect status type!");
    }

  let connectionRequest = await ConnectionRequest.findOne({_id:requestId , toUserId:loggedInUserId , status:"interested"})
  if(!connectionRequest){
    throw new Error("Connection request not found!");
  }else{
     connectionRequest.status = status
     await connectionRequest.save()
     res.json({
      message: `Request ${status} successfully!`,
      status: true,
    });
  }

  } catch (error) {
    res.status(400).json({
      message: error.message,
      status: false,
    });
  }
});

module.exports = router
