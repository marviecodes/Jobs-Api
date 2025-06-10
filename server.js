require("dotenv").config();
// require('express-async-errors');
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const connectToDb = require("./database/db");
const authMiddleware = require("./middleware/authentication");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
