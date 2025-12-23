import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './InitiativesPage.css';

const contentBySlug = {
  'daily-food-distribution': {
    title: 'Daily Food Distribution',
    description:
      'Daily Food Distribution: We prepare and distribute prasadam to communities every day, focusing on those in the greatest need. Volunteers and centers across India coordinate to ensure hot meals reach people reliably.',
  },
  'make-your-day-special': {
    title: 'Make Your Day Special',
    description:
      'Make Your Day Special: Donate or sponsor special prasadam packages for events, festivals, and important days for beneficiaries. Your support brightens someone\'s special day.',
  },
  'mental-abled-child': {
    title: 'Mental Abled Child',
    description:
      'Mental Abled Child: Dedicated programs and support for children with special needs, including meal programmes, care activities, and community integration.',
  },
};

const InitiativeDetail = () => {
  const { slug } = useParams();
  const content = contentBySlug[slug] || { title: 'Initiative', description: 'Details coming soon.' };

  return (
    <>
      <Header />
      <main className="initiative-detail page-container">
        <Link to="/initiatives" className="back-link">← Back to Initiatives</Link>
        <h1>{content.title}</h1>
        <p className="lead">{content.description}</p>

        <section className="initiative-actions">
          <h3>Get Involved</h3>
          <p>Support by volunteering, donating, or spreading the word.</p>
          <Link to="/donate" className="cta-button">Donate Now</Link>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default InitiativeDetail;
