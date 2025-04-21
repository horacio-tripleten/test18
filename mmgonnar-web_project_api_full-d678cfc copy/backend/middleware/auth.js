require("dotenv").config();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(403).json({ message: "No autorizado" });
  }

  const token = authorization.replace("Bearer", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token Invalido" });
  }
};
