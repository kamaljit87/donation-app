import React from 'react';
import { useLocation } from 'react-router-dom';

const categoryHeadings = {
  'daily-food-distribution': 'Daily Food Distribution',
  'make-your-day-special': 'Make Your Day Special',
  'mental-abled-child': 'Mental Abled Child',
};

const InitiativesPage = () => {
  const location = useLocation();
  const category = location.state?.category || 'daily-food-distribution';
  const heading = categoryHeadings[category] || 'Our Feeding Initiatives';

  return (
    <>
      <div className="wide-hero">
        <div className="hero-inner">
          <a className="back-link" href="/">&lt; Back to Home</a>
          <h1>{heading}</h1>
          <p className="lead">{heading} initiative details and stories will appear here. All initiatives share this page but are categorized for clarity.</p>
        </div>
      </div>

      <div className="initiatives-page page-container">
        <div className="initiatives-content container">
          {/* Content for each initiative can be conditionally rendered here */}
          <p>
            {/* Example content, replace with real info */}
            Detailed information, stories, images and volunteer calls-to-action can be added here for the initiative.
          </p>
        </div>
      </div>
    </>
  );
};

export default InitiativesPage;
