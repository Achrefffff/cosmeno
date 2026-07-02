"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 15, z: 200 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalSections = 3;

  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    particles: THREE.Points | null;
    atmosphere: THREE.Mesh | null;
    animationId: number | null;
    targetCameraX: number;
    targetCameraY: number;
    targetCameraZ: number;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    particles: null,
    atmosphere: null,
    animationId: null,
    targetCameraX: 0,
    targetCameraY: 15,
    targetCameraZ: 200,
  });

  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;

      // Scene - fond noir profond
      refs.scene = new THREE.Scene();
      refs.scene.background = new THREE.Color(0x050510);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        5000
      );
      refs.camera.position.set(0, 15, 200);
      refs.camera.lookAt(0, 0, -200);

      if (!canvasRef.current) return;

      // Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: false
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 1.5;

      // Composer with bloom
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.3,  // strength - réduit pour éviter la saturation
        0.15,  // radius
        0.15   // threshold - augmenté pour ne bloomer que les zones très lumineuses
      );
      refs.composer.addPass(bloomPass);

      // Create scene elements - On remet la couleur (nebula) et les particules
      createStars();
      createNebula();
      createParticles();
      
      animate();
      setIsReady(true);
    };

    // --- STARS ---
    const createStars = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;

      const starCount = 6000;

      for (let layer = 0; layer < 3; layer++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
          const radius = 100 + layer * 300 + Math.random() * 400;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.5;
          positions[i * 3 + 2] = radius * Math.cos(phi) - 400;

          // Bright star colors - white, silver & gold
          const colorChoice = Math.random();
          const color = new THREE.Color();
          if (colorChoice < 0.5) {
            color.setHSL(0, 0, 0.85 + Math.random() * 0.15); // Pure white
          } else if (colorChoice < 0.75) {
            color.setHSL(0, 0, 0.7 + Math.random() * 0.15); // Silver/grey
          } else if (colorChoice < 0.95) {
            color.setHSL(0.1, 0.6, 0.55 + Math.random() * 0.2); // Gold/warm
          } else {
            color.setHSL(0, 0, 0.95 + Math.random() * 0.05); // Bright white
          }

          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;
          sizes[i] = Math.random() * 3 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            layer: { value: layer }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float layer;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              float speed = 0.02 * (1.0 - layer * 0.25);
              float angle = time * speed;
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xz = rot * pos.xz;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (250.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
              alpha = pow(alpha, 1.5);
              gl_FragColor = vec4(vColor, alpha);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    // --- NEBULA (CHAMPAGNE BACKGROUND) ---
    const createNebula = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;

      const geometry = new THREE.SphereGeometry(1500, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xf5f5dc) }, // Beige pur
          color2: { value: new THREE.Color(0xe5d3b3) }, // Sable / Nude
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float time;
          varying vec2 vUv;
          void main() {
            // Un mélange de beige et sable parfaitement uniforme et plein
            float noise = sin(vUv.x * 2.0 + time * 0.05) * cos(vUv.y * 2.0 + time * 0.08);
            vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        side: THREE.BackSide,
        depthWrite: false
      });

      const background = new THREE.Mesh(geometry, material);
      refs.scene.add(background);
      refs.nebula = background;
    };

    // --- FLOATING PARTICLES ---
    const createParticles = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;

      const count = 3000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 500;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 300;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800 - 200;
        sizes[i] = Math.random() * 2 + 0.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Create a circular texture for particles
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(200,200,200,0.8)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      const texture = new THREE.CanvasTexture(canvas);

      const material = new THREE.PointsMaterial({
        color: 0xf1e5ac, // Or brillant
        size: 2.2,
        map: texture,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      });

      refs.particles = new THREE.Points(geometry, material);
      refs.scene.add(refs.particles);
    };

    // --- ATMOSPHERE GLOW ---
    const createAtmosphere = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;

      const geometry = new THREE.SphereGeometry(400, 48, 48);
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float rim = 1.0 - abs(dot(vNormal, viewDir));
            rim = pow(rim, 3.0);
            
            vec3 color1 = vec3(0.6, 0.55, 0.4); // Warm gold - plus subtil
            vec3 color2 = vec3(0.5, 0.5, 0.55); // Silver - plus subtil
            float pulse = sin(time * 0.5) * 0.15 + 0.85;
            vec3 color = mix(color1, color2, rim) * pulse;
            
            gl_FragColor = vec4(color, rim * 0.3);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
      });

      refs.atmosphere = new THREE.Mesh(geometry, material);
      refs.scene.add(refs.atmosphere);
    };

    // --- ANIMATION LOOP ---
    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Rotate stars
      refs.stars.forEach((starField) => {
        if (starField.material instanceof THREE.ShaderMaterial) {
          starField.material.uniforms.time.value = time;
        }
      });

      // Animate nebula
      if (refs.scene) {
        refs.scene.children.forEach((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial &&
            child.material.uniforms.time) {
            child.material.uniforms.time.value = time * 0.5 + (child.position.z * 0.001);
          }
        });
      }

      // Float particles
      if (refs.particles) {
        const positions = refs.particles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time + positions[i] * 0.01) * 0.002;
        }
        refs.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth camera
      if (refs.camera) {
        const smoothFactor = 0.04;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothFactor;

        const floatX = Math.sin(time * 0.08) * 3;
        const floatY = Math.cos(time * 0.12) * 2;

        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 0, -400);
      }

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    initThree();

    // Handle resize
    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      const { current: refs } = threeRefs;
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);
      if (refs.renderer) refs.renderer.dispose();
    };
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!isReady) return;

    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: 'visible'
    });

    const tl = gsap.timeline();
    if (menuRef.current) {
      tl.from(menuRef.current, { x: -80, opacity: 0, duration: 1, ease: "power3.out" });
    }
    if (titleRef.current) {
      tl.from(titleRef.current, {
        y: 150, opacity: 0, duration: 1.5, ease: "power4.out"
      }, "-=0.5");
    }
    if (subtitleRef.current) {
      tl.from(subtitleRef.current, {
        y: 40, opacity: 0, duration: 1.2, ease: "power3.out"
      }, "-=0.8");
    }
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0, y: 30, duration: 1, ease: "power2.out"
      }, "-=0.5");
    }
    return () => { tl.kill(); };
  }, [isReady]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Progression uniquement dans le hero container (0 à 1)
      const scrolledInContainer = -rect.top;
      const maxScroll = containerHeight - windowHeight;
      const progress = Math.max(0, Math.min(scrolledInContainer / maxScroll, 1));

      setScrollProgress(progress);
      const newSection = Math.floor(progress * totalSections);
      setCurrentSection(Math.min(newSection, totalSections - 1));

      // Cacher le wrapper fixed quand on dépasse le hero container
      const wrapper = container.querySelector('.hero-sticky-wrapper') as HTMLElement;
      if (wrapper) {
        if (rect.bottom <= 0) {
          wrapper.style.display = 'none';
        } else {
          wrapper.style.display = '';
        }
      }

      const { current: refs } = threeRefs;

      // Camera journey through space
      const startZ = 200;
      const endZ = -800;
      const targetZ = startZ + (endZ - startZ) * progress;

      const startY = 15;
      const endY = 5;
      const targetY = startY + (endY - startY) * progress;

      const startX = 0;
      const endX = 20;
      const targetX = startX + (endX - startX) * progress;

      refs.targetCameraX = targetX;
      refs.targetCameraY = targetY;
      refs.targetCameraZ = targetZ;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const sections = [
    {
      title: "Cosmenova",
      subtitle: "Laboratoire Cosmétique full-service & Parfum Français.",
      subtitle2: "CLEAN BEAUTY — ISO 22716",
      desc: "Partenaire stratégique",
      longDesc: "De la R&D sur-mesure à l'industrialisation, Cosmenova sécurise vos lancements : formulation sur-mesure, qualité audit-proof et fabrication française."
    },
    {
      title: "EXPERTISE",
      subtitle: "R&D sur-mesure et Formulation innovante.",
      subtitle2: "QUALITÉ & RIGUEUR SCIENTIFIQUE",
      desc: "Savoir-faire",
      longDesc: "Nos experts accompagnent votre marque dans la création de produits d'exception, alliant naturalité et performance technologique."
    },
    {
      title: "PROVISION",
      subtitle: "Industrialisation et Fabrication française.",
      subtitle2: "AGILITÉ & RÉACTIVITÉ",
      desc: "Production",
      longDesc: "Une capacité de production flexible pour répondre à vos besoins, du prototype à la grande série, dans le respect total des normes BPF."
    }
  ];

  const currentData = sections[currentSection];

  return (
    <div ref={containerRef} className="hero-container">
      <div className="hero-sticky-wrapper">
        <canvas ref={canvasRef} className="hero-canvas" />

        {/* Side Menu */}
        <div ref={menuRef} className="side-menu" style={{ visibility: 'hidden' }}>
          <div className="vertical-text">Cosmenova</div>
        </div>

        {/* Hero Content */}
        <div className="hero-content" key={currentSection}>
          <div className="hero-section-indicator">
            <span className="section-number">0{currentSection + 1}</span>
            <span className="section-total">/ 03</span>
          </div>

          <h1 ref={titleRef} className="hero-title">
            {currentData.title.split('').map((char, i) => (
              <span key={i} className="title-char" style={{ animationDelay: `${i * 0.05}s` }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          <div ref={subtitleRef} className="hero-subtitle">
            <p className="subtitle-line gradient-text">
              {currentData.desc}
            </p>
            <p className="subtitle-line-2">{currentData.subtitle}</p>
            <p className="subtitle-line-3">{currentData.subtitle2}</p>
            {currentData.longDesc && (
              <p className="text-[#1a1510]/80 text-base max-w-lg mx-auto mt-6 font-medium leading-relaxed">
                {currentData.longDesc}
              </p>
            )}
          </div>


        </div>

        {/* Scroll Progress */}
        <div ref={scrollProgressRef} className="scroll-progress" style={{ visibility: 'hidden' }}>
          <div className="scroll-text">DÉCOUVRIR</div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${scrollProgress * 100}%` }} />
            <div className="progress-dot" style={{ left: `${scrollProgress * 100}%` }} />
          </div>
          <div className="section-counter">
            {String(currentSection + 1).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Scroll Sections (spacers for scroll height) */}
      <div ref={sectionsRef} className="scroll-sections">
        {sections.map((section, index) => (
          <section key={index} className="content-section" />
        ))}
      </div>
    </div>
  );
};