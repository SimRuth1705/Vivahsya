import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full h-screen">
      
      <img 
        alt="Cloth Science" 
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        
        <p className="text-sm md:text-lg font-bold tracking-[0.3em] uppercase mb-4 text-white/70">
          New Collection 2025
        </p>

        <h1 className="text-7xl md:text font-brand tracking-tight mb-6 drop-shadow-2xl">
          pallet
        </h1>
        
        <p className="text-xl md:text-2xl font-light tracking-wider mb-10 max-w-2xl text-gray-200">
          WEAR THE FUTURE
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <Link 
            to="/collections" 
            className="px-10 py-4 bg-primary text-white font-bold text-lg rounded-full hover:bg-white hover:text-primary transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Shop Now
          </Link>
          <Link 
            to="/about" 
            className="px-10 py-4 border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            Learn More
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Hero;