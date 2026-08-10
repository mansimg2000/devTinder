const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../../models/user");
const { ALLOWED_FIELDS } = require("../../untils/constants");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const data = req.body;
  if (data?.skills?.length > 10) {
    throw new Error("Can not add more than 10 skils!");
  } else {
    try {
      let password = req.body.password;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ ...data, password: passwordHash });
      await user.save();
      res.send("User created successfully!");
    } catch (err) {
      res.status(400).send("Error creating user: " + err.message);
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    } else {
      let userData = await User.findOne({ email });
      if (!userData) {
        throw new Error("User not found!");
      } else {
        //validatePassword: this is a schema methond
        let isValidPassword = await userData.validatePassword(password);

        if (isValidPassword) {
          //generate JWT token
          let token = await userData.getJWT();
          res.cookie("authToken", token, {
            maxAge: 7 * 60 * 60 * 1000,
            httpOnly: true,
          });
          const { password, __v, updatedAt, createdAt, ...rest } =
            userData.toObject();
          res.json({ data: rest , status:true });
        } else {
         return res.json({ message:"Invalid credentials", status:false });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message:error.message, status:false })
  }
});

router.post("/logout", (req, res) => {
  res.cookie("authToken", null, { maxAge: Date.now() });
  res.send("User logged out successfully!");
});
module.exports = router;
