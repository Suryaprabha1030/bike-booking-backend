// const Bike = require("../models/bike");
// exports.createBike = async (req, res) => {
//   try {
//     const { location, BikeType, RatePerDay } = req.body;

//     const bike = await Bike.create({
//       location,
//       BikeType,
//       RatePerDay,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Bike added successfully",
//       data: bike,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const Bike = require("../models/Bike");

exports.createBike = async (req, res) => {
  try {
    const {
      adminId,
      location,
      BikeType,
      RatePerDay,
      image,
      about,
      bikeStatus,
    } = req.body;

    const bike = await Bike.create({
      adminId,
      location,
      BikeType,
      RatePerDay,
      image,
      about,
      bikeStatus,
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

exports.getBikes = async (req, res) => {
  try {
    const { adminId } = req.params;
    const bikes = await Bike.find({ adminId }); // fetch all bikes
    res.status(200).json({
      success: true,
      data: bikes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteBike = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body; // or from token later

    const bike = await Bike.findOneAndDelete({
      _id: id,
      adminId,
    });

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bike deleted successfully",
      data: bike,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBike = async (req, res) => {
  try {
    const { id } = req.params;
    // const { location, BikeType, RatePerDay, image, about, bikeStatus } =
    //   req.body;
    const updateData = { ...req.body };

    const bike = await Bike.findByIdAndUpdate(
      id,
      updateData,
      { new: true }, // return updated document
    );

    if (!bike) {
      return res
        .status(404)
        .json({ success: false, message: "Bike not found" });
    }

    res.status(200).json({
      success: true,
      message: "Bike updated successfully",
      data: bike,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
