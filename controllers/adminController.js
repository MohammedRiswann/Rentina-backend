const { request, response } = require("express");
const Seller = require("../models/seller");
const Apartments = require("../models/apartments");
const Lands = require("../models/lands");
const sellerProfile = require("../models/seller-profile");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const user = require("../models/user");
const gmailPass = process.env.GMAIL_PASS;

const adminController = {
  getSeller: async (request, response) => {
    try {
      const sellers = await Seller.find();
      response.json(sellers);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
  getProfile: async (request, response) => {
    try {
      const sellerId = request.params.userId;
      const sellerProfile = await Seller.findById(sellerId);

      if (!sellerProfile) {
        response.status(404).json({ message: "No such user found" });
      }
      response.json(sellerProfile);
    } catch (error) {
      console.log(error);
    }
  },
  getAllApartments: async (request, response) => {
    console.log("hello world");

    const { userId } = request.params;
    const apartments = await Apartments.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "userId",
          foreignField: "userId",
          as: "products",
        },
      },
    ]);
    response.json(apartments);
  },
  getAllLands: async (request, response) => {
    const { userId } = request.params;
    const lands = await Lands.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "lands",
          localField: "userId",
          foreignField: "userId",
          as: "lands",
        },
      },
    ]);
    response.json(lands);
  },
  apartmentDetails: async (request, response) => {
    try {
      const apartmentId = request.params.apartmentId;
      const apartmentDetails = await Apartments.findById(apartmentId);

      if (!apartmentDetails) {
        response.status(404).json({ message: "No such apartment found" });
      }
      response.json(apartmentDetails);
    } catch (error) {
      console.log(error);
    }
  },
  landDetails: async (request, response) => {
    try {
      console.log("hello");
      const landId = request.params.landId;
      console.log(landId);
      const landDetails = await Lands.findById(landId);

      if (!landDetails) {
        response.status(404).json({ message: "No such Lands found" });
      }
      response.json(landDetails);
    } catch (error) {
      console.log(error);
    }
  },
  pendingApproval: async (request, response) => {
    try {
      const seller = await Seller.aggregate([
        {
          $match: { isVerified: false },
        },
      ]);
      response.json(seller);
    } catch (error) {
      console.log(error);
    }
  },
  approveSeller: async (request, response) => {
    try {
      const sellerId = request.params.sellerId;

      const updatedSeller = await Seller.findByIdAndUpdate(
        sellerId,
        { isVerified: true },
        { new: true }
      );

      if (!updatedSeller) {
        return response.status(404).json({ message: "No such user found" });
      }

      return response.json(updatedSeller);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Internal server error" });
    }
  },
  sendEmail: async (request, response) => {
    const { sellerId } = request.body;

    const sellerDetails = await Seller.findById(sellerId);

    if (!sellerDetails) {
      return response
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    const sellerName = `${sellerDetails.firstName} ${sellerDetails.lastName}`;
    const sellerMail = sellerDetails.email;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "riswan14.rm@gmail.com",
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: "riswan14.rm@gmail.com",
      to: sellerMail,
      subject: "Seller Approval Notification",
      text: ` Dear ${sellerName},
     We are pleased to inform you that your seller account has been approved. You can now start selling your products on our platform.
      Thank you for choosing us.
      Best regards,<br>Rentina PVT LTD`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        response
          .status(500)
          .json({ success: false, message: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        response
          .status(200)
          .json({ success: true, message: "Email sent successfully" });
      }
    });
  },
  deleteLand: async (request, response) => {
    const id = request.params.id;
    console.log(id);
    console.log("works");

    try {
      await Lands.findByIdAndDelete(id);
      response.status(200).json("Successfully deleted");
    } catch (error) {
      console.error("Error deleting apartment:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
  getUserList: async (request, response) => {
    try {
      const users = await user.find();
      response.json(users);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
  BlockAndUnblock: async (request, response) => {
    const id = request.params.id;
    const status = request.body.status;

    try {
      const updatedUser = await user.findByIdAndUpdate(
        id,
        { isBlocked: status === "block" ? true : false },
        { new: true }
      );

      if (!updatedUser) {
        return response.status(404).json({ error: "User not found" });
      }

      response.status(200).json({
        message: "User block status updated successfully",
        seller: updatedUser,
      });
    } catch (error) {
      console.error("Error updating User block status:", error);
      response.status(500).json({ error: "Internal server error" });
    }
  },
  getUserProfile: async (request, response) => {
    try {
      const userId = request.params.userId;
      const userProfile = await user.findById(userId);

      if (!userProfile) {
        response.status(404).json({ message: "No such user found" });
      }
      response.json(userProfile);
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = adminController;
