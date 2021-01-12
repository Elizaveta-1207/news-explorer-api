/* eslint-disable consistent-return */
/* eslint-disable comma-dangle */
const jwt = require("jsonwebtoken");
const UnauthError = require("../errors/UnauthError");

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace("Bearer ", "");

// const handleAuthError = (res) => {
//   res.status(401).send({ message: "Необходимо авторизироваться" });
// };

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // console.log(req.headers);
  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res.status(401).send({ message: "Необходимо авторизироваться" });
    return next(new UnauthError("Необходимо авторизироваться"));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(
      token,
      // временно!!!
      // "super-strong-secret"
      `${NODE_ENV === "production" ? JWT_SECRET : "dev-secret"}`
    );
  } catch (err) {
    // return handleAuthError(res);
    next(new UnauthError("Необходимо авторизироваться"));
  }

  req.user = payload;

  next();
};
