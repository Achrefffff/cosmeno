"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Service Professionnel", href: "#services" },
    { name: "Les piliers d'expertise", href: "#expertise" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed w-full z-50 top-0 start-0 transition-all duration-300 ${
      scrolled 
        ? "bg-[#f5f5dc]/90 backdrop-blur-md border-b border-[#1a1510]/10 py-2" 
        : "bg-transparent py-4"
    }`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center relative overflow-hidden w-40 md:w-48 h-12">
          <img src="/images/cosmenova.png" alt="Cosmenova" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[250px] max-w-none" />
        </Link>

        {/* Mobile Toggle */}
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white/70 rounded-lg md:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-controls="navbar-sticky"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Nav Links */}
        <div
          className={`${isOpen ? "block" : "hidden"
            } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-white/10 rounded-lg bg-black/30 backdrop-blur-sm md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent md:backdrop-blur-none">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 text-black/80 font-semibold rounded hover:bg-black/10 md:hover:bg-transparent md:hover:text-black md:p-0 transition-colors text-lg"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};