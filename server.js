require("dotenv").config();
// require('express-async-errors');
const express = require("express");
const app = express();
// extra security package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const PORT = process.env.PORT || 3000;
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const connectToDb = require("./database/db");
const authMiddleware = require("./middleware/authentication");
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 100, //15 minutes
    max: 100, //Limit each Ip to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(xss());

// parent routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", authMiddleware, jobRoutes);

// error middlewares
app.use(notFound);
app.use(errorHandler);

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});

const start = async () => {
  try {
    connectToDb();
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
