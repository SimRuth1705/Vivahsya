const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Portfolio = require("../models/Portfolio");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// 1. Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Multer Setup (Increased to 100MB)
const upload = multer({ 
  dest: "uploads/",
  limits: { fileSize: 100 * 1024 * 1024 } 
});

// --- HELPERS ---
const uploadToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "vivahasya_portfolio",
    resource_type: "auto",
  });
  if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  return result.secure_url;
};

const deleteFromCloudinary = async (url) => {
  try {
    const parts = url.split('/');
    const fileName = parts.pop().split('.')[0];
    await cloudinary.uploader.destroy(`vivahasya_portfolio/${fileName}`);
  } catch (error) { console.error("Cloudinary Delete Error"); }
};

// --- API ENDPOINTS ---

router.get("/", async (req, res) => {
  const items = await Portfolio.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/", protect, adminOnly, upload.fields([{ name: "coverImage" }, { name: "images" }]), async (req, res) => {
  try {
    const itemData = { title: req.body.title, category: req.body.category, images: [] };
    if (req.files["coverImage"]) itemData.coverImage = await uploadToCloudinary(req.files["coverImage"][0]);
    if (req.files["images"]) {
      itemData.images = await Promise.all(req.files["images"].map(f => uploadToCloudinary(f)));
    }
    const newItem = await Portfolio.create(itemData);
    res.status(201).json(newItem);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", protect, adminOnly, upload.fields([{ name: "coverImage" }, { name: "images" }]), async (req, res) => {
  try {
    const current = await Portfolio.findById(req.params.id);
    const updateData = { title: req.body.title, category: req.body.category };
    if (req.files["coverImage"]) {
      if (current.coverImage) await deleteFromCloudinary(current.coverImage);
      updateData.coverImage = await uploadToCloudinary(req.files["coverImage"][0]);
    }
    if (req.files["images"]) {
      const newImgs = await Promise.all(req.files["images"].map(f => uploadToCloudinary(f)));
      updateData.images = [...(current.images || []), ...newImgs];
    }
    const updated = await Portfolio.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

router.patch("/:id/bulk-remove-photos", protect, adminOnly, async (req, res) => {
  try {
    const { imageUrls } = req.body;
    await Promise.all(imageUrls.map(url => deleteFromCloudinary(url)));
    await Portfolio.findByIdAndUpdate(req.params.id, { $pull: { images: { $in: imageUrls } } });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Bulk delete failed" }); }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (item.coverImage) await deleteFromCloudinary(item.coverImage);
    await Promise.all(item.images.map(url => deleteFromCloudinary(url)));
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

module.exports = router;