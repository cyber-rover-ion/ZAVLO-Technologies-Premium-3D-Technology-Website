/**
 * ZAVLO TECHNOLOGIES — 3D MEDICAL DELIVERY DRONE (STAGE 6 PREMIUM PASS)
 * Precision autonomous medical logistics drone:
 * - Streamlined aerodynamic monocoque composite fuselage
 * - Sapphire photovoltaic solar matrix on spine
 * - 4 carbon-fiber cantilever arms & high-efficiency motor pods
 * - Dual-layer propellers (carbon blades + translucent rotor motion blur discs)
 * - Integrated cold-chain medical payload chamber with telemetry indicator
 * - Heavy-mass flight physics with banking, pitch, and hover stabilization
 */

import * as THREE from '../vendor/three.module.js';

export class ZavloDroneScene {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.droneMeshGroup = new THREE.Group();
    this.rotors = [];
    this.navLights = [];
    
    this.curve = null;
    this.flightLine = null;
    this.energyPackets = [];
    
    this.baseScale = 1.0;
    this.targetPos = new THREE.Vector3(2.4, 0.8, 0.5);
    this.currentPos = new THREE.Vector3().copy(this.targetPos);
    this.targetScale = 1.0;
    this.currentScale = 1.0;

    this.velocity = new THREE.Vector3();
    this.lastPos = new THREE.Vector3().copy(this.targetPos);

