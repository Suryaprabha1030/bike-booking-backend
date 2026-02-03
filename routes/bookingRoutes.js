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
router.get("/getBookings/:adminId", getBookings);
router.put("/:id", updateBooking);
router.post("/user-booking/:user", fetchBookData);
router.get("/amount-analytics", getAmountAnalytics);
module.exports = router;
