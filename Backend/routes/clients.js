const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 1. Get all clients (🔒 Admin Only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch clients", error: err.message });
  }
});

// 2. Get single client (🔒 Admin Only)
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Update client info (🔒 Admin Only)
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedClient)
      return res.status(404).json({ message: "Client not found" });
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
});

// 4. Delete client (🔒 Admin Only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Client deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
