const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const port = 2000;
const userRoutes = require("./routes/userRoutes");

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`server started succesfully in port ${port}`);
});
