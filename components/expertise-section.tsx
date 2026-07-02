"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const ExpertiseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax scroll tracking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Video parallax — moves slower than scroll for depth effect
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1]);

  // Overlay opacity — stays dark for readability, slight intensity change on scroll
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0.7, 0.85, 0.9]);

  // Gold line width animation
  const lineWidth = useTransform(scrollYProgress, [0.1, 0.4], ["0%", "100%"]);

  const stats = [
    { value: "ISO 22716", label: "Certification" },
    { value: "100%", label: "Made in France" },
    { value: "Clean", label: "Beauty" },
  ];

  return (
    <motion.section
      ref={sectionRef}
      className="expertise-parallax-section"
      style={{ position: 'relative', zIndex: 2 }}
    >
      {/* Video Background with Parallax */}
      <div className="expertise-video-container">
        <motion.div
          className="expertise-video-wrapper"
          style={{ y: videoY, scale: videoScale }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="expertise-video"
          >
            <source
              src="https://www.laboratoirekea.com/cdn/shop/videos/c/vp/da277ddaace043d9b6033243a9277792/da277ddaace043d9b6033243a9277792.HD-1080p-7.2Mbps-61809986.mp4?v=0"
              type="video/mp4"
            />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        </motion.div>

        {/* Dynamic overlay that intensifies on scroll */}
        <motion.div
          className="expertise-overlay"
          style={{ opacity: overlayOpacity }}
        />

        {/* Grain texture overlay for cinematic feel */}
        <div className="expertise-grain" />
      </div>

      {/* Content Layer */}
      <div className="expertise-content">
        {/* Top badge */}
        <motion.div
          className="expertise-badge"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="expertise-badge-dot" />
          <span>Expertise &amp; Innovation</span>
        </motion.div>

        {/* Main heading with staggered reveal */}
        <div className="expertise-heading-group">
          <motion.h2
            className="expertise-heading"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            Votre Vision,
          </motion.h2>
          <motion.h2
            className="expertise-heading expertise-heading-gold"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          >
            Notre Expertise
          </motion.h2>
        </div>

        {/* Animated gold line */}
        <motion.div className="expertise-gold-line-container">
          <motion.div
            className="expertise-gold-line"
            style={{ width: lineWidth }}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          className="expertise-description"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        >
          L&apos;approche de conception et de formulation chez Cosmenova fusionne la chimie
          cosmétique, une connaissance approfondie du marché et l&apos;exploitation des
          dernières avancées technologiques — pour transformer un brief en produit
          prêt à industrialiser.
        </motion.p>

        {/* Stats row */}
        <motion.div
          className="expertise-stats"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.6 },
            },
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="expertise-stat"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <span className="expertise-stat-value">{stat.value}</span>
              <span className="expertise-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="expertise-cta-group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
        >
          <a href="#contact" className="expertise-cta">
            <span>Contactez-nous</span>
            <svg
              className="expertise-cta-arrow"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Top fade transition from previous section */}
      <div className="expertise-top-fade" />

      {/* Bottom fade transition to next section */}
      <div className="expertise-bottom-fade" />
    </motion.section>
  );
};
