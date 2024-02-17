const Twilio = require("twilio");
const seller = require("../models/seller");
require("dotenv").config();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Products = require("../models/apartments");
const Lands = require("../models/lands");
const { findByIdAndDelete } = require("../models/user");
const products = require("../models/apartments");

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
    console.log(request.file);

    try {
      // Check if user already exists
      const existingUser = await seller.findOne({ phone });

      if (existingUser) {
        console.log("ex");
        // User already exists, return error response
        return response.status(400).json({
          success: false,
          message: `User with this ${phone} already exists!`,
        });
      }

      let fileUrl = "";
      console.log("hello");

      if (request.file && request.file.location) {
        console.log("hey");
        fileUrl = request.file.location; // Assign the file location to fileURL
        console.log(fileUrl);
      }

      // Create a new user instance
      const newUser = new seller({
        firstName,
        lastName,
        email,
        phone,
        password,
        isVerified: false,
        profileImage: fileUrl,
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      // Send OTP verification
      const verification = await twilio.verify.v2
        .services(serviceId)
        .verifications.create({ to: `+91${phone}`, channel: "sms" });

      console.log("verification", verification.status);

      if (!verification) {
        // If OTP sending failed, return error response
        return response.status(400).json({
          success: false,
          message: "Failed to send verification code",
        });
      }

      // User created successfully, return success response
      return response.status(200).json({
        success: true,
        message: "User created successfully and verification code sent",
        user: savedUser,
      });
    } catch (error) {
      console.log(error, "error caught");
      return response.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  sellerRegister: async (request, response) => {
    console.log("entered to seller regisyter");
    const { phone, otp } = request.body;
    console.log(phone);

    try {
      const existingUser = await seller.findOne({ phone });

      const verification_check = await twilio.verify.v2
        .services(serviceId)
        .verificationChecks.create({ to: `+91${phone}`, code: otp });

      console.log(verification_check.status);

      if (verification_check.status === "approved") {
        console.log("entered");

        // Update the user's isVerified field to true
        existingUser.isVerified = true;
        const savedUser = await existingUser.save();

        // return response.status(200).json({
        //   success: true,
        //   message: "OTP verification successful",
        // });

        // const savedUser = await newUser.save();
        const token = JWT.sign({ userId: savedUser }, jwtSecret, {
          expiresIn: "1hr",
        });

        return response
          .status(200)
          .json({ user: savedUser, success: true, type: "seller", token });
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
  addProducts: async (request, response) => {
    try {
      const { name, price, description, features, type, location, role } =
        request.body;
      console.log(request.body);
      let productUrl = [];
      console.log(request.files);

      if (request.files) {
        console.log("hey");
        const url = request.files.forEach((m) => {
          console.log(m.location);
          productUrl.push(m.location);
        });
        console.log(productUrl);
      }

      const products = new Products({
        name,
        price,
        images: productUrl,
        description,
        features,
        type,
        location,
        role,
      });
      await products.save();
      response.status(201).json({ message: "Product added successfully" });
    } catch (error) {
      console.error("Error adding product:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
  addLands: async (request, response) => {
    try {
      const { name, price } = request.body;
      console.log(request.body);
      let landUrl = [];
      console.log(request.files);

      if (request.files) {
        console.log("hey");
        const url = request.files.forEach((m) => {
          console.log(m.location);
          landUrl.push(m.location);
        });
        console.log(landUrl);
      }

      const lands = new Lands({
        name,
        price,
        images: productUrl,
        description,
        features,
        type,
        location,
        role,
      });
      await lands.save();
      response.status(201).json({ message: "Product added successfully" });
    } catch (error) {
      console.error("Error adding product:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
  getAllApartments: async (request, response) => {
    try {
      const list = await Products.find().select("_id name price location");
      if (!list) {
        console.log(error);
      } else {
        response.status(200).json(list);
      }
    } catch (error) {
      console.error("Error retrieving apartments:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },

  deleteApartment: async (request, response) => {
    const id = request.params.id;
    console.log(id);

    try {
      await products.findByIdAndDelete(id);
      response.status(200).json("Successfully deleted");
    } catch (error) {
      console.error("Error deleting apartment:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
  getProductDetails: async (request, response) => {
    console.log("hel");
    const id = request.params.id;
    console.log(id);
    try {
      const product = await Products.findById(id);
      if (!product) {
        return response.status(404).json({ error: "Product not found" });
      }
      response.status(200).json(product);
    } catch (error) {
      console.error("Error retrieving product details:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = sellerController;
