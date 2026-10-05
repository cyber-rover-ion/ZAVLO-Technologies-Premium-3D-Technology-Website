/**
 * ZAVLO TECHNOLOGIES — MAIN APPLICATION SCRIPT (STAGE 5 PRODUCTION)
 * Orchestrates 3D Engine, Section 3D Constellations, Interactive Hover Links,
 * Navigation, WhatsApp Click-to-Chat Enquiry Flow, and Anime.js Motion
 */

import { animationEngine } from './animation.js';
import { Zavlo3DSceneManager } from './3d/scene-manager.js';

class ZavloApp {
  constructor() {
    this.animation = animationEngine;
    this.sceneManager = new Zavlo3DSceneManager();
  }

  init() {
    // 1. Initialize Central 3D Engine
    this.sceneManager.init();

    // 2. Setup Navigation & Fullscreen Mobile Menu
    this.initNavigation();

    // 3. Setup Scroll Interactivity & Ecosystem 3D Hover Linkage
    this.initInteractions();

    // 4. Setup WhatsApp Click-to-Chat Enquiry Form
    this.initContactForm();

    // 5. Trigger Cinematic Entrance Sequence
    this.animation.playCinematicHeroEntrance(this.sceneManager, () => {
      console.log('[ZAVLO TECHNOLOGIES] Production Website & WhatsApp Flow Ready.');
    });
  }

  initNavigation() {
    const header = document.getElementById('site-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');

    if (header) {
      const onScroll = () => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (mobileToggle && mobileOverlay) {
      const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !mobileOverlay.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isOpen.toString());
        mobileOverlay.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';

        const lines = mobileToggle.querySelectorAll('.hamburger-line');
        if (lines.length >= 2) {
          if (isOpen) {
            lines[0].style.transform = 'translateY(3.5px) rotate(45deg)';
            lines[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
          } else {
            lines[0].style.transform = '';
            lines[1].style.transform = '';
          }
        }
      };

      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });

      mobileOverlay.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
          toggleMenu(false);
        }
      });
    }
  }

  initInteractions() {
    // 1. Smooth Anchor Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = 80;
          const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      });
    });

    // 2. Ecosystem Card Hover Linkage to 3D Ecosystem Network
    const ecosystemCards = document.querySelectorAll('.ecosystem-node');
    ecosystemCards.forEach((card, idx) => {
      card.addEventListener('mouseenter', () => {
        if (this.sceneManager && this.sceneManager.ecosystemNetwork) {
          this.sceneManager.ecosystemNetwork.setFocusNode(idx);
        }
      });
      card.addEventListener('mouseleave', () => {
        if (this.sceneManager && this.sceneManager.ecosystemNetwork) {
          this.sceneManager.ecosystemNetwork.setFocusNode(-1);
        }
      });
    });
  }

  /**
   * Real WhatsApp Click-to-Chat Enquiry Flow
   * Validates form -> creates pre-filled message -> opens WhatsApp with target 919949663048
   */
  initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    if (!form || !feedback) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const name = (document.getElementById('input-name')?.value || '').trim();
      const email = (document.getElementById('input-email')?.value || '').trim();
      const phone = (document.getElementById('input-phone')?.value || '').trim();
      const org = (document.getElementById('input-org')?.value || '').trim() || 'Not Specified';
      
      const categorySelect = document.getElementById('input-category');
      const categoryText = categorySelect ? categorySelect.options[categorySelect.selectedIndex]?.text : 'General Inquiry';
      
      const message = (document.getElementById('input-message')?.value || '').trim();

      if (!name || !email || !phone || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      // Format pre-filled WhatsApp message
      const whatsappMessage = 
`Hello ZAVLO Technologies,

I would like to make an enquiry.

Name: ${name}
Email: ${email}
Phone: ${phone}
Organization: ${org}
Enquiry Type: ${categoryText}
Message: ${message}

Sent through the ZAVLO Technologies website.`;

      // Official ZAVLO WhatsApp number: +91 9949663048 -> normalized: 919949663048
      const targetPhone = '919949663048';
      const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(whatsappMessage)}`;

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Opening WhatsApp...</span>';
      }

      // Show feedback with fallback link
      setTimeout(() => {
        form.style.display = 'none';
        
        feedback.innerHTML = `
          <h3>Opening WhatsApp</h3>
          <p style="margin-top:0.6rem; color:var(--zavlo-text-secondary); font-size:0.9375rem; line-height:1.6;">
            Your enquiry has been prepared. WhatsApp is opening with your pre-filled message so you can review and press <strong>Send</strong>.
          </p>
          <div style="margin-top:1.25rem;">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="zavlo-btn zavlo-btn-primary" style="display:inline-flex;">
              <span class="btn-text">Continue to WhatsApp</span>
              <span class="btn-glow" aria-hidden="true"></span>
            </a>
          </div>
          <p style="margin-top:1rem; font-size:0.75rem; color:var(--zavlo-text-dim);">
            If WhatsApp does not open automatically, click the button above.
          </p>
        `;
        feedback.classList.add('active');

        // Open WhatsApp in a new tab/app
        try {
          window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        } catch (err) {
          console.warn('[ZAVLO WhatsApp] Pop-up blocked, fallback link provided.');
        }
      }, 400);
    });
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new ZavloApp();
  app.init();
  window.__ZAVLO__ = app;
});
