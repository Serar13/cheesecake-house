import React, { useEffect } from 'react';
import CandyBar from '../components/CandyBar';

export default function CandyBarPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-padding-top animate-fade-in" style={{ paddingBottom: '60px' }}>
      <CandyBar />
    </div>
  );
}
