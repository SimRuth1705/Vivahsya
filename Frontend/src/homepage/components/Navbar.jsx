import React, { useState } from "react";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { Link, useLocation } from "react-router-dom"; 
import { FiX, FiMenu } from "react-icons/fi";
import CartSidebar from "./CartSidebar";
  
const NavLinks = ({ mobile, onClick }) => {
  const baseClass = mobile
    ? "hover:text-primary block font-semibold text-gray-700"
    : "hover:text-accent text-white/90";

  return (
    <>
      <Link to="/Collections/:collection?gender=women&size=&material=&brand=&maxPrice=150" className={baseClass} onClick={onClick}>Women</Link>
      <Link to="/Collections/:collection?gender=men&size=&material=&brand=&maxPrice=150" className={baseClass} onClick={onClick}>Men</Link>
      <Link to="/Collections/:collection?gender=men&size=xs&material=cotton&brand=&maxPrice=150" className={baseClass} onClick={onClick}>Kids</Link>
      <Link to="/sport" className={baseClass} onClick={onClick}>Sport</Link>
      <Link to="/brands" className={baseClass} onClick={onClick}>Brands</Link>
      <Link to="/new" className={baseClass} onClick={onClick}>New</Link>
      <Link to="/sale" className={`${baseClass} ${mobile ? "text-red-600" : "text-light font-bold"}`} onClick={onClick}>Sale</Link>
    </>
  );
};

function Navbar() {
  const [SearchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  const location = useLocation(); 

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("User searched for:", SearchTerm);
    setSearchTerm("");
    setIsMenuOpen(false);
  };

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="shadow-md relative top-0 z-50 bg-primary text-white">
        <div className="flex justify-between items-center w-full relative z-50 bg-primary px-4 py-2">
          <Link to="/" className="text-3xl font-bold tracking-wide hover:opacity-90 transition">
            <span className="font-brand">pallet</span>
            <span className="text-accent">.</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden w-full md:flex md:w-1/3 bg-light border border-transparent rounded-md p-2 focus-within:ring-2 focus-within:ring-accent justify-between mx-4 space-x-2">
            <input type="text" value={SearchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="flex flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-500" />
            <IoSearchOutline size={20} className="text-primary" />
          </form>

          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4 ">
              <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center justify-center cursor-pointer  hover:text-accent transition">
                <IoCartOutline size={24} />
                <span className="text-xs mt-1">Cart</span>
              </button>

              <Link to="/favorite" className="flex flex-col items-center justify-center cursor-pointer  hover:text-accent transition">
                <CiHeart size={24} />
                <span className="text-xs mt-1">Favorite</span>
              </Link>

              {isLoggedIn ? (
                <Link to="/profile" className="flex flex-col items-center justify-center cursor-pointer hover:text-accent transition transform hover:scale-110">
                  <CgProfile size={24} />
                  <span className="text-xs mt-1">Profile</span>
                </Link>
              ) : (
                <Link to="/login" className="px-3 py-1.5 text-sm bg-light text-primary font-bold rounded-md hover:bg-white hover:shadow-lg transition transform hover:scale-105">
                  Login
                </Link>
              )}

              <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>

            <div>
              <button className="md:hidden text-3xl focus:outline-none ml-2 cursor-pointer text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FiX /> : <FiMenu />}
              </button>
            </div>
          </div>
        </div>

        {location.pathname === "/" && (
          <div className="hidden md:flex space-x-9 p-3 border-t border-white/20 text-sm font-medium bg-primary">
            <NavLinks />
          </div>
        )}

        <div className={`md:hidden bg-white border-t absolute top-full left-0 w-full z-50 transition-all duration-300 ease-in-out border-gray-200 p-4 shadow-lg ${isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-10 pointer-events-none"}`}>
          <form onSubmit={handleSearch}>
            <input type="text" placeholder="Search products..." value={SearchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full border-2 border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:border-primary text-gray-800" />
          </form>

          <div className="flex flex-col space-y-4 text-gray-700">
            <div className="flex flex-col space-y-3 border-b border-gray-300 pb-3">
              {isLoggedIn ? (
                <Link to="/profile" className="flex items-center space-x-2 font-bold hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  <CgProfile size={20} /> <span>My Profile</span>
                </Link>
              ) : (
                <Link to="/login" className="flex items-center space-x-2 font-bold text-primary hover:opacity-80" onClick={() => setIsMenuOpen(false)}>
                  <CgProfile size={20} /> <span>Login / Register</span>
                </Link>
              )}
              <Link to="/cart" className="flex items-center space-x-2 font-bold hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                <IoCartOutline size={20} /> <span>Shopping Cart</span>
              </Link>
              <Link to="/favorite" className="flex items-center space-x-2 font-bold hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                <CiHeart size={20} /> <span>Favorites</span>
              </Link>
            </div>

            <div className="flex flex-col space-y-3 pt-2">
              <NavLinks mobile onClick={() => setIsMenuOpen(false)} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;