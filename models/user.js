const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: { type: String, required: true },
    address: { type: String, required: true },
    proofType: { type: String, required: true },
    // proofNumber: { type: String },
    image: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("user", userSchema);
