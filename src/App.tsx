import { useState, useEffect, ReactNode, useRef, HTMLAttributeReferrerPolicy, FormEvent } from 'react';
import { 
  Sparkles, Leaf, ShieldCheck, Truck, ShoppingBag, 
  ChevronRight, Phone, MapPin, RefreshCw, Gift, Star, 
  HelpCircle, ClipboardList, TrendingUp, Award, Plus, Minus, X, Eye,
  MessageSquare, Search, Clock, Calendar, User, Sun, Moon, LogOut, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Chatbot from './components/ChatBot';
import { Produit, Commande } from './lib/supabase';

import imageTraiterSidre from "./assets/images/image_traiter_sidre_1782546555922.jpg";

// Map old Arabic filenames to new kebab-case asset names
const localImageMap: Record<string, string> = {
  "/عرق السوس 100غ ب15د.jpeg": "/licorice-soap-100g-15dt.jpeg",
  "./عرق السوس 100غ ب15د.jpeg": "/licorice-soap-100g-15dt.jpeg",
  "عرق السوس 100غ ب15د.jpeg": "/licorice-soap-100g-15dt.jpeg",
  "/لوبان الذكر 150غ ب18.jpeg": "/louban-soap-150g-18dt.jpeg",
  "./لوبان الذكر 150غ ب18.jpeg": "/louban-soap-150g-18dt.jpeg",
  "لوبان الذكر 150غ ب18.jpeg": "/louban-soap-150g-18dt.jpeg",
  "/هذا واللوبان الذكر ب15د.jpeg": "/licorice-louban-soap-15dt.jpeg",
  "./هذا واللوبان الذكر ب15د.jpeg": "/licorice-louban-soap-15dt.jpeg",
  "هذا واللوبان الذكر ب15د.jpeg": "/licorice-louban-soap-15dt.jpeg",
  "/شوفان والعسل ب12.jpeg": "/oatmeal-honey-soap-12dt.jpeg",
  "./شوفان والعسل ب12.jpeg": "/oatmeal-honey-soap-12dt.jpeg",
  "شوفان والعسل ب12.jpeg": "/oatmeal-honey-soap-12dt.jpeg",
  "/عرق السوس والحبة السوداء ب15.jpeg": "/licorice-nigella-soap-15dt.jpeg",
  "./عرق السوس والحبة السوداء ب15.jpeg": "/licorice-nigella-soap-15dt.jpeg",
  "عرق السوس والحبة السوداء ب15.jpeg": "/licorice-nigella-soap-15dt.jpeg",
  "/قهوة ونشاء وكركم ب15د.jpeg": "/coffee-starch-turmeric-soap-15dt.jpeg",
  "./قهوة ونشاء وكركم ب15د.jpeg": "/coffee-starch-turmeric-soap-15dt.jpeg",
  "قهوة ونشاء وكركم ب15د.jpeg": "/coffee-starch-turmeric-soap-15dt.jpeg",
  "/السدر ب15.jpeg": "/sidr-soap-15dt.jpeg",
  "./السدر ب15.jpeg": "/sidr-soap-15dt.jpeg",
  "السدر ب15.jpeg": "/sidr-soap-15dt.jpeg"
};

// High-fidelity editorial details for each Tunisian botanical product
const productDetailsMap: Record<string, { ingredients: string[]; conseils: string; bienfaits: string; certification: string }> = {
  "Savon à la Réglisse": {
    ingredients: [
      "Extrait pur de racine de réglisse (Glabridine)",
      "Poudre de riz extra-fine",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile d'amande douce vierge",
      "Beurre de karité brut"
    ],
    conseils: "Appliquer quotidiennement matin et soir sur visage humide. Laisser poser la mousse crémeuse 1 minute avant de rincer à l'eau tiède pour un effet éclaircissant optimal.",
    bienfaits: "Cible et estompe les taches d'hyperpigmentation, illumine le teint terne, lisse le grain de peau pour un fini soyeux.",
    certification: "100% Naturel - Saponifié à froid - Poids : 100g"
  },
  "Savon au Louban Dakar 150g": {
    ingredients: [
      "Résine pure de Louban Dakar (Oliban mâle)",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile d'argan biologique pressée à froid",
      "Huile de coco brute",
      "Huile de ricin adoucissante"
    ],
    conseils: "Faire mousser délicatement sur le visage ou le corps humide. Effectuer de légers mouvements circulaires pour stimuler l'effet anti-âge et raffermissant. Rincer abondamment à l'eau claire.",
    bienfaits: "Régénérant cellulaire puissant, stimule la production de collagène, estompe les imperfections et raffermit l'épiderme fatigué.",
    certification: "100% Naturel - Saponifié à froid - Poids : 150g"
  },
  "Savon Duo Réglisse & Louban": {
    ingredients: [
      "Extrait de racine de réglisse pure",
      "Résine de Louban Dakar infusée",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile d'amande douce",
      "Beurre de karité"
    ],
    conseils: "Appliquer matin ou soir sur visage humide en effectuant de doux mouvements circulaires. Laisser poser 30 secondes, puis rincer à l'eau claire.",
    bienfaits: "Double action anti-taches et raffermissante. Unifie le teint tout en retendant l'ovale du visage.",
    certification: "100% Naturel - Saponifié à froid - Poids : 100g"
  },
  "Savon Flocons d'Avoine & Miel": {
    ingredients: [
      "Miel sauvage tunisien pur",
      "Flocons d'avoine biologique finement moulus",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile de coco brute",
      "Huile d'amande douce apaisante"
    ],
    conseils: "Utiliser au quotidien pour la toilette du visage et du corps. Masser doucement pour bénéficier de l'action calmante et nutritive du miel et de l'avoine.",
    bienfaits: "Calme les irritations, hydrate intensément, nourrit les peaux les plus sensibles et laisse la peau extrêmement douce.",
    certification: "100% Naturel - Saponifié à froid - Poids : 100g"
  },
  "Savon Réglisse & Graine Noire / Nigelle": {
    ingredients: [
      "Extrait pur de racine de réglisse",
      "Huile de nigelle de première pression (Habba Sawda)",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Argile verte purifiante",
      "Huile essentielle de tea tree"
    ],
    conseils: "Faire mousser sur visage humide en insistant sur la zone T (front, nez, menton) sujette aux imperfections. Rincer à l'eau fraîche.",
    bienfaits: "Purifie, combat l'excès de sébum et les imperfections tout en estompant les cicatrices et taches résiduelles.",
    certification: "100% Naturel - Saponifié à froid - Poids : 100g"
  },
  "Savon Café, Amidon & Curcuma": {
    ingredients: [
      "Marc de café de haute qualité",
      "Amidon de maïs (amidon lissant)",
      "Extrait de curcuma illuminateur",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Beurre de karité"
    ],
    conseils: "Utiliser 2 à 3 fois par semaine comme exfoliant corporel et visage sous la douche. Masser par mouvements circulaires doux puis rincer.",
    bienfaits: "Raffermit le grain de peau, estompe la cellulite, apporte un coup d'éclat immédiat et nettoie en profondeur.",
    certification: "100% Naturel - Saponifié à froid - Poids : 100g"
  },
  "Savon au Sidr / Jujubier": {
    ingredients: [
      "Poudre de feuilles de Sidr (Jujubier)",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile de coco",
      "Huile de amande douce",
      "Argile blanche (Kaolin)"
    ],
    conseils: "Idéal pour laver les peaux sensibles ou sujettes aux irritations, démangeaisons ou acné. Faire mousser sur la peau, laisser poser quelques secondes, puis rincer.",
    bienfaits: "Calme les irritations cutanées, désinfecte en douceur, régule le sébum et préserve la fraîcheur de l'épiderme.",
    certification: "100% Naturel - Saponifié à froid - Poids : 100g"
  }
};

const productArMap: Record<string, { nom: string; description: string; ingredients: string[]; conseils: string; bienfaits: string; certification: string }> = {
  "Savon à la Réglisse": {
    nom: "صابون عرق السوس وبودرة الأرز للتفتيح",
    description: "صابون التفتيح الفائق بخلاصة عرق السوس وبودرة الأرز للقضاء على البقع الداكنة والتصبغات ومنحك إشراقة مخملية.",
    ingredients: [
      "خلاصة جذور عرق السوس النقيّة",
      "بودرة الأرز التونسية فائقة النعومة",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت اللوز الحلو المغذي للبشرة",
      "زبدة الشيا الخام غير المكررة"
    ],
    conseils: "يستعمل يومياً صباحاً ومساءً على وجه مبلل. تترك الرغوة الغنية على البشرة لمدة دقيقة واحدة قبل الشطف بالماء الدافئ لتحقيق أفضل نتائج التفتيح.",
    bienfaits: "يستهدف البقع الداكنة والتصبغات بكفاءة، يوحد لون البشرة الباهتة، ويصقل ملمسها ليمنحها نعومة حريرية ولمعاناً طبيعياً.",
    certification: "طبيعي 100٪ - مصبن على البارد - الوزن: 100 غ"
  },
  "Savon au Louban Dakar 150g": {
    nom: "صابون لبان الذكر الفاخر",
    description: "إكسير الشباب الأبدي بتركيبة ملكية غنية بلبان الذكر الفاخر لشد البشرة وتوحيد لونها ومكافحة التجاعيد.",
    ingredients: [
      "صمغ لبان الذكر النقي (اللبان الذكر الأصلي)",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت أرغان بيولوجي معصور على البارد",
      "زيت جوز الهند الخام المغذي",
      "زيت الخروع المرطب والمنعم"
    ],
    conseils: "يُرغى الصابون بلطف على الوجه أو الجسم المبلل، مع التدليك الدائري الخفيف لتنشيط الخلايا وشد البشرة، ثم يشطف جيداً بالماء النقي.",
    bienfaits: "مجدد خلايا قوي للغاية، يحفز إنتاج الكولاجين الطبيعي، يشد الجلد المترهل، ويخفي عيوب البشرة لتبدو أكثر شباباً.",
    certification: "طبيعي 100٪ - مصبن على البارد - الوزن: 150 غ"
  },
  "Savon Duo Réglisse & Louban": {
    nom: "صابون عرق السوس ولبان الذكر الثنائي",
    description: "ثنائي الجمال الفاخر الذي يجمع بين قوة عرق السوس في تفتيح البشرة ولبان الذكر في شد الجلد ومقاومة علامات التقدم في السن.",
    ingredients: [
      "خلاصة عرق السوس المفتحة",
      "مستخلص لبان الذكر لشد البشرة",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت اللوز الحلو",
      "زبدة الشيا المغذية"
    ],
    conseils: "يوضع على بشرة رطبة مع تدليك خفيف بحركات دائرية. يترك لمدة نصف دقيقة لتتغلغل المكونات ثم يشطف بالماء.",
    bienfaits: "مفعول مزدوج لتفتيح التصبغات وشد الجلد المترهل، يمنح البشرة مرونة ونضارة مثالية.",
    certification: "طبيعي 100٪ - مصبن على البارد - الوزن: 100 غ"
  },
  "Savon Flocons d'Avoine & Miel": {
    nom: "صابون الشوفان والعسل المهدئ",
    description: "صابون الشوفان والعسل الطبيعي المهدئ للبشرة الحساسة والجافة، يغذي بعمق، يهدئ التهيج، ويمنح رطوبة فائقة ونعومة مخملية.",
    ingredients: [
      "عسل جبلي طبيعي حر",
      "شوفان عضوي مطحون ناعم",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت جوز هند خام",
      "زيت اللوز الحلو الملطف"
    ],
    conseils: "يستعمل يومياً للوجه والجسم. يدلك بلطف لتنشيط البشرة والاستفادة من التأثير المرطب والمهدئ للعسل والشوفان.",
    bienfaits: "يهدئ الاحمرار والتهيج، يغذي البشرة الجافة بعمق، ويحمي الحاجز الطبيعي للجلد.",
    certification: "طبيعي 100٪ - مصبن على البارد - الوزن: 100 غ"
  },
  "Savon Réglisse & Graine Noire / Nigelle": {
    nom: "صابون عرق السوس والحبة السوداء المنقي",
    description: "صابون منقّ ومطهر يجمع بين خصائص عرق السوس المفتحة وفوائد الحبة السوداء المعقمة لتنقية البشرة ومحاربة الشوائب وحب الشباب.",
    ingredients: [
      "خلاصة جذور عرق السوس",
      "زيت الحبة السوداء الأصلي المعصور على البارد",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "طين أخضر منقي للبشرة",
      "زيت شجرة الشاي الأساسي المطهر"
    ],
    conseils: "يُرغى على وجه رطب مع التركيز على المناطق المعرضة للبثور والدهون، ثم يشطف بماء فاتر ثم بارد لغلق المسام.",
    bienfaits: "يطهر المسام، يقلل من ظهور الحبوب، ينظم الإفرازات الدهنية ويساعد في إزالة آثار البثور وتوحيد لون البشرة.",
    certification: "طبيعي 100٪ - مصبن على البارد - الوزن: 100 غ"
  },
  "Savon Café, Amidon & Curcuma": {
    nom: "صابون القهوة والنشاء والكركم المنشط",
    description: "تركيبة فريدة مقشرة ومفتحة تجمع بين تفل القهوة المنشط، النشاء لشد المسام، والكركم لإعادة النضارة والإشراق الطبيعي للبشرة.",
    ingredients: [
      "تفل قهوة طبيعي ناعم",
      "نشا الذرة المنعم للمسام",
      "مسحوق الكركم الصافي المفتح",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زبدة الشيا المرطبة"
    ],
    conseils: "يستعمل مرتين إلى 3 مرات أسبوعياً كقناع ومقشر لطيف أثناء الاستحمام. يدلك بحركات دائرية ثم يشطف بالماء.",
    bienfaits: "ينشط الدورة الدموية السطحية، يصفي البشرة، يشد المسام الواسعة، ويمنح نضارة فائقة من الاستعمال الأول.",
    certification: "طبيعي 100٪ - مصبن على البارد - الوزن: 100 غ"
  },
  "Savon au Sidr / Jujubier": {
    nom: "صابون السدر الطبيعي المطهر",
    description: "صابون السدر التقليدي الفاخر لتنظيف البشرة وتطهيرها بعمق، يهدئ الحكة والالتهابات، ويضفي نعومة ونقاء طبيعياً لا يضاهى.",
    ingredients: [
      "مسحوق أوراق السدر (النبق) الطبيعي",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت جوز الهند النقي",
      "زيت اللوز الحلو",
      "الطين الأبيض اللطيف (الكاولين)"
    ],
    conseils: "يُرغى على وجه أو جسم مبلل، يترك لبضع ثوانٍ لتستفيد البشرة من خصائص السدر المهدئة والمطهرة، ثم يشطف جيداً.",
    bienfaits: "يهدئ الحكة والالتهابات الجلدية، يعقم بلطف، يوحد لون البشرة، ومناسب جداً للبشرة الحساسة والمتهيجة.",
    certification: "طبيعي 100٪ - مصبن على البارد - الوزن: 100 غ"
  }
};

const getProductDetails = (nom: string) => {
  const match = productDetailsMap[nom];
  if (match) return match;
  
  const isSavon = nom.toLowerCase().includes("savon");
  const isCreme = nom.toLowerCase().includes("crème") || nom.toLowerCase().includes("creme");
  
  return {
    ingredients: isSavon ? [
      "Huile d'olive extra-vierge tunisienne saponifiée",
      "Huile de coco de première pression",
      "Glycérine végétale naturelle issue de la saponification",
      "Extraits botaniques du Cap Bon"
    ] : isCreme ? [
      "Eau pure distillée de fleur d'oranger",
      "Huile de pépins de figue de barbarie biologique",
      "Beurre de karité pur",
      "Huiles essentielles purifiantes et protectrices"
    ] : [
      "Huile d'olive vierge du Sahel",
      "Ingrédients 100% d'origine biologique locale",
      "Fleurs et extraits pressés à la main"
    ],
    conseils: isSavon 
      ? "Faire mousser le savon entre vos mains mouillées, masser délicatement la peau et rincer abondamment à l'eau claire."
      : "Prendre une noisette et masser doucement du bout des doigts sur une peau propre, matin et soir.",
    bienfaits: "Hydrate, nourrit et redonne éclat naturel à la peau grâce à des composants locaux sans perturbateurs endocriniens.",
    certification: "100% Fait Main - Savoir-faire tunisien"
  };
};

const productContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const productCardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

interface TooltipProps {
  content: string;
  children: ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[99] px-3 py-2 text-[10px] font-medium leading-normal text-[#F9F7F2] bg-[#2C3E2E] border border-[#F9F7F2]/10 rounded shadow-md w-60 text-center pointer-events-none"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C3E2E]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
}

function LazyImage({ src, alt, className = "", referrerPolicy }: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={elementRef} className="relative w-full h-full overflow-hidden bg-[#E8E4DB]">
      {/* Premium brand-colored pulse loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#E8E4DB] flex items-center justify-center animate-pulse">
          <span className="text-[9px] uppercase tracking-[0.25em] font-serif italic text-[#2C3E2E]/25">Pure Glow</span>
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy={referrerPolicy}
          onLoad={() => setIsLoaded(true)}
          className={`${className} transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
          }`}
        />
      )}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState<'fr' | 'ar'>('ar');
  const [heroMediaType, setHeroMediaType] = useState<'image' | 'video'>('image');
  const [products, setProducts] = useState<Produit[]>([
    {
      id: "savon-reglisse",
      nom: "Savon à la Réglisse",
      prix: 15.000,
      description: "Un soin éclaircissant d'exception, formulé à la réglisse et à la poudre de riz pour harmoniser le teint et atténuer les taches.",
      image_url: "/licorice-soap-100g-15dt.jpeg",
      categorie: "savon"
    },
    {
      id: "savon-louban-dakar",
      nom: "Savon au Louban Dakar 150g",
      prix: 18.000,
      description: "Un soin anti-âge impérial saponifié à froid au précieux Louban Dakar (Oliban) pour raffermir, unifier et lisser le grain de peau.",
      image_url: "/louban-soap-150g-18dt.jpeg",
      categorie: "savon"
    },
    {
      id: "savon-duo-reglisse-louban",
      nom: "Savon Duo Réglisse & Louban",
      prix: 15.000,
      description: "L'alliance parfaite de la réglisse illuminatrice et du louban dakar raffermissant pour une double action jeunesse et éclat.",
      image_url: "/licorice-louban-soap-15dt.jpeg",
      categorie: "savon"
    },
    {
      id: "savon-avoine-miel",
      nom: "Savon Flocons d'Avoine & Miel",
      prix: 12.000,
      description: "Un véritable havre de douceur aux flocons d'avoine apaisants et au miel pur pour réparer et hydrater les peaux délicates.",
      image_url: "/oatmeal-honey-soap-12dt.jpeg",
      categorie: "savon"
    },
    {
      id: "savon-reglisse-nigelle",
      nom: "Savon Réglisse & Graine Noire / Nigelle",
      prix: 15.000,
      description: "Une synergie purifiante qui combine l'action anti-taches de la réglisse et les vertus antibactériennes de l'huile de nigelle.",
      image_url: "/licorice-nigella-soap-15dt.jpeg",
      categorie: "savon"
    },
    {
      id: "savon-cafe-amidon-curcuma",
      nom: "Savon Café, Amidon & Curcuma",
      prix: 15.000,
      description: "Un exfoliant et antioxydant remarquable au marc de café tonifiant, à l'amidon lissant et au curcuma illuminateur.",
      image_url: "/coffee-starch-turmeric-soap-15dt.jpeg",
      categorie: "savon"
    },
    {
      id: "savon-sidr-jujubier",
      nom: "Savon au Sidr / Jujubier",
      prix: 15.000,
      description: "Un nettoyant ancestral d'exception aux feuilles de Sidr (jujubier) pour purifier en profondeur, calmer les peaux sensibles et unifier le teint.",
      image_url: "/sidr-soap-15dt.jpeg",
      categorie: "savon"
    }
  ]);
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'boutique' | 'admin' | 'suivi'>('boutique');
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);

  // States for administrator authentication
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('samisami231182@gmail.com');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // States for order tracking
  const [trackRef, setTrackRef] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Commande | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackLoading, setTrackLoading] = useState<boolean>(false);

  // Track order handler
  const handleTrackOrder = async (referenceId?: string) => {
    const refToUse = referenceId || trackRef;
    if (!refToUse.trim()) {
      setTrackError(lang === 'ar' ? 'الرجاء إدخال رقم مرجع صالح' : 'Veuillez saisir un numéro de référence.');
      setTrackedOrder(null);
      return;
    }
    
    setTrackLoading(true);
    setTrackError(null);
    try {
      const cleanRef = refToUse.replace('#', '').trim();
      const res = await fetch(`http://localhost:5000/api/orders/track/${cleanRef}`);
      const data = await res.json();
      if (data.success && data.order) {
        setTrackedOrder(data.order);
      } else {
        // Fallback to local state / search in orders state just in case
        const found = orders.find(o => String(o.id) === cleanRef);
        if (found) {
          setTrackedOrder(found);
        } else {
          setTrackError(
            lang === 'ar' 
              ? 'لم نتمكن من العثور على أي طلب بهذا الرقم. الرجاء التثبت وإعادة المحاولة.' 
              : 'Aucune commande trouvée pour cette référence. Veuillez vérifier le numéro.'
          );
          setTrackedOrder(null);
        }
      }
    } catch (err) {
      console.error("Tracking error:", err);
      // Fallback to local check
      const cleanRef = refToUse.replace('#', '').trim();
      const found = orders.find(o => String(o.id) === cleanRef);
      if (found) {
        setTrackedOrder(found);
      } else {
        setTrackError(
          lang === 'ar' 
            ? 'خطأ أثناء الاتصال بالخادم. الرجاء المحاولة لاحقاً.' 
            : 'Erreur de connexion au serveur. Veuillez réessayer.'
        );
        setTrackedOrder(null);
      }
    } finally {
      setTrackLoading(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      if (data.success) {
        const mappedProducts = data.products.map((p: Produit) => ({
          ...p,
          image_url: localImageMap[p.image_url] || p.image_url
        }));
        setProducts(mappedProducts);
      }
    } catch (e) {
      console.error("Erreur de récupération des produits:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    if (!isAdminAuthenticated) {
      setLoadingOrders(false);
      return;
    }
    setLoadingOrders(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Erreur de récupération des commandes:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchOrders();
      // Auto refresh orders every 10 seconds to catch chat-registered orders live!
      const interval = setInterval(() => {
        fetchOrders();
      }, 10000);
      return () => clearInterval(interval);
    } else {
      setOrders([]);
    }
  }, [isAdminAuthenticated]);

  // Trigger custom event to open Chatbot with selected product pre-filled
  const handleOrderClick = (productNom: string) => {
    const event = new CustomEvent('chat-order', { detail: { productNom } });
    window.dispatchEvent(event);
    
    // Alert feedback
    setAlertMsg({
      type: 'success',
      text: `Sarra a été informée ! Ouvrez le chat en bas à droite pour commander votre "${productNom}".`
    });
    setTimeout(() => setAlertMsg(null), 6000);
  };

  // Administrator verification handlers
  const handleAdminTabClick = () => {
    if (isAdminAuthenticated) {
      setActiveTab('admin');
    } else {
      setLoginError(null);
      setEmailInput('samisami231182@gmail.com');
      setPasswordInput('');
      setShowAdminLoginModal(true);
    }
  };

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    const correctEmail = 'samisami231182@gmail.com';
    const correctPassword = 'sami2311';
    if (emailInput.trim().toLowerCase() === correctEmail && passwordInput.trim() === correctPassword) {
      setIsAdminAuthenticated(true);
      setShowAdminLoginModal(false);
      setActiveTab('admin');
      setAlertMsg({
        type: 'success',
        text: lang === 'ar' ? 'تم تسجيل الدخول كمسؤول بنجاح' : 'Accès autorisé. Bienvenue au tableau de bord.'
      });
      setTimeout(() => setAlertMsg(null), 4000);
    } else {
      setLoginError(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور خاطئة. حاول مرة أخرى.' : 'Email ou mot de passe incorrect. Accès refusé.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setActiveTab('boutique');
    setAlertMsg({
      type: 'success',
      text: lang === 'ar' ? 'تم تسجيل الخروج من لوحة التحكم' : 'Déconnexion réussie.'
    });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleUpdateOrderStatus = async (orderId: string | number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Update local orders state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statut: newStatus } : o));
        
        // Live update trackedOrder if currently tracked
        if (trackedOrder && String(trackedOrder.id) === String(orderId)) {
          setTrackedOrder(prev => prev ? { ...prev, statut: newStatus } : null);
        }
        
        setAlertMsg({
          type: 'success',
          text: lang === 'ar' ? `تم تحديث حالة الطلب إلى "${newStatus}"` : `Statut mis à jour en "${newStatus}" avec succès !`
        });
        setTimeout(() => setAlertMsg(null), 4000);
      } else {
        setAlertMsg({
          type: 'error',
          text: data.error || 'Erreur lors de la mise à jour.'
        });
        setTimeout(() => setAlertMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setAlertMsg({
        type: 'error',
        text: 'Erreur de connexion avec le serveur.'
      });
      setTimeout(() => setAlertMsg(null), 4000);
    }
  };

  const getEstimatedDelivery = (createdAtString?: string, currentStatus?: string) => {
    if (!createdAtString) {
      return {
        fr: "Prévue sous 24 à 48 heures",
        ar: "متوقع خلال 24 إلى 48 ساعة"
      };
    }
    
    const createdDate = new Date(createdAtString);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (currentStatus === 'Livrée' || currentStatus === 'Livré') {
      return {
        fr: "Livré avec succès !",
        ar: "تم التوصيل بنجاح!"
      };
    }

    if (diffHours < 2) {
      return {
        fr: "Prévue sous 24 à 36 heures (En cours de traitement)",
        ar: "متوقع خلال 24 إلى 36 ساعة (قيد المعالجة)"
      };
    } else if (diffHours < 12) {
      return {
        fr: "Prévue dans les prochaines 12 à 24 heures (En préparation)",
        ar: "متوقع خلال الـ 12 إلى 24 ساعة القادمة (قيد التحضير)"
      };
    } else if (diffHours < 24) {
      return {
        fr: "Prévue aujourd'hui ou dans les prochaines heures (Prête à être expédiée)",
        ar: "متوقع اليوم أو خلال الساعات القادمة (جاهزة للشحن)"
      };
    } else if (diffHours < 48) {
      return {
        fr: "Livraison imminente par notre partenaire de transport (Sous 24h)",
        ar: "التسليم وشيك عبر شريك الشحن (خلال 24 ساعة)"
      };
    } else {
      return {
        fr: "Prévue sous 24 heures",
        ar: "متوقع خلال 24 ساعة"
      };
    }
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => {
    // Basic extraction of price from order details if possible
    // Defaulting to a simulated average or exact matching
    return sum + 25.0; // Simulated average order value in DT
  }, 0);

  // Theme color styling mappings
  const themeBgMain = isNightMode ? 'bg-[#141E15]' : 'bg-[#F5F2EB]';
  const themeBgWhite = isNightMode ? 'bg-[#1D2A1E]' : 'bg-white';
  const themeBgLight = isNightMode ? 'bg-[#19241A]' : 'bg-[#FAF9F5]';
  const themeTextMain = isNightMode ? 'text-[#FAF9F5]' : 'text-[#2C3E2E]';
  const themeTextMuted = isNightMode ? 'text-[#A0A49B]' : 'text-[#5A5A40]';
  const themeBorderMain = isNightMode ? 'border-[#FAF9F5]/10' : 'border-[#2C3E2E]/10';
  const themeBorderLight = isNightMode ? 'border-[#FAF9F5]/5' : 'border-[#2C3E2E]/5';

  return (
    <div 
      className={`min-h-screen ${themeBgMain} ${lang === 'ar' ? 'font-cairo' : 'font-sans'} ${themeTextMain} transition-all duration-300`} 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      
      {/* Alert Notice Banner */}
      {alertMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl bg-[#2C3E2E] p-4 text-[#F9F7F2] shadow-xl flex items-center justify-between border border-[#C18D5D]/20"
        >
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-[#C18D5D] animate-pulse" />
            <p className="text-xs font-medium tracking-wide">{alertMsg.text}</p>
          </div>
          <button onClick={() => setAlertMsg(null)} className="text-[#C18D5D] hover:text-[#F9F7F2] font-bold text-xs uppercase tracking-widest ml-3">
            Fermer
          </button>
        </motion.div>
      )}

      {/* Top Brand bar */}
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${themeBorderMain} ${isNightMode ? 'bg-[#141E15]/95' : 'bg-[#F5F2EB]/95'} backdrop-blur-md`}>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4 px-6 py-5 sm:px-8 lg:px-12 max-w-7xl">
          
          {/* Left: LA COLLECTION BIO */}
          <div className="flex justify-start items-center hidden md:flex">
            <a href="#catalogue" className={`text-xs uppercase tracking-[0.3em] font-bold transition-colors cursor-pointer ${themeTextMuted} hover:${themeTextMain}`}>
              {lang === 'ar' ? 'المجموعة العضوية' : 'La Collection Bio'}
            </a>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2.5">
              <img 
                src="/watermarked_img_10592767577053482886.png" 
                alt="Pure Glow MH Logo" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className={`font-serif italic text-2xl sm:text-3xl tracking-tighter ${themeTextMain} font-semibold transition-colors duration-300`}>
                Pure Glow MH
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#C18D5D] font-bold mt-1">
              {lang === 'ar' ? '- مستحضرات تجميل طبيعية -' : '- COSMÉTIQUES NATURELS -'}
            </span>
          </div>

          {/* Right: Buttons BOUTIQUE and COMMANDES + Language Selector */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end items-center">
            <nav className={`flex space-x-1 border transition-colors duration-300 ${themeBorderMain} rounded-full ${isNightMode ? 'bg-[#1D2A1E]/85' : 'bg-white/60'} p-1 shadow-xs`}>
              <button
                onClick={() => setActiveTab('boutique')}
                className={`rounded-full px-4 sm:px-5 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  activeTab === 'boutique' 
                    ? (isNightMode ? 'bg-[#C18D5D] text-white shadow-xs' : 'bg-[#2C3E2E] text-[#F9F7F2] shadow-xs') 
                    : `${themeTextMuted} hover:${themeTextMain}`
                }`}
              >
                {lang === 'ar' ? 'المتجر' : 'Boutique'}
              </button>
              <button
                onClick={() => setActiveTab('suivi')}
                className={`rounded-full px-4 sm:px-5 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'suivi' 
                    ? 'bg-[#8F6A48] text-white shadow-xs' 
                    : `${themeTextMuted} hover:${themeTextMain}`
                }`}
              >
                <Truck className="h-3 w-3" />
                <span>{lang === 'ar' ? 'تتبع' : 'Suivi'}</span>
              </button>
              <button
                onClick={handleAdminTabClick}
                className={`rounded-full px-4 sm:px-5 py-1.5 text-[10px] uppercase tracking-wider font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  activeTab === 'admin' 
                    ? 'bg-[#C18D5D] text-white shadow-xs' 
                    : `${themeTextMuted} hover:${themeTextMain}`
                }`}
              >
                <ClipboardList className="h-3 w-3" />
                <span>{lang === 'ar' ? 'الطلبات' : 'Commandes'}</span>
                {orders.length > 0 && (
                  <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[8px] font-bold ${isNightMode ? 'bg-emerald-900 text-[#FAF9F5]' : 'bg-[#2C3E2E] text-[#F9F7F2]'}`}>
                    {orders.length}
                  </span>
                )}
              </button>
            </nav>

            {/* Language Selector FR | ع */}
            <div className={`flex items-center transition-colors duration-300 ${isNightMode ? 'bg-[#1D2A1E]/85' : 'bg-white/60'} border ${themeBorderMain} rounded-full px-2.5 py-1 text-[10px] font-bold shadow-xs`}>
              <button 
                onClick={() => setLang('fr')} 
                className={`px-1.5 py-0.5 rounded-full transition-colors cursor-pointer ${lang === 'fr' ? 'text-[#C18D5D]' : `${themeTextMuted} hover:${themeTextMain}`}`}
                title="Français"
              >
                FR
              </button>
              <span className={`transition-colors duration-300 ${isNightMode ? 'text-[#FAF9F5]/20' : 'text-[#2C3E2E]/20'} font-light select-none mx-0.5`}>|</span>
              <button 
                onClick={() => setLang('ar')} 
                className={`px-1.5 py-0.5 rounded-full transition-colors cursor-pointer font-cairo text-xs leading-none ${lang === 'ar' ? 'text-[#C18D5D] font-bold' : `${themeTextMuted} hover:${themeTextMain}`}`}
                title="العربية"
              >
                ع
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`flex items-center justify-center p-2 rounded-full border transition-all duration-300 ${themeBorderMain} ${isNightMode ? 'bg-[#1D2A1E]/85 text-[#FAF9F5]' : 'bg-white/60 text-[#2C3E2E]'} hover:text-[#C18D5D] hover:border-[#C18D5D] shadow-xs cursor-pointer`}
              title={isNightMode ? (lang === 'ar' ? 'وضع النهار' : 'Mode Jour') : (lang === 'ar' ? 'وضع الليل' : 'Mode Nuit')}
            >
              {isNightMode ? <Sun className="h-3.5 w-3.5 text-[#C18D5D]" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'boutique' ? (
        <>
          {/* Hero Section */}
          <section className={`relative overflow-hidden ${themeBgMain} border-b ${themeBorderLight} py-16 lg:py-24 transition-colors duration-300`}>
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
                
                {/* Left Column: Archetype Arche (Editorial Layout) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center">
                  {/* Arche with double contour: Outer crème/beige border, inner thick pure white border */}
                  <div className={`relative w-full max-w-[340px] sm:max-w-[420px] aspect-[3/4] rounded-t-full p-1 ${themeBgMain} border ${isNightMode ? 'border-emerald-950' : 'border-[#E2DDD3]'} shadow-[0_16px_40px_rgba(44,62,46,0.06)] flex items-center justify-center transition-colors duration-300`}>
                    <div className={`w-full h-full rounded-t-full ${themeBgWhite} p-5 sm:p-6 flex items-center justify-center relative overflow-hidden transition-colors duration-300`}>
                      {/* Image centered directly inside the Arch */}
                      <div className="w-full h-full rounded-t-full overflow-hidden relative bg-[#FAF9F5] flex items-center justify-center">
                        <img 
                          src={imageTraiterSidre} 
                          alt={lang === 'ar' ? 'صابون السدر والعسل الطبيعي الممتاز' : 'Savon Artisanal au Sidr et au Miel'} 
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Editorial Title below the Arch */}
                  <div className="text-center mt-6">
                    {lang === 'ar' ? (
                      <p className="font-amiri text-xl sm:text-2xl font-bold tracking-wide text-[#2C3E2E] leading-relaxed">
                        مستحضرات تجميل طبيعية<br />
                        صنع يدوي في المهدية
                      </p>
                    ) : (
                      <p className="font-serif text-lg sm:text-xl font-medium tracking-wide text-[#2C3E2E] leading-relaxed">
                        Cosmétiques Naturels<br />
                        Fait Main à Mahdia
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Content Column */}
                <div className={`lg:col-span-7 space-y-8 lg:ps-6 pt-2 lg:pt-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <div className="space-y-4">
                    <h1 className={`font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight ${lang === 'ar' ? 'font-amiri' : ''}`}>
                      {lang === 'ar' ? (
                        <>
                          <span className={`font-bold ${themeTextMain}`}>فخامة</span> <br /> 
                          <span className="italic font-light text-[#C18D5D]">العناية الطبيعية</span>
                        </>
                      ) : (
                        <>
                          <span className={`font-bold ${themeTextMain}`}>La Douceur</span> <br /> 
                          <span className="italic font-light text-[#C18D5D]">du Terroir</span>
                        </>
                      )}
                    </h1>
                  </div>
                  
                  <p className={`max-w-xl text-base sm:text-lg leading-relaxed ${themeTextMuted} ${lang === 'ar' ? 'font-cairo leading-loose text-justify' : ''}`}>
                    {lang === 'ar' ? (
                      "اكتشفوا سحر الطبيعة التونسية مع صابوننا التقليدي المصنوع على البارد وكريماتنا المرطبة الفائقة. تركيباتنا الطبيعية الغنية تمزج بين نقاء زيت الزيتون البكر من بساتيننا الممتدة، ولمسة زيت اللوز الحلو وزيت الأرغان المغذي، لتمنح بشرتكم أسرار الجمال الطبيعي الفاخر بنفحات ياسمين الحمامات الزكية."
                    ) : (
                      "Découvrez nos savons traditionnels de Thapsus saponifiés à froid et nos crèmes hydratantes onctueuses. Formulés avec l'authentique huile de pépins de figue de barbarie tunisienne, l'huile d'olive de nos vergers et les secrets de beauté parfumés au jasmin de Hammamet."
                    )}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a
                      href="#catalogue"
                      className={`inline-flex items-center justify-center rounded-sm transition-colors shadow-md cursor-pointer ${
                        isNightMode 
                          ? 'bg-[#C18D5D] text-white hover:bg-[#b07d4e]' 
                          : 'bg-[#2C3E2E] text-[#F9F7F2] hover:bg-[#C18D5D]'
                      } px-8 py-3.5 text-xs uppercase tracking-widest font-bold ${lang === 'ar' ? 'font-cairo' : ''}`}
                    >
                      {lang === 'ar' ? 'تصفح الكتالوج' : 'EXPLORER LE CATALOGUE'}
                      <ChevronRight className={`h-4 w-4 transition-transform ${lang === 'ar' ? 'rotate-180 me-2' : 'ms-2'}`} />
                    </a>
                    <button
                      onClick={() => {
                        const event = new CustomEvent('chat-order', { detail: {} });
                        window.dispatchEvent(event);
                      }}
                      className={`inline-flex items-center justify-center rounded-sm transition-colors cursor-pointer border ${
                        isNightMode 
                          ? 'bg-[#1D2A1E] border-[#FAF9F5]/20 text-[#FAF9F5] hover:bg-[#19241A] hover:border-[#FAF9F5]/30' 
                          : 'bg-white border-[#2C3E2E]/20 text-[#2C3E2E] hover:bg-[#FAF9F5] hover:border-[#2C3E2E]'
                      } px-8 py-3.5 text-xs uppercase tracking-widest font-bold ${lang === 'ar' ? 'font-cairo' : ''}`}
                    >
                      <MessageSquare className={`h-4 w-4 text-[#C18D5D] ${lang === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {lang === 'ar' ? 'تحدث مع سارة' : 'PARLER À SARRA'}
                    </button>
                  </div>

                  {/* Trust Badges in refined theme grid */}
                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t ${themeBorderMain}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#C18D5D]">
                        <Tooltip content={
                          lang === 'ar' 
                            ? 'نستخدم حصرياً زيوتاً نباتية معصورة على البارد ومستخلصات نقية طبيعية 100٪ بدون إضافات كيميائية.' 
                            : 'Nous utilisons exclusivement des huiles végétales de première pression à froid et des hydrolats purs, sans additifs chimiques.'
                        }>
                          <span className="flex items-center gap-2 cursor-help">
                            <Leaf className="h-4 w-4 shrink-0 hover:scale-110 transition-transform" />
                            <span className={`text-xs uppercase tracking-wider font-bold ${lang === 'ar' ? 'font-cairo' : ''}`}>
                              {lang === 'ar' ? 'المكونات' : 'INGRÉDIENTS'}
                            </span>
                          </span>
                        </Tooltip>
                      </div>
                      <p className={`text-xs ${themeTextMuted} ${lang === 'ar' ? 'font-cairo' : ''}`}>
                        {lang === 'ar' ? '100% طبيعي وعضوي' : '100% Organique'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#C18D5D]">
                        <Tooltip content={
                          lang === 'ar' 
                            ? 'كل منتج مصنوع يدوياً في المهدية بالطرق التقليدية للتصبين على البارد للحفاظ على كامل الفوائد الطبيعية.' 
                            : 'Chaque produit est fabriqué à la main à Mahdia selon des méthodes traditionnelles de saponification à froid pour préserver tous ses bienfaits.'
                        }>
                          <span className="flex items-center gap-2 cursor-help">
                            <Award className="h-4 w-4 shrink-0 hover:scale-110 transition-transform" />
                            <span className={`text-xs uppercase tracking-wider font-bold ${lang === 'ar' ? 'font-cairo' : ''}`}>
                              {lang === 'ar' ? 'حرفي تقليدي' : 'ARTISANAL'}
                            </span>
                          </span>
                        </Tooltip>
                      </div>
                      <p className={`text-xs ${themeTextMuted} ${lang === 'ar' ? 'font-cairo' : ''}`}>
                        {lang === 'ar' ? 'مصبوب ومقطع يدويًا' : 'Moulé et découpé à la main'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[#C18D5D]">
                        <Tooltip content={
                          lang === 'ar' 
                            ? 'توصيل سريع خلال 24 إلى 48 ساعة لكامل التراب التونسي والدفع نقداً عند الاستلام بعد معاينة طلبك.' 
                            : 'Livraison rapide sous 24 à 48 heures sur toute la Tunisie avec paiement sécurisé en espèces après réception.'
                        }>
                          <span className="flex items-center gap-2 cursor-help">
                            <Truck className="h-4 w-4 shrink-0 hover:scale-110 transition-transform" />
                            <span className={`text-xs uppercase tracking-wider font-bold ${lang === 'ar' ? 'font-cairo' : ''}`}>
                              {lang === 'ar' ? 'التوصيل' : 'LIVRAISON'}
                            </span>
                          </span>
                        </Tooltip>
                      </div>
                      <p className={`text-xs ${themeTextMuted} ${lang === 'ar' ? 'font-cairo' : ''}`}>
                        {lang === 'ar' ? 'الدفع نقداً عند الاستلام' : 'Espèces à la livraison'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className={`transition-colors duration-300 ${themeBgWhite} py-16 border-b ${themeBorderLight}`}>
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              <div className="text-center max-w-xl mx-auto mb-16">
                <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#C18D5D]">
                  {lang === 'ar' ? 'ميثاق الجودة والالتزام' : 'Charte Qualité'}
                </span>
                <h2 className={`font-serif text-3xl sm:text-4xl font-semibold tracking-tight ${themeTextMain} mt-2`}>
                  {lang === 'ar' ? 'لماذا تختار معشبتنا التجميلية؟' : 'Pourquoi choisir notre herboristerie ?'}
                </h2>
                <div className="w-12 h-0.5 bg-[#C18D5D] mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                
                <div className={`border ${themeBorderMain} p-8 rounded-sm ${isNightMode ? 'bg-[#19241A]/50 hover:bg-[#19241A]' : 'bg-[#F9F7F2]/50 hover:bg-[#F9F7F2]'} transition-colors duration-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className={`font-serif italic text-lg ${themeTextMain} mb-2`}>
                    {lang === 'ar' ? 'زيوت نباتية ثمينة' : 'Huiles Précieuses'}
                  </h3>
                  <p className={`text-xs ${themeTextMuted} leading-relaxed`}>
                    {lang === 'ar' 
                      ? 'نحن نستخلص زيت بذور التين الشوكي التونسي النقي والمعصور على البارد، وهو أقوى إكسير طبيعي لمقاومة علامات تقدم السن في العالم النباتي.'
                      : "Nous extrayons l'huile pure de pépins de figue de barbarie tunisienne, l'élixir anti-âge le plus puissant du règne végétal."}
                  </p>
                </div>

                <div className={`border ${themeBorderMain} p-8 rounded-sm ${isNightMode ? 'bg-[#19241A]/50 hover:bg-[#19241A]' : 'bg-[#F9F7F2]/50 hover:bg-[#F9F7F2]'} transition-colors duration-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className={`font-serif italic text-lg ${themeTextMain} mb-2`}>
                    {lang === 'ar' ? 'خالٍ من المواد الكيميائية' : 'Zéro Chimie'}
                  </h3>
                  <p className={`text-xs ${themeTextMuted} leading-relaxed`}>
                    {lang === 'ar' 
                      ? 'نعتمد تصبيناً تقليدياً يحافظ على جودة الزيوت وبكامل الغليسرين الطبيعي المرطب. تركيباتنا خالية تماماً من البارابين، السلفات والمواد الحافظة الاصطناعية.'
                      : 'Saponification traditionnelle préservant les glycérines naturelles. Aucun parabène, sulfate ou conservateur synthétique.'}
                  </p>
                </div>

                <div className={`border ${themeBorderMain} p-8 rounded-sm ${isNightMode ? 'bg-[#19241A]/50 hover:bg-[#19241A]' : 'bg-[#F9F7F2]/50 hover:bg-[#F9F7F2]'} transition-colors duration-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className={`font-serif italic text-lg ${themeTextMain} mb-2`}>
                    {lang === 'ar' ? 'عطور طبيعية ساحرة' : 'Parfums Subtils'}
                  </h3>
                  <p className={`text-xs ${themeTextMuted} leading-relaxed`}>
                    {lang === 'ar' 
                      ? 'من عبير تقطير زهر البرتقال الفواح بنابل والورد الجوري، إلى نفحات ياسمين الحمامات البري الساحر. عبير أصيل ينبض بأصالة الطبيعة التونسية.'
                      : "De la fleur d'oranger de Nabeul au jasmin sauvage de Hammamet. Des senteurs authentiques et enivrantes de Tunisie."}
                  </p>
                </div>

                <div className={`border ${themeBorderMain} p-8 rounded-sm ${isNightMode ? 'bg-[#19241A]/50 hover:bg-[#19241A]' : 'bg-[#F9F7F2]/50 hover:bg-[#F9F7F2]'} transition-colors duration-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h3 className={`font-serif italic text-lg ${themeTextMain} mb-2`}>
                    {lang === 'ar' ? 'دعم الاقتصاد المحلي التونسي' : 'Soutien Agricole'}
                  </h3>
                  <p className={`text-xs ${themeTextMuted} leading-relaxed`}>
                    {lang === 'ar' 
                      ? 'نلتزم بالشراء المسؤول والعادل ومباشرة من التعاونيات النسائية والمزارعات المحليات في القصرين، الساحل، والوطن القبلي التونسي لدعم الاستدامة والعمل الكريم.'
                      : "Achat équitable auprès de femmes agricultrices et coopératives de Kasserine, du Sahel et du Cap Bon tunisien."}
                  </p>
                </div>

              </div>
            </div>
          </section>

          {/* Catalogue Section with refined grids */}
          <section id="catalogue" className={`py-20 ${themeBgMain} transition-colors duration-300`}>
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-xs uppercase tracking-[0.4em] font-bold text-[#C18D5D]">Sélection Exclusive</span>
                <h2 className={`font-serif text-3xl sm:text-4xl font-semibold ${themeTextMain}`}>
                  Les Savons &amp; Onctueux du Moment
                </h2>
                <p className={`text-xs ${themeTextMuted} max-w-md mx-auto leading-relaxed`}>
                  Cliquez sur "Prendre commande" pour ouvrir le Chatbot. Sarra (IA) s'occupera d'enregistrer vos informations de livraison en Tunisie.
                </p>
              </div>

              {loadingProducts ? (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className={`animate-pulse ${themeBgWhite} border ${themeBorderMain} p-6 space-y-4`}>
                      <div className="bg-[#E8E4DB] h-60 w-full animate-pulse" />
                      <div className="h-4 bg-[#E8E4DB] rounded w-2/3" />
                      <div className="h-3 bg-[#E8E4DB] rounded w-full" />
                      <div className="h-10 bg-[#E8E4DB] rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
                  variants={productContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {products.map((product) => {
                    const translatedNom = lang === 'ar' && productArMap[product.nom] ? productArMap[product.nom].nom : product.nom;
                    const translatedDesc = lang === 'ar' && productArMap[product.nom] ? productArMap[product.nom].description : product.description;
                    return (
                      <motion.div 
                        key={product.id} 
                        variants={productCardVariants}
                        className={`group ${themeBgWhite} border ${themeBorderMain} p-5 hover:border-[#C18D5D]/40 transition-all duration-300 flex flex-col justify-between`}
                      >
                        <div>
                          {/* Image Wrap - Clickable to open details */}
                          <div 
                            onClick={() => setSelectedProduct(product)}
                            className={`aspect-square ${isNightMode ? 'bg-[#223323]' : 'bg-[#E8E4DB]'} overflow-hidden mb-4 relative cursor-pointer group-hover:opacity-95`}
                          >
                            <LazyImage 
                              src={product.image_url} 
                              alt={translatedNom} 
                              className="h-full w-full object-cover grayscale-[10%] transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-3 left-3 bg-[#2C3E2E] text-[#F9F7F2] text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1">
                              {lang === 'ar' ? 'حرفي تونسي أصيل' : 'Artisanal Tunisien'}
                            </div>
                            
                            {/* Elegant hover overlay */}
                            <div className="absolute inset-0 bg-[#2C3E2E]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className={`transition-colors duration-300 ${isNightMode ? 'bg-[#182219] text-[#FAF9F5] border-[#FAF9F5]/10' : 'bg-[#F9F7F2] text-[#2C3E2E] border-[#2C3E2E]/15'} text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 shadow-sm border flex items-center space-x-1`}>
                                <Eye className="h-3.5 w-3.5 text-[#C18D5D]" />
                                <span>{lang === 'ar' ? 'التفاصيل والمكونات' : 'En savoir plus'}</span>
                              </span>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <div className={`space-y-2 mt-2 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                            <h3 
                              onClick={() => setSelectedProduct(product)}
                              className={`font-serif text-lg font-bold ${themeTextMain} hover:text-[#C18D5D] transition-colors leading-snug cursor-pointer`}
                            >
                              {translatedNom}
                            </h3>
                            <p className={`text-xs ${themeTextMuted} leading-relaxed`}>
                              {translatedDesc}
                            </p>
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className={`text-[10px] font-bold text-[#C18D5D] hover:${themeTextMain} transition-colors flex items-center space-x-1 cursor-pointer pt-1 ${lang === 'ar' ? 'flex-row-reverse space-x-reverse' : ''}`}
                            >
                              <Leaf className="h-3 w-3" />
                              <span>{lang === 'ar' ? 'عرض المكونات وطريقة الاستعمال' : 'Afficher les ingrédients & conseils'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Price & Action footer */}
                        <div className={`pt-4 mt-6 border-t ${themeBorderMain} flex items-center justify-between gap-1.5 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                            <span className={`text-[9px] ${themeTextMuted} uppercase tracking-wider block font-semibold`}>
                              {lang === 'ar' ? 'سعر المنتج' : 'Prix Tunisien'}
                            </span>
                            <span className="text-base font-serif italic font-bold text-[#C18D5D]">{product.prix.toFixed(3)} {lang === 'ar' ? 'د.ت' : 'TND'}</span>
                          </div>
                          <div className={`flex gap-1.5 shrink-0 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className={`rounded-sm border ${
                                isNightMode 
                                  ? 'border-[#FAF9F5]/10 hover:border-[#C18D5D] text-[#FAF9F5] bg-[#19241A]/30' 
                                  : 'border-[#2C3E2E]/15 hover:border-[#C18D5D] text-[#2C3E2E] bg-[#FAF9F5]/30'
                              } hover:text-[#C18D5D] transition-colors px-3 py-2 text-[10px] uppercase tracking-widest font-bold cursor-pointer`}
                              title={lang === 'ar' ? 'عرض تفاصيل المكونات والنصائح' : "Voir les ingrédients et conseils d'utilisation"}
                            >
                              {lang === 'ar' ? 'تفاصيل' : 'Détails'}
                            </button>
                            <button
                              onClick={() => handleOrderClick(product.nom)}
                              className={`rounded-sm transition-colors px-3 py-2 text-[10px] uppercase tracking-widest font-bold cursor-pointer ${
                                isNightMode 
                                  ? 'bg-[#C18D5D] text-white hover:bg-[#b07d4e]' 
                                  : 'bg-[#2C3E2E] text-[#F9F7F2] hover:bg-[#C18D5D]'
                              }`}
                            >
                              {lang === 'ar' ? 'طلب الآن' : 'Commander'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </section>

          {/* Testimonials (Témoignages) Section - Editorial Style */}
          <section className={`py-20 ${themeBgWhite} border-b ${themeBorderLight} transition-colors duration-300`}>
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-[#C18D5D] text-xs uppercase tracking-[0.4em] font-bold block">{lang === 'ar' ? 'تجارب مشتركة' : 'Expériences Partagées'}</span>
                <h2 className={`font-serif text-3xl sm:text-4xl font-semibold ${themeTextMain}`}>
                  {lang === 'ar' ? 'النعومة والراحة في حياتك اليومية' : 'La Douceur Adoptée au Quotidien'}
                </h2>
                <div className="w-12 h-0.5 bg-[#C18D5D] mx-auto mt-4" />
                <p className={`text-xs ${themeTextMuted} max-w-md mx-auto leading-relaxed pt-2`}>
                  {lang === 'ar' ? 'اكتشف الآراء والشهادات الحقيقية لعملائنا الذين جعلوا من Pure Glow MH جزءاً لا يتجزأ من روتينهم اليومي للعناية بالبشرة.' : 'Découvrez les retours authentiques de ceux et celles qui ont fait de Pure Glow MH leur rituel de soin favori.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Testimonial 1 */}
                <div className={`border ${themeBorderMain} ${isNightMode ? 'bg-[#19241A]/40' : 'bg-[#F9F7F2]/40'} p-8 flex flex-col justify-between hover:border-[#C18D5D]/30 transition-all duration-300 relative group`}>
                  <span className="font-serif text-6xl text-[#C18D5D]/15 absolute top-4 left-6 pointer-events-none select-none">“</span>
                  <div className="space-y-4 relative z-10">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-[#C18D5D] text-[#C18D5D]" />
                      ))}
                    </div>
                    <p className={`text-sm font-serif italic ${themeTextMain} leading-relaxed ${lang === 'ar' ? 'text-right font-cairo' : 'text-left'}`}>
                      {lang === 'ar' 
                        ? '"صابون التين الشوكي المصنع على البارد هو أعجوبة حقيقية! أصبحت بشرتي ناعمة ورطبة للغاية بعد أيام قليلة من الاستعمال. معشبة استثنائية بكل المقاييس!"'
                        : '"Le savon saponifié à froid à l\'huile de figue de barbarie est une pure merveille. Ma peau est incroyablement douce et réhydratée après seulement quelques jours. Une herboristerie d\'exception !"'
                      }
                    </p>
                  </div>
                  <div className={`mt-8 pt-4 border-t ${themeBorderMain} flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                      <h4 className={`font-sans font-bold text-xs ${themeTextMain} uppercase tracking-wider`}>{lang === 'ar' ? 'أمينة قدور' : 'Amina Kaddour'}</h4>
                      <p className="text-[10px] text-[#C18D5D] font-medium uppercase tracking-widest">{lang === 'ar' ? 'المهدية، تونس' : 'Mahdia, Tunisie'}</p>
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-semibold ${isNightMode ? 'bg-emerald-950 text-[#FAF9F5]' : 'bg-[#2C3E2E] text-[#F9F7F2]'} px-2 py-0.5`}>
                      {lang === 'ar' ? 'تقييم موثق' : 'Avis vérifié'}
                    </span>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className={`border ${themeBorderMain} ${isNightMode ? 'bg-[#19241A]/40' : 'bg-[#F9F7F2]/40'} p-8 flex flex-col justify-between hover:border-[#C18D5D]/30 transition-all duration-300 relative group`}>
                  <span className={`font-serif text-6xl text-[#C18D5D]/15 absolute top-4 ${lang === 'ar' ? 'right-6' : 'left-6'} pointer-events-none select-none`}>“</span>
                  <div className="space-y-4 relative z-10">
                    <div className={`flex space-x-1 ${lang === 'ar' ? 'justify-end' : ''}`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-[#C18D5D] text-[#C18D5D]" />
                      ))}
                    </div>
                    <p className={`text-sm font-serif italic ${themeTextMain} leading-relaxed ${lang === 'ar' ? 'text-right font-cairo' : 'text-left'}`}>
                      {lang === 'ar' 
                        ? '"المقشر الطبيعي وكريم الترطيب بزيت الأرغان مثاليان لروتيني اليومي. التوصيل إلى سوسة كان سريعاً جداً، والتعليب الأنيق المزين بالورود المجففة يعكس دقة واهتماماً نادراً بالتفاصيل."'
                        : '"Le gommage à l\'argile et la crème hydratante au beurre de karité bio sont parfaits pour ma routine. L\'expédition vers Sousse a été ultra rapide et l\'emballage en carton brut et fleurs séchées est d\'un raffinement rare."'
                      }
                    </p>
                  </div>
                  <div className={`mt-8 pt-4 border-t ${themeBorderMain} flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                      <h4 className={`font-sans font-bold text-xs ${themeTextMain} uppercase tracking-wider`}>{lang === 'ar' ? 'يوسف بوهلال' : 'Youssef Bouhlel'}</h4>
                      <p className="text-[10px] text-[#C18D5D] font-medium uppercase tracking-widest">{lang === 'ar' ? 'سوسة، الساحل' : 'Sousse, Sahel'}</p>
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-semibold ${isNightMode ? 'bg-emerald-950 text-[#FAF9F5]' : 'bg-[#2C3E2E] text-[#F9F7F2]'} px-2 py-0.5`}>
                      {lang === 'ar' ? 'تقييم موثق' : 'Avis vérifié'}
                    </span>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className={`border ${themeBorderMain} ${isNightMode ? 'bg-[#19241A]/40' : 'bg-[#F9F7F2]/40'} p-8 flex flex-col justify-between hover:border-[#C18D5D]/30 transition-all duration-300 relative group`}>
                  <span className={`font-serif text-6xl text-[#C18D5D]/15 absolute top-4 ${lang === 'ar' ? 'right-6' : 'left-6'} pointer-events-none select-none`}>“</span>
                  <div className="space-y-4 relative z-10">
                    <div className={`flex space-x-1 ${lang === 'ar' ? 'justify-end' : ''}`}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-[#C18D5D] text-[#C18D5D]" />
                      ))}
                    </div>
                    <p className={`text-sm font-serif italic ${themeTextMain} leading-relaxed ${lang === 'ar' ? 'text-right font-cairo' : 'text-left'}`}>
                      {lang === 'ar' 
                        ? '"تجربة شراء مذهلة! تحدثت مع المساعدة الذكية سارة مباشرة بالدارجة التونسية، حيث نصحتني بصابون الياسمين وسجلت معلومات التوصيل في لحظات. برافو!"'
                        : '"Une expérience d\'achat magique ! J\'ai discuté avec l\'assistante IA Sarra directement en Darija, elle m\'a conseillée sur le savon au jasmin et a enregistré mes informations de livraison en deux clics. Chapeau bas !"'
                      }
                    </p>
                  </div>
                  <div className={`mt-8 pt-4 border-t ${themeBorderMain} flex items-center justify-between ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                      <h4 className={`font-sans font-bold text-xs ${themeTextMain} uppercase tracking-wider`}>{lang === 'ar' ? 'مريم غربال' : 'Meriam Ghorbel'}</h4>
                      <p className="text-[10px] text-[#C18D5D] font-medium uppercase tracking-widest">{lang === 'ar' ? 'صفاقس' : 'Sfax'}</p>
                    </div>
                    <span className={`text-[9px] uppercase tracking-wider font-semibold ${isNightMode ? 'bg-emerald-950 text-[#FAF9F5]' : 'bg-[#2C3E2E] text-[#F9F7F2]'} px-2 py-0.5`}>
                      {lang === 'ar' ? 'تقييم موثق' : 'Avis vérifié'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* FAQ (Foire Aux Questions) Section - Editorial Style */}
          <section className={`py-20 ${themeBgMain} border-b ${themeBorderLight} transition-colors duration-300`}>
            <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
              
              <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                <span className="text-[#C18D5D] text-xs uppercase tracking-[0.4em] font-bold block">{lang === 'ar' ? 'الأسئلة الشائعة' : 'Foire Aux Questions'}</span>
                <h2 className={`font-serif text-3xl sm:text-4xl font-semibold ${themeTextMain}`}>
                  {lang === 'ar' ? 'بعض الإجابات عن تساؤلاتكم حول منتجاتنا الطبيعية' : "Quelques réponses à vos questions d'herboristerie"}
                </h2>
                <div className="w-12 h-0.5 bg-[#C18D5D] mx-auto mt-4" />
                <p className={`text-xs ${themeTextMuted} leading-relaxed pt-2`}>
                  {lang === 'ar' ? 'نحن نلتزم بالشفافية المطلقة حول طريقة التصنيع اليدوي التقليدي وخدمات التوصيل في تونس.' : 'Nous privilégions une transparence totale sur nos processus de fabrication artisanale et nos services de livraison en Tunisie.'}
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q_fr: "Quels sont les ingrédients phares de vos cosmétiques et d’où proviennent-ils ?",
                    q_ar: "ما هي المكونات الأساسية لمنتجاتكم ومن أين تأتي؟",
                    a_fr: "Nos formulations s'articulent autour d'ingrédients précieux du terroir tunisien : l'huile pure de pépins de figue de barbarie biologique récoltée auprès de coopératives de Kasserine (un puissant élixir anti-âge), l'huile d'olive extra-vierge pressée à froid provenant de nos vergers familiaux du Sahel, et les absolues naturelles et enivrantes de jasmin de Hammamet ou de fleur d'oranger de Nabeul. Nous excluons toute chimie nocive pour honorer la pureté brute de la nature.",
                    a_ar: "تتمحور تركيباتنا حول مكونات ثمينة مستخلصة من خيرات تونس الخضراء: زيت بذور التين الشوكي العضوي النقي الذي يتم جنيه من تعاونيات القصرين (وهو إكسير قوي لمقاومة علامات تقدم السن)، زيت الزيتون البكر الممتاز المعصور على البارد من بساتين عائلتنا بالساحل التونسي، ومقطرات الياسمين الطبيعي من الحمامات وزهر البرتقال الفواح من نابل. نحن نستبعد تماماً أي إضافات كيميائية ضارة احتراماً لنقاء ونضارة بشرتكم."
                  },
                  {
                    q_fr: "Quels sont les tarifs et les délais de livraison à travers la Tunisie ?",
                    q_ar: "ما هي أسعار وتواريخ (آجال) التوصيل في تونس؟",
                    a_fr: "Nous expédions nos colis d'exception à votre porte sur toute la Tunisie (Grand Tunis, Cap Bon, Sahel, Sfax, Sousse, Bizerte et les régions intérieures) sous 24 à 48 heures ouvrables. Les frais de port s’élèvent à un tarif forfaitaire de 7 TND, et nous sommes ravis de vous offrir la livraison gratuite pour tout panier à partir de 60 TND. Le règlement s'effectue en toute simplicité en espèces (Cash à la livraison) lors du dépôt de votre colis.",
                    a_ar: "نقوم بتوصيل طلباتكم مباشرة إلى باب منزلكم في جميع أنحاء الجمهورية التونسية (تونس الكبرى، الوطن القبلي، الساحل، صفاقس، سوسة، بنزرت وكافة المناطق الداخلية) في غضون 24 إلى 48 ساعة عمل. تكلفة التوصيل ثابتة ومقدرة بـ 7 دينار تونسي، ويسعدنا تقديم التوصيل المجاني بالكامل لكل طلب تفوق قيمته 60 دينار تونسي. الدفع يتم بكل أمان نقداً عند الاستلام بعد معاينة طلبيتك."
                  },
                  {
                    q_fr: "En quoi consiste la saponification à froid et quelles sont vos garanties bio ?",
                    q_ar: "ما هي عملية التصبين على البارد وما هي ضماناتكم العضوية؟",
                    a_fr: "La saponification à froid est une méthode traditionnelle exigeante qui permet de fabriquer du savon sans chauffer les huiles végétales de base. Ce procédé préserve intacts l'ensemble de leurs bienfaits, vitamins et de la glycérine hydratante naturelle. Nos formulations sont entièrement exemptes de sulfates, de parabènes, de silicones ou de parfums synthétiques irritants. Chaque soin est entièrement biodégradable et respecte votre épiderme.",
                    a_ar: "التصبين على البارد هو طريقة تقليدية أصيلة تتطلب دقة وخبرة عالية لصنع الصابون دون تسخين الزيوت النباتية الأساسية. تحافظ هذه الطريقة على سلامة جميع الفوائد والفيتامينات، بالإضافة إلى الغليسرين الطبيعي المرطب للبشرة. جميع مستحضراتنا خالية تماماً من الكبريتات (السلفات)، البارابين، السيليكون أو العطور الاصطناعية المسببة للتهيج. كل منتج صديق للبيئة وقابل للتحلل بالكامل."
                  },
                  {
                    q_fr: "Comment commander ou échanger avec votre conseillère virtuelle Sarra ?",
                    q_ar: "كيف يمكنني الطلب أو التحدث مع المستشارة الافتراضية سارة؟",
                    a_fr: "Sarra est notre assistante IA chaleureuse. Vous pouvez lui adresser des questions cosmétiques ou lui désigner vos produits à commander via le chat en bas à droite. Elle s'exprime gracieusement en français comme en Arabe Tunisien (Darija). Elle collectera vos articles choisis et vos coordonnées d’expédition pour les enregistrer immédiatement et de façon sécurisée.",
                    a_ar: "سارة هي مستشارتنا الذكية والودودة. يمكنك طرح أي أسئلة تخص العناية بالبشرة أو اختيار المنتجات التي تود طلبها عبر المحادثة المباشرة أسفل الشاشة. تتحدث سارة باللغتين العربية والدارجة التونسية بطلاقة، وسوف تقوم بتسجيل قائمة مشترياتك وعنوان التوصيل فوراً وبكل أمان لتصلك شحنتك في أسرع وقت."
                  }
                ].map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  const qText = lang === 'ar' ? item.q_ar : item.q_fr;
                  const aText = lang === 'ar' ? item.a_ar : item.a_fr;
                  return (
                    <div 
                      key={idx} 
                      className={`border ${themeBorderMain} ${themeBgWhite} hover:border-[#C18D5D]/25 transition-all duration-300 rounded-sm overflow-hidden`}
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className={`w-full px-6 py-5 flex items-center justify-between font-sans text-sm font-bold ${themeTextMain} tracking-wide hover:bg-[#F9F7F2]/30 transition-colors cursor-pointer ${lang === 'ar' ? 'flex-row-reverse text-right' : 'text-left'}`}
                      >
                        <span className={lang === 'ar' ? 'pl-4 font-cairo' : 'pr-4'}>{qText}</span>
                        <span className="flex-shrink-0 text-[#C18D5D]">
                          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </span>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className={`px-6 pb-6 pt-2 text-xs leading-relaxed ${themeTextMuted} border-t ${themeBorderLight} ${lang === 'ar' ? 'text-right font-cairo leading-loose text-justify' : 'text-left'}`}>
                              {aText}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* Call to action Chatbot guide banner */}
          <section className="bg-[#2C3E2E] text-[#F9F7F2] py-20 relative overflow-hidden border-t border-[#C18D5D]/20">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#C18D5D]/5 -mr-20 -mt-20 blur-3xl" />
            
            <div className="mx-auto max-w-4xl px-6 text-center space-y-6 relative z-10">
              <span className="text-[#C18D5D] text-xs uppercase tracking-[0.4em] font-bold block">
                {lang === 'ar' ? 'اطلب في لمحة بصر' : 'Commandez en un instant'}
              </span>
              
              <h2 className="font-serif text-4xl sm:text-5xl font-semibold leading-tight">
                {lang === 'ar' ? (
                  <>تحدث مع <span className="italic font-light text-[#C18D5D]">سارة (مساعدتنا الذكية)</span></>
                ) : (
                  <>Discutez avec <span className="italic font-light text-[#C18D5D]">Sarra (Notre IA)</span></>
                )}
              </h2>
              
              <p className="text-sm text-[#E8E4DB] max-w-xl mx-auto leading-relaxed font-sans">
                {lang === 'ar' 
                  ? 'اطرح أسئلتك بالفرنسية أو بالدارجة التونسية. فقط زودها بمعلومات التوصيل لتصلك مستحضراتك وصابونك المفضل إلى منزلك! الدفع نقداً عند الاستلام.'
                  : 'Posez vos questions en français ou en Arabe Tunisien (Darija). Indiquez simplement vos coordonnées pour faire livrer vos savons préférés chez vous ! Paiement en cash après réception.'}
              </p>
              
              <div className="pt-4">
                <button
                  onClick={() => {
                    const event = new CustomEvent('chat-order', { detail: {} });
                    window.dispatchEvent(event);
                  }}
                  className="rounded-sm bg-[#C18D5D] text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-[#b07d4e] transition-colors shadow-lg"
                >
                  {lang === 'ar' ? 'افتح المحادثة مع سارة 💬' : 'Ouvrir le chat avec Sarra 💬'}
                </button>
              </div>
            </div>
          </section>

          {/* Footer Line matching Editorial style */}
          <footer className={`h-16 border-t ${themeBorderLight} flex flex-col md:flex-row items-center justify-between px-12 ${themeBgWhite} text-[10px] uppercase tracking-widest ${themeTextMuted} py-4 md:py-0 transition-colors duration-300`}>
            <span>{lang === 'ar' ? 'توصيل لكامل تراب الجمهورية التونسية (7 د.ت أو مجاني)' : 'Livraison partout en Tunisie (7-8 TND ou offerte)'}</span>
            <span>{lang === 'ar' ? 'الدفع نقداً عند الاستلام' : 'Paiement en espèces à la livraison'}</span>
            <span>© {new Date().getFullYear()} Pure Glow MH</span>
          </footer>
        </>
      ) : activeTab === 'suivi' ? (
        /* Dynamic High-Fidelity Client Order Tracking View */
        <main className="mx-auto max-w-4xl px-6 py-12 sm:px-8">
          
          {/* Top Banner and title */}
          <div className="text-center mb-10 space-y-3">
            <span className="text-[#C18D5D] text-[10px] uppercase tracking-[0.4em] font-bold block">
              {lang === 'ar' ? 'تتبع الطلبيات في الوقت الحقيقي' : 'Suivi de livraison en direct'}
            </span>
            <h2 className={`font-serif text-3xl sm:text-4xl font-bold text-[#2C3E2E] ${lang === 'ar' ? 'font-amiri' : ''}`}>
              {lang === 'ar' ? 'أين هي طلبيتك؟' : 'Où en est votre commande ?'}
            </h2>
            <p className={`text-xs text-[#5A5A40] max-w-lg mx-auto leading-relaxed ${lang === 'ar' ? 'font-cairo' : ''}`}>
              {lang === 'ar' 
                ? 'أدخل رقم المرجع الخاص بطلبك (الذي تلقيته من سارة أو تجده في سجلاتك) لمعرفة حالة توصيل منتجاتك الطبيعية مباشرة.'
                : 'Saisissez votre numéro de référence unique à 5 ou 6 chiffres pour suivre l\'acheminement de vos soins botaniques en temps réel.'}
            </p>
          </div>

          {/* Search Box Card */}
          <div className={`${themeBgWhite} border ${themeBorderMain} rounded-sm p-6 sm:p-8 shadow-xs mb-8 transition-colors duration-300`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-[#C18D5D] ${lang === 'ar' ? 'right-4' : 'left-4'}`} />
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'رقم المرجع (مثال: 539281)...' : 'Référence de commande (ex: 539281)...'}
                  value={trackRef}
                  onChange={(e) => setTrackRef(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTrackOrder();
                  }}
                  className={`w-full rounded-sm border ${
                    isNightMode ? 'border-[#FAF9F5]/10 bg-[#1D2A1E] text-[#FAF9F5] placeholder-[#FAF9F5]/40' : 'border-[#2C3E2E]/15 bg-[#FAF9F5] text-[#2C3E2E] placeholder-[#5A5A40]/60'
                  } py-3.5 text-sm focus:border-[#C18D5D] focus:outline-hidden focus:ring-1 focus:ring-[#C18D5D] ${
                    lang === 'ar' ? 'pr-11 pl-4 text-right font-cairo' : 'pl-11 pr-4 text-left'
                  }`}
                />
              </div>
              <button
                onClick={() => handleTrackOrder()}
                disabled={trackLoading}
                className={`rounded-sm transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
                  isNightMode 
                    ? 'bg-[#C18D5D] hover:bg-[#b07d4e] text-white' 
                    : 'bg-[#2C3E2E] hover:bg-[#C18D5D] text-[#F9F7F2]'
                } px-8 py-3.5 text-xs uppercase tracking-widest font-bold ${
                  lang === 'ar' ? 'font-cairo' : ''
                }`}
              >
                {trackLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{lang === 'ar' ? 'جاري البحث...' : 'Recherche...'}</span>
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    <span>{lang === 'ar' ? 'تتبع الطلب' : 'Suivre la livraison'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {trackError && (
              <p className={`text-red-700 text-xs mt-3 ${lang === 'ar' ? 'text-right font-cairo font-semibold' : 'text-left font-medium'}`}>
                {trackError}
              </p>
            )}
          </div>

          {/* Tracked Order Details Panel */}
          <AnimatePresence mode="wait">
            {trackedOrder ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className={`space-y-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
              >
                {/* Status Header Block */}
                <div className="bg-[#2C3E2E] text-[#F9F7F2] p-6 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#C18D5D]/5 -mr-10 -mt-10 blur-2xl" />
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-center gap-2 text-xs text-[#C18D5D] uppercase tracking-widest font-bold">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {lang === 'ar' ? 'مرجع الطلب :' : 'Référence de Commande :'} #{trackedOrder.id}
                      </span>
                    </div>
                    <h3 className={`font-serif text-xl sm:text-2xl font-bold ${lang === 'ar' ? 'font-amiri' : ''}`}>
                      {lang === 'ar' ? 'تحديث مباشر للشحنة' : 'Statut de livraison en direct'}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div className="rounded-sm bg-[#FAF9F5] border-l-4 border-[#C18D5D] px-4 py-2.5 text-xs text-[#2C3E2E] font-bold uppercase tracking-wider relative z-10 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className={lang === 'ar' ? 'font-cairo' : ''}>
                      {lang === 'ar' ? 'الحالة الحالية: ' : 'Statut : '} 
                      {trackedOrder.statut === 'En attente' ? (lang === 'ar' ? 'قيد الانتظار' : 'En attente') :
                       trackedOrder.statut === 'En cours' || trackedOrder.statut === 'Préparation' ? (lang === 'ar' ? 'قيد التحضير' : 'En préparation') :
                       trackedOrder.statut === 'Expédiée' || trackedOrder.statut === 'En cours de livraison' ? (lang === 'ar' ? 'جاري التوصيل' : 'En cours de livraison') :
                       trackedOrder.statut === 'Livrée' || trackedOrder.statut === 'Livré' ? (lang === 'ar' ? 'تم التسليم' : 'Livrée') : 
                       (trackedOrder.statut || (lang === 'ar' ? 'تم التأكيد' : 'Confirmée'))}
                    </span>
                  </div>
                </div>

                {/* Timeline Stepper Section */}
                <div className={`${themeBgWhite} border ${themeBorderMain} rounded-sm p-6 sm:p-8 transition-colors duration-300`}>
                  <h4 className={`text-xs uppercase tracking-[0.2em] font-bold ${themeTextMuted} mb-8 ${lang === 'ar' ? 'font-cairo' : ''}`}>
                    {lang === 'ar' ? 'مراحل التوصيل' : 'Étapes de livraison'}
                  </h4>

                  {/* Desktop/Mobile Stepper */}
                  <div className="relative">
                    {/* Stepper horizontal line background */}
                    <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200 hidden md:block" />
                    
                    {/* Active line filler */}
                    <div 
                      className="absolute top-5 left-10 h-0.5 bg-[#C18D5D] transition-all duration-700 hidden md:block" 
                      style={{ 
                        width: 
                          trackedOrder.statut === 'En attente' ? '0%' :
                          trackedOrder.statut === 'En cours' || trackedOrder.statut === 'Préparation' ? '33.33%' :
                          trackedOrder.statut === 'Expédiée' || trackedOrder.statut === 'En cours de livraison' ? '66.66%' :
                          trackedOrder.statut === 'Livrée' || trackedOrder.statut === 'Livré' ? '100%' : '0%'
                      }} 
                    />

                    {/* Timeline items container */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
                      
                      {/* Step 1: Reçue */}
                      <div className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 font-bold font-mono transition-colors duration-500 ${
                          trackedOrder.statut !== '' 
                            ? 'bg-[#2C3E2E] border-[#2C3E2E] text-white font-bold' 
                            : `${isNightMode ? 'bg-[#1D2A1E] border-emerald-950 text-gray-500' : 'bg-white border-gray-200 text-gray-400'}`
                        }`}>
                          ✓
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold ${themeTextMain} ${lang === 'ar' ? 'font-cairo' : ''}`}>
                            {lang === 'ar' ? '1. تم استلام الطلب' : '1. Commande Reçue'}
                          </p>
                          <p className={`text-[10px] ${themeTextMuted} max-w-[160px] leading-relaxed mx-auto ${lang === 'ar' ? 'font-cairo' : ''}`}>
                            {lang === 'ar' ? 'تم تسجيل طلبك وتأكيده في نظامنا.' : 'Nous avons bien enregistré votre commande.'}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Préparation */}
                      <div className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 font-bold font-mono transition-colors duration-500 ${
                          trackedOrder.statut !== 'En attente'
                            ? 'bg-[#2C3E2E] border-[#2C3E2E] text-white font-bold' 
                            : `${isNightMode ? 'bg-[#1D2A1E] border-emerald-950 text-gray-500' : 'bg-white border-gray-200 text-gray-400'}`
                        }`}>
                          {trackedOrder.statut !== 'En attente' ? '✓' : '2'}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold ${themeTextMain} ${lang === 'ar' ? 'font-cairo' : ''}`}>
                            {lang === 'ar' ? '2. قيد التحضير' : '2. Préparation'}
                          </p>
                          <p className={`text-[10px] ${themeTextMuted} max-w-[160px] leading-relaxed mx-auto ${lang === 'ar' ? 'font-cairo' : ''}`}>
                            {lang === 'ar' ? 'توضيب وتجهيز المنتجات الطبيعية في ورشتنا.' : 'Vos produits naturels sont soigneusement emballés.'}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Livraison */}
                      <div className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 font-bold font-mono transition-colors duration-500 ${
                          trackedOrder.statut === 'Expédiée' || trackedOrder.statut === 'En cours de livraison' || trackedOrder.statut === 'Livrée' || trackedOrder.statut === 'Livré'
                            ? 'bg-[#2C3E2E] border-[#2C3E2E] text-white font-bold' 
                            : `${isNightMode ? 'bg-[#1D2A1E] border-emerald-950 text-gray-500' : 'bg-white border-gray-200 text-gray-400'}`
                        }`}>
                          {trackedOrder.statut === 'Expédiée' || trackedOrder.statut === 'En cours de livraison' || trackedOrder.statut === 'Livrée' || trackedOrder.statut === 'Livré' ? '✓' : '3'}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold ${themeTextMain} ${lang === 'ar' ? 'font-cairo' : ''}`}>
                            {lang === 'ar' ? '3. قيد التوصيل' : '3. En cours de livraison'}
                          </p>
                          <p className={`text-[10px] ${themeTextMuted} max-w-[160px] leading-relaxed mx-auto ${lang === 'ar' ? 'font-cairo' : ''}`}>
                            {lang === 'ar' ? 'الطلب مع الموزع للتسليم في مدينتكم.' : 'Le colis est en route avec notre livreur.'}
                          </p>
                        </div>
                      </div>

                      {/* Step 4: Livrée */}
                      <div className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2 font-bold font-mono transition-colors duration-500 ${
                          trackedOrder.statut === 'Livrée' || trackedOrder.statut === 'Livré'
                            ? 'bg-[#C18D5D] border-[#C18D5D] text-white font-bold' 
                            : `${isNightMode ? 'bg-[#1D2A1E] border-emerald-950 text-gray-500' : 'bg-white border-gray-200 text-gray-400'}`
                        }`}>
                          {trackedOrder.statut === 'Livrée' || trackedOrder.statut === 'Livré' ? '★' : '4'}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-xs font-bold ${themeTextMain} ${lang === 'ar' ? 'font-cairo' : ''}`}>
                            {lang === 'ar' ? '4. تم التسليم' : '4. Livrée'}
                          </p>
                          <p className={`text-[10px] ${themeTextMuted} max-w-[160px] leading-relaxed mx-auto ${lang === 'ar' ? 'font-cairo' : ''}`}>
                            {lang === 'ar' ? 'تم تسليم الطرد ودفع قيمة الطلب نقداً.' : 'Colis remis en main propre. Merci de votre confiance !'}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Estimated Delivery Time */}
                  <div className={`mt-8 pt-5 border-t ${themeBorderLight} flex flex-col sm:flex-row items-center justify-between gap-3`}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#C18D5D]" />
                      <span className={`text-xs font-bold ${themeTextMain} ${lang === 'ar' ? 'font-cairo' : ''}`}>
                        {lang === 'ar' ? 'موعد التسليم المتوقع :' : 'Date de livraison estimée :'}
                      </span>
                    </div>
                    <div className={`text-xs px-3.5 py-1.5 rounded-sm font-semibold tracking-wide ${isNightMode ? 'bg-[#1D2A1E] text-[#C18D5D]' : 'bg-[#FAF9F5] text-[#2C3E2E] border border-[#2C3E2E]/10 font-medium'}`}>
                      {(() => {
                        const estimate = getEstimatedDelivery(trackedOrder.created_at, trackedOrder.statut);
                        return lang === 'ar' ? estimate.ar : estimate.fr;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Grid layout for Customer details and ordered products */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left Column: Products Details */}
                  <div className={`md:col-span-7 ${themeBgWhite} border ${themeBorderMain} rounded-sm p-6 flex flex-col justify-between transition-colors duration-300`}>
                    <div className="space-y-4">
                      <h4 className={`text-xs uppercase tracking-[0.2em] font-bold ${themeTextMain} pb-3 border-b ${themeBorderMain} flex items-center gap-2 ${lang === 'ar' ? 'font-cairo' : ''}`}>
                        <ShoppingBag className="h-4 w-4 text-[#C18D5D]" />
                        <span>{lang === 'ar' ? 'تفاصيل السلة والمنتجات' : 'Détails des produits'}</span>
                      </h4>
                      
                      <div className="space-y-3 font-sans">
                        {trackedOrder.details_produits.split(/,|\n/).map((item, idx) => {
                          const cleanItem = item.trim();
                          if (!cleanItem) return null;
                          return (
                            <div key={idx} className={`flex justify-between items-center text-xs ${themeTextMuted} py-1 border-b border-dashed ${themeBorderLight} last:border-0`}>
                              <span className={`font-medium ${themeTextMain}`}>{cleanItem}</span>
                              <span className="text-[10px] text-[#C18D5D] font-bold uppercase">Bio</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className={`mt-8 pt-4 border-t ${themeBorderMain} flex justify-between items-baseline`}>
                      <span className={`text-xs ${themeTextMuted} font-bold uppercase tracking-wider ${lang === 'ar' ? 'font-cairo' : ''}`}>
                        {lang === 'ar' ? 'طريقة الدفع :' : 'Mode de Paiement :'}
                      </span>
                      <span className={`text-xs ${themeTextMain} font-bold ${lang === 'ar' ? 'font-cairo' : ''}`}>
                        {lang === 'ar' ? 'نقداً عند الاستلام' : 'Espèces à la livraison'}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Customer info */}
                  <div className={`md:col-span-5 ${themeBgWhite} border ${themeBorderMain} rounded-sm p-6 space-y-4 transition-colors duration-300`}>
                    <h4 className={`text-xs uppercase tracking-[0.2em] font-bold ${themeTextMain} pb-3 border-b ${themeBorderMain} flex items-center gap-2 ${lang === 'ar' ? 'font-cairo' : ''}`}>
                      <User className="h-4 w-4 text-[#C18D5D]" />
                      <span>{lang === 'ar' ? 'بيانات التوصيل' : 'Informations de livraison'}</span>
                    </h4>

                    <div className="space-y-3 font-sans text-xs">
                      <div className="space-y-1">
                        <span className={`text-[10px] uppercase ${isNightMode ? 'text-[#FAF9F5]/40' : 'text-[#5A5A40]/70'} font-bold tracking-wider block`}>
                          {lang === 'ar' ? 'الاسم واللقب :' : 'Nom du destinataire :'}
                        </span>
                        <p className={`font-bold ${themeTextMain}`}>{trackedOrder.nom_client}</p>
                      </div>

                      <div className="space-y-1">
                        <span className={`text-[10px] uppercase ${isNightMode ? 'text-[#FAF9F5]/40' : 'text-[#5A5A40]/70'} font-bold tracking-wider block`}>
                          {lang === 'ar' ? 'رقم الهاتف :' : 'Téléphone :'}
                        </span>
                        <p className={`font-mono font-bold ${themeTextMain}`}>{trackedOrder.telephone}</p>
                      </div>

                      <div className="space-y-1">
                        <span className={`text-[10px] uppercase ${isNightMode ? 'text-[#FAF9F5]/40' : 'text-[#5A5A40]/70'} font-bold tracking-wider block`}>
                          {lang === 'ar' ? 'عنوان التوصيل :' : 'Adresse de livraison :'}
                        </span>
                        <p className={`leading-relaxed font-medium ${themeTextMuted}`}>{trackedOrder.adresse}</p>
                      </div>

                      {trackedOrder.created_at && (
                        <div className={`space-y-1 pt-1.5 border-t border-dotted ${themeBorderMain}`}>
                          <span className={`text-[10px] uppercase ${isNightMode ? 'text-[#FAF9F5]/40' : 'text-[#5A5A40]/70'} font-bold tracking-wider block`}>
                            {lang === 'ar' ? 'تاريخ الطلب :' : 'Date de commande :'}
                          </span>
                          <p className="text-gray-500 flex items-center gap-1 text-[11px]">
                            <Calendar className="h-3 w-3 text-[#C18D5D]" />
                            <span>{new Date(trackedOrder.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Help Contact Box with Sarra */}
                <div className={`${isNightMode ? 'bg-[#1D2A1E]' : 'bg-[#FAF9F5]'} border ${themeBorderMain} p-6 text-center space-y-4 rounded-sm`}>
                  <p className={`text-xs ${themeTextMuted} leading-relaxed max-w-xl mx-auto ${lang === 'ar' ? 'font-cairo' : ''}`}>
                    {lang === 'ar' 
                      ? 'هل تريد تعديل العنوان أو الاستفسار عن التوصيل؟ يمكنك التحدث مباشرة مع مستشارتنا الذكية سارة لمساعدتك فورا.'
                      : 'Besoin de modifier l\'adresse de livraison ou de poser une question concernant votre colis ? Notre conseillère virtuelle Sarra est à votre entière disposition.'}
                  </p>
                  <button
                    onClick={() => {
                      // Trigger Sarra chatbot order query
                      const promptText = lang === 'ar' 
                        ? `أريد الاستفسار عن طلبي رقم #${trackedOrder.id}`
                        : `Bonjour Sarra, je souhaite poser une question sur ma commande #${trackedOrder.id}`;
                      const event = new CustomEvent('chat-order', { detail: { customPrompt: promptText } });
                      window.dispatchEvent(event);
                    }}
                    className={`rounded-sm bg-[#C18D5D] hover:bg-[#b07d4e] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2 ${
                      lang === 'ar' ? 'font-cairo' : ''
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{lang === 'ar' ? 'اسأل سارة عن هذا الطلب' : 'Parler de cette commande à Sarra'}</span>
                  </button>
                </div>

              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`${isNightMode ? 'bg-[#1D2A1E]' : 'bg-[#FAF9F5]'} border ${themeBorderMain} rounded-sm p-12 text-center text-gray-400 font-sans flex flex-col items-center justify-center space-y-3`}
              >
                <Truck className="h-12 w-12 text-[#C18D5D]/40 stroke-1 animate-bounce" />
                <p className={`text-sm ${themeTextMuted} ${lang === 'ar' ? 'font-cairo font-semibold' : 'font-medium'}`}>
                  {lang === 'ar' ? 'الرجاء إدخال رقم الطلب للبحث وتتبع الشحنة.' : 'Aucun suivi actif. Saisissez une référence de commande ci-dessus.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Elegant Footer match */}
          <footer className={`h-16 mt-12 border-t ${themeBorderLight} flex flex-col md:flex-row items-center justify-between px-12 ${themeBgWhite} text-[10px] uppercase tracking-widest ${themeTextMuted} py-4 md:py-0 transition-colors duration-300`}>
            <span>{lang === 'ar' ? 'توصيل كامل التراب التونسي' : 'Livraison partout en Tunisie'}</span>
            <span>{lang === 'ar' ? 'الدفع عند الاستلام' : 'Paiement en espèces à la livraison'}</span>
            <span>© {new Date().getFullYear()} Pure Glow MH</span>
          </footer>
        </main>
      ) : (
        /* Merchant Orders Log Tracker Page (Dashboard) */
        <main className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          
          {/* Header Dashboard section */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#C18D5D]">Système d'administration</span>
              <h2 className={`font-serif text-3xl font-bold ${themeTextMain} mt-1 flex items-center`}>
                <ClipboardList className="h-8 w-8 mr-2 text-[#C18D5D]" />
                Journal des Ventes &amp; Commandes
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className={`inline-flex items-center justify-center rounded-sm ${themeBgWhite} border ${themeBorderMain} px-5 py-2.5 text-xs uppercase tracking-wider font-bold ${themeTextMain} hover:opacity-85 transition-colors cursor-pointer`}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                {lang === 'ar' ? 'تحديث' : 'Rafraîchir'}
              </button>
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center justify-center rounded-sm bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 mr-2" />
                {lang === 'ar' ? 'خروج' : 'Déconnexion'}
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
            
            <div className={`border ${themeBorderMain} ${themeBgWhite} p-6 transition-colors duration-300`}>
              <span className={`text-[10px] font-bold ${themeTextMuted} uppercase tracking-widest block`}>Commandes IA Reçues</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className={`text-3xl font-serif font-bold ${themeTextMain}`}>{orders.length}</span>
                <span className="text-[10px] text-[#C18D5D] bg-[#C18D5D]/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Live</span>
              </div>
            </div>

            <div className={`border ${themeBorderMain} ${themeBgWhite} p-6 transition-colors duration-300`}>
              <span className={`text-[10px] font-bold ${themeTextMuted} uppercase tracking-widest block`}>Chiffre d'Affaires Estimé</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className={`text-3xl font-serif font-bold ${themeTextMain}`}>{(orders.length * 25.000).toFixed(3)} TND</span>
              </div>
            </div>

            <div className={`border ${themeBorderMain} ${themeBgWhite} p-6 transition-colors duration-300`}>
              <span className={`text-[10px] font-bold ${themeTextMuted} uppercase tracking-widest block`}>Lieux de Livraison</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className={`text-3xl font-serif font-bold ${themeTextMain}`}>Tunisie</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">National</span>
              </div>
            </div>

          </div>

          {/* Orders Log List */}
          <div className={`border ${themeBorderMain} ${themeBgWhite} overflow-hidden rounded-sm transition-colors duration-300`}>
            <div className={`${isNightMode ? 'bg-[#1D2A1E]' : 'bg-[#FAF9F5]'} border-b ${themeBorderMain} p-4 flex items-center justify-between`}>
              <span className={`text-xs uppercase tracking-widest font-bold ${themeTextMain}`}>Historique des transactions collectées par Sarra (IA)</span>
              <span className="text-[10px] uppercase tracking-wider text-[#C18D5D] font-bold">Synchronisé Supabase</span>
            </div>

            {loadingOrders ? (
              <div className="p-12 text-center space-y-2">
                <RefreshCw className="h-8 w-8 animate-spin text-[#C18D5D] mx-auto" />
                <p className={`text-xs ${themeTextMuted}`}>Mise à jour en cours...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-16 text-center space-y-4">
                <div className={`h-12 w-12 rounded-full ${isNightMode ? 'bg-[#1D2A1E]' : 'bg-[#FAF9F5]'} flex items-center justify-center mx-auto text-[#C18D5D]`}>
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div className="max-w-xs mx-auto space-y-1">
                  <h4 className={`font-bold text-sm ${themeTextMain}`}>Aucun colis en attente</h4>
                  <p className={`text-xs ${themeTextMuted}`}>
                    Commandez un produit avec Sarra pour voir la commande s'enregistrer immédiatement ici !
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className={`${isNightMode ? 'bg-[#1D2A1E]/80' : 'bg-[#FAF9F5]/80'} border-b ${themeBorderMain} text-[10px] ${themeTextMuted} uppercase font-bold tracking-wider`}>
                      <th className="p-4">Référence / Date</th>
                      <th className="p-4">Destinataire</th>
                      <th className="p-4">Contact / Adresse</th>
                      <th className="p-4">Panier d'achat</th>
                      <th className="p-4">Paiement</th>
                      <th className="p-4">{lang === 'ar' ? 'الوضعية والإجراءات' : 'Statut & Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isNightMode ? 'divide-emerald-950/30' : 'divide-slate-100'}`}>
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF9F5]/10 transition-colors">
                        <td className="p-4 space-y-1">
                          <span className={`text-xs font-bold ${themeTextMain} block`}>REF-CMD-{order.id}</span>
                          <span className={`text-[10px] ${themeTextMuted} block`}>
                            {order.created_at ? new Date(order.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Maintenant'}
                          </span>
                        </td>
                        <td className={`p-4 font-serif italic text-sm ${themeTextMain}`}>
                          {order.nom_client}
                        </td>
                        <td className="p-4 space-y-1">
                          <span className="text-xs font-semibold text-[#C18D5D] flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {order.telephone}
                          </span>
                          <span className={`text-xs ${themeTextMuted} flex items-start leading-tight max-w-xs`}>
                            <MapPin className="h-3.5 w-3.5 mr-1 text-[#C18D5D] flex-shrink-0 mt-0.5" />
                            {order.adresse}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-medium">
                          <span className={`inline-block ${isNightMode ? 'bg-[#1D2A1E] text-[#FAF9F5]' : 'bg-[#F9F7F2] text-[#2C3E2E]'} border ${themeBorderMain} px-2.5 py-1`}>
                            {order.details_produits}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full ${isNightMode ? 'bg-amber-950/30 text-amber-300 border-amber-900/50' : 'bg-amber-50 text-amber-800 border-amber-200'} px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold border`}>
                            Cash à la livraison
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 min-w-[220px]">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold border ${
                              order.statut === 'En attente' 
                                ? (isNightMode ? 'bg-slate-900/40 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200')
                                : order.statut === 'En cours' || order.statut === 'Préparation'
                                ? (isNightMode ? 'bg-blue-950/40 text-blue-300 border-blue-900/50' : 'bg-blue-50 text-blue-700 border-blue-200')
                                : order.statut === 'Expédiée' || order.statut === 'En cours de livraison'
                                ? (isNightMode ? 'bg-amber-950/40 text-amber-300 border-amber-900/50' : 'bg-amber-50 text-amber-800 border-amber-200')
                                : order.statut === 'Livrée' || order.statut === 'Livré'
                                ? (isNightMode ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50' : 'bg-emerald-50 text-emerald-800 border-emerald-200')
                                : (isNightMode ? 'bg-slate-900/40 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200')
                            }`}>
                              {order.statut === 'En attente' ? (lang === 'ar' ? 'قيد الانتظار' : 'En attente') :
                               order.statut === 'En cours' || order.statut === 'Préparation' ? (lang === 'ar' ? 'قيد التحضير' : 'En préparation') :
                               order.statut === 'Expédiée' || order.statut === 'En cours de livraison' ? (lang === 'ar' ? 'جاري التوصيل' : 'En cours de livraison') :
                               order.statut === 'Livrée' || order.statut === 'Livré' ? (lang === 'ar' ? 'تم التسليم' : 'Livrée') : 
                               (order.statut || (lang === 'ar' ? 'تم التأكيد' : 'Confirmée'))}
                            </span>
                            
                            <select
                              value={order.statut || 'En attente'}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`text-[11px] font-semibold border ${themeBorderMain} rounded-xs px-2 py-1 bg-transparent cursor-pointer transition-colors focus:ring-1 focus:ring-[#C18D5D] focus:outline-hidden ${isNightMode ? 'text-white bg-[#1C2A1C]' : 'text-[#2C3E2E] bg-white'}`}
                            >
                              <option value="En attente" className={isNightMode ? 'bg-[#1D2A1E] text-white' : 'bg-white text-black'}>
                                {lang === 'ar' ? 'قيد الانتظار' : 'En attente'}
                              </option>
                              <option value="Préparation" className={isNightMode ? 'bg-[#1D2A1E] text-white' : 'bg-white text-black'}>
                                {lang === 'ar' ? 'قيد التحضير' : 'En préparation'}
                              </option>
                              <option value="En cours de livraison" className={isNightMode ? 'bg-[#1D2A1E] text-white' : 'bg-white text-black'}>
                                {lang === 'ar' ? 'جاري التوصيل' : 'En cours de livraison'}
                              </option>
                              <option value="Livrée" className={isNightMode ? 'bg-[#1D2A1E] text-white' : 'bg-white text-black'}>
                                {lang === 'ar' ? 'تم التسليم' : 'Livrée'}
                              </option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Product Details Modal (Fenêtre Modale Éditoriale) */}
      <AnimatePresence>
        {selectedProduct && (() => {
          const isAr = lang === 'ar';
          const arData = isAr ? productArMap[selectedProduct.nom] : null;
          const translatedNom = arData ? arData.nom : selectedProduct.nom;
          const translatedDesc = arData ? arData.description : selectedProduct.description;
          const details = arData ? arData : getProductDetails(selectedProduct.nom);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
              {/* Blur backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="fixed inset-0 bg-[#2C3E2E]/40 backdrop-blur-xs cursor-pointer"
              />

              {/* Modal Body Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`relative ${themeBgMain} w-full max-w-3xl overflow-hidden shadow-2xl border ${themeBorderMain} flex flex-col md:flex-row max-h-[90vh] transition-colors duration-300 ${isAr ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} z-20 ${themeBgWhite} hover:bg-[#C18D5D] hover:text-white ${themeTextMain} border ${themeBorderMain} hover:border-[#C18D5D] p-1.5 transition-colors cursor-pointer rounded-sm`}
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Left Side: Product Image & certification details */}
                <div className={`w-full md:w-[42%] ${isNightMode ? 'bg-[#1D2A1E]' : 'bg-[#FAF9F5]'} flex flex-col justify-between border-b md:border-b-0 ${isAr ? 'md:border-l' : 'md:border-r'} ${themeBorderMain} p-6 md:p-8 shrink-0`}>
                  <div className="space-y-4">
                    <div className="aspect-square bg-[#E8E4DB] overflow-hidden border border-[#2C3E2E]/5 relative">
                      <LazyImage
                        src={selectedProduct.image_url}
                        alt={translatedNom}
                        className="h-full w-full object-cover"
                      />
                      <div className={`absolute bottom-3 ${isAr ? 'right-3' : 'left-3'} z-10`}>
                        <Tooltip content={
                          isAr
                            ? 'ضمان جودة هذا المنتج الطبيعي وصنعه اليدوي الفاخر.'
                            : 'Garantie d\'un produit certifié sain, naturel et fait main avec le plus grand soin.'
                        }>
                          <div className={`bg-[#2C3E2E] text-[#F9F7F2] text-[8px] uppercase tracking-[0.25em] font-semibold px-2 py-0.5 cursor-help ${isNightMode ? 'border border-[#FAF9F5]/20' : ''}`}>
                            {details.certification}
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 md:mt-0 pt-4 border-t ${themeBorderLight} space-y-3 ${isAr ? 'text-right' : 'text-left'}`}>
                    <Tooltip content={
                      isAr
                        ? 'مكونات قابلة للتحلل الحيوي بالكامل، وتغليف صديق للبيئة يدعم الاستدامة والحد من الانبعاثات الكربونية.'
                        : 'Formules 100% biodégradables, emballages durables et approvisionnement éthique à empreinte carbone minimale.'
                    }>
                      <div className={`flex items-center space-x-2 text-[#C18D5D] cursor-help ${isAr ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <ShieldCheck className="h-4 w-4 shrink-0 hover:scale-110 transition-transform" />
                        <span className={`text-[10px] font-sans font-bold uppercase tracking-widest ${themeTextMain}`}>{isAr ? 'عناية صديقة للبيئة' : 'Soin Éco-responsable'}</span>
                      </div>
                    </Tooltip>
                    <p className={`text-[10px] ${themeTextMuted} leading-relaxed`}>
                      {isAr 
                        ? 'يتم قطف كل مكون بعناية بطرق أخلاقية ومستدامة في تونس لضمان النقاء التام والفاعلية القصوى.'
                        : 'Chaque ingrédient est soigneusement cueilli de manière éthique en Tunisie pour garantir une pureté totale. Sans additifs nocifs.'}
                    </p>
                  </div>
                </div>

                {/* Right Side: Editorial Content */}
                <div className={`w-full md:w-[58%] p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6 max-h-[50vh] md:max-h-none ${isAr ? 'text-right' : 'text-left'}`}>
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="space-y-1">
                      <span className="text-[#C18D5D] text-[9px] uppercase tracking-[0.3em] font-bold block">
                        {isAr ? 'معشبة تجميل استثنائية' : "Herboristerie d'Exception"}
                      </span>
                      <h2 className={`font-serif text-xl sm:text-2xl font-semibold ${themeTextMain} leading-tight`}>
                        {translatedNom}
                      </h2>
                      <div className={`flex items-baseline space-x-3 pt-1 ${isAr ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <span className="text-lg font-serif italic text-[#C18D5D] font-bold">
                          {selectedProduct.prix.toFixed(3)} {isAr ? 'د.ت' : 'TND'}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5">
                          {isAr ? 'متوفر حالياً' : 'En stock'}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-xs ${themeTextMuted} leading-relaxed`}>
                      {translatedDesc}
                    </p>

                    {/* Ingredients List */}
                    <div className="space-y-2 pt-2">
                      <h3 className={`text-[10px] uppercase tracking-widest ${themeTextMain} font-bold flex items-center ${isAr ? 'flex-row-reverse' : ''}`}>
                        <Leaf className={`h-3.5 w-3.5 text-[#C18D5D] ${isAr ? 'ml-1.5' : 'mr-1.5'}`} />
                        {isAr ? 'المكونات الثمينة :' : 'Ingrédients précieux :'}
                      </h3>
                      <ul className={`grid grid-cols-1 gap-1.5 text-xs ${themeTextMuted}`}>
                        {details.ingredients.map((ing, idx) => (
                          <li key={idx} className={`flex items-start ${isAr ? 'flex-row-reverse' : 'space-x-2'}`}>
                            <span className={`text-[#C18D5D] shrink-0 ${isAr ? 'ml-2' : 'mt-1 mr-2'}`}>•</span>
                            <span className="text-[11px] leading-tight font-medium">{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Advice / Conseils */}
                    <div className="space-y-1.5 pt-2">
                      <h3 className={`text-[10px] uppercase tracking-widest ${themeTextMain} font-bold flex items-center ${isAr ? 'flex-row-reverse' : ''}`}>
                        <Sparkles className={`h-3.5 w-3.5 text-[#C18D5D] ${isAr ? 'ml-1.5' : 'mr-1.5'}`} />
                        {isAr ? 'نصائح الاستعمال :' : "Conseils d'utilisation :"}
                      </h3>
                      <p className={`text-[11px] ${themeTextMuted} leading-relaxed italic ${isNightMode ? 'bg-[#1D2A1E]' : 'bg-[#FAF9F5]'} p-3 ${isAr ? 'border-r-2 border-l-0 text-right' : 'border-l-2 border-r-0 text-left'} border-[#C18D5D]`}>
                        {details.conseils}
                      </p>
                    </div>

                    {/* Benefits / Bienfaits */}
                    <div className="space-y-1">
                      <h4 className={`text-[9px] uppercase tracking-wider ${themeTextMain} font-bold`}>
                        {isAr ? 'الفوائد والخصائص :' : 'Propriétés :'}
                      </h4>
                      <p className={`text-[10px] ${themeTextMuted} leading-relaxed`}>
                        {details.bienfaits}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className={`pt-6 border-t ${themeBorderLight} flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${isAr ? 'sm:flex-row-reverse' : ''}`}>
                    <div className={isAr ? 'text-right' : 'text-left'}>
                      <span className={`text-[8px] uppercase tracking-wider ${themeTextMuted} block`}>
                        {isAr ? 'الدفع الآمن' : 'Paiement Sécurisé'}
                      </span>
                      <span className={`text-[10px] ${themeTextMain} font-bold`}>
                        {isAr ? 'عند الاستلام في تونس' : 'À la livraison en Tunisie'}
                      </span>
                    </div>
                    
                    <div className={`flex gap-2.5 ${isAr ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                        }}
                        className={`rounded-sm border ${isNightMode ? 'border-[#FAF9F5]/25 hover:border-white text-[#FAF9F5]' : 'border-[#2C3E2E]/25 hover:border-[#2C3E2E] text-[#2C3E2E]'} hover:opacity-85 transition-colors px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold cursor-pointer text-center flex-1 sm:flex-none`}
                      >
                        {isAr ? 'رجوع' : 'Retour'}
                      </button>
                      <button
                        onClick={() => {
                          const pName = selectedProduct.nom;
                          setSelectedProduct(null);
                          handleOrderClick(pName);
                        }}
                        className={`rounded-sm ${isNightMode ? 'bg-[#C18D5D] hover:bg-[#b07d4e] text-white' : 'bg-[#2C3E2E] hover:bg-[#C18D5D] text-[#F9F7F2]'} transition-all duration-300 px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold shadow-md cursor-pointer flex-1 sm:flex-none text-center`}
                      >
                        {isAr ? 'طلب الآن' : 'Commander'}
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Admin Login Authentication Modal */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-brand-dark/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`relative ${themeBgWhite} rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border ${themeBorderMain} p-6 sm:p-8`}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAdminLoginModal(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-full ${isNightMode ? 'text-slate-400 hover:text-[#FAF9F5] hover:bg-white/10' : 'text-brand-dark hover:text-brand-primary hover:bg-brand-cream/40'} transition-all cursor-pointer`}
                aria-label="Fermer"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                {/* Lock Icon and Header */}
                <div className={`p-4 rounded-full ${isNightMode ? 'bg-[#C18D5D]/15 text-[#C18D5D]' : 'bg-[#2C3E2E]/10 text-[#2C3E2E]'} inline-flex`}>
                  <Lock className="h-6 w-6 stroke-[1.5]" />
                </div>

                <div className="space-y-1">
                  <h3 className={`font-serif text-xl font-bold ${themeTextMain}`}>
                    {lang === 'ar' ? 'بوابة المدير الآمنة' : 'Accès Administrateur'}
                  </h3>
                  <p className={`text-xs ${themeTextMuted} max-w-[280px] mx-auto leading-relaxed`}>
                    {lang === 'ar' 
                      ? 'الرجاء إدخال كلمة مرور المسؤول لعرض وإدارة طلبات الزبائن والتحكم في المبيعات.' 
                      : 'Veuillez saisir le mot de passe de gestion pour accéder au tableau de bord des commandes.'}
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleAdminLogin} className="w-full space-y-4 pt-2 text-left">
                  <div className="space-y-1.5">
                    <label className={`text-[10px] uppercase tracking-widest font-bold ${themeTextMuted}`}>
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (loginError) setLoginError(null);
                      }}
                      placeholder="Ex: admin@pureglow.tn"
                      className={`w-full text-sm rounded-sm px-4 py-2.5 outline-none transition-all ${
                        isNightMode 
                          ? 'bg-[#141E15] text-[#FAF9F5] border-[#FAF9F5]/10 focus:border-[#C18D5D]/50' 
                          : 'bg-[#FAF9F5] text-[#2C3E2E] border-[#2C3E2E]/15 focus:border-[#2C3E2E]'
                      } border`}
                      autoFocus
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] uppercase tracking-widest font-bold ${themeTextMuted}`}>
                      {lang === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                    </label>
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (loginError) setLoginError(null);
                      }}
                      placeholder={lang === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                      className={`w-full text-sm rounded-sm px-4 py-2.5 outline-none transition-all ${
                        isNightMode 
                          ? 'bg-[#141E15] text-[#FAF9F5] border-[#FAF9F5]/10 focus:border-[#C18D5D]/50' 
                          : 'bg-[#FAF9F5] text-[#2C3E2E] border-[#2C3E2E]/15 focus:border-[#2C3E2E]'
                      } border`}
                    />
                    {loginError && (
                      <p className="text-red-500 text-[10px] font-semibold mt-1">
                        {loginError}
                      </p>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdminLoginModal(false)}
                      className={`flex-1 rounded-sm border ${
                        isNightMode 
                          ? 'border-[#FAF9F5]/25 hover:border-[#FAF9F5] text-slate-300' 
                          : 'border-[#2C3E2E]/25 hover:border-[#2C3E2E] text-[#2C3E2E]'
                      } transition-colors px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold cursor-pointer text-center`}
                    >
                      {lang === 'ar' ? 'إلغاء' : 'Annuler'}
                    </button>
                    <button
                      type="submit"
                      className={`flex-1 rounded-sm text-[#F9F7F2] ${
                        isNightMode ? 'bg-[#C18D5D] hover:bg-[#b07d4e]' : 'bg-[#2C3E2E] hover:bg-[#C18D5D]'
                      } transition-all duration-300 px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold shadow-md cursor-pointer text-center`}
                    >
                      {lang === 'ar' ? 'تأكيد الدخول' : 'Se connecter'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Chatbot Bubble */}
      <Chatbot isNightMode={isNightMode} />
    </div>
  );
}
