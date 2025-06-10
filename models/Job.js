const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./User");

const JobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name."],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a company position."],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: [true, "Please provide a User"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
