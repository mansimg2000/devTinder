const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
  try {
    let token = req.cookies.authToken;
    if (!token) {
    return res.status(401).json({message: "Unauthorized Access!" , status:false});
    }else{
    let decodedObj = await jwt.verify(token, "DevTinder@Mansisinma@19");

    let _id = decodedObj._id;
    let user = await User.findById({ _id });
    if(!user){
      throw new Error('User not found!')
    }else{
      req.user = user;
      next();
    }
    }
  } catch (error) {
    res.status(400).send("ERROR: "+error.message)
  }
};

module.exports = { userAuth };
