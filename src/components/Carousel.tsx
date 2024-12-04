import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slide } from '../types';

interface CarouselProps {
  slides: Slide[];
}

const Carousel = ({ slides }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[600px] w-full group">
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className="w-full h-full bg-center bg-cover duration-500 relative"
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 transition-all duration-300">
            {slides[currentIndex].title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl transition-all duration-300">
            {slides[currentIndex].description}
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <ChevronLeft onClick={prevSlide} size={30} className="hover:scale-110 transition" />
      </div>
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <ChevronRight onClick={nextSlide} size={30} className="hover:scale-110 transition" />
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === slideIndex ? 'bg-white scale-110' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;