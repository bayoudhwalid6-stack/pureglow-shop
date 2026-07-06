import React, { useState } from "react";
import { Search, MapPin, Truck, Calendar, User, Package, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { MOCK_TRACKING_DATA } from "../data";
import { TrackingInfo } from "../types";

interface TrackingSectionProps {
  initialSearchNumber?: string;
}

export default function TrackingSection({ initialSearchNumber = "" }: TrackingSectionProps) {
  const [searchNumber, setSearchNumber] = useState(initialSearchNumber);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(
    initialSearchNumber ? MOCK_TRACKING_DATA[initialSearchNumber] || null : null
  );
  const [hasSearched, setHasSearched] = useState(!!initialSearchNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchNumber.trim()) return;

    const cleanNum = searchNumber.trim().toUpperCase();
    const result = MOCK_TRACKING_DATA[cleanNum] || null;

    setTrackingInfo(result);
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Info */}
      <div className="text-center space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-dark">
          Suivi de Colis en Ligne
        </h2>
        <p className="text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-sans">
          Saisissez votre numéro de suivi (reçu par e-mail ou SMS après confirmation) pour suivre l'acheminement de vos soins de Mahdia.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl border border-brand-border-warm p-6 sm:p-8 soft-shadow">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder="Ex : MH-2026-001"
              className="w-full bg-brand-cream border border-brand-border-warm rounded-full pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-brand-primary uppercase font-mono tracking-wider"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold text-xs tracking-wider uppercase px-8 py-3.5 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <span>Rechercher</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Informative advice on testing */}
        <div className="mt-4 flex flex-wrap gap-2 items-center text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Numéros de test :</span>
          <button
            onClick={() => {
              setSearchNumber("MH-2026-001");
              setTrackingInfo(MOCK_TRACKING_DATA["MH-2026-001"]);
              setHasSearched(true);
            }}
            className="underline hover:text-brand-primary font-mono"
          >
            MH-2026-001 (En cours)
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setSearchNumber("MH-2026-002");
              setTrackingInfo(MOCK_TRACKING_DATA["MH-2026-002"]);
              setHasSearched(true);
            }}
            className="underline hover:text-brand-primary font-mono"
          >
            MH-2026-002 (Livré)
          </button>
          <span>•</span>
          <button
            onClick={() => {
              setSearchNumber("MH-2026-003");
              setTrackingInfo(MOCK_TRACKING_DATA["MH-2026-003"]);
              setHasSearched(true);
            }}
            className="underline hover:text-brand-primary font-mono"
          >
            MH-2026-003 (Reçu)
          </button>
        </div>
      </div>

      {/* Results Rendering */}
      {hasSearched && (
        <div className="space-y-8 animate-fade-in">
          {trackingInfo ? (
            /* CASE: FOUND */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Side: General Info Card */}
              <div className="lg:col-span-4 bg-white border border-brand-border-warm rounded-3xl p-6 soft-shadow space-y-6">
                <div className="border-b border-brand-cream pb-4">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Numéro de suivi</span>
                  <span className="font-mono text-lg font-bold text-brand-dark tracking-wide">{trackingInfo.number}</span>
                </div>

                <div className="space-y-4">
                  {/* Carrier */}
                  <div className="flex items-start gap-3">
                    <Truck className="text-brand-primary mt-0.5" size={18} />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Transporteur</span>
                      <span className="text-sm font-semibold text-brand-dark">{trackingInfo.carrier}</span>
                    </div>
                  </div>

                  {/* Recipient */}
                  <div className="flex items-start gap-3">
                    <User className="text-brand-primary mt-0.5" size={18} />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Destinataire</span>
                      <span className="text-sm font-semibold text-brand-dark">{trackingInfo.recipientName}</span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex items-start gap-3">
                    <MapIcon size={18} className="text-brand-primary mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Destination</span>
                      <span className="text-sm font-semibold text-brand-dark">{trackingInfo.destination}</span>
                    </div>
                  </div>

                  {/* Est. Delivery */}
                  <div className="flex items-start gap-3 bg-brand-cream/60 p-3 rounded-xl border border-brand-border-warm">
                    <div className="mt-0.5 text-brand-accent">
                      <Truck size={18} />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Date de livraison</span>
                      <span className="text-xs font-bold text-brand-dark">{trackingInfo.estimatedDelivery}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Step Progress Stepper */}
              <div className="lg:col-span-8 bg-white border border-brand-border-warm rounded-3xl p-6 sm:p-8 soft-shadow">
                <h3 className="font-serif text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
                  <Package size={20} className="text-brand-primary" />
                  <span>Historique des étapes de livraison</span>
                </h3>

                <div className="relative border-l-2 border-brand-primary/25 ml-4 pl-6 space-y-8">
                  {trackingInfo.steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Circle Bullet Badge */}
                      <span className={`absolute -left-[35px] top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                        step.isCurrent
                          ? "border-brand-primary text-brand-primary"
                          : "border-brand-accent/60 text-brand-accent"
                      }`}>
                        {step.isCurrent ? (
                          <CheckCircle2 size={14} className="fill-brand-primary/10" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-brand-accent/60" />
                        )}
                      </span>

                      {/* Content step */}
                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className={`text-sm font-bold block ${
                            step.isCurrent ? "text-brand-primary text-base font-extrabold" : "text-brand-dark"
                          }`}>
                            {step.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans">{step.description}</p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-accent uppercase tracking-wider">
                          📍 {step.location}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* CASE: NOT FOUND error status card */
            <div className="bg-red-50/50 border border-red-200 rounded-3xl p-8 text-center max-w-lg mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mx-auto">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg font-bold text-brand-dark">Colis introuvable</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Le numéro de suivi saisi ne correspond à aucun colis enregistré. <br />
                  Assurez-vous de saisir le code complet tel qu'il apparaît sur votre confirmation (ex: <strong className="font-mono text-xs">MH-2026-001</strong>).
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSearchNumber("MH-2026-001");
                    setTrackingInfo(MOCK_TRACKING_DATA["MH-2026-001"]);
                    setHasSearched(true);
                  }}
                  className="px-5 py-2 bg-brand-dark hover:bg-brand-primary text-white rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer"
                >
                  Tester avec MH-2026-001
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Simple fallback MapPin icon to avoid missing exports
function MapIcon(props: any) {
  return <MapPin {...props} />;
}
