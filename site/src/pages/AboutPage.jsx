import React, { useEffect } from 'react';
  import AboutUs from '../components/AboutUs';

  export default function AboutPage() {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return (
      <div className="page-padding-top animate-fade-in" style={{ paddingBottom: '40px' }}>
        <AboutUs />
      </div>
    );
  }
  
