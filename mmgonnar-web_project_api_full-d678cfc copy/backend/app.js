require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/users");
const cardRoutes = require("./routes/cards");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");
const errors = require("./middleware/errors");
const log = require("./middleware/log");
const app = express();
const PORT = process.env.PORT || 3000;
const corsSettings = require("./middleware/cors");

const mongoose = require("mongoose");

const DATABASE_URL = "mongodb://127.0.0.1:27017/aroundb";

mongoose.connect(DATABASE_URL).then(() => {
  console.log("Server connected");
});


app.use(cors("*"));
app.use(cors(corsSettings));

app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `${new Date().toLocaleString()}, ${req.method}, ${req.url}, "app.js 38"`
  );
  next();
});
//
app.use(requestLogger);

//root
app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("El servidor va a caer");
  }, 0);
});
//auth routes
app.use("/", authRoutes);
app.use(auth);
app.use("/", userRoutes); //users
app.use("/", cardRoutes); // cards
app.use(errors);
app.use(requestLogger);
app.use(errorLogger);
// not existing routes
app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
//start server
app.listen(PORT, () => {
  console.log(`Server listening in http://localhost:${PORT}`);
});
