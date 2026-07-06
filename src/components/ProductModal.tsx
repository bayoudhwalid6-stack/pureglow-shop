import React, { useState } from "react";
import { X, Star, ShoppingBag, Plus, Minus, Check, HelpCircle } from "lucide-react";
import { Product } from "../types";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "usage">("description");
  const [isAdded, setIsAdded] = useState(false);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddClick = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-brand-dark/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Container Card */}
      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-brand-border-warm flex flex-col md:flex-row soft-shadow">
        {/* Absolute Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-brand-cream/80 hover:bg-brand-primary/15 rounded-full text-brand-dark hover:text-brand-primary transition-all shadow-sm focus:outline-none cursor-pointer"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        {/* Left Column: Product Image with details */}
        <div className="w-full md:w-1/2 bg-brand-cream p-8 flex items-center justify-center relative min-h-[300px]">
          <div className="w-full h-full aspect-square rounded-2xl overflow-hidden shadow-md bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {product.weight && (
            <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-brand-border-warm text-brand-dark font-semibold text-xs py-1.5 px-3 rounded-full shadow-xs">
              Contenance : {product.weight}
            </span>
          )}
        </div>

        {/* Right Column: Information & Settings */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header section */}
            <div className="space-y-1">
              <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest block">
                {product.categoryLabel}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-brand-dark leading-tight">
                {product.name}
              </h2>

              {/* Star rating & sales */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} avis vérifiés)</span>
              </div>
            </div>

            {/* Price display */}
            <div className="text-2xl font-bold font-mono text-brand-dark pt-1">
              {product.price.toFixed(2)} <span className="text-base font-semibold">TND</span>
            </div>

            {/* In-Modal Navigation Tabs */}
            <div className="border-b border-brand-border-warm flex space-x-6 text-sm font-medium">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-2 transition-all relative cursor-pointer ${
                  activeTab === "description" ? "text-brand-primary font-bold" : "text-slate-400 hover:text-brand-primary"
                }`}
              >
                Bienfaits
                {activeTab === "description" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("ingredients")}
                className={`pb-2 transition-all relative cursor-pointer ${
                  activeTab === "ingredients" ? "text-brand-primary font-bold" : "text-slate-400 hover:text-brand-primary"
                }`}
              >
                Ingrédients
                {activeTab === "ingredients" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("usage")}
                className={`pb-2 transition-all relative cursor-pointer ${
                  activeTab === "usage" ? "text-brand-primary font-bold" : "text-slate-400 hover:text-brand-primary"
                }`}
              >
                Application
                {activeTab === "usage" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-full" />
                )}
              </button>
            </div>

            {/* Tab content container */}
            <div className="min-h-[140px] text-sm text-slate-600 leading-relaxed font-sans pt-1">
              {activeTab === "description" && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <ul className="space-y-1.5 pl-1.5">
                    {product.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-accent flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "ingredients" && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Formulation naturelle active :</p>
                  <ul className="space-y-2">
                    {product.ingredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-brand-cream/60 p-2 rounded-lg border border-brand-accent/10">
                        <span className="mt-1 text-brand-primary font-bold text-xs">🌿</span>
                        <span className="text-xs text-brand-dark font-medium">{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "usage" && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conseils d'utilisation de Selma :</p>
                  <p className="italic text-brand-dark bg-brand-accent/5 p-4 rounded-xl border border-brand-accent/15 relative">
                    "{product.howToUse}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Row: Quantities & Add to Cart */}
          <div className="pt-6 border-t border-brand-cream space-y-4">
            {/* Stock Level Indicator */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wide">Disponibilité</span>
              {product.stock > 10 ? (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  En Stock (Atelier de Mahdia)
                </span>
              ) : (
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Quantité limitée ({product.stock} restants !)
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Quantities input selector */}
              <div className="flex items-center border border-brand-accent/40 rounded-full bg-brand-cream p-1">
                <button
                  onClick={handleDecrement}
                  className="p-2 rounded-full hover:bg-white text-brand-dark transition-all focus:outline-none"
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-bold font-mono text-brand-dark text-sm">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-2 rounded-full hover:bg-white text-brand-dark transition-all focus:outline-none"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Major Add Action button */}
              <button
                onClick={handleAddClick}
                className={`flex-1 py-3.5 rounded-full font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                  isAdded
                    ? "bg-emerald-600 text-white shadow-emerald-100"
                    : "bg-brand-primary hover:bg-brand-primary-hover text-white shadow-brand-cream"
                } cursor-pointer`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} />
                    <span>Ajouté !</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Ajouter au Panier — {(product.price * quantity).toFixed(2)} TND</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
