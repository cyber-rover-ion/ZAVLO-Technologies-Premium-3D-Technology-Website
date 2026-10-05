/**
 * ZAVLO TECHNOLOGIES — 3D CENTRAL SCENE MANAGER (STAGE 6 PREMIUM PASS)
 * Coordinates single-loop WebGL rendering, continuous viewport 3D world,
 * ZAVLO emblem, orbital system, medical drone, and atmospheric depth field
 */

import * as THREE from '../vendor/three.module.js';
import { ZavloCamera } from './camera.js';
import { ZavloLighting } from './lighting.js';
import { ZavloObject } from './zavlo-object.js';
import { ZavloOrbitalSystem } from './orbital-system.js';
import { ZavloDroneScene } from './drone-scene.js';

export class Zavlo3DSceneManager {
  constructor(options = {}) {
    this.container = options.container || null;
    this.canvas = options.canvas || null;

    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.lighting = null;

    // 3D Objects
    this.zavloObject = null;
    this.orbitalSystem = null;
    this.droneScene = null;
    this.atmosphereParticles = null;

    this.isInitialized = false;
    this.isRunning = false;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.deviceTier = this.assessDeviceTier();

    this.rafId = null;
    this.clock = new THREE.Clock();
    this.scrollProgress = 0;
  }

  assessDeviceTier() {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = window.innerWidth <= 768;

    if (memory >= 8 && cores >= 8 && !isMobile) return 'high';
    if (memory >= 4 && cores >= 4) return 'medium';
    return 'low';
  }

  getOptimalDPR() {
    const dpr = window.devicePixelRatio || 1;
    if (this.deviceTier === 'low') return Math.min(dpr, 1.0);
    if (this.deviceTier === 'medium') return Math.min(dpr, 1.35);
    return Math.min(dpr, 2.0);
  }

  static isWebGLSupported() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  init(config = {}) {
    if (this.isInitialized) return;

    this.container = config.container || document.getElementById('webgl-container');
    this.canvas = config.canvas || document.getElementById('hero-webgl-canvas');

    if (!this.container || !this.canvas) {
      console.warn('[ZAVLO 3D] Canvas container not found.');
      return;
    }

    if (!Zavlo3DSceneManager.isWebGLSupported()) {
      this.triggerFallback();
      return;
    }

    try {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 1. Single Unified 3D Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('#030508');

      // 2. Cinematic Camera
      this.camera = new ZavloCamera();
      this.camera.setReducedMotion(this.isReducedMotion);
      this.camera.updateProjection(width, height);

      // 3. WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: this.deviceTier !== 'low',
        alpha: false,
        powerPreference: 'high-performance'
      });

