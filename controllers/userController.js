const Twilio = require("twilio");
const user = require("../models/user");
require("dotenv").config();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const otpSID = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.SERVICE_ID;
const jwtSecret = process.env.JWT_SECRET;

const twilio = Twilio(otpSID, token);

// This is the signup of the user
const userController = {
  Verification: async (request, response) => {
    console.log("sudais");
    const { firstName, lastName, email, phone, password } = request.body;
    console.log(email);
    console.log(phone, "phone");
    console.log(email, "email");

    // OTP verification
    try {
      const verification = await twilio.verify.v2
        .services(serviceId)
        .verifications.create({ to: `+91${phone}`, channel: "sms" });

      console.log(verification.status);
      response.json({ success: true });
    } catch (error) {
      console.log(error);
      response.json({ success: false });
    }
  },

  Register: async (request, response) => {
    const { firstName, lastName, email, phone, password, otp } = request.body;
    console.log(firstName);

    const hashed = await bcrypt.hash(password, 10);

    try {
      const verification_check = await twilio.verify.v2
        .services(serviceId)
        .verificationChecks.create({ to: `+91${phone}`, code: otp });

      console.log(verification_check.status);

      if (verification_check.status === "approved") {
        const newUser = new user({
          firstName,
          lastName,
          email,
          phone,
          password: hashed,
        });

        const savedUser = await newUser.save();
        const token = JWT.sign({ userId: savedUser }, jwtSecret, {
          expiresIn: "1hr",
        });
        console.log(token);
        response.status(200).json({ user: savedUser, success: true });
      } else {
        response
          .status(400)
          .json({ success: false, message: "OTP verification failed" });
        console.log("This is the case of wrong OTP");
      }
    } catch (error) {
      console.log(error);
      response
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  Login: async (request, response) => {
    const { phone, password } = request.body;

    try {
      const existingUser = await user.findOne({ phone });

      if (!existingUser) {
        return response
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!passwordMatch) {
        return response.status(402).json({
          success: false,
          message: "Incorrect password",
        });
      }
      const token = JWT.sign({ userId: existingUser._id }, jwtSecret, {
        expiresIn: "1hr",
      });
      console.log(token);
      response.status(200).json({ success: true, token, user: existingUser });
    } catch (error) {
      response.status(400).json({ success: false, message: "Error occured" });
    }
  },
};

module.exports = userController;
