const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// --- 1. CREATE (POST) ---
router.post('/', async (req, res) => {
  try {
    const newClient = new Client(req.body);
    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    res.status(400).json({ message: "Error adding client: " + err.message });
  }
});

// --- 2. READ (GET) ---
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// --- 3. UPDATE (PUT) ---
router.put('/:id', async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // 'new: true' returns the modified document
    );
    if (!updatedClient) return res.status(404).json({ message: "Client not found" });
    res.json(updatedClient);
  } catch (err) {
    res.status(400).json({ message: "Update failed: " + err.message });
  }
});

// --- 4. DELETE (DELETE) ---
router.delete('/:id', async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ message: "Client not found" });
    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed: " + err.message });
  }
});

module.exports = router;