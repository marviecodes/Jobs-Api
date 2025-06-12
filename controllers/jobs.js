const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");

const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
});

const getJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.userId;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error(`A job with this id - ${jobId} was not found `);
  }

  res.status(StatusCodes.OK).json(job);
});

const createJob = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
});

const updateJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.userId;
  const { company, position } = req.body;

  if (company === "" || position === "") {
    throw new Error("Company or Position Fields Cannot Be Empty.");
  }

  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedJob) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error(`A job with this id - ${jobId} was not found `);
  }

  res.status(StatusCodes.OK).json(updatedJob);
});

const deleteJob = asyncHandler(async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user.userId;

  const deletedJob = await Job.findOneAndRemove({
    _id: jobId,
    createdBy: userId,
  });
  if (!deleteJob) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error(`A job with this id - ${jobId} was not found `);
  }
  res.status(StatusCodes.OK).send();
});

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
