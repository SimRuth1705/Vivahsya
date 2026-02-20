const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// 1. CREATE: Add a new vendor
router.post('/', async (req, res) => {
  const vendor = new Vendor({
    name: req.body.name,
    category: req.body.category,
    phone: req.body.phone,
    email: req.body.email,
    location: req.body.location,
    rating: req.body.rating
  });

  try {
    const newVendor = await vendor.save();
    res.status(201).json(newVendor);
  } catch (err) {
    res.status(400).json({ message: "Error creating vendor: " + err.message });
  }
});

// 2. READ: Get all vendors
router.get('/', async (req, res) => {
  try {
    // .sort({ createdAt: -1 }) ensures new vendors appear at the top
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// 3. UPDATE: Edit vendor details
router.put('/:id', async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // 'new: true' returns the updated document
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json(updatedVendor);
  } catch (err) {
    res.status(400).json({ message: "Update failed: " + err.message });
  }
});

// 4. DELETE: Remove a vendor
router.delete('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed: " + err.message });
  }
});

module.exports = router;