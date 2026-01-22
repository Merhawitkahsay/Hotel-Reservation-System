import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Search, Star, Coffee, Mountain } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1578991624414-276ef23a534f?q=80&w=1920&auto=format&fit=crop",
    title: "ህድሞና", 
    subtitle: "Experience the Soul of Tigray"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1920&auto=format&fit=crop",
    title: "Habesha Hospitality",
    subtitle: "Warmth, Tradition, and Elegant Comfort"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1920&auto=format&fit=crop",
    title: "Modern Luxury",
    subtitle: "Where Ancient Culture Meets Modern Design"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prevSlide, setPrevSlide] = useState(0); 

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setPrevSlide(currentSlide); 
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); 

    return () => clearInterval(slideInterval);
  }, [currentSlide]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/rooms');
  };

  return (
    <div className="bg-black relative min-h-screen">
      
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        
        {/* Background Slideshow */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isPrev = index === prevSlide;
          
          // Logic to keep the previous slide visible behind the new one
          let slideClasses = "opacity-0 z-0"; 
          if (isActive) {
            slideClasses = "opacity-100 z-20 transition-opacity duration-1000 ease-in-out"; 
          } else if (isPrev) {
            slideClasses = "opacity-100 z-10"; 
          }

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 ${slideClasses}`}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-linear"
                style={{ 
                  backgroundImage: `url("${slide.image}")`,
                  transform: isActive ? 'scale(110%)' : 'scale(100%)'
                }}
              />
              
              {/* Darker Gradient Overlay */}
              {/* This makes the text pop and gives a 'Cinematic' look instead of 'Foggy' */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>
            </div>
          );
        })}

        {/* Hero Content */}
        <div className="relative z-30 h-full flex flex-col justify-center items-center text-center px-4 pb-20">
          
          {/* Text back to White with Shadow for Luxury feel */}
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 drop-shadow-2xl animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          
          {/* Gold/Amber Subtitle */}
          <p className="text-amber-400 text-xl md:text-2xl font-light tracking-[0.2em] uppercase mb-8 drop-shadow-lg transition-opacity duration-500 font-medium">
            {slides[currentSlide].subtitle}
          </p>
          
          {/* Divider Line */}
          <div className="w-24 h-1 bg-amber-500 rounded-full mb-8 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
        </div>

        {/* Floating Search Widget  */}
        <div className="absolute bottom-8 md:bottom-16 left-0 right-0 px-4 z-40">
          <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 md:p-8 border-t-4 border-amber-600">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check In</label>
                <div className="flex items-center border-b-2 border-gray-200 py-2 focus-within:border-amber-600 transition-colors">
                  <Calendar className="text-amber-700 mr-2" size={20} />
                  <input type="date" className="w-full focus:outline-none text-gray-700 bg-transparent font-medium" required />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Check Out</label>
                <div className="flex items-center border-b-2 border-gray-200 py-2 focus-within:border-amber-600 transition-colors">
                  <Calendar className="text-amber-700 mr-2" size={20} />
                  <input type="date" className="w-full focus:outline-none text-gray-700 bg-transparent font-medium" required />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Guests</label>
                <div className="flex items-center border-b-2 border-gray-200 py-2 focus-within:border-amber-600 transition-colors">
                  <Users className="text-amber-700 mr-2" size={20} />
                  <select className="w-full focus:outline-none text-gray-700 bg-transparent font-medium cursor-pointer">
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                    <option>2 Adults, 1 Child</option>
                    <option>Family (4+)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-black hover:bg-amber-700 text-white font-bold py-4 rounded-lg transition-all duration-300 flex justify-center items-center gap-2 shadow-lg transform hover:-translate-y-1"
              >
                <Search size={20} />
                CHECK AVAILABILITY
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* Cultural Features Section */}
      <div className="py-24 bg-white relative z-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-gray-900 mb-4">The ህድሞና Experience</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Discover the perfect blend of Tigrayan heritage and modern luxury.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-700 group-hover:scale-110 transition-transform">
                <Star size={36} />
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-3">Royal Treatment</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Experience service fit for royalty, inspired by the ancient Axumite kingdom.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-700 group-hover:scale-110 transition-transform">
                <Mountain size={36} />
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-3">Historic Views</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Breathtaking views of the mountains and landscapes that define our history.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-700 group-hover:scale-110 transition-transform">
                <Coffee size={36} />
              </div>
              <h3 className="text-xl font-serif text-gray-900 mb-3">Traditional Bunna</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Enjoy our daily complimentary coffee ceremony, a staple of our culture.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;