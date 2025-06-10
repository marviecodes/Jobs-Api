const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
});

const getJob = asyncHandler(async (req, res) => {
  res.send("Get single job");
});

const createJob = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
});

const updateJob = asyncHandler(async (req, res) => {
  res.send("Update a job");
});

const deleteJob = asyncHandler(async (req, res) => {
  res.send("Delete a job");
});

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