      this.renderer.setPixelRatio(this.getOptimalDPR());
      this.renderer.setSize(width, height);
      if (THREE.SRGBColorSpace) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      }

      // 4. Studio Multi-Point Lighting
      this.lighting = new ZavloLighting(this.scene);

      // 5. Centerpiece Sculpted Z Ribbon Emblem & Synchronized Orbital System
      this.zavloObject = new ZavloObject(this.scene);
      this.zavloObject.setResponsiveScale(width);
      this.orbitalSystem = new ZavloOrbitalSystem(this.scene);

      // 6. Medical Delivery Drone
      this.droneScene = new ZavloDroneScene(this.scene);

      // 7. Atmospheric Spatial Depth Particles
      this.createAtmosphericDepthField();

      // 8. Event Listeners & Observers
      this.setupListeners();
      this.setupObservers();

      this.isInitialized = true;
      this.isRunning = true;
      this.clock.start();

      // 9. Start Rendering Loop
      this.animate();

      console.log(`[ZAVLO 3D Engine] Stage 6 Premium Active | Tier: ${this.deviceTier}`);
    } catch (err) {
      console.error('[ZAVLO 3D] Initialization failed:', err);
      this.triggerFallback();
    }
  }

  createAtmosphericDepthField() {
    const particleCount = this.deviceTier === 'low' ? 30 : (this.deviceTier === 'medium' ? 60 : 100);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      scales[i] = Math.random() * 0.04 + 0.015;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0x00f0b5,
      size: 0.06,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.atmosphereParticles = new THREE.Points(geometry, material);
    this.scene.add(this.atmosphereParticles);
  }

  triggerFallback() {
    console.warn('[ZAVLO 3D] Activating static fallback.');
    if (this.container) {
      this.container.classList.add('webgl-fallback-active');
    }
  }

  setupListeners() {
    window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 150);
    }, { passive: true });

    // Desktop Pointer Parallax
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch && !this.isReducedMotion) {
      window.addEventListener('mousemove', (e) => {
        const halfX = window.innerWidth / 2;
        const halfY = window.innerHeight / 2;
        const normX = (e.clientX - halfX) / halfX;
        const normY = (e.clientY - halfY) / halfY;
        this.camera.onMouseMove(normX, normY);
      }, { passive: true });
    }

    // Scroll progress binding
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      this.scrollProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
      this.camera.setScrollProgress(this.scrollProgress);
    }, { passive: true });

    // Reduced motion listener
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      this.camera.setReducedMotion(this.isReducedMotion);
    });
  }

  setupObservers() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  handleResize() {
    if (!this.renderer || !this.camera) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.updateProjection(width, height);
    this.renderer.setPixelRatio(this.getOptimalDPR());
    this.renderer.setSize(width, height);

    if (this.zavloObject) {
      this.zavloObject.setResponsiveScale(width);
    }
  }

  setEntranceProgress(progress) {
    if (this.zavloObject) {
      this.zavloObject.setEntrance(progress);
    }
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
    if (this.camera) {
      this.camera.setScrollProgress(this.scrollProgress);
    }
  }

  pause() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (this.isRunning || !this.isInitialized) return;
    this.isRunning = true;
    this.animate();
  }

  animate() {
    if (!this.isRunning) return;

    this.rafId = requestAnimationFrame(this.animate.bind(this));

    const time = this.clock.getElapsedTime();
    const mouseX = this.camera.mouse.x;
    const mouseY = this.camera.mouse.y;

    // 1. Camera & Dynamic Lighting
    this.camera.update(time);
    this.lighting.update(time, this.isReducedMotion);

    // 2. Centerpiece Emblem & Synchronized Orbital System
    this.zavloObject.update(time, this.scrollProgress, mouseX, mouseY, this.isReducedMotion);
    if (this.orbitalSystem && this.zavloObject && this.zavloObject.group) {
      this.orbitalSystem.syncWithEmblem(this.zavloObject.group.position, this.zavloObject.group.scale.x / 1.25);
    }
    this.orbitalSystem.update(time, this.isReducedMotion);

    // 3. Medical Delivery Drone
    if (this.droneScene) {
      this.droneScene.update(time, this.scrollProgress, mouseX, mouseY, this.isReducedMotion);
    }

    // 4. Subtle Atmospheric Drift
    if (this.atmosphereParticles && !this.isReducedMotion) {
      this.atmosphereParticles.rotation.y = time * 0.015;
      this.atmosphereParticles.rotation.x = Math.sin(time * 0.01) * 0.02;
    }

    // 5. Render World
    this.renderer.render(this.scene, this.camera.instance);
  }

  dispose() {
    this.pause();
    window.removeEventListener('resize', this.handleResize);

    if (this.zavloObject) this.zavloObject.dispose();
    if (this.orbitalSystem) this.orbitalSystem.dispose();
    if (this.droneScene) this.droneScene.dispose();
    if (this.atmosphereParticles) {
      this.atmosphereParticles.geometry.dispose();
      this.atmosphereParticles.material.dispose();
      this.scene.remove(this.atmosphereParticles);
    }
    if (this.renderer) this.renderer.dispose();
    this.isInitialized = false;
  }
}

export default Zavlo3DSceneManager;
