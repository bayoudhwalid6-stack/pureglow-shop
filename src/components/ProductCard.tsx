import React from "react";
import { Star, Eye, ShoppingCart, Plus, Leaf } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onOpenDetails,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-brand-border-warm overflow-hidden soft-shadow hover:shadow-lg hover:border-brand-primary/30 transition-all duration-300 flex flex-col group h-full">
      {/* Product Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-cream/60 p-4 flex items-center justify-center">
        {product.isPopular && (
          <div className="absolute top-4 left-4 bg-brand-primary text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs z-10 flex items-center gap-1">
            <Star size={9} fill="currentColor" />
            <span>Favori</span>
          </div>
        )}

        <div className="w-full h-full bg-white rounded-2xl overflow-hidden flex items-center justify-center shadow-xs relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Hover overlay icons */}
        <div className="absolute inset-0 bg-brand-dark/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onOpenDetails(product)}
            className="p-3 bg-white text-brand-dark rounded-full shadow-md hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer"
            title="Voir les détails"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="p-3 bg-white text-brand-dark rounded-full shadow-md hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 cursor-pointer"
            title="Ajouter au panier"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Product Body Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] block">
            {product.categoryLabel}
          </span>
          <h3 className="font-serif text-base font-bold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          {/* Stars & Reviews */}
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  className="currentColor"
                />
              ))}
            </div>
            <span className="text-xs font-bold text-brand-dark">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewsCount} avis)</span>
          </div>
        </div>

        {/* Footer of Card with price and add button */}
        <div className="flex justify-between items-center pt-3 border-t border-brand-border-warm">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Prix</span>
            <span className="text-base font-serif font-bold text-brand-accent tracking-tight">
              {product.price.toFixed(2)} <span className="text-xs font-sans font-normal text-slate-500">TND</span>
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="px-4 py-2 bg-[#4A4A3A] hover:bg-brand-primary text-white rounded-full font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus size={12} />
            <span>Ajouter</span>
          </button>
        </div>
      </div>
    </div>
  );
}

