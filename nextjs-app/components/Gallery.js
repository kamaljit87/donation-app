'use client';

import React, { useState, useEffect } from 'react';
import './Gallery.css';
import galleryManifest from '../data/gallery-manifest.json';

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleImageLoad = (index) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  return (
    <div className="gallery-section">
      <div className="gallery-container">
        <h2 className="gallery-title">
          Witness the <span className="gradient-text">Power of Prasadam</span>
        </h2>
        <p className="gallery-subtitle">
          See how your generosity transforms lives through sacred meals served with love
        </p>

        <div className="carousel-wrapper">
          {/* Main Image Display */}
          <div className="carousel-main">
            <button
              className="carousel-nav carousel-nav-prev"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="carousel-images">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                >
                  {!loadedImages.has(index) && (
                    <div className="image-skeleton skeleton"></div>
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
              className="carousel-nav carousel-nav-next"
              onClick={goToNext}
              aria-label="Next image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Auto-play Control */}
          <button
            className="autoplay-toggle"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isAutoPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Indicator Dots */}
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Image Counter */}
        <div className="carousel-counter">
          <span>{currentIndex + 1}</span> / {images.length}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
