/**
 * ZAVLO TECHNOLOGIES — 3D CINEMATIC CAMERA SYSTEM (STAGE 6 PREMIUM PASS)
 * Smooth continuous waypoint spline flight through the ZAVLO technological world
 * Featuring controlled damping, gentle breathing, and pointer parallax
 */

import * as THREE from '../vendor/three.module.js';

export class ZavloCamera {
  constructor(options = {}) {
    this.baseFov = options.fov || 42;
    this.fov = this.baseFov;
    this.near = options.near || 0.1;
    this.far = options.far || 1000;

    this.basePosition = new THREE.Vector3(0, 0.35, 7.2);
    this.targetPosition = new THREE.Vector3().copy(this.basePosition);
    this.currentPosition = new THREE.Vector3().copy(this.basePosition);

    this.baseLookAt = new THREE.Vector3(0, -0.05, 0);
    this.targetLookAt = new THREE.Vector3().copy(this.baseLookAt);
    this.currentLookAt = new THREE.Vector3().copy(this.baseLookAt);

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.isReducedMotion = false;

    this.instance = new THREE.PerspectiveCamera(this.fov, 1, this.near, this.far);
    this.instance.position.copy(this.basePosition);
  }

  updateProjection(width, height) {
    if (!height || height === 0) return;
    const aspect = width / height;
    this.instance.aspect = aspect;

    const isLandscapeShort = height < 540 && width > height;
    const isSmallMobile = width < 480;
    const isTablet = width <= 768;

    if (isLandscapeShort) {
      this.basePosition.set(0, 0.15, 8.2);
    } else if (isSmallMobile) {
      this.basePosition.set(0, 0.42, 8.0);
    } else if (isTablet) {
      this.basePosition.set(0, 0.38, 7.6);
    } else {
      this.basePosition.set(0, 0.35, 7.2);
    }

    this.instance.updateProjectionMatrix();
  }

  onMouseMove(normalizedX, normalizedY) {
    if (this.isTouchDevice || this.isReducedMotion) return;
    this.mouse.targetX = normalizedX;
    this.mouse.targetY = normalizedY;
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  setReducedMotion(isReduced) {
    this.isReducedMotion = isReduced;
  }

  /**
   * Continuous camera waypoints across scroll progression
   */
  update(time) {
    if (this.isReducedMotion) {
      this.instance.position.set(
        this.basePosition.x,
        this.basePosition.y - this.scrollProgress * 1.5,
        this.basePosition.z + this.scrollProgress * 1.8
      );
      this.instance.lookAt(0, 0, 0);
      return;
    }

    // Smooth lerp mouse coordinates
    if (!this.isTouchDevice) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    } else {
      this.mouse.x = 0;
      this.mouse.y = 0;
    }

    // Organic atmospheric breathing drift
    const driftX = Math.sin(time * 0.35) * 0.045;
    const driftY = Math.cos(time * 0.30) * 0.030;

    // Cinematic Waypoints across 12 Storytelling Sections
    const sp = this.scrollProgress;
    let targetX = this.basePosition.x;
    let targetY = this.basePosition.y;
    let targetZ = this.basePosition.z;
    let lookX = this.baseLookAt.x;
    let lookY = this.baseLookAt.y;
    let lookZ = this.baseLookAt.z;

    if (sp < 0.08) {
      // 1. HERO (Centerpiece Z emblem)
      const t = sp / 0.08;
      targetX = 0;
      targetY = 0.35 + t * 0.10;
      targetZ = 7.2 - t * 0.50;
      lookX = 0;
      lookY = -0.05 + t * 0.10;
      lookZ = 0;
    } else if (sp < 0.20) {
      // 2. MISSION (Emblem moves up & camera glides slightly forward)
      const t = (sp - 0.08) / 0.12;
      targetX = THREE.MathUtils.lerp(0, 0.25, t);
      targetY = THREE.MathUtils.lerp(0.45, 0.65, t);
      targetZ = THREE.MathUtils.lerp(6.7, 5.8, t);
      lookX = THREE.MathUtils.lerp(0, 0.08, t);
      lookY = THREE.MathUtils.lerp(0.05, 0.22, t);
      lookZ = 0;
    } else if (sp < 0.32) {
      // 3. ECOSYSTEM (Orbital core focus)
      const t = (sp - 0.20) / 0.12;
      targetX = THREE.MathUtils.lerp(0.25, 0.0, t);
      targetY = THREE.MathUtils.lerp(0.65, 0.20, t);
      targetZ = THREE.MathUtils.lerp(5.8, 6.2, t);
      lookX = 0;
      lookY = 0.10;
      lookZ = 0;
    } else if (sp < 0.46) {
      // 4. LOGISTICS (Frames dominant Medical Drone on right)
      const t = (sp - 0.32) / 0.14;
      targetX = THREE.MathUtils.lerp(0.0, -0.80, t);
      targetY = THREE.MathUtils.lerp(0.20, 0.15, t);
      targetZ = THREE.MathUtils.lerp(6.2, 5.2, t);
      lookX = THREE.MathUtils.lerp(0.0, 1.15, t);
      lookY = THREE.MathUtils.lerp(0.10, 0.0, t);
      lookZ = 0.5;
    } else if (sp < 0.60) {
      // 5. SMART STATIONS
      const t = (sp - 0.46) / 0.14;
      targetX = THREE.MathUtils.lerp(-0.80, 0.85, t);
      targetY = THREE.MathUtils.lerp(0.15, -0.08, t);
      targetZ = THREE.MathUtils.lerp(5.2, 5.6, t);
      lookX = THREE.MathUtils.lerp(1.15, -1.05, t);
      lookY = -0.08;
      lookZ = 0.4;
    } else if (sp < 0.74) {
      // 6. DIGITAL & INFRASTRUCTURE
      const t = (sp - 0.60) / 0.14;
      targetX = THREE.MathUtils.lerp(0.85, 0.0, t);
      targetY = THREE.MathUtils.lerp(-0.08, 0.22, t);
      targetZ = THREE.MathUtils.lerp(5.6, 6.4, t);
      lookX = 0;
      lookY = 0.10;
      lookZ = 0;
    } else if (sp < 0.88) {
      // 7. VISION (Pullback into connected ecosystem)
      const t = (sp - 0.74) / 0.14;
      targetX = 0;
      targetY = THREE.MathUtils.lerp(0.22, 0.42, t);
      targetZ = THREE.MathUtils.lerp(6.4, 8.0, t);
      lookX = 0;
      lookY = 0.0;
      lookZ = 0;
    } else {
      // 8. FOUNDER & CONTACT (Calm final composition)
      const t = (sp - 0.88) / 0.12;
      targetX = 0;
      targetY = THREE.MathUtils.lerp(0.42, 0.20, t);
      targetZ = THREE.MathUtils.lerp(8.0, 7.2, t);
      lookX = 0;
      lookY = 0;
      lookZ = 0;
    }

    this.targetPosition.x = targetX + (this.mouse.x * 0.40) + driftX;
    this.targetPosition.y = targetY - (this.mouse.y * 0.30) + driftY;
    this.targetPosition.z = targetZ;

    this.currentPosition.lerp(this.targetPosition, 0.055);
    this.instance.position.copy(this.currentPosition);

    this.targetLookAt.x = lookX + (this.mouse.x * 0.12);
    this.targetLookAt.y = lookY - (this.mouse.y * 0.08);
    this.targetLookAt.z = lookZ;

    this.currentLookAt.lerp(this.targetLookAt, 0.055);
    this.instance.lookAt(this.currentLookAt);
  }
}

export default ZavloCamera;
