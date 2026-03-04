const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const Venue = require("../models/Venue");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 1. Configure Cloudinary (Automatically reads from your .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Multer Configuration (Temporary storage)
const upload = multer({ dest: "uploads/" });

// --- HELPER: Extract Cloudinary Public ID from URL for Deletion ---
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    let pathWithoutUpload = parts[1];
    // Remove versioning (e.g., v1612345678/)
    pathWithoutUpload = pathWithoutUpload.replace(/^v\d+\//, '');
    // Remove file extension
    return pathWithoutUpload.substring(0, pathWithoutUpload.lastIndexOf('.'));
  } catch (error) {
    return null;
  }
};

// --- HELPER: Delete from Cloudinary ---
const deleteFromCloudinary = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary Deletion Error:", error);
    }
  }
};

// --- HELPER: Upload to Cloudinary ---
const uploadToCloudinary = async (file) => {
  try {
    // Uploads to a specific folder in your Cloudinary account
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "vivahasya_venues",
      resource_type: "image",
    });

    // Return the secure (https) URL directly from Cloudinary
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  } finally {
    // 🧹 ALWAYS clean up the temporary file from your local server
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

// =====================================================
// --- ROUTES ---
// =====================================================

// CREATE VENUE
router.post("/", protect, adminOnly, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 15 },
  ]), async (req, res) => {
    try {
      const venueData = { ...req.body };
      
      // Upload Main Image
      if (req.files["image"]) {
        venueData.image = await uploadToCloudinary(req.files["image"][0]);
      }
      
      // Upload Gallery Images
      if (req.files["gallery"]) {
        const promises = req.files["gallery"].map(f => uploadToCloudinary(f));
        venueData.gallery = await Promise.all(promises);
      }

      const venue = await Venue.create(venueData);
      res.status(201).json(venue);
    } catch (err) {
      console.error("SERVER CRASH LOG:", err);
      res.status(500).json({ error: "Failed to upload to Cloudinary", details: err.message });
    }
});

// UPDATE VENUE & GALLERY
router.put("/:id", protect, adminOnly, upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 15 },
  ]), async (req, res) => {
    try {
      const venueData = { ...req.body };
      const currentVenue = await Venue.findById(req.params.id);

      // Handle Cover Image Update
      if (req.files["image"]) {
        if (currentVenue.image) await deleteFromCloudinary(currentVenue.image);
        venueData.image = await uploadToCloudinary(req.files["image"][0]);
      }

      // Handle New Gallery Images
      if (req.files["gallery"]) {
        const newImgs = await Promise.all(req.files["gallery"].map(f => uploadToCloudinary(f)));
        venueData.gallery = [...(currentVenue.gallery || []), ...newImgs];
      }

      const updated = await Venue.findByIdAndUpdate(req.params.id, venueData, { new: true });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Update failed" });
    }
});

// REMOVE SINGLE PHOTO (From Edit Dashboard)
router.patch("/:id/remove-photo", protect, adminOnly, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    // 1. Delete from Cloudinary
    await deleteFromCloudinary(imageUrl);
    
    // 2. Remove from MongoDB array
    await Venue.findByIdAndUpdate(req.params.id, { $pull: { gallery: imageUrl } });
    
    res.json({ message: "Asset removed" });
  } catch (err) {
    res.status(500).json({ error: "Asset removal failed" });
  }
});

// FULL PURGE (Delete Venue and all its images)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ error: "Not found" });

    // 1. Delete Main Image
    if (venue.image) await deleteFromCloudinary(venue.image);
    
    // 2. Delete Gallery Images
    if (venue.gallery && venue.gallery.length > 0) {
      const deletePromises = venue.gallery.map(url => deleteFromCloudinary(url));
      await Promise.all(deletePromises);
    }

    // 3. Delete DB Document
    await Venue.findByIdAndDelete(req.params.id);
    res.json({ message: "Purge complete." });
  } catch (err) {
    res.status(500).json({ error: "Purge failed" });
  }
});

// GET ALL VENUES
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch venues" });
  }
});

module.exports = router;