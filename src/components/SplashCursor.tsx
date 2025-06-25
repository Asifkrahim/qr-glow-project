
import React, { useEffect, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const SplashCursor = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    let rippleId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newRipple: Ripple = {
        id: rippleId++,
        x: e.clientX,
        y: e.clientY,
      };

      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    };

    // Throttle mouse move events for better performance
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledMouseMove = (e: MouseEvent) => {
      if (throttleTimer) return;
      
      throttleTimer = setTimeout(() => {
        handleMouseMove(e);
        throttleTimer = null;
      }, 50);
    };

    document.addEventListener('mousemove', throttledMouseMove);

    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-green-400/20 animate-ping"
          style={{
            left: ripple.x - 15,
            top: ripple.y - 15,
            width: '30px',
            height: '30px',
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

export default SplashCursor;
