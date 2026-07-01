import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InAppBrowserBannerProps {
  isNightMode?: boolean;
}

const InAppBrowserBanner: React.FC<InAppBrowserBannerProps> = ({ isNightMode = false }) => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkInAppBrowser = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
      
      // Detect in-app browsers
      const inAppPatterns = [
        'FBAN',      // Facebook
        'FBAV',      // Facebook
        'Instagram', // Instagram
        'Messenger', // Messenger
        'Twitter',   // Twitter
        'Line',      // Line
        'WeChat',    // WeChat
        'MicroMessenger', // WeChat
        'WhatsApp',  // WhatsApp
        'Telegram',  // Telegram
        'Viber',     // Viber
        'Snapchat',  // Snapchat
        'TikTok',    // TikTok
      ];

      const isInApp = inAppPatterns.some(pattern => userAgent.includes(pattern));
      setIsInAppBrowser(isInApp);
      
      // Show banner if in in-app browser
      if (isInApp) {
        // Check if user has dismissed it before
        const dismissed = localStorage.getItem('inapp_banner_dismissed');
        if (!dismissed) {
          setIsVisible(true);
        }
      }
    };

    checkInAppBrowser();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('inapp_banner_dismissed', 'true');
  };

  if (!isInAppBrowser || !isVisible) return null;

  const bgColor = isNightMode ? 'bg-[#1D2A1E]' : 'bg-[#2C3E2E]';
  const textColor = isNightMode ? 'text-[#FAF9F5]' : 'text-[#F9F7F2]';
  const accentColor = isNightMode ? 'text-[#C18D5D]' : 'text-[#C18D5D]';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className={`${bgColor} ${textColor} border-b border-[#C18D5D]/20`}
          dir="rtl"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                <Smartphone className={`h-5 w-5 ${accentColor}`} />
              </div>

              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-relaxed">
                  <span className={accentColor}>⚠️</span>{' '}
                  Pour pouvoir parler avec Sarra au micro, cliquez sur les{' '}
                  <span className="font-bold">3 points</span> en haut à droite et sélectionnez{' '}
                  <span className="font-bold">"Ouvrir dans Chrome"</span> ou{' '}
                  <span className="font-bold">"Ouvrir dans Safari"</span>.
                </p>
                <p className="text-xs text-[#E8E4DB] mt-1">
                  Les navigateurs intégrés bloquent l'accès au microphone pour votre sécurité.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InAppBrowserBanner;
