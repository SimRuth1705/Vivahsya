import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../assets/fakeData"; 

function NewArrivals() {
  const isScroll = useRef(null);
  const navigate = useNavigate(); 
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Take the first 8 items as "New Arrivals"
  const products = getAllProducts().slice(0, 8);

  const checkScrollButtons = () => {
    if (isScroll.current) {
      const { scrollLeft, scrollWidth, clientWidth } = isScroll.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
  }, []);

  const scroll = (direction) => {
    if (isScroll.current) {
      const { current } = isScroll;
      const scrollAmount = direction === "left" ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 bg-white">
      <div className="container mx-auto text-center mt-5 mb-10 relative px-4">
        <h1 className="text-3xl font-bold mb-4 text-[#9CAFAA]">Explore New Arrivals</h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Discover the latest trends in fashion.
        </p>

        <div className="absolute space-x-2 right-4 bottom-[-30px] flex">
          <button onClick={() => scroll("left")} disabled={!canScrollLeft} className={`p-2 rounded-full border border-[#9CAFAA] transition duration-300 flex items-center justify-center ${!canScrollLeft ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300" : "text-[#9CAFAA] hover:bg-[#9CAFAA] hover:text-white cursor-pointer"}`}>
            <FiChevronLeft className="text-2xl" />
          </button>
          <button onClick={() => scroll("right")} disabled={!canScrollRight} className={`p-2 rounded-full border border-[#9CAFAA] transition duration-300 flex items-center justify-center ${!canScrollRight ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-300" : "text-[#9CAFAA] hover:bg-[#9CAFAA] hover:text-white cursor-pointer"}`}>
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      <div
        ref={isScroll}
        onScroll={checkScrollButtons}
        className="container mx-auto overflow-x-scroll flex space-x-6 relative pb-6 px-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="min-w-[250px] md:min-w-[300px] bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition duration-300 cursor-pointer"
          >
            <div className="h-80 w-full overflow-hidden rounded-t-lg relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-4 text-left">
              <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
              <p className="text-[#D6A99D] font-bold mt-1 text-lg">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;