import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { 
  HiOutlinePencilAlt, HiOutlineTrash, HiOutlinePlus, 
  HiOutlinePhotograph, HiOutlineX, HiOutlineCollection,
  HiOutlineLocationMarker, HiOutlineUserGroup, HiOutlineHome
} from "react-icons/hi";
import "./AdminVenues.css";

const AdminVenues = () => {
  const [venues, setVenues] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", location: "", type: "Resort", pax: "", rooms: ""
  });
  
  const [mainImage, setMainImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/venues");
      const data = await res.json();
      setVenues(data);
    } catch (err) {
      toast.error("Database connection failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVenues(); }, []);

  // ✅ ADDED: 10MB Safety Check for Main Image
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10485760) {
        return toast.error("Cover image is too large! Must be under 10MB.");
      }
      setMainImage(file);
      setMainPreview(URL.createObjectURL(file));
    }
  };

  // ✅ ADDED: 10MB Safety Check for Gallery Images
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    
    const oversizedFiles = files.filter(f => f.size > 10485760);
    if (oversizedFiles.length > 0) {
      return toast.error(`Found ${oversizedFiles.length} images over 10MB. Please select smaller files.`);
    }

    setGalleryFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  const removeGalleryItem = async (url) => {
    if (!editingId) {
       // Just UI cleanup for new venue
       setGalleryPreviews(prev => prev.filter(item => item !== url));
       return;
    }
    
    // Server cleanup for existing venue
    if (!window.confirm("Delete photo from Cloud permanently?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/venues/${editingId}/remove-photo`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ imageUrl: url })
      });
      if (res.ok) {
        setGalleryPreviews(prev => prev.filter(item => item !== url));
        toast.success("Asset removed from Cloud");
      }
    } catch (err) { toast.error("Asset removal failed"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure? This will remove all cloud assets.")) return;
    try {
        await fetch(`http://localhost:5000/api/venues/${id}`, { 
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        toast.success("Venue deleted");
        fetchVenues();
    } catch (err) { toast.error("Delete failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    const token = localStorage.getItem("token");

    const submitData = new FormData();

    // 1. SAFE APPEND: Only send actual text data.
    const ignoredFields = ["image", "gallery", "_id", "createdAt", "updatedAt", "__v"];
    
    Object.keys(formData).forEach((key) => {
      if (!ignoredFields.includes(key)) {
        submitData.append(key, formData[key]);
      }
    });

    // 2. FILE APPEND: Add the actual File objects chosen by the user.
    if (mainImage) {
      submitData.append("image", mainImage);
    }
    
    galleryFiles.forEach((file) => {
      submitData.append("gallery", file);
    });

    // 3. API ROUTING
    const url = editingId 
      ? `http://localhost:5000/api/venues/${editingId}` 
      : "http://localhost:5000/api/venues";
    const method = editingId ? "PUT" : "POST";

    // 4. EXECUTE REQUEST
    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
        body: submitData
      });

      if (res.ok) {
        toast.success(editingId ? "Property Updated Successfully!" : "Cloud Sync Complete!");
        resetForm(); 
        fetchVenues(); 
      } else {
        const errorData = await res.json();
        toast.error(`Upload failed: ${errorData.error || "Check terminal logs"}`);
        console.error("Backend response error:", errorData);
      }
    } catch (err) { 
      toast.error("Network connection failed. Is the server running?");
      console.error("Fetch Error:", err);
    } finally { 
      setIsUploading(false); 
    }
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setMainImage(null);
    setGalleryFiles([]);
    setMainPreview(null);
    setGalleryPreviews([]);
    setFormData({ name: "", location: "", type: "Resort", pax: "", rooms: "" });
  };

  return (
    <div className="av-page-wrapper">
      <Toaster position="top-right" richColors />
      
      <header className="av-main-header">
        <div className="av-title-area">
          <h1>Vivahasya Admin</h1>
          <p>Cloud Asset Management System</p>
        </div>
        {!isFormOpen && (
          <button className="av-primary-cta" onClick={() => setIsFormOpen(true)}>
            <HiOutlinePlus size={20} /> New Listing
          </button>
        )}
      </header>

      {isFormOpen && (
        <section className="av-form-overlay fade-in">
          <div className="av-glass-card">
            <div className="av-card-top">
              <h3>{editingId ? "Manage Asset Gallery" : "Create Cloud Listing"}</h3>
              <button className="av-close-circle" onClick={resetForm}><HiOutlineX /></button>
            </div>

            <form onSubmit={handleSubmit} className="av-pro-form">
              <div className="av-upload-grid">
                <div className="av-uploader-box">
                  <span>Cover Photo (Max 10MB)</span>
                  <input type="file" onChange={handleMainImageChange} id="mainImg" hidden accept="image/*" />
                  <label htmlFor="mainImg" className="av-upload-trigger">
                    {mainPreview ? <img src={mainPreview} alt="Main" className="av-image-preview" /> : <HiOutlinePhotograph size={32} />}
                  </label>
                </div>

                <div className="av-uploader-box gallery">
                  <span>Multi-Image Gallery (Max 10MB each)</span>
                  <input type="file" multiple onChange={handleGalleryChange} id="galImg" hidden accept="image/*" />
                  <label htmlFor="galImg" className="av-upload-trigger">
                    {galleryPreviews.length > 0 ? (
                      <div className="av-mini-grid">
                        {galleryPreviews.map((url, i) => (
                           <div key={i} className="av-mini-preview-item">
                              <img src={url} alt="Gal" />
                              <button type="button" onClick={() => removeGalleryItem(url)} className="av-mini-del"><HiOutlineX /></button>
                           </div>
                        ))}
                      </div>
                    ) : <HiOutlineCollection size={32} />}
                  </label>
                </div>
              </div>

              <div className="av-form-section">
                <div className="av-input-row">
                  <input type="text" placeholder="Venue Name" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})} required />
                  <input type="text" placeholder="City" value={formData.location} onChange={(e)=>setFormData({...formData, location:e.target.value})} required />
                </div>
                <div className="av-input-row three-col">
                  <input type="text" placeholder="Category" value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})} />
                  <input type="text" placeholder="Max Capacity" value={formData.pax} onChange={(e)=>setFormData({...formData, pax:e.target.value})} />
                  <input type="text" placeholder="Total Rooms" value={formData.rooms} onChange={(e)=>setFormData({...formData, rooms:e.target.value})} />
                </div>
              </div>

              <button type="submit" className="av-submit-btn" disabled={isUploading}>
                {isUploading ? "Syncing Assets to Cloud..." : (editingId ? "Update Cloud Assets" : "Publish to Vivahasya")}
              </button>
            </form>
          </div>
        </section>
      )}

      {loading ? <div className="av-shimmer">Refreshing...</div> : (
        <main className="av-grid-container">
          {venues.map(v => (
            <article key={v._id} className="av-pro-card">
              <div className="av-card-visual">
                <img src={v.image} alt={v.name} />
                <div className="av-badge">{v.gallery?.length || 0} Cloud Photos</div>
              </div>
              <div className="av-card-body">
                <h4>{v.name}</h4>
                <p><HiOutlineLocationMarker /> {v.location}</p>
                <div className="av-card-footer">
                  <button onClick={() => { 
                      setEditingId(v._id); setFormData(v); 
                      setMainPreview(v.image); setGalleryPreviews(v.gallery || []);
                      setIsFormOpen(true); 
                  }} className="av-edit-btn">Edit Listing</button>
                  <button onClick={() => handleDelete(v._id)} className="av-del-btn"><HiOutlineTrash /></button>
                </div>
              </div>
            </article>
          ))}
        </main>
      )}
    </div>
  );
};

export default AdminVenues;