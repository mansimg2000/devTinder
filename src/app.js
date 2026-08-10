const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth/auth");
const profileRouter = require("./routes/profile/profile");
const requestsRouter = require("./routes/requests/request");
const userRouter = require("./routes/user/user");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connected successfully!");
    app.listen("3000", () => {
      console.log("app is running ion port: 3000");
    });
  })
  .catch((err) => console.error("Can not coinnect to the dartabase!"));
