import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import './InspirationPage.css';

const InspirationPage = () => {
  return (
    <>
      <Helmet>
        <title>Our Inspiration - Srila Prabhupada | Prabhupada Annakshetra</title>
        <meta
          name="description"
          content="The compassionate vision of Srila Prabhupada that inspired our mission to feed the hungry through prasadam distribution."
        />
      </Helmet>

      <Header />

      <div className="inspiration-page">
        <div className="inspiration-hero">
          <div className="hero-badge">🕉️ The Inspiration Behind Our Existence</div>
          <h1>
            Nurtured By The Compassionate Vision<br />
            <span className="gradient-text">Of Srila Prabhupada</span>
          </h1>
        </div>

        <div className="inspiration-content">
          <div className="story-section">
            <div className="story-card">
              <div className="story-icon">📖</div>
              <h2>A Moment That Changed Everything</h2>
              <div className="story-text">
                <p>
                  One day, while looking out of a window in Mayapur, a small hamlet near 
                  Calcutta, Srila Prabhupada saw a group of children fighting with stray dogs 
                  over scraps of food.
                </p>
                <p>
                  Deeply moved by this incident, he resolved to ensure that no one within a 
                  ten mile radius of his centre would go hungry. This direction to his followers 
                  inspired the genesis of various charitable feeding initiatives.
                </p>
              </div>
            </div>

            <div className="image-section">
              <div className="image-card">
                <div className="image-placeholder">
                  <div className="placeholder-icon">🕉️</div>
                  <p className="placeholder-text">Srila Prabhupada</p>
                </div>
                <p className="image-caption">
                  His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
                </p>
              </div>
            </div>
          </div>

          <div className="quote-section">
            <div className="quote-card">
              <div className="quote-mark">"</div>
              <p className="quote-text">
                "No one within ten miles of a temple should go hungry. We should serve prasadam 
                to everyone, and we should distribute prasadam profusely, not being miserly."
              </p>
              <p className="quote-author">— Srila Prabhupada</p>
            </div>
          </div>

          <div className="impact-section">
            <h2>His Vision Lives On</h2>
            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-icon">🌍</div>
                <h3>Global Reach</h3>
                <p>
                  Today, ISKCON Food Relief Foundation serves millions of meals annually 
                  across the globe, staying true to Srila Prabhupada's vision.
                </p>
              </div>
              <div className="impact-card">
                <div className="impact-icon">❤️</div>
                <h3>Pure Compassion</h3>
                <p>
                  Every meal is prepared with devotion and offered with love, embodying 
                  the spiritual principle that food is divine mercy.
                </p>
              </div>
              <div className="impact-card">
                <div className="impact-icon">🙏</div>
                <h3>Community Unity</h3>
                <p>
                  Bringing people together through prasadam distribution, fostering a sense 
                  of community and shared humanity.
                </p>
              </div>
            </div>
          </div>

          <div className="meditation-section">
            <div className="meditation-image">
              <div className="image-placeholder meditation-placeholder">
                <div className="placeholder-icon">🙏</div>
                <p className="placeholder-text">In Meditation</p>
              </div>
            </div>
            <div className="meditation-text">
              <h2>A Life of Service</h2>
              <p>
                Srila Prabhupada dedicated his life to spreading Krishna consciousness and 
                serving humanity. At the age of 69, he traveled to America with just a few 
                rupees and a trunk of books, establishing a global movement that would touch 
                millions of lives.
              </p>
              <p>
                His teachings emphasized that spiritual advancement and social welfare go 
                hand in hand. The prasadam distribution program is a perfect embodiment of 
                this philosophy—nourishing both body and soul.
              </p>
            </div>
          </div>

          <div className="cta-section">
            <h2>Join This Divine Mission</h2>
            <p>Be part of the legacy. Help us continue Srila Prabhupada's vision of ending hunger.</p>
            <div className="cta-buttons">
              <Link to="/" className="cta-button primary">
                Donate Now
              </Link>
              <Link to="/about" className="cta-button secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InspirationPage;
