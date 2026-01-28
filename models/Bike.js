const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    location: { type: String, required: true },
    BikeType: { type: String, required: true },
    RatePerDay: { type: String, required: true },
    image: String,
    about: { type: String, required: true },
    bikeStatus: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bike", bikeSchema);
