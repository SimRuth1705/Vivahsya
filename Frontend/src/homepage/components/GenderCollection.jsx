import { Link } from "react-router-dom";

const GenderCollection = () => {

const handleScroll = (direction) => {
    const container = isScroll.current;
    const scrollAmount = container.offsetWidth / 2;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
    };

  return (
    <section className="py-16 px-4 md:px-10 bg-light">
      <div className="container mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="relative h-[600px] group overflow-hidden rounded-xl shadow-md cursor-pointer ">
            
            <img 
              src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974&auto=format&fit=crop" 
              alt="Women's Collection" 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-6 max-w-xs rounded-lg shadow-sm ">
              <h2 className="text-2xl font-bold text-primary mb-2">Women's Collection</h2>
              <Link 
                to="/women" 
                className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-secondary underline decoration-secondary decoration-2 underline-offset-4 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          <div className="relative h-[600px] group overflow-hidden rounded-xl shadow-md cursor-pointer ">
            <img 
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop" 
              alt="Men's Collection" 
              className="w-full h-full object-cover"
            />
            
            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-6 max-w-xs rounded-lg shadow-sm ">
              <h2 className="text-2xl font-bold text-primary mb-2">Men's Collection</h2>
              <Link 
                to="/men" 
                className="text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-secondary underline decoration-secondary decoration-2 underline-offset-4 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GenderCollection;    
