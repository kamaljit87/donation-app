import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';
import galleryManifest from '../data/gallery-manifest.json';

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set([0]));

  const images = galleryManifest;

  // Preload first 3 images on mount
  useEffect(() => {
    [0, 1, 2].forEach(index => {
      if (images[index]) {
        const img = new Image();
        img.src = images[index].path;
        img.onload = () => handleImageLoad(index);
      }
    });
  }, []);

  // Prefetch adjacent images
  useEffect(() => {
    const nextIndex = (currentIndex + 1) % images.length;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    
    [nextIndex, prevIndex].forEach(index => {
      if (!loadedImages.has(index) && images[index]) {
        const img = new Image();
        img.src = images[index].path;
        img.onload = () => handleImageLoad(index);
      }
    });
  }, [currentIndex, images.length]);

  // Auto-play functionality - scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-container">
        {/* Navigation Buttons */}
        <button
          className="hero-carousel-nav hero-carousel-nav-prev"
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Carousel Images */}
        <div className="hero-carousel-images">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`hero-carousel-slide ${index === currentIndex ? 'active' : ''}`}
            >
              {!loadedImages.has(index) && (
                <div className="hero-image-skeleton skeleton"></div>
              )}
              <img
                src={image.path}
                alt={image.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => handleImageLoad(index)}
                style={{ display: loadedImages.has(index) ? 'block' : 'none' }}
              />
            </div>
          ))}
        </div>

        <button
          className="hero-carousel-nav hero-carousel-nav-next"
          onClick={goToNext}
          aria-label="Next image"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Image Counter */}
        <div className="hero-carousel-counter">
          <span>{currentIndex + 1}</span> / {images.length}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
