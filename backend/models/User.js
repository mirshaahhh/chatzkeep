const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    resume: {
  type: String,
  default: "",
},

    role: {
      type: String,
      enum: ["candidate", "recruiter"],
      default: "candidate",
    },

    phone: String,

    location: String,

    profession: String,

    specialization: String,

    experience: Number,

    resume: String,

    profileImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);