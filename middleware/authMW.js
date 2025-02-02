const JWT = require("jsonwebtoken");
const { JWTKey } = require("../config/config");

module.exports = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) {
    res.json("No token provided");
    return;
  }
  const decodedToken = JWT.verify(token, JWTKey);
  req.user = decodedToken;
  next();
};
