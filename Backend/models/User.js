const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["owner", "employee", "client"], 
    default: "employee" 
  },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" } 
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);