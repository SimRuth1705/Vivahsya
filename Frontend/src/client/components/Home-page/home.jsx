import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './home.css';
import v1 from '../../assets/V1.png';
import v2 from '../../assets/V2.png';
import v3 from '../../assets/V3.png';
import v4 from '../../assets/V4.png';
import logo from '../../assets/logo.png';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const images = [v1, v2, v3, v4];

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
