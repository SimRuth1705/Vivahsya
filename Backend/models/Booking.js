const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  status: { type: String, enum: ["Pending", "Confirmed", "Completed"], default: "Confirmed" },
  type: { type: String, default: "Wedding" },
  amount: { type: String, default: "0" },
  timeline: { type: Array, default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);