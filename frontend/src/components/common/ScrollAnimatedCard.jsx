import React, { useEffect, useRef, useState } from 'react';

export default function ScrollAnimatedCard({
  children,
  index = 0,
  className = '',
}) {
  const domRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Re-triggers every time the card enters/exits the viewport
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentTarget = domRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  // On mobile: Alternate left (even index) and right (odd index)
  // On laptop/desktop (md+): Animate from bottom UP (translate-y)
  const isLeft = index % 2 === 0;

  const animationStateClass = isVisible
    ? 'translate-x-0 translate-y-0 opacity-100'
    : isLeft
    ? '-translate-x-14 md:translate-x-0 md:translate-y-14 opacity-0'
    : 'translate-x-14 md:translate-x-0 md:translate-y-14 opacity-0';

  // Stagger delay for desktop cards
  const desktopDelay = `${(index % 3) * 120}ms`;

  return (
    <div
      ref={domRef}
      style={{
        transitionDuration: '750ms',
        transitionDelay: isVisible ? desktopDelay : '0ms',
      }}
      className={`transition-all ease-out transform will-change-transform ${animationStateClass} ${className}`}
    >
      {children}
    </div>
  );
}
