const Twilio = require("twilio");
const user = require("../models/user");
require("dotenv").config();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Apartment = require("../models/apartments");

const otpSID = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.SERVICE_ID;
const jwtSecret = process.env.JWT_SECRET;

const twilio = Twilio(otpSID, token);

// This is the signup of the user
const userController = {
  Verification: async (request, response) => {
    const { firstName, lastName, email, phone, password } = request.body;
    const existingUser = await user.findOne({ phone });

    // OTP verification
    try {
      if (existingUser) {
        response.status(400).json({
          message: `User with this ${phone} already exists!`,
        });
      } else {
        console.log("hello");
        const verification = await twilio.verify.v2
          .services(serviceId)
          .verifications.create({ to: `+91${phone}`, channel: "sms" });

        console.log(verification.status);
        response.json({ success: true, type: "user" });
      }
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
          isVerified: false,
          isAdmin: false,
          isBlocked: false,
        });

        const savedUser = await newUser.save();
        const token = JWT.sign({ userId: savedUser }, jwtSecret, {
          expiresIn: "1hr",
        });

        response
          .status(200)
          .json({ user: savedUser, success: true, token, type: "user" });
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
      if (existingUser.isAdmin) {
        // Redirect to homepage for admin
        return response.status(200).json({
          success: true,
          message: "Redirect to homepage",
          isAdmin: true,
          type: "admin",
        });
      }
      if (existingUser.isBlocked) {
        return response.status(401).json({
          success: false,
          message: "You are blocked  ! Contact the ADMIN",
        });
      }
      const token = JWT.sign({ userId: existingUser._id }, jwtSecret, {
        expiresIn: "1hr",
      });

      response
        .status(200)
        .json({ success: true, token, user: existingUser, type: "user" });
    } catch (error) {
      response.status(400).json({ success: false, message: "Error occured" });
    }
  },

  propertyList: async (request, response) => {
    try {
      const { query, location, minPrice, maxPrice, type } = request.query;

      let apartmentsQuery = {};

      if (query) {
        apartmentsQuery.$or = [
          { name: { $regex: new RegExp(query, "i") } },
          { location: { $regex: new RegExp(query, "i") } },
        ];
      }
      if (location) {
        apartmentsQuery.location = { $regex: new RegExp(location, "i") };
      }
      if (minPrice && !maxPrice) {
        apartmentsQuery.price = { $gte: minPrice };
      } else if (!minPrice && maxPrice) {
        apartmentsQuery.price = { $lte: maxPrice };
      } else if (minPrice && maxPrice) {
        apartmentsQuery.price = { $gte: minPrice, $lte: maxPrice };
      }

      if (type) {
        apartmentsQuery.type = type.toLowerCase(); // Assuming type is stored in lowercase
      }

      const apartments = await Apartment.find(apartmentsQuery);

      response.json(apartments);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
  apartmentDetails: async (request, response) => {
    try {
      const apartmentId = request.params.userId;

      const apartmentDetails = await Apartment.findById(apartmentId);
      response.json(apartmentDetails);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = userController;
