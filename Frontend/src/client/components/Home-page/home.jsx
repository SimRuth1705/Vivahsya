import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import hero1 from '../../assets/wedding-hero-1.jpg';
import hero2 from '../../assets/wedding-hero-2.jpg';
import hero3 from '../../assets/wedding-hero-3.jpg';
import hero4 from '../../assets/wedding-hero-4.jpg';
import logo from '../../assets/logo.png';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [hero1, hero2, hero3, hero4];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="home-container">
            {/* Background Slideshow */}
            <div className="hero-slider">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${img})` }}
                    />
                ))}
                <div className="overlay"></div>
            </div>





            {/* Navigation Dots */}
            <div className="slider-dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default Home;
