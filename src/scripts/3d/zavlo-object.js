/**
 * ZAVLO TECHNOLOGIES — 3D SCULPTED EMBLEM (STAGE 6 PREMIUM PASS)
 * Precision manufactured medical technology centerpiece:
 * - Sculpted aerodynamic Z-Ribbon shell with chamfered precision bevels
 * - Luminescent internal core energy spine
 * - High-grade composite sapphire → cyan → teal shader with multi-lobe specular sheen
 * - Responsive viewport scale and smooth scroll-driven spatial depth
 */

import * as THREE from '../vendor/three.module.js';

export class ZavloObject {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.mesh = null;
    this.innerSpine = null;
    this.material = null;
    this.spineMaterial = null;
    this.geometry = null;
    this.spineGeometry = null;

    this.baseScale = 1.25;
    this.entranceProgress = 1.0;

    this.targetPos = new THREE.Vector3(0, 0, 0);
    this.currentPos = new THREE.Vector3(0, 0, 0);
    this.targetScale = 1.0;
    this.currentScale = 1.0;
    this.targetOpacity = 1.0;

    this.init();
  }

  init() {
    this.scene.add(this.group);

    // 1. Primary Sculpted Z-Ribbon Body
    this.geometry = this.buildRibbonGeometry();
    this.material = this.buildCustomShaderMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.group.add(this.mesh);

    // 2. Embedded Luminescent Core Energy Spine
    this.spineGeometry = this.buildSpineGeometry();
    this.spineMaterial = this.buildSpineMaterial();
    this.innerSpine = new THREE.Mesh(this.spineGeometry, this.spineMaterial);
    this.group.add(this.innerSpine);

    this.group.scale.set(this.baseScale, this.baseScale, this.baseScale);
  }

  buildRibbonGeometry() {
    const shape = new THREE.Shape();

    // High-precision smooth curvature contour for ZAVLO Ribbon Form
    shape.moveTo(-1.68, 1.15);
    shape.bezierCurveTo(-1.08, 1.45, 0.82, 1.45, 1.72, 1.10);
    shape.bezierCurveTo(2.12, 0.94, 2.02, 0.60, 1.52, 0.50);
    shape.bezierCurveTo(0.62, 0.30, -0.40, 0.02, -0.95, -0.50);
    shape.bezierCurveTo(-1.35, -0.90, -0.95, -1.40, 0.45, -1.44);
    shape.bezierCurveTo(1.38, -1.50, 1.78, -1.34, 1.92, -1.06);
    shape.bezierCurveTo(2.00, -0.84, 1.70, -0.64, 1.34, -0.70);
    shape.bezierCurveTo(0.14, -0.80, -0.40, -0.60, -0.10, -0.14);
    shape.bezierCurveTo(0.30, 0.36, 1.22, 0.76, -0.90, 0.82);
    shape.bezierCurveTo(-1.68, 0.82, -1.92, 0.96, -1.68, 1.15);

    const extrudeSettings = {
      steps: 3,
      depth: 0.38,
      bevelEnabled: true,
      bevelThickness: 0.20,
      bevelSize: 0.15,
      bevelOffset: 0,
      bevelSegments: 10,
      curveSegments: 48
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
  }

  buildSpineGeometry() {
    const shape = new THREE.Shape();

    // Slender interior core curve
    shape.moveTo(-1.45, 1.02);
    shape.bezierCurveTo(-0.90, 1.25, 0.65, 1.25, 1.45, 0.95);
    shape.bezierCurveTo(1.65, 0.85, 1.45, 0.65, 1.05, 0.55);
    shape.bezierCurveTo(0.35, 0.35, -0.55, 0.05, -0.85, -0.40);
    shape.bezierCurveTo(-1.10, -0.75, -0.65, -1.15, 0.35, -1.22);
    shape.bezierCurveTo(1.05, -1.25, 1.35, -1.15, 1.45, -0.95);
    shape.bezierCurveTo(1.35, -0.80, 0.95, -0.85, 0.05, -0.72);
    shape.bezierCurveTo(-0.35, -0.50, 0.15, 0.25, -0.75, 0.70);
    shape.bezierCurveTo(-1.40, 0.75, -1.55, 0.88, -1.45, 1.02);

    const extrudeSettings = {
      steps: 2,
      depth: 0.18,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 6,
      curveSegments: 36
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    return geometry;
  }

  buildCustomShaderMaterial() {
    const colorSapphire = new THREE.Color('#004cd6');
    const colorCyan = new THREE.Color('#00c2ff');
    const colorTeal = new THREE.Color('#00f0b5');
    const colorMint = new THREE.Color('#98fce0');

    return new THREE.ShaderMaterial({
      uniforms: {
        uColorSapphire: { value: colorSapphire },
        uColorCyan: { value: colorCyan },
        uColorTeal: { value: colorTeal },
        uColorMint: { value: colorMint },
        uLightPos: { value: new THREE.Vector3(5.0, 8.0, 5.5) },
        uRimLightPos: { value: new THREE.Vector3(-4.5, -3.0, 3.5) },
        uTime: { value: 0 },
        uEntrance: { value: 1.0 },
        uOpacity: { value: 1.0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorSapphire;
        uniform vec3 uColorCyan;
        uniform vec3 uColorTeal;
        uniform vec3 uColorMint;
        uniform vec3 uLightPos;
        uniform vec3 uRimLightPos;
        uniform float uTime;
        uniform float uEntrance;
        uniform float uOpacity;

        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // 1. Multi-Stage ZAVLO Tri-Color Gradient with Subtle Dynamic Current
          float wave = sin(vWorldPosition.y * 2.5 + uTime * 0.8) * 0.06;
          float heightFactor = clamp((vWorldPosition.y + 1.35) / 2.7 + wave, 0.0, 1.0);
          
          vec3 gradientColor;
          if (heightFactor > 0.52) {
            float t = (heightFactor - 0.52) / 0.48;
            gradientColor = mix(uColorCyan, uColorSapphire, smoothstep(0.0, 1.0, t));
          } else {
            float t = heightFactor / 0.52;
            gradientColor = mix(uColorTeal, uColorCyan, smoothstep(0.0, 1.0, t));
          }

          // 2. Primary Key Specular Highlighting (Gloss Ceramic / Polished Composite)
          vec3 lightDir = normalize(uLightPos - vWorldPosition);
          float diff = max(dot(normal, lightDir), 0.0);
          
          vec3 halfDir = normalize(lightDir + viewDir);
          float sharpSpec = pow(max(dot(normal, halfDir), 0.0), 64.0);
          float glossSpec = pow(max(dot(normal, halfDir), 0.0), 16.0);

          // 3. Secondary Rim / Grazing Highlight
          vec3 rimLightDir = normalize(uRimLightPos - vWorldPosition);
          float rimDiff = max(dot(normal, rimLightDir), 0.0);

          // 4. True Fresnel Edge Corona (Medical Cyan / Mint Glint)
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.6);
          vec3 rimColor = mix(uColorTeal, uColorMint, 0.4);

          // 5. Final Color Composition
          vec3 ambient = vec3(0.018, 0.04, 0.08);
          vec3 diffuseContrib = gradientColor * (diff * 0.78 + rimDiff * 0.15 + 0.12);
          vec3 specularContrib = vec3(1.0) * (sharpSpec * 0.65 + glossSpec * 0.22);
          vec3 rimContrib = rimColor * (fresnel * 0.75 + rimDiff * 0.2);

          vec3 finalColor = (ambient + diffuseContrib + specularContrib + rimContrib) * uEntrance;
          float alpha = uOpacity * uEntrance;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }

  buildSpineMaterial() {
    return new THREE.MeshBasicMaterial({
      color: 0x00f0b5,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
  }

  setResponsiveScale(viewportWidth) {
    if (!this.group) return;
    if (viewportWidth < 480) {
      this.baseScale = 0.85;
    } else if (viewportWidth <= 768) {
      this.baseScale = 0.95;
    } else if (viewportWidth <= 1200) {
      this.baseScale = 1.15;
    } else {
      this.baseScale = 1.25;
    }
  }

  setEntrance(progress) {
    this.entranceProgress = progress;
    if (this.material && this.material.uniforms) {
      this.material.uniforms.uEntrance.value = progress;
    }
    if (this.spineMaterial) {
      this.spineMaterial.opacity = 0.35 * progress;
    }
  }

  /**
   * Scroll-linked 3D depth choreography
   */
  update(time, scrollProgress = 0, mouseX = 0, mouseY = 0, isReducedMotion = false) {
    if (!this.group) return;

    if (this.material && this.material.uniforms) {
      this.material.uniforms.uTime.value = time;
    }

    if (this.spineMaterial && !isReducedMotion) {
      this.spineMaterial.opacity = 0.25 + Math.sin(time * 2.0) * 0.12;
    }

    const sp = scrollProgress;

    if (sp < 0.12) {
      // Hero: Centerpiece Dominant
      const t = sp / 0.12;
      this.targetPos.set(0, THREE.MathUtils.lerp(0.08, 0.75, t), THREE.MathUtils.lerp(0, -1.4, t));
      this.targetScale = THREE.MathUtils.lerp(1.0, 0.72, t);
      this.targetOpacity = 1.0;
    } else if (sp < 0.32) {
      // Mission: Glides up & back into upper atmosphere
      const t = (sp - 0.12) / 0.20;
      this.targetPos.set(0, THREE.MathUtils.lerp(0.75, 1.9, t), THREE.MathUtils.lerp(-1.4, -4.8, t));
      this.targetScale = THREE.MathUtils.lerp(0.72, 0.32, t);
      this.targetOpacity = THREE.MathUtils.lerp(1.0, 0.38, t);
    } else if (sp < 0.80) {
      // Logistics / Stations / Digital: Quiet celestial anchor
      this.targetPos.set(0, 2.6, -8.2);
      this.targetScale = 0.14;
      this.targetOpacity = 0.08;
    } else {
      // Vision & Contact: Re-emerges calmly in background
      const t = (sp - 0.80) / 0.20;
      this.targetPos.set(0, THREE.MathUtils.lerp(2.6, 0.45, t), THREE.MathUtils.lerp(-8.2, -2.4, t));
      this.targetScale = THREE.MathUtils.lerp(0.14, 0.52, t);
      this.targetOpacity = THREE.MathUtils.lerp(0.08, 0.65, t);
    }

    if (isReducedMotion) {
      this.group.position.copy(this.targetPos);
      this.group.scale.setScalar(this.baseScale * this.targetScale);
      return;
    }

    this.currentPos.lerp(this.targetPos, 0.055);
    this.currentScale += (this.targetScale - this.currentScale) * 0.055;

    const floatY = Math.sin(time * 0.65) * 0.055;
    this.group.position.set(
      this.currentPos.x,
      this.currentPos.y + floatY,
      this.currentPos.z
    );

    const activeScale = this.baseScale * this.currentScale * Math.min(1.0, 0.3 + this.entranceProgress * 0.7);
    this.group.scale.set(activeScale, activeScale, activeScale);

    if (this.material && this.material.uniforms) {
      this.material.uniforms.uOpacity.value = this.targetOpacity;
    }

    const baseRotY = Math.sin(time * 0.3) * 0.08;
    this.group.rotation.y = baseRotY + (mouseX * 0.16);
    this.group.rotation.x = (mouseY * -0.10) + (sp * 0.18);
  }

  dispose() {
    if (this.geometry) this.geometry.dispose();
    if (this.spineGeometry) this.spineGeometry.dispose();
    if (this.material) this.material.dispose();
    if (this.spineMaterial) this.spineMaterial.dispose();
    if (this.group) this.scene.remove(this.group);
  }
}

export default ZavloObject;
