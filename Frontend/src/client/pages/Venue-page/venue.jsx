import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    HiOutlineLocationMarker, 
    HiOutlineUserGroup, 
    HiOutlineHome, 
    HiOutlineOfficeBuilding, 
    HiStar,
    HiSearch
} from 'react-icons/hi';
import './venue.css';

const VenuesPage = () => {
    const [venuesData, setVenuesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All Cities');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/venues");
                const data = await res.json();
                setVenuesData(data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVenues();
    }, []);

    const filteredVenues = venuesData.filter(venue => {
        const safeName = (venue.name || "").toLowerCase();
        const safeLocation = (venue.location || "").toLowerCase();
        const query = (searchQuery || "").toLowerCase();

        const matchesSearch = safeName.includes(query) || safeLocation.includes(query);
        const matchesLocation = selectedLocation === 'All Cities' || venue.location === selectedLocation;
        return matchesSearch && matchesLocation;
    });

    if (loading) return <div className="loading-container">Loading Premium Collection...</div>;

    return (
        <div className="venue-page">
            <div className="main-content">
                {/* --- HEADER & SEARCH --- */}
                <header className="venue-list-header">
                    <div className="header-left">
                        <h1 className="main-title">Wedding Venues in {selectedLocation}</h1>
                        <p className="subtitle">Curated collection of {filteredVenues.length} premium locations</p>
                    </div>

                    <div className="header-right">
                        <div className="modern-search-bar" ref={searchRef}>
                            <HiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by venue or city..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchOpen(true)}
                            />
                        </div>
                    </div>
                </header>

                {/* --- VENUE GRID --- */}
                <section className="image-display-area">
                    <div className="venue-grid fade-in">
                        {filteredVenues.map(venue => {
                            const safeLocation = encodeURIComponent(venue.location || "unknown-city");
                            const safeName = encodeURIComponent((venue.name || "unknown-venue").replace(/\s+/g, '-'));

                            return (
                                <Link
                                    to={`/venue/${safeLocation}/${safeName}`}
                                    state={{ venue }}
                                    key={venue._id}
                                    className="venue-card-link"
                                >
                                    <div className="venue-card">
                                        <div className="image-wrapper">
                                            <img src={venue.image} alt={venue.name} loading="lazy" />
                                            <div className="image-overlay"></div>
                                        </div>
                                        
                                        <div className="card-content">
                                            <div className="card-header">
                                                <h3 className="venue-name">{venue.name}</h3>
                                                <div className="rating">
                                                    <HiStar className="rating-icon" /> {venue.rating || "5.0"}
                                                </div>
                                            </div>
                                            
                                            <div className="location-type">
                                                <span className="info-item">
                                                    <HiOutlineLocationMarker className="info-icon" /> {venue.location}
                                                </span>
                                                <span className="info-item">
                                                    <HiOutlineOfficeBuilding className="info-icon" /> {venue.type}
                                                </span>
                                            </div>
                                            
                                            <div className="card-divider"></div>
                                            
                                            <div className="capacity-tags">
                                                {venue.pax && (
                                                    <span className="tag">
                                                        <HiOutlineUserGroup className="tag-icon"/> {venue.pax}
                                                    </span>
                                                )}
                                                {venue.rooms && (
                                                    <span className="tag">
                                                        <HiOutlineHome className="tag-icon"/> {venue.rooms}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default VenuesPage;