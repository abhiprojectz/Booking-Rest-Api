const mongoose = require("mongoose");

const AdvisorSchema = mongoose.Schema({
  advisorName: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String,
    unique: true,
    required: true
  }
});

module.exports = mongoose.model("Advisor", AdvisorSchema);