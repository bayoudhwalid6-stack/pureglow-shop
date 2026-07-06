import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ArrowLeft, CreditCard, ShoppingBag, ShieldCheck, Heart, Truck, Sparkles } from "lucide-react";
import { CartItem, OrderDetails } from "../types";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (orderId: string, trackingNumber: string, orderDetails: OrderDetails) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}: CartSidebarProps) {
  if (!isOpen) return null;

  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form">("cart");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Tunis");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">("cod");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Delivery standard 7 TND, free if subtotal > 60 TND
  const shippingFee = subtotal >= 60 || subtotal === 0 ? 0 : 7.0;
  const total = subtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = "Nom complet requis";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = "E-mail valide requis";
    if (!phone.trim() || phone.length < 8) errors.phone = "Numéro de téléphone valide requis (8 chiffres)";
    if (!address.trim()) errors.address = "Adresse de livraison requise";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Generate dynamic IDs
    const orderId = `PO-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `MH-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const details: OrderDetails = {
      fullName,
      email,
      phone,
      address,
      city,
      paymentMethod,
      cartItems,
      subtotal,
      shippingFee,
      total,
    };

    onCheckoutSuccess(orderId, trackingNumber, details);
    // Reset form states
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCity("Tunis");
    setCheckoutStep("cart");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay background */}
      <div
        className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-brand-border-warm flex flex-col justify-between h-full relative">
          {/* Header */}
          <div className="px-6 py-6 border-b border-brand-border-warm flex items-center justify-between bg-brand-cream/40">
            <div className="flex items-center gap-2">
              {checkoutStep === "form" && (
                <button
                  onClick={() => setCheckoutStep("cart")}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-brand-dark transition-colors focus:outline-none mr-1 cursor-pointer"
                  title="Retour au panier"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <h2 className="font-serif text-xl font-bold text-brand-dark">
                {checkoutStep === "cart" ? "Votre Panier" : "Informations de Livraison"}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 bg-brand-accent/20 text-brand-dark font-bold rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-full text-brand-dark transition-colors focus:outline-none cursor-pointer"
              aria-label="Close panel"
            >
              <X size={20} />
            </button>
          </div>

          {/* Core Content Box */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-72 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-accent border border-brand-border-warm">
                  <ShoppingBag size={28} />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-bold text-brand-dark">Votre panier est vide</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Parcourez notre collection de cosmétiques bio et ajoutez de la douceur à votre journée.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Faire mes achats
                </button>
              </div>
            ) : checkoutStep === "cart" ? (
              /* CART STEP LIST */
              <div className="space-y-4">
                {subtotal < 60 && (
                  <div className="bg-brand-accent/10 border border-brand-accent/20 rounded-xl p-3 text-xs text-brand-primary flex items-center gap-2">
                    <Sparkles size={14} className="text-brand-accent animate-spin-slow" />
                    <span>
                      Ajoutez encore <strong>{(60 - subtotal).toFixed(2)} TND</strong> pour débloquer la{" "}
                      <strong>livraison gratuite</strong> !
                    </span>
                  </div>
                )}

                <div className="divide-y divide-brand-cream space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 pt-4 first:pt-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-brand-accent/20 bg-brand-cream flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-serif font-bold text-sm text-brand-dark line-clamp-1 leading-tight">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-1"
                              title="Retirer du panier"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                            {item.product.categoryLabel}
                          </span>
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center border border-brand-accent/20 rounded-full bg-brand-cream px-1.5 py-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 rounded-full text-brand-dark hover:bg-white disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono text-brand-dark">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 rounded-full text-brand-dark hover:bg-white disabled:opacity-30"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <span className="text-sm font-bold font-mono text-brand-dark">
                            {(item.product.price * item.quantity).toFixed(2)} TND
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* CHECKOUT FORM STEP */
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                {/* Full name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
                    Nom Complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (formErrors.fullName) delete formErrors.fullName;
                    }}
                    placeholder="Ex: Mohamed Ben Ali"
                    className="w-full bg-brand-cream border border-brand-accent/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary"
                  />
                  {formErrors.fullName && <p className="text-xs text-red-500 font-medium">{formErrors.fullName}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
                    Adresse E-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) delete formErrors.email;
                    }}
                    placeholder="Ex: mohamed@gmail.com"
                    className="w-full bg-brand-cream border border-brand-accent/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary"
                  />
                  {formErrors.email && <p className="text-xs text-red-500 font-medium">{formErrors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
                    Téléphone (Tunisie) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formErrors.phone) delete formErrors.phone;
                    }}
                    placeholder="Ex: 98 765 432"
                    className="w-full bg-brand-cream border border-brand-accent/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary"
                  />
                  {formErrors.phone && <p className="text-xs text-red-500 font-medium">{formErrors.phone}</p>}
                </div>

                {/* City */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
                    Gouvernorat / Ville <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-brand-cream border border-brand-accent/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary appearance-none cursor-pointer"
                  >
                    <option value="Tunis">Tunis</option>
                    <option value="Sousse">Sousse</option>
                    <option value="Mahdia">Mahdia</option>
                    <option value="Sfax">Sfax</option>
                    <option value="Monastir">Monastir</option>
                    <option value="Nabeul">Nabeul / Hammamet</option>
                    <option value="Bizerte">Bizerte</option>
                    <option value="Gabes">Gabès</option>
                    <option value="Djerba">Djerba / Médenine</option>
                    <option value="Kairouan">Kairouan</option>
                    <option value="Autre">Autre Ville (Tunisie)</option>
                  </select>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
                    Adresse Exacte <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (formErrors.address) delete formErrors.address;
                    }}
                    placeholder="Ex: 45 Rue de la Corniche, Appt B3"
                    className="w-full bg-brand-cream border border-brand-accent/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-primary resize-none"
                  />
                  {formErrors.address && <p className="text-xs text-red-500 font-medium">{formErrors.address}</p>}
                </div>

                {/* Payment Method Option */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
                    Mode de Paiement
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                          : "border-brand-accent/35 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Truck size={16} />
                      <span>À la Livraison (COD)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-brand-primary bg-brand-primary/10 text-brand-primary"
                          : "border-brand-accent/35 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <CreditCard size={16} />
                      <span>Par Carte (Dinar Sp)</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer containing Total Summary & Action button */}
          {cartItems.length > 0 && (
            <div className="px-6 py-6 border-t border-brand-accent/15 bg-brand-cream/30 space-y-4">
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Sous-total</span>
                  <span className="font-mono">{subtotal.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Frais de livraison</span>
                  {shippingFee === 0 ? (
                    <span className="text-brand-primary font-bold uppercase text-[10px] tracking-wider bg-brand-primary/15 px-2 py-0.5 rounded-full">
                      Gratuit
                    </span>
                  ) : (
                    <span className="font-mono">{shippingFee.toFixed(2)} TND</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-bold text-brand-dark pt-2 border-t border-brand-accent/10">
                  <span className="font-serif">Total à payer</span>
                  <span className="font-mono text-brand-dark">{total.toFixed(2)} TND</span>
                </div>
              </div>

              {/* Major checkout buttons */}
              {checkoutStep === "cart" ? (
                <button
                  onClick={() => setCheckoutStep("form")}
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Passer la Commande</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckoutSubmit}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck size={16} />
                  <span>Confirmer mon Achat ({total.toFixed(2)} TND)</span>
                </button>
              )}

              {/* Guarantees of security */}
              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-brand-primary" /> Authentique Mahdia
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={12} className="text-brand-primary" /> Service Client Tunisien
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
