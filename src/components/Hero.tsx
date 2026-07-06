import React from "react";
import { Sparkles, ArrowRight, Leaf, ShieldCheck, Heart } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-brand-cream py-16 sm:py-24 border-b border-brand-border-warm">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
              <Sparkles size={12} className="text-brand-accent" />
              <span>Savoir-faire Ancestral de Mahdia</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark leading-tight tracking-tight">
              La pureté d'une peau <br />
              <span className="text-brand-primary italic font-normal font-serif">lumineuse & naturelle</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Découvrez nos savons saponifiés à froid et cosmétiques biologiques. Formulés de manière artisanale à Mahdia
              à partir d'huile d'olive extra-vierge, d'huile de pépins de figue de barbarie et d'hydrolats de fleurs sauvages.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover text-white font-medium text-sm tracking-wider px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Découvrir la Collection</span>
                <ArrowRight size={16} />
              </button>
              <a
                href="#histoire"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-brand-dark hover:text-brand-primary border border-brand-accent/40 font-medium text-sm tracking-wider px-8 py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("histoire");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Notre Histoire
              </a>
            </div>

            {/* Micro badges of organic trust */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-brand-accent/20 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center gap-1.5 text-brand-primary">
                  <Leaf size={16} />
                  <span className="text-xs font-bold tracking-wider uppercase text-brand-dark">100% Bio</span>
                </div>
                <span className="text-[11px] text-slate-500 text-center lg:text-left">Actifs purs & sauvages</span>
              </div>

              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center gap-1.5 text-brand-primary">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold tracking-wider uppercase text-brand-dark">Fait Main</span>
                </div>
                <span className="text-[11px] text-slate-500 text-center lg:text-left">Saponifié à froid à Mahdia</span>
              </div>

              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center gap-1.5 text-brand-primary">
                  <Heart size={16} />
                  <span className="text-xs font-bold tracking-wider uppercase text-brand-dark">Éthique</span>
                </div>
                <span className="text-[11px] text-slate-500 text-center lg:text-left">Zéro déchet & Cruelty-Free</span>
              </div>
            </div>
          </div>

          {/* Right Image/Mockup Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Elegant Frame */}
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 relative group">
                <img
                  src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800"
                  alt="Organic cosmetics by Pure Glow MH"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                {/* Floating Badge in image */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl border border-brand-accent/20 shadow-lg flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <Leaf size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Garantie</span>
                    <span className="text-xs font-bold text-brand-dark">Zéro pétrochimie</span>
                  </div>
                </div>
              </div>

              {/* Decorative Secondary Frame overlapping */}
              <div className="hidden sm:block absolute -bottom-8 -right-8 w-44 aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white transform rotate-3">
                <img
                  src="https://images.unsplash.com/photo-1607006342411-91f143048a1d?auto=format&fit=crop&q=80&w=400"
                  alt="Handcrafted Soap of Mahdia"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
