const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    user: { type: String, required: true },
    bikeType: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    modeOfRental: { type: String, required: true },
    modeOfPayment: { type: String, required: true },
    duration: { type: String, required: true },
    amount: { type: Number, required: true },
    booking: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    amountStatus: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
