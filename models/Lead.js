const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  status: { 
    type: String, 
    enum: ["New", "Assigned", "Engaged", "Disposed"], 
    default: "New" 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Sales Rep
  activities: [
    {
      action: String,
      note: String,
      actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Lead", leadSchema);
