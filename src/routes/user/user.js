const express = require("express");
const { userAuth } = require("../../middlewares/auth");
const connectionRequest = require("../../models/connectionRequest");
const router = express.Router();
const User = require('../../models/user')
const {ALLOWED_FIELDS} = require('../../untils/constants')


router.get("/user/request/received", userAuth, async (req, res) => {
  try {
    let loggedInuser = req.user;
    const data = await connectionRequest
      .find({ toUserId: loggedInuser._id, status: "interested" })
      .populate("fromUserId", "firstName lastName skills age gender photoUrl");
    res.json({ data, status: true });
  } catch (error) {
    res.status(400).json({ message: "Error " + error.message, status: false });
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    let loggedInuser = req.user._id;
    let connectionData = await connectionRequest
      .find({
        $or: [{ toUserId: loggedInuser }, { fromUserId: loggedInuser }],
      })
      .populate("fromUserId", ALLOWED_FIELDS)
      .populate("toUserId", ALLOWED_FIELDS);

    let data = connectionData.map((data) => {
      if (data.fromUserId.toString() === loggedInuser._id.toString()) {
        return data.toUserId;
      } else {
        return data.fromUserId;
      }
    });

    res.json({ data, status: true });
  } catch (error) {
    res.status(400).json({ message: "Error " + error.message, status: false });
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    let loggedInuser = req.user._id;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit
    let page = req.query.page || 1;
    let skip = (page-1) *limit;


    let connectionData = await connectionRequest
      .find({
        $or: [{ toUserId: loggedInuser }, { fromUserId: loggedInuser }],
      })

      let connectionDataSet = new Set()

     connectionData.forEach(connection => {
         connectionDataSet.add(connection.toUserId.toString())
        connectionDataSet.add(connection.fromUserId.toString())
    })

  let data =  await User.find({$and:[
        {_id: {$ne:loggedInuser}},
        {_id:{$nin:Array.from(connectionDataSet)}}
    ]}).select(ALLOWED_FIELDS).skip(skip).limit(limit)

    res.json({ data, status: true });
  } catch (error) {
    res.status(400).json({ message: "Error " + error.message, status: false });
  }
});

module.exports = router;
