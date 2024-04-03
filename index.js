const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const port = 2000;
const userRoutes = require("./routes/userRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const landRoutes = require("./routes/landRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishListRoutes");

mongoose
  .connect(process.env.ATLAS)
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
app.use("/lands", landRoutes);
app.use("/reviews", reviewRoutes);
app.use("/wishlist", wishlistRoutes);

app.listen(port, () => {
  console.log(`server started succesfully in port ${port}`);
});
