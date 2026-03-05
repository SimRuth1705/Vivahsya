import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { HiOutlineTrash, HiOutlinePlus, HiOutlinePhotograph, HiOutlineX, HiOutlineCollection, HiOutlinePencilAlt } from "react-icons/hi";
import API_BASE_URL from "../../../../config";
import "./AdminPortfolio.css";

const AdminPortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "Weddings" });
  const [coverImage, setCoverImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  // 👈 2. Use the live URL
  const API_BASE = `${API_BASE_URL}/api/portfolio`;

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      setPortfolioItems(data);
    } catch (err) { toast.error("Connection failed"); }
  };

  useEffect(() => { fetchPortfolio(); }, []);

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedImages.length} images?`)) return;
    try {
      const res = await fetch(`${API_BASE}/${editingId}/bulk-remove-photos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ imageUrls: selectedImages })
      });
      if (res.ok) {
        setGalleryPreviews(prev => prev.filter(item => !selectedImages.includes(item)));
        setSelectedImages([]);
        toast.success("Images removed");
      }
    } catch (err) { toast.error("Delete failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("category", formData.category);
    if (coverImage) submitData.append("coverImage", coverImage);
    galleryFiles.forEach(file => submitData.append("images", file));

    try {
      const res = await fetch(editingId ? `${API_BASE}/${editingId}` : API_BASE, {
        method: editingId ? "PUT" : "POST",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: submitData
      });
      if (res.ok) {
        toast.success("Success!");
        resetForm();
        fetchPortfolio();
      } else { toast.error("Upload failed"); }
    } catch (err) { toast.error("Error"); }
    finally { setIsUploading(false); }
  };

  const resetForm = () => {
    setIsFormOpen(false); setEditingId(null); setCoverImage(null); setGalleryFiles([]);
    setCoverPreview(null); setGalleryPreviews([]); setSelectedImages([]);
    setFormData({ title: "", category: "Weddings" });
  };

  // 👈 3. Safety check for Cover Image upload
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // 👈 4. Safety check for Gallery Images upload
  const handleGalleryChange = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setGalleryFiles(files);
      setGalleryPreviews(files.map(f => URL.createObjectURL(f)));
    }
  };

  return (
    <div className="av-page-wrapper">
      <Toaster position="top-right" richColors />
      <header className="av-main-header">
        <h1>Portfolio Manager</h1>
        {!isFormOpen && <button className="av-primary-cta" onClick={() => setIsFormOpen(true)}><HiOutlinePlus /> New Project</button>}
      </header>

      {isFormOpen && (
        <section className="av-form-overlay">
          <div className="av-glass-card">
            <button className="av-close-circle" type="button" onClick={resetForm}><HiOutlineX /></button>
            <form onSubmit={handleSubmit}>
              <div className="av-upload-grid">
                
                {/* Cover Image Uploader */}
                <div className="av-uploader-box">
                  <input type="file" id="cov" hidden accept="image/*" onChange={handleCoverChange} />
                  <label htmlFor="cov">
                    {coverPreview ? <img src={coverPreview} className="av-image-preview" alt="Cover Preview" /> : <HiOutlinePhotograph size={30} />}
                  </label>
                </div>

                {/* Gallery Images Uploader */}
                <div className="av-uploader-box">
                  {selectedImages.length > 0 && <button type="button" onClick={handleBulkDelete} className="bulk-del-btn">Delete {selectedImages.length}</button>}
                  <input type="file" multiple id="gal" hidden accept="image/*" onChange={handleGalleryChange} />
                  <label htmlFor="gal" className="av-mini-grid">
                    {galleryPreviews.length > 0 ? galleryPreviews.map(url => (
                      <div key={url} className={`av-mini-preview-item ${selectedImages.includes(url) ? 'selected' : ''}`} onClick={(e) => {e.preventDefault(); setSelectedImages(prev => prev.includes(url) ? prev.filter(i => i !== url) : [...prev, url])}}>
                        <img src={url} alt="Gallery Preview" />
                      </div>
                    )) : <HiOutlineCollection size={30} />}
                  </label>
                </div>
              </div>

              <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="av-input-styled" />
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="av-select-styled">
                <option value="Weddings">Weddings</option>
                <option value="Decor">Decor</option>
                <option value="Photography">Photography</option>
              </select>
              <button type="submit" className="av-submit-btn" disabled={isUploading}>{isUploading ? "Uploading..." : "Save Project"}</button>
            </form>
          </div>
        </section>
      )}

      <main className="av-grid-container">
        {portfolioItems.map((item) => (
          <div key={item._id} className="av-pro-card">
            <div className="av-card-visual">
              <img src={item.coverImage} alt={item.title} />
              <div className="av-badge">{item.images?.length || 0} Photos</div>
            </div>
            
            <div className="av-card-body">
              <h4>{item.title}</h4>
              <p className="av-category-tag">{item.category}</p>
              
              <div className="av-card-footer">
                <button 
                  className="av-edit-btn"
                  onClick={() => {
                    setEditingId(item._id);
                    setFormData(item);
                    setCoverPreview(item.coverImage);
                    setGalleryPreviews(item.images || []);
                    setIsFormOpen(true);
                  }}
                >
                  <HiOutlinePencilAlt /> Edit
                </button>

                <button 
                  className="av-del-btn"
                  onClick={async () => {
                    if (window.confirm("Delete project?")) {
                      await fetch(`${API_BASE}/${item._id}`, {
                        method: 'DELETE',
                        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                      });
                      fetchPortfolio();
                    }
                  }}
                >
                  <HiOutlineTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default AdminPortfolio;