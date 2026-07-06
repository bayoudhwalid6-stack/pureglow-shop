import React from "react";
import { Truck, ShieldCheck, Heart, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

interface FooterProps {
  setActiveSection: (section: string) => void;
}

export default function Footer({ setActiveSection }: FooterProps) {
  return (
    <footer className="bg-brand-dark text-slate-300 font-sans border-t border-brand-border-warm/15">
      {/* Top Banner Guarantees */}
      <div className="bg-brand-cream border-b border-brand-border-warm py-8 text-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Truck size={24} />
              </div>
              <h4 className="font-serif font-bold text-sm">Livraison Rapide</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Expédition sous 24h à 48h partout en Tunisie via Aramex ou First Delivery.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <ShieldCheck size={24} />
              </div>
              <h4 className="font-serif font-bold text-sm">Paiement 100% Sécurisé</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Réglez en toute sérénité en ligne par carte bancaire ou en espèces à la livraison (COD).
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Heart size={24} />
              </div>
              <h4 className="font-serif font-bold text-sm">Satisfaction Garantie</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Une question ? Selma notre conseillère IA ou nos conseillers physiques vous répondent 7j/7.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Logo & Bio Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/watermarked_img_10592767577053482886.png" 
                alt="Pure Glow MH Logo" 
                className="h-8 w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                Pure Glow <span className="text-brand-accent">MH</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Artisans de Mahdia engagés pour une cosmétique naturelle d'excellence. Nos soins marient l'authenticité de nos récoltes locales à la pureté d'ingrédients nobles et éco-conçus.
            </p>
            <div className="flex items-center space-x-3 text-slate-400 pt-2">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Nav Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setActiveSection("boutique");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  La Boutique Bio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("histoire");
                    const target = document.getElementById("histoire");
                    if (target) target.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Notre Histoire & Engagements
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveSection("suivi");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Suivre mon Colis (Aramex)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Hours Column */}
          <div className="md:col-span-4 space-y-4 text-xs sm:text-sm text-slate-400">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Nous Contacter</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-brand-accent mt-0.5" />
                <span>Atelier Pure Glow, Boulevard Habib Bourguiba, 5100 Mahdia, Tunisie</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-brand-accent" />
                <span>+216 73 998 888</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-brand-accent" />
                <span>contact@pureglow-mh.tn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright banner */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Pure Glow MH. Conçu avec amour et passion pour l'artisanat de Mahdia.</p>
        </div>
      </div>
    </footer>
  );
}
