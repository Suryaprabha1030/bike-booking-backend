const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

dotenv.config();
connectDB();
const app = express();
app.use(cors());
// app.use(cors({ origin: "http://localhost:8081" }));

// app.use(express.json());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
// app.listen(5000, "0.0.0.0", () => console.log("Server running"));

const bikeRoutes = require("./routes/bikeRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/bikes", bikeRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// const express = require("express");
// const mongoose = require("mongoose");

// const app = express();

// // 🔹 MongoDB connection (PUT IT HERE)
// mongoose.connect("mongodb://122.178.141.153/32", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("✅ Connected to MongoDB");
// });

// // 🔹 Middleware
// app.use(express.json());

// // 🔹 Test route
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // 🔹 Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });
