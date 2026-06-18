import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * Wraps route output so each navigation triggers a CSS enter animation.
 * The key trick: we keep the previous children rendering during the exit
 * phase, then swap in the new children with the enter animation.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit'
  const prevPathRef = useRef(location.pathname);
  const exitTimerRef = useRef(null);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;

    // Clear any pending swap.
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    // Start exit phase while still showing old children.
    setPhase('exit');

    exitTimerRef.current = setTimeout(() => {
      // Swap to new children and enter.
      setDisplayedChildren(children);
      setPhase('enter');
    }, 200); // must match page-exit duration

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Keep displayed children in sync when they update without a route change.
  useEffect(() => {
    if (phase === 'enter') {
      setDisplayedChildren(children);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <div className={`page-transition-${phase}`}>
      {displayedChildren}
    </div>
  );
}
