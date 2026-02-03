const Booking = require("../models/Booking");
const User = require("../models/user");

exports.createBooking = async (req, res) => {
  try {
    const {
      adminId,
      user,
      bikeType,
      modeOfRental,
      modeOfPayment,
      duration,
      amountPaid,
      amount,
      booking,
      fromDate,
      toDate,
      amountStatus,
    } = req.body;

    const bike = await Booking.create({
      adminId,
      user,
      bikeType,
      modeOfRental,
      modeOfPayment,
      duration,
      amount,
      amountPaid,
      booking,
      fromDate,
      toDate,
      amountStatus,
    });

    res.status(201).json({
      success: true,
      message: "Bike added successfully",
      data: bike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getBookings = async (req, res) => {
  try {
    const { adminId } = req.params;
    const bookingData = await Booking.find({ adminId }); // fetch all bikes
    res.status(200).json({
      success: true,
      data: bookingData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateBooking = async (req, res) => {
  try {
    const id = req.params.id || req.body.id;
    const { adminId } = req.body;
    console.log(adminId, "adminId");
    if (!id || !adminId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    // ✅ Fields that are allowed to be added or overwritten
    const allowedFields = [
      "booking",
      "modeOfRental",
      "modeOfPayment",
      "amount",
      "duration",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      {
        _id: id,
        adminId, // 🔐 admin ownership check
      },
      updateData, // 🔥 add OR overwrite happens here
      {
        new: true,
        runValidators: true,
      },
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.updateBooking = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // const { location, BikeType, RatePerDay, image, about, bikeStatus } =
//     //   req.body;
//     const updateData = { ...req.body };

//     const bookingStatus = await Booking.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true } // return updated document
//     );

//     if (!bookingStatus) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Booking  not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Booking status updated successfully",
//       data: bike,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

exports.fetchBookData = async (req, res) => {
  try {
    const { user } = req.params;
    const { adminId } = req.body;
    if (!user || !adminId) {
      return res.status(400).json({
        success: false,
        message: "user and adminId are required",
      });
    }

    const data = await User.aggregate([
      {
        $match: { user: user }, // explicit match
      },
      {
        $lookup: {
          from: "bookings", // Mongo collection name
          localField: "user",
          foreignField: "user",
          as: "bookingDetails",
        },
      },
      {
        $unwind: {
          path: "$bookingDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (!data.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// exports.getAmountAnalytics = async (req, res) => {
//   try {
//     const { type, adminId } = req.query;
//     console.log(adminId, "adminId");
//     // const adminId = req.body?.adminId; // assuming POST with body
//     // Or, if GET + query param:
//     // const adminId = req.query.adminId;

//     if (!adminId) {
//       return res.status(400).json({ error: "adminId is required" });
//     }

//     let groupId;

//     if (type === "days") {
//       groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
//     } else if (type === "month") {
//       groupId = { $dateToString: { format: "%b-%Y", date: "$createdAt" } };
//     } else if (type === "year") {
//       groupId = { $year: "$createdAt" };
//     } else {
//       return res.status(400).json({ error: "Invalid type" });
//     }

//     const data = await Booking.aggregate([
//       {
//         // 1️⃣ Filter by adminId first
//         $match: { adminId: adminId },
//       },
//       {
//         $group: {
//           _id: groupId,
//           totalAmount: { $sum: { $toDouble: "$amount" } },
//           totalBookings: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     res.json({ success: true, data });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };
const mongoose = require("mongoose");

exports.getAmountAnalytics = async (req, res) => {
  try {
    const { type } = req.query;
    let { adminId } = req.query; // or req.body if POST

    if (!adminId) {
      return res.status(400).json({ error: "adminId is required" });
    }

    // 🔹 Convert adminId to ObjectId if stored as ObjectId in MongoDB
    if (mongoose.Types.ObjectId.isValid(adminId)) {
      adminId = new mongoose.Types.ObjectId(adminId);
    }

    let groupId;
    if (type === "days") {
      groupId = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    } else if (type === "month") {
      groupId = { $dateToString: { format: "%b-%Y", date: "$createdAt" } };
    } else if (type === "year") {
      groupId = { $year: "$createdAt" };
    } else {
      return res.status(400).json({ error: "Invalid type" });
    }

    const data = await Booking.aggregate([
      {
        $match: { adminId: adminId }, // 🔹 Filter by adminId first
      },
      {
        $group: {
          _id: groupId,
          totalAmount: { $sum: { $toDouble: "$amount" } },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// exports.getAmountAnalytics = async (req, res) => {
//   try {
//     const { type, adminId } = req.query;

//     let groupId;

//     if (type === "days") {
//       groupId = {
//         $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//       };
//     } else if (type === "month") {
//       groupId = {
//         $dateToString: { format: "%b-%Y", date: "$createdAt" },
//       };
//     } else if (type === "year") {
//       groupId = { $year: "$createdAt" };
//     } else {
//       return res.status(400).json({ error: "Invalid type" });
//     }

//     const data = await Booking.aggregate([
//       {
//         // 1️⃣ Filter by adminId first
//         $match: { adminId: adminId.adminId },
//       },
//       {
//         $group: {
//           _id: groupId,

//           totalAmount: {
//             $sum: {
//               $toDouble: "$amount", // ✅ handles decimals
//             },
//           },
//           totalBookings: { $sum: 1 },
//         },
//       },
//       { $sort: { _id: 1 } },
//     ]);

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
