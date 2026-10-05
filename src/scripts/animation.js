/**
 * ZAVLO TECHNOLOGIES — CENTRAL CINEMATIC MOTION SYSTEM
 * Engine: Anime.js v4.5.0 + Native RAF
 * Features:
 * - Timed Master Hero Cinematic Entrance Sequence
 * - Smooth Normalized Scroll Choreography across 12 Landmarks
 * - Restrained Card 3D Tilt Parallax & Specular Sheen Tracker
 * - Magnetic Physics Cursor Controls
 * - Living Background Ambient Glow & Pointer Follower
 * - Form Micro-Interactions & Accessible Reduced Motion Support
 */

import { animate, createTimeline, stagger, set, cubicBezier } from './vendor/anime.esm.js';

class ZavloAnimationEngine {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isLowPowerDevice = 'navigator' in window && (navigator.hardwareConcurrency <= 4 || (navigator.deviceMemory && navigator.deviceMemory <= 4));
    
    this.progressBar = null;
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.scrollVelocity = 0;
    this.lastScrollY = 0;
    this.lastScrollTime = performance.now();
    
    this.cursor = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 };
    this.rafId = null;
    this.sceneManager = null;
    this._scrollChoreographyInitialized = false;

    this.initMediaListeners();
  }

  initMediaListeners() {
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
    });
  }

  shouldAnimate() {
    return !this.isReducedMotion;
  }

  /**
   * 1. CINEMATIC HERO ENTRANCE SEQUENCE
   */
  playCinematicHeroEntrance(sceneManager, onComplete) {
    this.sceneManager = sceneManager;
    this.progressBar = document.getElementById('zavlo-scroll-progress');

    this.initScrollChoreography();
    this.initMicroInteractions();
    this.initCard3DParallax();
    this.initPointerTracker();

    if (!this.shouldAnimate()) {
      if (sceneManager) sceneManager.setEntranceProgress(1.0);
      set(['.zavlo-header', '.hero-content-center', '.scroll-prompt'], {
        opacity: 1,
        transform: 'none'
      });
      if (typeof onComplete === 'function') onComplete();
      return;
    }

    // Set initial off-stage states
    set('.zavlo-header', { opacity: 0, translateY: -25 });
    set('.hero-wordmark-badge', { opacity: 0, translateY: 20 });
    set('.hero-cinematic-title', { opacity: 0, translateY: 30 });
    set('.hero-tagline', { opacity: 0, translateY: 20 });
    set('.hero-cinematic-cta', { opacity: 0, translateY: 20 });
    set('.scroll-prompt', { opacity: 0, translateY: 15 });

    const timeline = createTimeline({
      ease: cubicBezier(0.16, 1, 0.3, 1),
      onComplete: () => {
        if (typeof onComplete === 'function') onComplete();
      }
    });

    // 0.35s: 3D Emblem emerges with smooth progressive luminance
    if (sceneManager) {
      const emblemState = { val: 0 };
      timeline.add(emblemState, {
        val: 1.0,
        duration: 1600,
        ease: cubicBezier(0.2, 0.8, 0.2, 1),
        onUpdate: () => {
          sceneManager.setEntranceProgress(emblemState.val);
        }
      }, 350);
    }

    // 1.80s: ZAVLO Badge
    timeline.add('.hero-wordmark-badge', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }, 1800);

    // 2.10s: Headline reveals
    timeline.add('.hero-cinematic-title', {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 900,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }, 2100);

    // 2.30s: Tagline
    timeline.add('.hero-tagline', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 750,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }, 2300);

    // 2.50s: Action CTAs
    timeline.add('.hero-cinematic-cta', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 750,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }, 2500);

    // 2.80s: Floating Header & Scroll Prompt
    timeline.add('.zavlo-header', {
      opacity: [0, 1],
      translateY: [-25, 0],
      duration: 800,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }, 2800);

    timeline.add('.scroll-prompt', {
      opacity: [0, 0.85],
      translateY: [15, 0],
      duration: 700,
      ease: cubicBezier(0.16, 1, 0.3, 1)
    }, 2900);

    return timeline;
  }

  /**
   * 2. CENTRALIZED SCROLL CHOREOGRAPHY & ACTIVE NAVIGATION
   */
  initScrollChoreography() {
    if (this._scrollChoreographyInitialized) return;
    this._scrollChoreographyInitialized = true;

    this.progressBar = document.getElementById('zavlo-scroll-progress');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link, .mobile-nav-link');

    const sections = [
      { id: 'hero', min: 0.0, max: 0.08 },
      { id: 'mission', min: 0.08, max: 0.17 },
      { id: 'ecosystem', min: 0.17, max: 0.28 },
      { id: 'logistics', min: 0.28, max: 0.40 },
      { id: 'stations', min: 0.40, max: 0.52 },
      { id: 'digital', min: 0.52, max: 0.64 },
      { id: 'infrastructure', min: 0.64, max: 0.74 },
      { id: 'engineering', min: 0.74, max: 0.82 },
      { id: 'vision', min: 0.82, max: 0.90 },
      { id: 'founder', min: 0.90, max: 0.95 },
      { id: 'contact', min: 0.95, max: 1.0 }
    ];

    const updateScrollMetrics = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      this.targetScrollProgress = Math.max(0, Math.min(1, scrollY / maxScroll));

      // Calculate instantaneous scroll velocity
      const now = performance.now();
      const dt = Math.max(1, now - this.lastScrollTime);
      const dy = scrollY - this.lastScrollY;
      this.scrollVelocity = dy / dt;
      this.lastScrollY = scrollY;
      this.lastScrollTime = now;
    };

    window.addEventListener('scroll', updateScrollMetrics, { passive: true });
    updateScrollMetrics();

    // Continuous Animation Frame Loop
    const tick = () => {
      const lerpSpeed = this.isReducedMotion ? 1.0 : 0.085;
      this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * lerpSpeed;
      this.scrollVelocity *= 0.92;

      // Update Top Progress Bar
      if (this.progressBar) {
        this.progressBar.style.transform = `scaleX(${this.scrollProgress})`;
      }

      // Update Active Nav Link
      const activeSec = sections.find(s => this.scrollProgress >= s.min && this.scrollProgress <= s.max);
      if (activeSec) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          const isMatch = href === `#${activeSec.id}`;
          link.classList.toggle('active', isMatch);
        });
      }

      // Notify Three.js Scene Manager
      if (this.sceneManager) {
        this.sceneManager.setScrollProgress(this.scrollProgress);
        if (typeof this.sceneManager.setScrollVelocity === 'function') {
          this.sceneManager.setScrollVelocity(this.scrollVelocity);
        }
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  /**
   * 3. SUBTLE CARD 3D PARALLAX & SPECULAR TRACKING
   */
  initCard3DParallax() {
    if (this.isReducedMotion || this.isLowPowerDevice) return;

    const cards = document.querySelectorAll('.challenge-pill, .ecosystem-node, .spec-card, .tech-cell, .founder-card, .contact-item, .contact-form-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${(x / rect.width * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height * 100).toFixed(1)}%`);
      });
    });
  }

  /**
   * 4. RESTRAINED MAGNETIC CONTROLS
   */
  initMicroInteractions() {
    if (this.isReducedMotion || this.isLowPowerDevice) return;

    const buttons = document.querySelectorAll('.zavlo-btn-primary, .zavlo-btn-secondary, .zavlo-btn-nav, .mobile-toggle');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        
        animate(btn, {
          translateX: x * 0.16,
          translateY: y * 0.16,
          duration: 250,
          ease: cubicBezier(0.16, 1, 0.3, 1)
        });
      });

      btn.addEventListener('mouseleave', () => {
        animate(btn, {
          translateX: 0,
          translateY: 0,
          duration: 450,
          ease: cubicBezier(0.16, 1, 0.3, 1)
        });
      });
    });
  }

  /**
   * 5. LIVING POINTER LIGHT & AMBIENT ATMOSPHERE
   */
  initPointerTracker() {
    if (this.isReducedMotion || this.isLowPowerDevice) return;

    const ambientBloom = document.querySelector('.zavlo-ambient-bloom');
    if (!ambientBloom) return;

    window.addEventListener('mousemove', (e) => {
      this.cursor.targetX = e.clientX;
      this.cursor.targetY = e.clientY;
    }, { passive: true });

    const updatePointerLight = () => {
      this.cursor.x += (this.cursor.targetX - this.cursor.x) * 0.04;
      this.cursor.y += (this.cursor.targetY - this.cursor.y) * 0.04;

      const normX = (this.cursor.x / window.innerWidth - 0.5) * 45;
      const normY = (this.cursor.y / window.innerHeight - 0.5) * 45;

      ambientBloom.style.transform = `translate(calc(-50% + ${normX.toFixed(1)}px), calc(-50% + ${normY.toFixed(1)}px))`;

      requestAnimationFrame(updatePointerLight);
    };

    requestAnimationFrame(updatePointerLight);
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

export const animationEngine = new ZavloAnimationEngine();
export { ZavloAnimationEngine };
export default animationEngine;
