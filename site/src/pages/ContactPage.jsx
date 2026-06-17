import React, { useEffect } from 'react';
import Contact from '../components/Contact';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-padding-top animate-fade-in" style={{ paddingBottom: '60px' }}>
      <Contact />
    </div>
  );
}
