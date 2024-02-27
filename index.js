const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 2000;
const userRoutes = require("./routes/userRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");

mongoose
  .connect("mongodb://localhost:27017/Rentina")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });
app.use(cors());
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/sellers", sellerRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`server started succesfully in port ${port}`);
});
