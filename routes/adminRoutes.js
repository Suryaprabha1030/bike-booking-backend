const express = require("express");
const router = express.Router();
const { createAdmin, loginAdmin } = require("../controller/adminController");

router.post("/create", createAdmin);
router.post("/login", loginAdmin);

module.exports = router;
