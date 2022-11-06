const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

// modules
const userRouter = require("./routes/userRoute.js");
const authRouter = require("./routes/authRoute.js");

const app = express();
dotenv.config();
// mongodb connection
mongoose.connect(process.env.MONGO_URL, () => {
  console.log("mongodb connected");
});
// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

// backend conncection checking
const port = process.env.PORT || 8000;
app.listen(port, () => console.log("server is running on port", port));
