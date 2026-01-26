const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  updateBooking,
  fetchBookData,
  getAmountAnalytics,
} = require("../controller/bookingController");

router.post("/createBooking", createBooking);
router.post("/getBookings", getBookings);
router.put("/:id", updateBooking);
router.get("/user-booking/:user", fetchBookData);
router.get("/amount-analytics", getAmountAnalytics);
module.exports = router;
