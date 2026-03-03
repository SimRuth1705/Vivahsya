import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './venue.css';

const VenuesPage = () => {
    const [selectedLocation, setSelectedLocation] = useState('Bangalore');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchRef = useRef(null);

    // Close search dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const venuesData = [
        {
            id: 1,
            name: 'Aura by Area',
            image: '/venue-images/bangalore/aura/image1.jpg',
            rating: '5.0',
            reviews: '162',
            location: 'Bangalore',
        },
        {
            id: 2,
            name: 'Mandara Wedding and Events',
            image: '/venue-images/bangalore/mandara/image1.jpg',
            rating: '5.0',
            location: 'North Bangalore',
        },
        {
            id: 3,
            name: 'Samaya Venue & Leisure',
            image: '/venue-images/bangalore/samaya/image1.jpg',
            rating: '4.8',
            location: 'Bangalore',
        },
        {
            id: 4,
            name: 'Aarambha',
            image: '/venue-images/bangalore/bangalore_image4.jpg',
            rating: '5.0',
            location: 'North Bangalore',
        },
        {
            id: 5,
            name: 'Kalyani Courtyard',
            image: '/venue-images/bangalore/bangalore_image5.jpg',
            rating: '5.0',
            location: 'North Bangalore',
        },
        {
            id: 6,
            name: "Fiestaa Resort & Events Venue",
            image: '/venue-images/bangalore/bangalore_image6.jpg',
            rating: '5.0',
            location: 'North Bangalore',

        },
        {
            id: 7,
            name: 'Temple Tree Farm',
            image: '/venue-images/bangalore/bangalore_image7.jpg',
            rating: '5.0',
            location: 'Bangalore',
        },

        {
            id: 8,
            name: 'Chitrakoot Wedding Venue',
            image: '/venue-images/bangalore/bangalore_image8.jpg',
            rating: '5.0',
            location: 'Bangalore',

        },
        {
            id: 9,
            name: 'Ambaari',
            image: '/venue-images/bangalore/bangalore_image9.jpg',
            rating: '5.0',
            location: 'Bangalore',

        },
        {
            id: 10,
            name: 'Samavana',
            image: '/venue-images/bangalore/bangalore_image10.jpg',
            rating: '5.0',
            location: 'Bangalore',

        },

        {
            id: 11,
            name: 'Apira Orchards',
            image: '/venue-images/bangalore/bangalore_image11.jpg',
            rating: '5.0',
            location: 'Bangalore',

        },

        {
            id: 101,
            name: 'Regenta-Baywatch-Resort',
            image: '/venue-images/goa/image1.png',
            rating: '4.6',
            location: 'Goa',

        },
        {
            id: 102,
            name: 'Goa-Marriott-Resort-and-Spa',
            image: '/venue-images/goa/image2.png',
            rating: '5.0',
            location: 'Goa',

        },
        {
            id: 103,
            name: 'The-Windflower-Resorts-and-Spa-Varca-Goa-A-Beach-Resort',
            image: '/venue-images/goa/image3.png',
            rating: '5.0',
            location: 'Goa',
        },
        {
            id: 104,
            name: 'Holiday-Inn-Resort-Goa-an-IHG-Hote',
            image: '/venue-images/goa/image4.png',
            rating: '4.5',
            location: 'Goa',
        },
        {
            id: 105,
            name: 'Planet-Hollywood-Beach-Resort',
            image: '/venue-images/goa/image5.png',
            rating: '4.8',
            location: 'Goa',
        },
        {
            id: 106,
            name: "Regenta-Beach-House-Resort-Goa",
            image: '/venue-images/goa/image6.png',
            rating: '3.9',
            location: 'Goa',
        },


        {
            id: 201,
            name: 'The-Leela-Palace',
            image: '/venue-images/chennai/image1.png',
            rating: '4.9',
            location: 'Chennai',

        },
        {
            id: 202,
            name: 'Sugam-Resort-and-Convention-Center',
            image: '/venue-images/chennai/image2.png',
            rating: '5.0',
            location: 'Chennai',
        },
        {
            id: 203,
            name: 'Aiyavoo Mahal',
            image: '/venue-images/chennai/image3.png',
            rating: '4.9',
            location: 'Chennai',

        },
        {
            id: 204,
            name: 'Radisson-Blu-Resort-Temple-Bay',
            image: '/venue-images/chennai/image4.png',
            rating: '5.0',
            location: 'Chennai',

        },
        {
            id: 205,
            name: 'Kailash-Resort',
            image: '/venue-images/chennai/image5.png',
            rating: '5.0',
            location: 'Chennai',
        },
        {
            id: 206,
            name: "Mamalla-Beach-Resor",
            image: '/venue-images/chennai/image6.png',
            rating: '5.0',
            location: 'Chennai',

        },

    ];

    const filteredVenues = venuesData.filter(venue => {
        if (!searchQuery) return true;
        const lowerQuery = searchQuery.toLowerCase();
        return (
            (venue.name && venue.name.toLowerCase().includes(lowerQuery)) ||
            (venue.location && venue.location.toLowerCase().includes(lowerQuery)) ||
            (venue.type && venue.type.toLowerCase().includes(lowerQuery))
        );
    });

    return (
        <div className="venue-page">
            {/* Main Content */}
            <div className="main-content">
                {/* Search & Toggle Header */}
                <header className="venue-list-header">
                    <div className="header-left">
                        <h1 className="main-title">Wedding Venues in {selectedLocation}</h1>
                        <p className="subtitle">Showing <strong>{filteredVenues.length} results</strong> as per your search criteria</p>
                    </div>

                    <div className="header-right">
                        <div className="search-bar" ref={searchRef}>
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search Wedding Venues..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchOpen(true)}
                            />

                            {/* Search Dropdown Overlay */}
                            {isSearchOpen && (
                                <div className="search-dropdown">
                                    <div className="dropdown-column">
                                        <h4>Top Cities</h4>
                                        <ul>
                                            <li onClick={() => { setSearchQuery(''); setSelectedLocation('All Cities'); setIsSearchOpen(false); }}>All Cities</li>
                                            <li onClick={() => { setSearchQuery('Chennai'); setSelectedLocation('Chennai'); setIsSearchOpen(false); }}>Chennai</li>
                                            <li onClick={() => { setSearchQuery('Bangalore'); setSelectedLocation('Bangalore'); setIsSearchOpen(false); }}>Bangalore</li>

                                        </ul>
                                    </div>
                                    <div className="dropdown-column">
                                        <h4>Popular Cities</h4>
                                        <ul>
                                            <li onClick={() => { setSearchQuery('Goa'); setSelectedLocation('Goa'); setIsSearchOpen(false); }}>Goa</li>
                                            <li onClick={() => { setSearchQuery('Chennai'); setSelectedLocation('Chennai'); setIsSearchOpen(false); }}>Chennai</li>
                                            <li onClick={() => { setSearchQuery('Bangalore'); setSelectedLocation('Bangalore'); setIsSearchOpen(false); }}>Bangalore</li>

                                        </ul>
                                    </div>
                                    <div className="dropdown-column">
                                        <h4>States</h4>
                                        <ul>
                                            <li onClick={() => { setSearchQuery('Goa'); setSelectedLocation('Goa'); setIsSearchOpen(false); }}>Goa</li>
                                            <li onClick={() => { setSearchQuery('Chennai'); setSelectedLocation('Chennai'); setIsSearchOpen(false); }}>Chennai</li>
                                            <li onClick={() => { setSearchQuery('Bangalore'); setSelectedLocation('Bangalore'); setIsSearchOpen(false); }}>Bangalore</li>

                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>


                {/* Venue Grid */}
                <section className="image-display-area">
                    <div className="venue-grid fade-in grid-view">
                        {filteredVenues.map(venue => (
                            <Link
                                to={`/venue/${venue.location}/${encodeURIComponent(venue.name.replace(/\s+/g, '-'))}`}
                                state={{ venue }}
                                key={venue.id}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="venue-card">
                                    <div className="image-wrapper">
                                        <img src={venue.image} alt={venue.name} />
                                    </div>
                                    <div className="card-content">
                                        <div className="card-header">
                                            <h3 className="venue-name">{venue.name}</h3>
                                            <div className="rating">
                                                <span className="star">★</span> {venue.rating} <span className="reviews">({venue.reviews} reviews)</span>
                                            </div>
                                        </div>

                                        <div className="location-type">
                                            <span className="location"><span className="icon">📍</span>{venue.location}</span>
                                            <span className="type"><span className="icon">🏛️</span>{venue.type}</span>
                                        </div>

                                        <div className="pricing">
                                            {venue.vegPrice ? (
                                                <div className="plate-pricing">
                                                    <div className="price-item">
                                                        <span className="label">Veg</span>
                                                        <span className="amount">{venue.vegPrice} <span className="unit">per plate</span></span>
                                                    </div>
                                                    <div className="price-item">
                                                        <span className="label">Non Veg</span>
                                                        <span className="amount">{venue.nonVegPrice} <span className="unit">per plate</span></span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="rental-pricing">
                                                    <span className="label">{venue.pricingText}</span>
                                                    {venue.price && <span className="amount">{venue.price} <span className="unit">{venue.priceUnit}</span></span>}
                                                </div>
                                            )}
                                        </div>

                                        <div className="capacity-tags">
                                            <span className="tag">{venue.pax}</span>
                                            <span className="tag">{venue.rooms}</span>
                                            {venue.moreCount && <span className="tag link">{venue.moreCount}</span>}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div >
        </div >

    );
};

export default VenuesPage;