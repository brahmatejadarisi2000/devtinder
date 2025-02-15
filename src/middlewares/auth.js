const User = require('.././models/user');
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error('Authentication Failed');
    }
    const dockodedmsg = await jwt.verify(token, "teja2000")
    const { _id } = dockodedmsg;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error('Authentication Failed');
    }
    req.user = user;
    next();
  }
  catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { userAuth };
