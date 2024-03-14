const Twilio = require("twilio");
const seller = require("../models/seller");
require("dotenv").config();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Products = require("../models/apartments");
const Lands = require("../models/lands");
const { findByIdAndDelete } = require("../models/user");
const products = require("../models/apartments");
const profile = require("../models/seller-profile");
const { default: mongoose } = require("mongoose");
const lands = require("../models/lands");

const otpSID = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.SERVICE_ID;
const jwtSecret = process.env.JWT_SECRET;

const twilio = Twilio(otpSID, token);
const sellerController = {
  Verification: async (request, response) => {
    const { firstName, lastName, email, phone, password } = request.body;

    try {
      // Check if user already exists
      const existingUser = await seller.findOne({ phone });
      console.log("hello back");

      if (existingUser) {
        // User already exists
        return response.status(400).json({
          success: false,
          message: `User with this ${phone} already exists!`,
        });
      }

      let fileUrl = "";

      if (request.file && request.file.location) {
        fileUrl = request.file.location;
      }

      // Send OTP verification
      const verification = await twilio.verify.v2
        .services(serviceId)
        .verifications.create({ to: `+91${phone}`, channel: "sms" });

      if (!verification) {
        // If OTP sending failed, return error response
        return response.status(400).json({
          success: false,
          message: "Failed to send verification code",
        });
      }

      // Generate JWT token
      const token = JWT.sign(
        { firstName, lastName, email, phone, password, fileUrl },
        jwtSecret,
        {
          expiresIn: "1hr",
        }
      );

      // User created successfully, return success response with JWT token
      return response.status(200).json({
        success: true,
        message: "User created successfully and verification code sent",
        token: token,
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
    try {
      const { firstName, lastName, email, password, fileUrl, phone } =
        request.token;
      const { otp } = request.body;
      const hashed = await bcrypt.hash(password, 10);
      const verification_check = await twilio.verify.v2
        .services(serviceId)
        .verificationChecks.create({ to: `+91${phone}`, code: otp });

      if (verification_check.status === "approved") {
        console.log("entered");

        // Create a new seller instance
        const newSeller = new seller({
          firstName,
          lastName,
          email,
          phone,
          password: hashed,
          profileImage: fileUrl,
          isVerified: false,
          isBlocked: false,
        });

        // Save the new seller to the database
        const savedSeller = await newSeller.save();

        // Generate JWT token
        const token = JWT.sign({ userId: savedSeller._id }, jwtSecret, {
          expiresIn: "1hr",
        });

        return response.status(200).json({
          success: true,
          message: "Seller registration successful",
          token: token,
          seller: savedSeller,
          type: "seller",
        });
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
      if (!existingUser.isVerified) {
        return response.status(401).json({
          success: false,
          message: "Seller is not verified, Contact Admin!",
        });
      }
      if (existingUser.isBlocked) {
        return response.status(401).json({
          success: false,
          message: "You are blocked  ! Contact the ADMIN",
        });
      }

      // Generate JWT token
      const token = JWT.sign({ userId: existingUser._id }, jwtSecret, {
        expiresIn: "1hr",
      });

      // Return success response with JWT token
      response
        .status(200)
        .json({ success: true, token, seller: existingUser, type: "seller" });
    } catch (error) {
      response.status(400).json({ success: false, message: "Error occurred" });
    }
  },

  addProducts: async (request, response) => {
    try {
      const { name, price, description, features, type, location, role } =
        request.body;

      const userId = request.token.userId;
      console.log(request.token.userId);
      let productUrl = [];

      if (request.files) {
        console.log("hey");
        const url = request.files.forEach((m) => {
          console.log(m.location);
          productUrl.push(m.location);
        });
        console.log(productUrl);
      }

      const products = new Products({
        userId,
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
      console.log("hello");
      const userId = request.token.userId;
      const { name, price, description, features, type, location, role } =
        request.body;
      if (
        !name ||
        !price ||
        !description ||
        !features ||
        !type ||
        !location ||
        !role
      ) {
        return response.status(400).json({ error: "All fields are required" });
      }
      let landUrl = [];

      if (request.files) {
        console.log("heylooo");
        const url = request.files.forEach((m) => {
          console.log(m.location);
          landUrl.push(m.location);
        });
        console.log(landUrl);
      }

      const lands = new Lands({
        userId,
        name,
        price,
        images: landUrl,
        description,
        features,
        type,
        location,
        role,
      });
      await lands.save();
      response.status(201).json({ message: "Product added successfully" });
    } catch (error) {
      console.error("Error adding lands", error);
      response.status(500).json({ error: "Internal servero error" });
    }
  },
  getAllApartments: async (request, response) => {
    const userId = request.params.userId;
    console.log(userId);

    try {
      const list = await Products.find({ userId }).select(
        "_id name price location"
      );
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
    console.log("heloooo");
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
  updateProperty: async (request, response) => {
    const { id } = req.params;
    const updatedDetails = req.body;

    try {
      // Find the property by ID and update its details
      const property = await Property.findByIdAndUpdate(id, updatedDetails, {
        new: true,
      });

      if (!property) {
        return response.status(404).json({ message: "Property not found" });
      }

      res.json({ message: "Property details updated successfully", property });
    } catch (error) {
      console.error("Error updating property details:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  getAllLands: async (request, response) => {
    const userId = request.params.userId;
    try {
      const list = await lands
        .find({ userId })
        .select("_id name price location");
      if (!list) {
        console.log(error);
      } else {
        console.log(list);
        response.status(200).json(list);
      }
    } catch (error) {
      console.error("Error retrieving apartments:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
  getProfile: async (request, response) => {
    console.log(request.token.userId);
    const userId = new mongoose.Types.ObjectId(request.token.userId);
    const sellers = await seller.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $lookup: {
          from: "sellerprofiles",
          localField: "_id",
          foreignField: "userId",
          as: "profile",
        },
      },
    ]);
    // console.log(sellers[0].profile);

    response.json(sellers);
  },

  addProfile: async (request, response) => {
    console.log(request.body, "fhdsh");

    try {
      // Assuming request.body contains the data for the new profile
      const { firstName, lastName, email, phone, country, state } =
        request.body;
      userId = request.token.userId;
      await profile.updateOne(
        {
          userId: userId,
        },
        {
          $set: {
            country,
            state,
          },
        },
        {
          upsert: true,
        }
      );
      await seller.updateOne(
        {
          _id: userId,
        },
        {
          $set: {
            firstName,
            lastName,
            email,
            phone,
          },
        }
      );

      response.status(201).json({ message: "Profile added successfully" });
    } catch (error) {
      console.error("Error adding profile:", error);
      response.status(500).json({ error: "Failed to add profile" });
    }
  },
  getLandDetails: async (request, response) => {
    console.log("hel");
    const id = request.params.id;
    console.log(id);
    try {
      const land = await lands.findById(id);
      if (!land) {
        return response.status(404).json({ error: "Product not found" });
      }
      response.status(200).json(land);
    } catch (error) {
      console.error("Error retrieving product details:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
  deleteLand: async (request, response) => {
    const id = request.params.id;

    try {
      await lands.findByIdAndDelete(id);
      response.status(200).json("Successfully deleted");
    } catch (error) {
      console.error("Error deleting apartment:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
  BlockAndUnblock: async (request, response) => {
    const id = request.params.id;
    const status = request.body.status; // 'block' or 'unblock'

    try {
      const updatedSeller = await seller.findByIdAndUpdate(
        id,
        { isBlocked: status === "block" ? true : false },
        { new: true }
      );

      if (!updatedSeller) {
        return response.status(404).json({ error: "Seller not found" });
      }

      response.status(200).json({
        message: "Seller block status updated successfully",
        seller: updatedSeller,
      });
    } catch (error) {
      console.error("Error updating seller block status:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = sellerController;