    this.init();
  }

  init() {
    this.group.add(this.droneMeshGroup);
    this.scene.add(this.group);

    this.buildDroneModel();
    this.buildFlightTrajectory();
  }

  buildDroneModel() {
    const d = this.droneMeshGroup;

    // 1. Aerodynamic Composite Fuselage (Upper Shell: Pure Medical White, Lower: Stealth Navy Carbon)
    const upperHullGeom = new THREE.CylinderGeometry(0.36, 0.46, 0.22, 24);
    const upperHullMat = new THREE.MeshStandardMaterial({
      color: 0xf4f8fc,
      roughness: 0.18,
      metalness: 0.82
    });
    const upperHull = new THREE.Mesh(upperHullGeom, upperHullMat);
    upperHull.scale.set(1.15, 1.0, 1.45);
    upperHull.position.y = 0.06;
    d.add(upperHull);

    // Aerodynamic Nose Fairing
    const noseGeom = new THREE.ConeGeometry(0.32, 0.48, 20);
    const nose = new THREE.Mesh(noseGeom, upperHullMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0.05, 0.62);
    nose.scale.set(1.1, 1.0, 0.85);
    d.add(nose);

    // Lower Carbon Chassis
    const lowerChassisGeom = new THREE.BoxGeometry(0.72, 0.14, 0.95);
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x08101e,
      roughness: 0.35,
      metalness: 0.90
    });
    const lowerChassis = new THREE.Mesh(lowerChassisGeom, carbonMat);
    lowerChassis.position.y = -0.06;
    d.add(lowerChassis);

    // 2. Sapphire Photovoltaic Upper Solar Array
    const solarGeom = new THREE.PlaneGeometry(0.68, 0.72);
    const solarMat = new THREE.MeshStandardMaterial({
      color: 0x061430,
      emissive: 0x0066ff,
      emissiveIntensity: 0.95,
      roughness: 0.08,
      metalness: 0.96
    });
    const solar = new THREE.Mesh(solarGeom, solarMat);
    solar.rotation.x = -Math.PI / 2;
    solar.position.y = 0.175;
    d.add(solar);

    // Solar Grid Line Divider
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x00c2ff, transparent: true, opacity: 0.6 });
    const gLine1 = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.015), gridMat);
    gLine1.rotation.x = -Math.PI / 2;
    gLine1.position.set(0, 0.178, 0);
    d.add(gLine1);

    const gLine2 = new THREE.Mesh(new THREE.PlaneGeometry(0.015, 0.72), gridMat);
    gLine2.rotation.x = -Math.PI / 2;
    gLine2.position.set(0, 0.178, 0);
    d.add(gLine2);

    // 3. Carbon-Fiber Quad Arms with Aerodynamic Motor Pods
    const armOffsets = [
      { x: 0.94, z: 0.84, dir: 1, isStarboard: true },
      { x: -0.94, z: 0.84, dir: -1, isStarboard: false },
      { x: 0.94, z: -0.84, dir: -1, isStarboard: true },
      { x: -0.94, z: -0.84, dir: 1, isStarboard: false }
    ];

    armOffsets.forEach((offset, idx) => {
      // Carbon Structural Strut
      const armGeom = new THREE.CylinderGeometry(0.028, 0.035, 1.28, 14);
      const arm = new THREE.Mesh(armGeom, carbonMat);
      arm.position.set(offset.x * 0.48, 0.0, offset.z * 0.48);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = Math.atan2(offset.z, offset.x);
      d.add(arm);

      // Motor Nacelle / Pod
      const motorGeom = new THREE.CylinderGeometry(0.075, 0.082, 0.16, 18);
      const motor = new THREE.Mesh(motorGeom, carbonMat);
      motor.position.set(offset.x, 0.06, offset.z);
      d.add(motor);

      // Rotor Group (Hub + Carbon Blades + Translucent High-Speed Spin Disc)
      const rotorGroup = new THREE.Group();
      rotorGroup.position.set(offset.x, 0.15, offset.z);

      // Carbon Dual Blades
      const bladeGeom = new THREE.BoxGeometry(0.74, 0.012, 0.045);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x182030,
        roughness: 0.25,
        metalness: 0.92
      });
      const blade = new THREE.Mesh(bladeGeom, bladeMat);
      rotorGroup.add(blade);

      // High-Speed Propeller Motion Blur Disc
      const discGeom = new THREE.RingGeometry(0.04, 0.38, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x00f0b5 : 0x00c2ff,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide
      });
      const disc = new THREE.Mesh(discGeom, discMat);
      disc.rotation.x = Math.PI / 2;
      rotorGroup.add(disc);

      d.add(rotorGroup);
      this.rotors.push({ group: rotorGroup, blade, dir: offset.dir });

      // Navigation LED Strobe Beacon
      const beaconGeom = new THREE.SphereGeometry(0.03, 12, 12);
      const beaconColor = offset.isStarboard ? 0x00f0b5 : 0x00c2ff;
      const beaconMat = new THREE.MeshBasicMaterial({ color: beaconColor });
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.set(offset.x, 0.08, offset.z);
      d.add(beacon);
      this.navLights.push({ mesh: beacon, phase: idx * 0.5 });
    });

    // 4. Secure Cold-Chain Medical Payload Chamber
    const payloadGeom = new THREE.BoxGeometry(0.48, 0.32, 0.52);
    const payloadMat = new THREE.MeshStandardMaterial({
      color: 0x060e1c,
      emissive: 0x00c2ff,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.88
    });
    const payload = new THREE.Mesh(payloadGeom, payloadMat);
    payload.position.set(0, -0.24, 0);
    d.add(payload);

    // Cold-Chain Telemetry Light Strip
    const stripMat = new THREE.MeshBasicMaterial({ color: 0x00f0b5 });
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.025), stripMat);
    strip.position.set(0, -0.15, 0.262);
    d.add(strip);

    // Medical Cross Insignia
    const crossMat = new THREE.MeshBasicMaterial({ color: 0x00f0b5 });
    const c1 = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.045), crossMat);
    c1.position.set(0, -0.25, 0.262);
    const c2 = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.16), crossMat);
    c2.position.set(0, -0.25, 0.262);
    d.add(c1);
    d.add(c2);

    // Payload Downward Inspection Spotlight
    const payloadLight = new THREE.PointLight(0x00f0b5, 2.2, 5.5);
    payloadLight.position.set(0, -0.42, 0);
    d.add(payloadLight);
  }

  buildFlightTrajectory() {
    this.curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(3.2, 1.2, -1.0),
      new THREE.Vector3(2.4, 0.8, 0.5),
      new THREE.Vector3(1.5, 0.0, 2.6),
      new THREE.Vector3(-1.6, 0.6, 1.0),
      new THREE.Vector3(-2.8, -0.4, -0.5),
      new THREE.Vector3(0.0, -1.2, 1.5),
      new THREE.Vector3(2.8, -0.8, -0.2),
      new THREE.Vector3(3.2, 1.2, -1.0)
    ]);
    this.curve.closed = true;

    const points = this.curve.getPoints(90);
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x00f0b5,
      dashSize: 0.35,
      gapSize: 0.18,
      transparent: true,
      opacity: 0.40,
      linewidth: 2
    });
    this.flightLine = new THREE.Line(lineGeom, lineMat);
    this.flightLine.computeLineDistances();
    this.group.add(this.flightLine);

    for (let i = 0; i < 4; i++) {
      const pGeom = new THREE.SphereGeometry(0.06, 12, 12);
      const pMat = new THREE.MeshBasicMaterial({ color: 0x70e5ff });
      const packet = new THREE.Mesh(pGeom, pMat);
      this.group.add(packet);
      this.energyPackets.push({ mesh: packet, offset: i * 0.25 });
    }
  }

  /**
   * Update Drone animation and smooth flight dynamics
   */
  update(time, scrollProgress = 0, mouseX = 0, mouseY = 0, isReducedMotion = false) {
    const spinSpeed = isReducedMotion ? 0.05 : 0.52;
    this.rotors.forEach(r => {
      r.group.rotation.y += spinSpeed * r.dir;
      r.blade.rotation.y += spinSpeed * r.dir * 1.6;
    });

    this.navLights.forEach(b => {
      const pulse = 0.5 + Math.sin(time * 5.0 + b.phase) * 0.5;
      b.mesh.scale.setScalar(pulse);
    });

    this.energyPackets.forEach(p => {
      const t = (time * 0.075 + p.offset) % 1.0;
      const pt = this.curve.getPoint(t);
      p.mesh.position.copy(pt);
    });

    if (isReducedMotion) {
      this.droneMeshGroup.position.set(2.2, 0.8 - scrollProgress * 1.2, 0.5);
      return;
    }

    const sp = scrollProgress;

    let targetX = 2.4, targetY = 0.8, targetZ = 0.5, targetScale = 1.0;
    let rollTarget = 0, pitchTarget = 0;

    if (sp < 0.14) {
      // Hero: Ambient holding pattern in upper-right
      targetX = 2.35 + Math.sin(time * 1.1) * 0.14;
      targetY = 0.78 + Math.cos(time * 0.95) * 0.10;
      targetZ = 0.5;
      targetScale = 0.95;
      rollTarget = Math.sin(time * 1.1) * 0.10;
      pitchTarget = Math.cos(time * 0.95) * 0.07;
    } else if (sp < 0.30) {
      // Mission: Glides across upper atmosphere
      const t = (sp - 0.14) / 0.16;
      targetX = THREE.MathUtils.lerp(2.35, -1.8, t);
      targetY = THREE.MathUtils.lerp(0.78, 1.35, t) + Math.sin(time * 1.4) * 0.08;
      targetZ = THREE.MathUtils.lerp(0.5, -0.9, t);
      targetScale = 0.85;
      rollTarget = -0.18;
      pitchTarget = -0.09;
    } else if (sp < 0.50) {
      // Logistics: Dominant in center-right showcase
      const t = (sp - 0.30) / 0.20;
      targetX = THREE.MathUtils.lerp(-1.8, 1.45, t) + Math.sin(time * 1.1) * 0.08;
      targetY = THREE.MathUtils.lerp(1.35, 0.02, t) + Math.cos(time * 1.3) * 0.07;
      targetZ = THREE.MathUtils.lerp(-0.9, 2.5, t);
      targetScale = 1.55;
      rollTarget = Math.sin(time * 1.6) * 0.20;
      pitchTarget = Math.cos(time * 1.3) * 0.12;
    } else if (sp < 0.80) {
      // Stations & Digital: Ascent into distance
      const t = (sp - 0.50) / 0.30;
      targetX = THREE.MathUtils.lerp(1.45, 3.1, t);
      targetY = THREE.MathUtils.lerp(0.02, 1.75, t);
      targetZ = THREE.MathUtils.lerp(2.5, -2.8, t);
      targetScale = 0.68;
      rollTarget = 0.12;
      pitchTarget = 0.08;
    } else {
      // Vision & Contact: Quiet distant patrol
      targetX = 2.7 + Math.sin(time * 0.75) * 0.18;
      targetY = 2.1 + Math.cos(time * 0.65) * 0.12;
      targetZ = -3.8;
      targetScale = 0.48;
      rollTarget = Math.sin(time * 0.75) * 0.08;
    }

    this.targetPos.set(targetX + (mouseX * 0.22), targetY - (mouseY * 0.18), targetZ);
    this.targetScale = targetScale;

    this.currentPos.lerp(this.targetPos, 0.045);
    this.currentScale += (this.targetScale - this.currentScale) * 0.045;

    this.droneMeshGroup.position.copy(this.currentPos);
    this.droneMeshGroup.scale.setScalar(this.baseScale * this.currentScale);

    // Controlled Banking and Stabilization
    this.droneMeshGroup.rotation.z += (rollTarget - this.droneMeshGroup.rotation.z) * 0.065;
    this.droneMeshGroup.rotation.x += (pitchTarget - this.droneMeshGroup.rotation.x) * 0.065;
    this.droneMeshGroup.rotation.y = Math.sin(time * 0.55) * 0.12 + (mouseX * 0.14);
  }

  dispose() {
    this.rotors.forEach(r => {
      r.blade.geometry.dispose();
      r.blade.material.dispose();
    });
    if (this.flightLine) {
      this.flightLine.geometry.dispose();
      this.flightLine.material.dispose();
    }
    this.energyPackets.forEach(p => {
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    });
    this.scene.remove(this.group);
  }
}

export default ZavloDroneScene;
