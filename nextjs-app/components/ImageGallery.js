'use client';

import React, { useState, useEffect } from 'react';
import './ImageGallery.css';

const ImageGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Generate array of image paths
  const images = Array.from({ length: 50 }, (_, i) => 
    `/images/gallery/_${String(1170700 + i).padStart(7, '0')}.JPG`
  );

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h2>🙏 Our Prasadam Seva in Action</h2>
        <p>Witness the joy of serving and receiving Krishna's mercy</p>
      </div>

      <div className="carousel-container">
        <button className="carousel-button prev" onClick={goToPrevious} aria-label="Previous">
          ❮
        </button>

        <div className="carousel-slide">
          <img 
            src={images[currentIndex]} 
            alt={`Prasadam distribution ${currentIndex + 1}`}
            className="carousel-image"
            loading="lazy"
          />
        </div>

        <button className="carousel-button next" onClick={goToNext} aria-label="Next">
          ❯
        </button>
      </div>

      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="gallery-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageGallery;
