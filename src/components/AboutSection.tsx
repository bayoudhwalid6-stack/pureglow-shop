import React from "react";
import { Sparkles, MapPin, Award, CheckCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <div id="histoire" className="bg-white py-16 sm:py-24 border-b border-brand-border-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden soft-shadow aspect-square bg-[#EAE7E2]/40">
                <img
                  src="https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=400"
                  alt="Tunisian olive groves"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="rounded-3xl overflow-hidden soft-shadow aspect-[3/4] bg-[#EAE7E2]/40">
                <img
                  src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400"
                  alt="Orange blossom petals"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-3xl overflow-hidden soft-shadow aspect-[3/4] bg-[#EAE7E2]/40">
                <img
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400"
                  alt="Handmade Soap creation"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="rounded-3xl overflow-hidden soft-shadow aspect-square bg-[#EAE7E2]/40">
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400"
                  alt="Cosmetics storage"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            {/* Absolute badge */}
            <div className="absolute -top-4 -right-4 bg-brand-primary text-white p-3.5 rounded-2xl shadow-lg flex flex-col items-center justify-center transform rotate-6 border border-white/20">
              <span className="font-serif text-lg font-bold">100%</span>
              <span className="text-[8px] font-bold uppercase tracking-wider">Artisanal</span>
            </div>
          </div>

          {/* Right Column: Narrative content */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
              <MapPin size={12} className="text-brand-accent" />
              <span>Mahdia, Perle de la Méditerranée</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-dark leading-tight">
              L'amour des soins botaniques et du <br />
              <span className="text-brand-primary italic font-normal font-serif">retour à la terre</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              Pure Glow MH est né au cœur de la médina de Mahdia, une ville tunisienne millénaire caressée par la mer et 
              renommée pour ses oliveraies ancestrales. Nous croyons que la terre de Tunisie recèle de trésors botaniques 
              uniques pour la santé et la longévité de notre peau.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              Chaque savon et soin que nous formulons respecte un processus de fabrication rigoureux. Notre saponification 
              à froid sur 4 à 6 semaines préserve l'intégralité des vitamines de l'huile d'olive et des huiles de fleurs locales, 
              pour vous offrir des produits sains, riches en glycérine naturelle et d'une douceur incomparable.
            </p>

            {/* Bullet list checklist of commitment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm text-brand-dark font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-primary flex-shrink-0" />
                <span>Huiles de première pression biologique</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-primary flex-shrink-0" />
                <span>Sans perturbateurs endocriniens</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-primary flex-shrink-0" />
                <span>Emballages 100% recyclables</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-brand-primary flex-shrink-0" />
                <span>Soutien aux agriculteurs locaux</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
