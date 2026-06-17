import React, { useEffect } from 'react';
import Reservations from '../components/Reservations';

export default function ReservationsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-padding-top animate-fade-in" style={{ paddingBottom: '60px' }}>
      <Reservations />
    </div>
  );
}
