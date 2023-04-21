const jwt = require("jsonwebtoken");
const User = require("../Models/userSchema");

const auth = async (req, res, next) => {
  let token;
  let decoded;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json({
        message: "Token has expired!",
        message2: `Message: ${error.message}`,
        message3: req.user,
        message4: (res.json = error.message),
      });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Unauthorized! No token provided!" });
  }
};

module.exports = { auth };
