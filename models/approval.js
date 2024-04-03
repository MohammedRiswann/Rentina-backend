const mongoose = require("mongoose");

const ApproveSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  productId: { type: mongoose.Types.ObjectId, required: true },
  images: {
    type: [String],
  },
  isVerified: { type: Boolean, default: false },
  isPending: { type: Boolean, default: true },
});

const Approval = mongoose.model("Approval", ApproveSchema);

module.exports = Approval;
