const Twilio = require("twilio");
const user = require("../models/user");
require("dotenv").config();

const otpSID = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.SERVICE_ID;

const twilio = Twilio(otpSID, token);

// This is the signup of the user
const userController = {
  userSignUp: async (request, response) => {
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

  userSuccess: async (request, response) => {
    const { firstName, lastName, email, phone, password, otp } = request.body;
    console.log(firstName);

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
          password,
        });

        const savedUser = await newUser.save();
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
};

module.exports = userController;
