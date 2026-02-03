const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUsers,
  updateUserAndBooking,
} = require("../controller/userController");

router.post("/userDetails", addUser);
router.get("/userDetails/:adminId", getAllUsers);
router.post("/editUserDetails/:userId", updateUserAndBooking);
module.exports = router;
