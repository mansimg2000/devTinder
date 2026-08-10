const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");


const isValid = (ALLOWED_UPDATES, data) => {
    console.log(Object.keys(data) , 'Object.keys(data)')
  let isValid = Object.keys(data).every((field) =>
    ALLOWED_UPDATES.includes(field),
  );
  return isValid;
};

const validateEditProfile = (data) => {
  const ALLOWED_UPDATES = [
    "age",
    "photoUrl",
    "firstName",
    "lastName",
    "skills",
    "about",
    "gender",
  ];
  return isValid(ALLOWED_UPDATES, data);
};

const validateEditPasswordRequest = (data) => {
  const ALLOWED_UPDATES = ["oldPassword", "newPassword"];
  return isValid(ALLOWED_UPDATES, data);
};

const validateForgotPasswordRequest = (data) => {
  const ALLOWED_UPDATES = ["email", "newPassword"];
  return isValid(ALLOWED_UPDATES, data);
};

const validateConnectionSendRequest = (data) => {
  const ALLOWED_REQUEST = ["interested", "ignored"];
  return isValid(ALLOWED_REQUEST, data);
};
const passwordUpdate = async (loggedInUser, newPassword) => {
  if (validator.isStrongPassword(newPassword)) {
    let newPasswordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      loggedInUser._id,
      { password: newPasswordHash },
      { runValidators: true },
    );
    return {
      message: "Password updated successfully!",
      status: "success",
    };
  } else {
    throw new Error("Password is not strong!");
  }
};

module.exports = {
  validateEditProfile,
  validateEditPasswordRequest,
  passwordUpdate,
  validateForgotPasswordRequest,
  validateConnectionSendRequest,
};
