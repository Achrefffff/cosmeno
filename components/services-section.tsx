"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
  {
    num: "01",
    tag: "Service",
    title: "Façonnage",
    description:
      "Vous avez la formule ? Nous industrialisons : mélange, contrôles, remplissage/sertissage, traçabilité — ISO 22716.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    num: "02",
    tag: "Service",
    title: "Clé en Main",
    description:
      "Du concept au prêt-à-vendre : formulation, tests, PIF/DIP, fabrication & conditionnement sous référentiel ISO 22716.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    ),
  },
  {
    num: "03",
    tag: "Service",
    title: "Marque Blanche",
    description:
      "Lancement rapide : formules éprouvées (soins & Parfum Français) personnalisées en branding & pack, dans l'esprit Clean Beauty.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

export const ServicesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      className="relative py-32 px-6 md:px-12 lg:px-24 bg-[#f5f5dc]"
      style={{
        zIndex: 2,
        background: 'linear-gradient(180deg, #f5f5dc 0%, #eae3ce 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase mb-6 text-[#b8860b]">
              Full-Service Professionnel
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-[#1a1510] tracking-tight">
              Choisissez votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8860b] to-[#d4a84b]">
                trajectoire
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-sm"
          >
            <p className="text-lg text-[#1a1510]/70 font-medium leading-relaxed">
              Un seul pilote pour vos lancements rapides et conformes — Formulation Sur-Mesure, process ISO 22716 et philosophie Clean Beauty.
            </p>
          </motion.div>
        </div>

        {/* Services List (Editorial Style) */}
        <div className="border-t border-[#1a1510]/10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative border-b border-[#1a1510]/10 py-10 md:py-16 flex flex-col md:flex-row md:items-center gap-8 cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated Gold Bottom Border on Hover */}
              <div 
                className="absolute bottom-0 left-0 h-[1px] bg-[#b8860b] transition-all duration-700 ease-out"
                style={{
                  width: hoveredIndex === index ? '100%' : '0%',
                  opacity: hoveredIndex === index ? 1 : 0
                }}
              />

              {/* Number */}
              <div className="w-full md:w-[15%]">
                <span className="text-2xl md:text-3xl font-light text-[#1a1510]/30 group-hover:text-[#b8860b] transition-colors duration-500">
                  {service.num}
                </span>
              </div>

              {/* Title & Icon */}
              <div className="w-full md:w-[40%] flex items-center gap-6">
                <div className="text-[#1a1510]/50 group-hover:text-[#b8860b] transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-[-5deg]">
                  {service.icon}
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1510] group-hover:translate-x-4 transition-transform duration-500 ease-out">
                  {service.title}
                </h3>
              </div>

              {/* Description & Action */}
              <div className="w-full md:w-[45%] flex flex-col items-start md:items-end text-left md:text-right gap-6">
                <p className="text-[#1a1510]/70 text-lg leading-relaxed max-w-md font-medium group-hover:text-[#1a1510] transition-colors duration-500">
                  {service.description}
                </p>

              </div>

              {/* Hover Background Glow */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b8860b]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
