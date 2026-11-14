"use client";
import { useEffect, useRef, useState } from 'react';

/* ---------------------------------------------------------
   Reveal: fades/slides children in when they scroll into view
--------------------------------------------------------- */
export function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ '--d': `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------
   TiltCard: 3D tilt that follows the cursor, with a light glare
--------------------------------------------------------- */
export function TiltCard({ children, className = '', max = 9 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (e.pointerType === 'touch') return; // no tilt on touch screens
    const el = ref.current;
    if (!el) return;
    el.classList.remove('is-resting');
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;   // 0..1
    const rotY = (px - 0.5) * 2 * max;
    const rotX = (0.5 - py) * 2 * max;
    el.style.transform =
      `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.add('is-resting');
    el.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt ${className}`}
    >
      {children}
      <span className="tilt-glare" aria-hidden="true" />
    </div>
  );
}

/* ---------------------------------------------------------
   AnimatedHeading: words rise in one after another
--------------------------------------------------------- */
export function AnimatedHeading({ text, className = '' }) {
  const words = text.split(' ');
  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="hero-word"
          style={{ '--d': `${i * 120}ms`, marginRight: '0.28em' }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}

/* ---------------------------------------------------------
   FloatingLeaves: drifting leaves behind the page
   (random values are generated after mount to avoid hydration mismatch)
--------------------------------------------------------- */
export function FloatingLeaves({ count = 14 }) {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const colors = ['#52B788', '#1B4332', '#95D5B2', '#2D6A4F'];
    setLeaves(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 16 + Math.random() * 26,
        duration: 16 + Math.random() * 18,
        delay: -Math.random() * 30,
        drift: (Math.random() - 0.5) * 160,
        spin: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 360),
        opacity: 0.18 + Math.random() * 0.3,
        color: colors[i % colors.length],
      }))
    );
  }, [count]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {leaves.map((l) => (
        <svg
          key={l.id}
          className="leaf"
          width={l.size}
          height={l.size}
          viewBox="0 0 24 24"
          style={{
            left: `${l.left}%`,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            '--drift': `${l.drift}px`,
            '--spin': `${l.spin}deg`,
            '--o': l.opacity,
          }}
        >
          <path
            d="M21 3C11 3 4 9 4 17c0 1.2.2 2.3.6 3.3C5.6 20.7 6.8 21 8 21c8 0 13-7 13-18z"
            fill={l.color}
          />
          <path d="M5 20C9 14 13 10 18 6" stroke="#FDFBF7" strokeWidth="1" fill="none" opacity="0.6" />
        </svg>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   ScrollProgress: thin green bar showing how far you've scrolled
--------------------------------------------------------- */
export function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-[#52B788] to-[#1B4332]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}