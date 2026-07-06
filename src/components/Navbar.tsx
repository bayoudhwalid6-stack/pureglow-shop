import React, { useState } from "react";
import { ShoppingBag, Menu, X, HelpCircle, Truck, Heart } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenChat: () => void;
}

export default function Navbar({
  cartCount,
  onOpenCart,
  activeSection,
  setActiveSection,
  onOpenChat,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    // Smooth scroll to top when changing major views
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur-md border-b border-brand-border-warm transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-brand-primary text-white text-xs py-2 px-4 text-center font-medium tracking-wider flex justify-center items-center gap-2">
        <span>✨ Livraison gratuite en Tunisie pour tout achat supérieur à 60 TND ✨</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-dark p-2 hover:text-brand-primary transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Elegant Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <button
              onClick={() => handleNavClick("boutique")}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <img 
                src="/watermarked_img_10592767577053482886.png" 
                alt="Pure Glow MH Logo" 
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark group-hover:text-brand-primary transition-colors">
                Pure Glow <span className="text-brand-accent">MH</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick("boutique")}
              className={`font-medium tracking-wide text-sm transition-colors cursor-pointer relative py-2 ${
                activeSection === "boutique" ? "text-brand-primary" : "text-brand-dark hover:text-brand-primary"
              }`}
            >
              La Boutique
              {activeSection === "boutique" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick("histoire")}
              className={`font-medium tracking-wide text-sm transition-colors cursor-pointer relative py-2 ${
                activeSection === "histoire" ? "text-brand-primary" : "text-brand-dark hover:text-brand-primary"
              }`}
            >
              Notre Histoire
              {activeSection === "histoire" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick("suivi")}
              className={`font-medium tracking-wide text-sm flex items-center gap-1.5 transition-colors cursor-pointer relative py-2 ${
                activeSection === "suivi" ? "text-brand-primary" : "text-brand-dark hover:text-brand-primary"
              }`}
            >
              <Truck size={16} className="text-brand-accent" />
              Suivi de Colis
              {activeSection === "suivi" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Utilities (Cart, Chatbot Toggler) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Ask Selma helper link */}
            <button
              onClick={onOpenChat}
              className="text-brand-dark hover:text-brand-primary hover:bg-brand-accent/10 p-2 rounded-full transition-all flex items-center gap-1 text-xs sm:text-sm font-medium"
              title="Discuter avec Selma, notre conseillère IA"
            >
              <HelpCircle size={20} className="text-brand-primary animate-pulse" />
              <span className="hidden lg:inline text-brand-dark">Conseils IA</span>
            </button>

            {/* Shopping Cart Icon with Badge */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-white hover:bg-brand-cream border border-brand-accent/30 rounded-full transition-all duration-300 shadow-sm focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingBag size={20} className="text-brand-dark" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-cream border-b border-brand-accent/20 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick("boutique")}
            className={`w-full text-left font-medium text-base py-2 border-b border-brand-accent/10 ${
              activeSection === "boutique" ? "text-brand-primary text-brand-primary font-semibold" : "text-brand-dark"
            }`}
          >
            La Boutique Pure Glow
          </button>
          <button
            onClick={() => handleNavClick("histoire")}
            className={`w-full text-left font-medium text-base py-2 border-b border-brand-accent/10 ${
              activeSection === "histoire" ? "text-brand-primary font-semibold" : "text-brand-dark"
            }`}
          >
            Notre Histoire & Secrets
          </button>
          <button
            onClick={() => handleNavClick("suivi")}
            className={`w-full text-left font-medium text-base py-2 border-b border-brand-accent/10 flex items-center gap-2 ${
              activeSection === "suivi" ? "text-brand-primary font-semibold" : "text-brand-dark"
            }`}
          >
            <Truck size={18} className="text-brand-accent" />
            Suivi de Colis en Ligne
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenChat();
            }}
            className="w-full text-left font-medium text-base py-2 flex items-center gap-2 text-brand-primary"
          >
            <HelpCircle size={18} />
            Conseillère IA Selma (Chat)
          </button>
        </div>
      )}
    </nav>
  );
}
