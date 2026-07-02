"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';

const piliers = [
  {
    tag: "R&D & CLEAN SCIENCE",
    title: "R&D Cosmétique : Formulation Sur-Mesure",
    description:
      "Du cahier des charges au lot pilote, nous concevons des textures performantes et sûres, dans une approche Clean Beauty pragmatique.",
    image: "/images/pilier-rd.png",
  },
  {
    tag: "PARFUMERIE & FAÇONNAGE",
    title: "Parfum Français : création & process",
    description:
      "De l'idée au flaconnage : composition, macération, glaçage, filtration — avec application des Standards IFRA.",
    image: "/images/pilier-parfum.png",
  },
  {
    tag: "QUALITÉ & RÉGLEMENTATION",
    title: "Qualité & conformité inébranlables",
    description:
      "Production sous ISO 22716 (BPF) et dossiers PIF conformes au Règlement (CE) n°1223/2009 : traçabilité, auditabilité.",
    image: "/images/pilier-qualite.png",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const PiliersSection = () => {
  return (
    <section 
      id="expertise"
      className="relative py-32 px-6 md:px-12 lg:px-24 bg-[#eae3ce]"
      style={{
        zIndex: 2,
        background: 'linear-gradient(180deg, #eae3ce 0%, #f5f5dc 100%)',
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <motion.div
          className="mb-20 max-w-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-[#1a1510] tracking-tight mb-6"
            variants={itemVariants}
          >
            Les piliers d&apos;expertise
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-[#1a1510]/80 font-medium leading-relaxed"
            variants={itemVariants}
          >
            Trois domaines qui font la différence : <span className="font-bold text-[#b8860b]">R&D & Clean Science</span>, <span className="font-bold text-[#b8860b]">Parfumerie & Façonnage</span>, <span className="font-bold text-[#b8860b]">Qualité & Réglementation</span> — pour des lancements performants et maîtrisés.
          </motion.p>
        </motion.div>

        {/* Pillars Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {piliers.map((pilier, index) => (
            <motion.div
              key={index}
              className="group relative flex flex-col h-[600px] rounded-2xl overflow-hidden cursor-pointer bg-[#1a1510]"
              variants={itemVariants}
            >
              {/* Image Container with Zoom effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${pilier.image})` }}
                />
              </div>

              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

              {/* Content Box (Aligned to Bottom) */}
              <div className="relative mt-auto p-8 md:p-10 flex flex-col z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                {/* Tag */}
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase mb-4 text-[#d4a84b]">
                  {pilier.tag}
                </span>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  {pilier.title}
                </h3>

                {/* Description (Fades in slightly on hover or just stays clean) */}
                <p className="text-white/70 text-base leading-relaxed font-light">
                  {pilier.description}
                </p>

                {/* Subtle separator line */}
                <div className="w-0 h-[1px] bg-[#d4a84b] mt-6 group-hover:w-12 transition-all duration-700 ease-out" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
