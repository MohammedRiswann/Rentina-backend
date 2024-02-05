function validateSignup(request, response, next) {
  const { email, password } = request.body;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validMail = emailPattern.test(email);

  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const validPassword = passwordPattern.test(password);

  if (validPassword && validMail) {
    next();
  } else {
    response.status(400).json({ message: "invalid" });
  }
}

module.exports = validateSignup;
