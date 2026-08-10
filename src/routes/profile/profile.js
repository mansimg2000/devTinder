const express = require("express");
const User = require("../../models/user");
const { userAuth } = require("../../middlewares/auth");
const {
  validateEditProfile,
  validateEditPasswordRequest,
  passwordUpdate,
  validateForgotPasswordRequest
} = require("../../untils/validations");
const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user;
    if (loggedInUser) {
      res.json({data: loggedInUser , status:true});
    } else {
     res.status(401).json({message: "Session expired please login again!" , status:false});
    }
  } catch (error) {
    res.send(error.message);
  }
});

router.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users?.length !== 0) {
      res.send(users);
    } else {
      res.send("No data exists!");
    }
  } catch (err) {
    res.status(400).send("something went wrong!: " + err.message);
  }
});

router.delete("/user", async (req, res) => {
  try {
    let { userId } = req.body;
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully!");
  } catch (err) {
    res.status(400).send("something went wrong!: " + err.message);
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    let userId = req.user._id;
    let data = req.body;
    if (validateEditProfile(data)) {
      let updatesRes = await User.findByIdAndUpdate(
        userId,
        data,
        { isAfter: true },
        { runValidators: true },
      );
      res.json({
        message: "User updated successfully!",
        data: updatesRes,
        status: "success",
      });
    } else {
      throw new Error("Update not allowed!");
    }
  } catch (err) {
    res.status(400).send("something went wrong!: " + err.message);
  }
});

router.patch("/profile/password", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user;
    let data = req.body;
    if (validateEditPasswordRequest(data)) {
      let oldPassword = data.oldPassword;
      let newPassword = data.newPassword;

      let isOldPasswordValid = await loggedInUser.validatePassword(oldPassword);

      if (isOldPasswordValid) {
      res.send(await passwordUpdate(loggedInUser , newPassword))
      } else {
        throw new Error("Old password is not correct!");
      }
    } else {
      throw new Error("Update not allowed!");
    }
  } catch (err) {
    res.status(400).send("something went wrong!: " + err.message);
  }
});
router.patch("/profile/password/forgot", userAuth, async (req, res) => {
  try {
    let loggedInUser = req.user;
    let data = req.body;
    if (validateForgotPasswordRequest(data)) {
      let email = data.email;
      let newPassword = data.newPassword;
      let isEmailValid = loggedInUser.email===email;

      console.log({isEmailValid})

      if (isEmailValid) {
        res.send(await passwordUpdate(loggedInUser , newPassword))
      } else {
        throw new Error("Email is not correct!");
      }
    } else {
      throw new Error("Update not allowed!");
    }
  } catch (err) {
    res.status(400).send("something went wrong!: " + err.message);
  }
});

module.exports = router;
