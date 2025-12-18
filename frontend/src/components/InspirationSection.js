import React from 'react';
import './InspirationSection.css';

const InspirationSection = () => {
  return (
    <section className="inspiration-section">
      <div className="inspiration-container">
        <div className="inspiration-content">
          <h3 className="inspiration-subtitle">The Inspiration behind our existence</h3>
          <h2 className="inspiration-title">
            Nurtured By The Compassionate Vision<br />
            Of Srila Prabhupada
          </h2>
          
          <div className="inspiration-text">
            <p>
              One day, while looking out of a window in Mayapur, a small hamlet near 
              Calcutta, Srila Prabhupada saw a group of children fighting with stray dogs 
              over scraps of food. Deeply moved by this incident, he resolved to ensure 
              that no one within a ten mile radius of his centre would go hungry. This 
              direction to his followers inspired the genesis of various charitable feeding 
              initiatives.
            </p>
          </div>

          <p className="inspiration-signature">
            <em>His Divine Grace A.C. Bhaktivedanta Swami Prabhupada</em>
          </p>

          <button className="join-cause-btn">Join Our Cause</button>
        </div>

        <div className="inspiration-image">
          <img 
            src="/images/srila-prabhupada-1.jpg" 
            alt="Srila Prabhupada" 
            className="prabhupada-image-main"
          />
        </div>
      </div>

      <div className="inspiration-full-image">
        <img 
          src="/images/srila-prabhupada-2.jpg" 
          alt="His Divine Grace A.C. Bhaktivedanta Swami Prabhupada" 
          className="prabhupada-image-secondary"
        />
      </div>
    </section>
  );
};

export default InspirationSection;
