const Twilio = require("twilio");
const seller = require("../models/seller");
require("dotenv").config();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const otpSID = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.SERVICE_ID;
const jwtSecret = process.env.JWT_SECRET;

const twilio = Twilio(otpSID, token);
const sellerController = {
  Verification: async (request, response) => {
    console.log("-----------worked first-------------");
    console.log(request.body);
    const { firstName, lastName, email, phone, password } = request.body;
    console.log(firstName);
    console.log(phone);
    const existingUser = await seller.findOne({ phone });

    // OTP verification
    try {
      if (existingUser) {
        response
          .status(400)
          .json({ message: `User with this ${phone} already exists! ` });
      } else {
        console.log("-------else part---------");
        const verification = await twilio.verify.v2
          .services(serviceId)
          .verifications.create({ to: `+91${phone}`, channel: "sms" });

        console.log(verification.status);
        response.json({ success: true, type: "seller" });
      }
    } catch (error) {
      console.log(error);
      response.json({ success: false });
    }
  },
  sellerRegister: async (request, response) => {
    const { firstName, lastName, email, phone, password, otp } = request.body;
    console.log(firstName);

    const hashed = await bcrypt.hash(password, 10);

    try {
      const verification_check = await twilio.verify.v2
        .services(serviceId)
        .verificationChecks.create({ to: `+91${phone}`, code: otp });

      console.log(verification_check.status);

      if (verification_check.status === "approved") {
        console.log("entered");
        const newUser = new seller({
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

        response
          .status(200)
          .json({ user: savedUser, success: true, type: "seller", token });
        //   } else {
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
      const existingUser = await seller.findOne({ phone });

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
      response
        .status(200)
        .json({ success: true, token, seller: existingUser, type: "seller" });
    } catch (error) {
      response.status(400).json({ success: false, message: "Error occured" });
    }
  },
};

module.exports = sellerController;
