"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ProfileType = 'creator' | 'existing' | 'project' | null;

export const ContactSection = () => {
  const [profile, setProfile] = useState<ProfileType>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const profiles = [
    {
      id: 'creator',
      icon: (
        <svg className="w-8 h-8 text-[#b8860b] group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
        </svg>
      ),
      title: 'Un(e) créateur·rice de marque',
      desc: 'Vous lancez votre première marque ou débutez dans la cosmétique.',
    },
    {
      id: 'existing',
      icon: (
        <svg className="w-8 h-8 text-[#b8860b] group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 17L12 22L22 17M2 12L12 17L22 12M12 2L2 7L12 12L22 7L12 2Z" />
        </svg>
      ),
      title: 'Une marque existante',
      desc: 'Vous gérez déjà une marque et cherchez à élargir ou sous-traiter la production.',
    },
    {
      id: 'project',
      icon: (
        <svg className="w-8 h-8 text-[#b8860b] group-hover:scale-110 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z"/>
        </svg>
      ),
      title: 'Un(e) porteur·se de projet',
      desc: 'Vous avez une idée à concrétiser, sans expérience préalable.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;
    
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      profile,
      profileName: profiles.find(p => p.id === profile)?.title,
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      vision: formData.get('vision'),
      answers: {} as Record<string, string>
    };

    // Extract dynamic answers
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('answer_')) {
        const question = key.replace('answer_', '');
        data.answers[question] = value as string;
      }
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Erreur réseau');
      
      setStatus('success');
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 lg:px-24 bg-white text-[#1a1510]">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold tracking-[0.3em] uppercase mb-6 text-[#b8860b]">
            Démarrer un projet
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Parlez-nous de <span className="text-[#b8860b] font-light italic">vous</span>
          </h2>
          <p className="text-lg text-[#1a1510]/60 max-w-2xl mx-auto">
            Afin de vous offrir l&apos;accompagnement le plus précis et personnalisé, merci de sélectionner le profil qui vous correspond le mieux.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Profile Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profiles.map((p) => (
              <div
                key={p.id}
                onClick={() => setProfile(p.id as ProfileType)}
                className={`cursor-pointer p-8 rounded-2xl border transition-all duration-500 ease-out flex flex-col items-start gap-4 ${
                  profile === p.id 
                    ? 'border-[#b8860b] bg-[#b8860b]/5 shadow-[0_10px_40px_-10px_rgba(184,134,11,0.2)] scale-[1.02]' 
                    : 'border-[#1a1510]/10 hover:border-[#1a1510]/30 hover:bg-gray-50'
                }`}
              >
                <div className="text-2xl">{p.icon}</div>
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="text-sm text-[#1a1510]/60 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Dynamic Form Sections */}
          <AnimatePresence mode="wait">
            {profile && (
              <motion.div
                key={profile}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-12 border-t border-[#1a1510]/10 space-y-12">
                  
                  {/* --- SECTION 1 : DYNAMIC FIELDS BASED ON PROFILE --- */}
                  <div className="space-y-10">
                    <h3 className="text-2xl font-bold mb-8">Votre Projet</h3>

                    {profile === 'creator' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <SelectField name="answer_Type de projet" label="Type de projet" options={["Lancer ma marque", "Lancer un 1er produit", "Autre"]} />
                        <SelectField name="answer_Contraintes de formulation" label="Contraintes de formulation" options={["Vegan", "Sans sulfates", "Cosmos-like", "Classique"]} />
                        <SelectField name="answer_Nombre de références" label="Nombre de références" options={["1 à 3", "4 à 10", "Plus de 10"]} />
                        <SelectField name="answer_Budget estimatif" label="Budget estimatif" options={["- de 10 k€", "10 à 30 k€", "30 à 50 k€", "+ de 50 k€"]} />
                      </div>
                    )}

                    {profile === 'existing' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <SelectField name="answer_Nature du projet" label="Nature du projet" options={["Nouvelle gamme", "Changement de façonneur", "Augmenter la capacité", "Autre"]} />
                        <SelectField name="answer_Packaging services" label="Packaging & services attendus" options={["Assemblage", "Semi-clé en main", "Full-service", "Juste le vrac"]} />
                        <SelectField name="answer_Nombre references actuelles" label="Nombre de références actuelles" options={["1 à 5", "5 à 20", "Plus de 20"]} />
                        <SelectField name="answer_Quantite annuelle" label="Quantité annuelle estimée" options={["- de 5 000 pcs", "5 000 à 20 000 pcs", "+ de 20 000 pcs"]} />
                      </div>
                    )}

                    {profile === 'project' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <SelectField name="answer_Nature du projet" label="Nature du projet" options={["Idée générale", "Preuve de concept (POC)", "Innovation matière", "Autre"]} />
                        <SelectField name="answer_Accompagnement attendu" label="Accompagnement attendu" options={["Idéation", "Études de faisabilité", "Réglementation UE", "Accompagnement global"]} />
                        <SelectField name="answer_Secteur cible" label="Secteur cible" options={["Skincare", "Haircare", "Parfumerie", "Hygiène"]} />
                        <SelectField name="answer_Horizon lancement" label="Horizon de lancement" options={["Dans 6 mois", "Dans 1 an", "Pas encore défini"]} />
                      </div>
                    )}
                  </div>

                  {/* --- SECTION 2 : COMMON FIELDS --- */}
                  <div className="pt-12 border-t border-[#1a1510]/10 space-y-10">
                    <h3 className="text-2xl font-bold mb-8">Vos Coordonnées</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <InputField name="firstName" label="Prénom" type="text" />
                      <InputField name="lastName" label="Nom" type="text" />
                      <InputField name="company" label="Société (Optionnel)" type="text" required={false} />
                      <InputField name="phone" label="Téléphone" type="tel" />
                      <div className="md:col-span-2">
                        <InputField name="email" label="Email professionnel" type="email" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold tracking-widest uppercase text-[#1a1510]/60">
                        Parlez-nous de votre vision
                      </label>
                      <textarea 
                        name="vision"
                        rows={4}
                        className="w-full bg-transparent border-b border-[#1a1510]/20 pb-2 focus:border-[#b8860b] focus:outline-none transition-colors resize-none placeholder:text-[#1a1510]/20 text-lg"
                        placeholder="Décrivez votre projet, vos inspirations, vos attentes..."
                      />
                    </div>
                  </div>

                  {/* Status Messages */}
                  {status === 'success' && (
                    <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                      Votre demande a bien été envoyée. Nous vous recontacterons très vite !
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                      Une erreur est survenue. Veuillez réessayer plus tard ou nous contacter directement.
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-8 flex justify-end">
                    <button 
                      type="submit"
                      disabled={status === 'loading'}
                      className="group flex items-center gap-4 bg-[#1a1510] disabled:bg-[#1a1510]/50 text-white px-10 py-5 rounded-full hover:bg-[#b8860b] transition-colors duration-500"
                    >
                      <span className="font-bold tracking-widest uppercase text-sm">
                        {status === 'loading' ? 'Envoi en cours...' : 'Envoyer la demande'}
                      </span>
                      {status !== 'loading' && (
                        <svg 
                          className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-500" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </form>
      </div>
    </section>
  );
};

// --- Reusable Mini Components for Luxury Inputs ---

const InputField = ({ name, label, type, required = true }: { name: string, label: string, type: string, required?: boolean }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold tracking-[0.2em] uppercase text-[#1a1510]/50">
      {label} {required ? '' : '(Optionnel)'}
    </label>
    <input 
      name={name}
      type={type} 
      required={required}
      className="w-full bg-transparent border-b border-[#1a1510]/20 pb-2 focus:border-[#b8860b] focus:outline-none transition-colors text-lg"
    />
  </div>
);

const SelectField = ({ name, label, options }: { name: string, label: string, options: string[] }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold tracking-[0.2em] uppercase text-[#1a1510]/50">
      {label}
    </label>
    <select 
      name={name}
      required
      defaultValue=""
      className="w-full bg-transparent border-b border-[#1a1510]/20 pb-2 focus:border-[#b8860b] focus:outline-none transition-colors text-lg appearance-none cursor-pointer"
      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231a1510%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
    >
      <option value="" disabled>Sélectionner</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
