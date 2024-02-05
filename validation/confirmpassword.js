function confirmPassword(request, response, next) {
  const { password, confirmPassword } = request.body;

  if (password !== confirmPassword) {
    response.json("password didnt matched");
  } else if (password == confirmPassword) {
    next();
  }
}

module.exports = confirmPassword;
