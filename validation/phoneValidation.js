function phoneValidation(request, response, next) {
  const { phone } = request.body;

  const phonePattern = /^[0-9]{10}$/;
  const validPhone = phonePattern.test(phone);

  if (!validPhone) {
    response
      .ststus(400)
      .json({ success: false, message: "wrong phone number" });
  } else if (validPhone) {
    next();
  }
}

module.exports = phoneValidation;
