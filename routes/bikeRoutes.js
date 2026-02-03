const express = require("express");
const router = express.Router();
const {
  createBike,
  getBikes,
  deleteBike,
  updateBike,
} = require("../controller/bikeController");

router.post("/add", createBike);
router.get("/fetchAllBike/:adminId", getBikes);
router.delete("/:id", deleteBike);
router.put("/:id", updateBike);

module.exports = router;
