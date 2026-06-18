import { useEffect, useRef, useState, useCallback } from 'react';
import './SplashScreen.css';

const LOGO =
  'https://assets.boosteat.com/images/c165/2023-03-21/20230321093311212641979d71009f/logo.png';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Premium intro splash. Timeline:
 *  - 0.0s  logo fades + scales into the centre of the screen
 *  - ~2.8s the lockup expands: the logo glides left while the
 *          "THE CHEESECAKE HOUSE" wordmark reveals to its right
 *  - ~4.4s the whole splash fades up and out
 *  - ~5.0s onDone() hands control back to the app
 *
 * The splash is fully skippable (click / tap / Esc / Enter / Space) and
 * respects prefers-reduced-motion. It only blocks paint — data prefetching
 * for the Home page runs in parallel underneath it.
 */
export default function SplashScreen({ onDone }) {
  // 'in' -> 'reveal' -> 'out'. Reduced-motion starts already revealed.
  const [phase, setPhase] = useState(() =>
    prefersReducedMotion() ? 'reveal' : 'in'
  );
  const doneRef = useRef(false);
  const timersRef = useRef([]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  const skip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase('out');
    timersRef.current.push(setTimeout(finish, 550));
  }, [finish]);

  useEffect(() => {
    // Lock scroll while the splash is up.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const t = timersRef.current;
    if (prefersReducedMotion()) {
      t.push(setTimeout(() => setPhase('out'), 900));
      t.push(setTimeout(finish, 1500));
    } else {
      t.push(setTimeout(() => setPhase('reveal'), 2800));
      t.push(setTimeout(() => setPhase('out'), 4400));
      t.push(setTimeout(finish, 5000));
    }

    const onKey = (e) => {
      if (['Escape', 'Enter', ' '].includes(e.key)) skip();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      t.forEach(clearTimeout);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [finish, skip]);

  return (
    <div
      className={`cch-splash ${phase}`}
      role="dialog"
      aria-label="The Cheesecake House"
      onClick={skip}
    >
      <div className="cch-splash-bg" aria-hidden="true" />

      <div className="cch-splash-stage">
        <div className="cch-brand-lockup">
          <img
            src={LOGO}
            alt="The Cheesecake House"
            className="cch-splash-logo"
            draggable="false"
          />
          <div className="cch-brand-wordmark">
            <span className="cch-brand-name">THE CHEESECAKE HOUSE</span>
            <span className="cch-brand-tagline">Premium Craft Cakes</span>
            <span className="cch-brand-underline" aria-hidden="true" />
          </div>
        </div>
      </div>

      <span className="cch-splash-skip">Apasă pentru a continua</span>
    </div>
  );
}
