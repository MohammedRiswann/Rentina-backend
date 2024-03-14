const jwt = require("jsonwebtoken");
const decodeSellerId = (request, response, next) => {
  try {
    console.log("decode");
    const token = request.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    request.token = decodedToken;
    next();
  } catch (err) {
    return response.status(500).json({ message: "internal server error" });
  }
};

module.exports = decodeSellerId;
