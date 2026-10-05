/**
 * ZAVLO TECHNOLOGIES — ORBITAL SYSTEM (STAGE 6 PREMIUM PASS)
 * Sophisticated healthcare/data-energy core with dual gyroscopic tracks,
 * luminous corona, and orbiting telemetry data markers
 */

import * as THREE from '../vendor/three.module.js';

export class ZavloOrbitalSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.orbitRadius = 2.45;
    
    this.primaryRing = null;
    this.secondaryRing = null;
    this.sphereMesh = null;
    this.glowMesh = null;
    this.pointLight = null;
    this.telemetryNodes = [];

    this.ringRotationX = Math.PI * 0.36;
    this.ringRotationY = Math.PI * 0.16;

    this.init();
  }

  init() {
    this.scene.add(this.group);
    this.createOrbitalTracks();
    this.createLuminousSphere();
    this.createTelemetryNodes();
  }

  createOrbitalTracks() {
    // 1. Primary Precision Orbital Torus Ring
    const ringGeometry = new THREE.TorusGeometry(this.orbitRadius, 0.012, 16, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0b5,
      transparent: true,
      opacity: 0.42
    });

    this.primaryRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.primaryRing.rotation.x = this.ringRotationX;
    this.primaryRing.rotation.y = this.ringRotationY;
    this.group.add(this.primaryRing);

    // 2. Secondary Subtle Gyroscopic Counter-Orbit Track
    const secGeometry = new THREE.TorusGeometry(this.orbitRadius * 1.08, 0.006, 12, 96);
    const secMaterial = new THREE.MeshBasicMaterial({
      color: 0x00c2ff,
      transparent: true,
      opacity: 0.20
    });

    this.secondaryRing = new THREE.Mesh(secGeometry, secMaterial);
    this.secondaryRing.rotation.x = -Math.PI * 0.28;
    this.secondaryRing.rotation.y = Math.PI * 0.32;
    this.group.add(this.secondaryRing);
  }

  createLuminousSphere() {
    // 1. Core Sphere (Healthcare / Data Energy Core)
    const sphereGeometry = new THREE.SphereGeometry(0.16, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0b5,
      emissive: 0x00f0b5,
      emissiveIntensity: 2.2,
      roughness: 0.10,
      metalness: 0.90
    });

    this.sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.group.add(this.sphereMesh);

    // 2. Additive Corona Glow Mesh (Safeguarded Shader)
    const glowGeometry = new THREE.SphereGeometry(0.32, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0x00f0b5) },
        viewVector: { value: new THREE.Vector3(0, 0, 1) }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          vec3 vNormView = normalize(viewVector);
          intensity = pow(max(0.0, 0.85 - dot(vNormal, vNormView)), 2.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity * 1.6;
          gl_FragColor = vec4(glow, intensity * 0.65);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });

    this.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    this.group.add(this.glowMesh);

    // 3. Local Dynamic Point Light
    this.pointLight = new THREE.PointLight(0x00f0b5, 2.8, 6.5);
    this.group.add(this.pointLight);
  }

  createTelemetryNodes() {
    // Micro data telemetry markers orbiting on track
    const nodeGeom = new THREE.SphereGeometry(0.035, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0x70e5ff,
      transparent: true,
      opacity: 0.85
    });

    for (let i = 0; i < 3; i++) {
      const node = new THREE.Mesh(nodeGeom, nodeMat);
      this.group.add(node);
      this.telemetryNodes.push({ mesh: node, offset: (i + 1) * (Math.PI * 2 / 3) });
    }
  }

  getOrbitCoordinates(angle, radius = this.orbitRadius, rotX = this.ringRotationX, rotY = this.ringRotationY) {
    const rawX = Math.cos(angle) * radius;
    const rawZ = Math.sin(angle) * radius;

    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const posX = rawX * cosY - rawZ * sinY;
    const posY = (rawZ * cosY + rawX * sinY) * sinX;
    const posZ = (rawZ * cosY + rawX * sinY) * cosX;

    return { x: posX, y: posY, z: posZ };
  }

  /**
   * Synchronize position and scale with Z emblem
   */
  syncWithEmblem(emblemPos, emblemScale) {
    if (!this.group) return;
    this.group.position.copy(emblemPos);
    this.group.scale.setScalar(emblemScale);
  }

  update(time, isReducedMotion = false) {
    if (!this.sphereMesh) return;

    const orbitSpeed = isReducedMotion ? 0.3 : time * 0.60;
    const pos = this.getOrbitCoordinates(orbitSpeed);

    this.sphereMesh.position.set(pos.x, pos.y, pos.z);

    if (this.glowMesh) {
      this.glowMesh.position.set(pos.x, pos.y, pos.z);
    }

    if (this.pointLight) {
      this.pointLight.position.set(pos.x, pos.y, pos.z);
    }

    // Telemetry nodes movement
    this.telemetryNodes.forEach(node => {
      const nPos = this.getOrbitCoordinates(orbitSpeed + node.offset);
      node.mesh.position.set(nPos.x, nPos.y, nPos.z);
    });

    // Emissive breathing pulse
    if (!isReducedMotion && this.sphereMesh.material) {
      const pulse = 2.0 + Math.sin(time * 2.2) * 0.45;
      this.sphereMesh.material.emissiveIntensity = pulse;
    }

    // Slow gyroscopic drift of secondary ring
    if (!isReducedMotion && this.secondaryRing) {
      this.secondaryRing.rotation.z = time * 0.08;
    }
  }

  dispose() {
    if (this.primaryRing) {
      this.primaryRing.geometry.dispose();
      this.primaryRing.material.dispose();
    }
    if (this.secondaryRing) {
      this.secondaryRing.geometry.dispose();
      this.secondaryRing.material.dispose();
    }
    if (this.sphereMesh) {
      this.sphereMesh.geometry.dispose();
      this.sphereMesh.material.dispose();
    }
    if (this.glowMesh) {
      this.glowMesh.geometry.dispose();
      this.glowMesh.material.dispose();
    }
    this.telemetryNodes.forEach(n => {
      n.mesh.geometry.dispose();
      n.mesh.material.dispose();
    });
    this.scene.remove(this.group);
  }
}

export default ZavloOrbitalSystem;
