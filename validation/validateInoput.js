const { response } = require("express");

function validateInput(request, response, next) {
  const { firstName, lastName, email, phone, password, confirmPassword } =
    request.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    response
      .status(400)
      .json({ succes: false, message: "all fields are required" });
  } else {
    next();
  }
}

module.exports = validateInput;
