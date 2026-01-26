const User = require("../models/user");
const Booking = require("../models/Booking");

exports.addUser = async (req, res) => {
  console.log("USER API HIT"); // debug
  try {
    const { name, user, address, proofType, proofNumber } = req.body;

    const userData = await User.create({
      name,
      user,
      address,
      proofType,
      proofNumber,
    });

    res.status(201).json({
      success: true,
      message: "user detail added successfully",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAllUsers = async (req, res) => {
  console.log("GET ALL USERS HIT"); // debug log
  try {
    const users = await User.find(); // fetch all users
    console.log("DB QUERY DONE", users.length, "users");
    res.json(users); // send response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserAndBooking = async (req, res) => {
  try {
    const { userId } = req.params; // matches your route
    const { user: newUser, ...otherFields } = req.body;

    // 1️⃣ Find existing user
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const oldUser = existingUser.user;

    // 2️⃣ Update User
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { user: newUser, ...otherFields } },
      { new: true, runValidators: true },
    );

    // 3️⃣ Update Booking
    await Booking.updateMany({ user: oldUser }, { $set: { user: newUser } });

    res.status(200).json({
      success: true,
      message: "User & bookings updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// exports.updateUserAndBooking = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { user: newUser, ...otherFields } = req.body;

//     // 1️⃣ Get OLD user value first
//     const existingUser = await User.findById(userId);

//     if (!existingUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const oldUser = existingUser.user;

//     // 2️⃣ Update USER collection
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       {
//         $set: {
//           user: newUser,
//           ...otherFields,
//         },
//       },
//       { new: true, runValidators: true },
//     );

//     // 3️⃣ Update BOOKING collection (using OLD user value)
//     await Booking.updateMany({ user: oldUser }, { $set: { user: newUser } });

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully in User & Booking",
//       data: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
