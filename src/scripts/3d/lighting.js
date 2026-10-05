/**
 * ZAVLO TECHNOLOGIES — 3D CINEMATIC LIGHTING SETUP (STAGE 6 PREMIUM PASS)
 * Studio 3-point lighting + dynamic accent illuminators:
 * - Ambient baseline (Deep Sapphire context)
 * - Key light (5500K crisp white directional specular highlight)
 * - Fill light (Deep Indigo shadow definition)
 * - Rim accents (Electric Cyan & Pale Mint grazing lights)
 */

import * as THREE from '../vendor/three.module.js';

export class ZavloLighting {
  constructor(scene) {
    this.scene = scene;
    this.lights = {};

    this.initLights();
  }

  initLights() {
    // 1. Ambient Baseline (Deep Sapphire Context)
    const ambient = new THREE.AmbientLight(0x0a1426, 1.45);
    this.scene.add(ambient);
    this.lights.ambient = ambient;

    // 2. Key Light (Crisp White/Ice Specular Highlight)
    const keyLight = new THREE.DirectionalLight(0xf0f7ff, 2.9);
    keyLight.position.set(5.0, 8.0, 5.5);
    this.scene.add(keyLight);
    this.lights.keyLight = keyLight;

    // 3. Fill Light (Deep Indigo Shadow Illumination)
    const fillLight = new THREE.DirectionalLight(0x002e73, 1.7);
    fillLight.position.set(-5.5, -3.5, -2.5);
    this.scene.add(fillLight);
    this.lights.fillLight = fillLight;

    // 4. Sapphire Point Light (Upper Right Rich Blue Accent)
    const sapphirePoint = new THREE.PointLight(0x0066ff, 3.6, 14);
    sapphirePoint.position.set(2.6, 3.0, 3.5);
    this.scene.add(sapphirePoint);
    this.lights.sapphirePoint = sapphirePoint;

    // 5. Electric Cyan Point Light (Mid Curve Definition)
    const cyanPoint = new THREE.PointLight(0x00c2ff, 4.2, 11);
    cyanPoint.position.set(-2.0, 0.6, 3.0);
    this.scene.add(cyanPoint);
    this.lights.cyanPoint = cyanPoint;

    // 6. Vibrant Teal Point Light (Lower Wing & Rim Glow)
    const tealPoint = new THREE.PointLight(0x00f0b5, 4.6, 11);
    tealPoint.position.set(-2.2, -2.5, 2.8);
    this.scene.add(tealPoint);
    this.lights.tealPoint = tealPoint;
  }

  /**
   * Dynamic light modulation synchronized with scene clock
   */
  update(time, isReducedMotion = false) {
    if (isReducedMotion) return;

    // Gentle orbital sway for point lights to animate surface highlights
    const osc1 = Math.sin(time * 0.45) * 0.28;
    const osc2 = Math.cos(time * 0.38) * 0.22;

    if (this.lights.sapphirePoint) {
      this.lights.sapphirePoint.position.x = 2.6 + osc1;
      this.lights.sapphirePoint.position.y = 3.0 + osc2;
    }

    if (this.lights.cyanPoint) {
      this.lights.cyanPoint.position.y = 0.6 + Math.sin(time * 0.55) * 0.18;
    }

    if (this.lights.tealPoint) {
      this.lights.tealPoint.position.x = -2.2 - osc1 * 0.5;
      this.lights.tealPoint.position.y = -2.5 + osc2 * 0.5;
    }
  }
}

export default ZavloLighting;
