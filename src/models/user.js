const mongoose = require("mongoose");
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const GENDER_VALUES = ["male", "female", "other"];

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      requiredd: true,
      trim: true,
      minLength:2,
      maxLength:20
    },
    lastName: {
      type: String,
      trim: true,
      minLength:2,
      maxLength:20
    },
    gender: {
      type: String,
      requiredd: true,
      enum: {
        values: GENDER_VALUES,
        message: "{VALUE} is not supported",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if(!validator.isEmail(value)){
            throw new Error("Email is invalid!")
        }
      },
    },
    password: {
      type: String,
      requiredd: true,
      validate(value){
        if(!validator.isStrongPassword(value)){
             throw new Error("Password is not strong !")

        }
      }
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
      min: 1000000000,
      max: 9999999999,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    skills: {
      type: [String],
      validate: {
        validator(value) {
          return value?.length <= 10;
        },
        message: "Can not add more than 10 skills!",
      },
    },
    about: {
      type: String,
      default: function () {
        return `Hi this is ${this.firstName}.`;
      },
      trim: true,
    },
    photoUrl: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/9.x/adventurer/svg?seed=${this.firstName}`;
      },
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function (){
    let user = this
     let token = await jwt.sign({_id:user._id , maxAge:"7d"} , "DevTinder@Mansisinma@19")
     return token;
}

userSchema.methods.validatePassword = async function (userPassword) {
   let user = this
    let isValidPassword = await bcrypt.compare(userPassword ,user.password)
    return isValidPassword
}

module.exports = mongoose.model("User", userSchema);
