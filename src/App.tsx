import { useState, useEffect, ReactNode, useRef, HTMLAttributeReferrerPolicy } from 'react';
import { 
  Sparkles, Leaf, ShieldCheck, Truck, ShoppingBag, 
  Phone, MapPin, RefreshCw, Gift, Star, 
  HelpCircle, ClipboardList, TrendingUp, Award, X, Eye,
  MessageSquare, Search, Clock, Calendar, User, Sun, Moon,
  Lock, Unlock, Trash2, Plus, Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Chatbot from './components/Chatbot';
import Login from './components/Login';
import InAppBrowserBanner from './components/InAppBrowserBanner';
import { Produit, Commande, getProduits, getCommandes, addCommande, updateCommandeStatut, supabase } from './lib/supabase';

// Direct asset image imports (none required since we use the public folder now)

export const staticProducts: Produit[] = [
  {
    id: 1,
    nom: 'صابون السدر الطبيعي الممتاز',
    description: 'صابون طبيعي ممتاز بخلاصة السدر الجبلي المطهر وزيت الزيتون البكر، ينقي البشرة بعمق، يكافح البثور، ويمنحها نضارة ونعومة فائقة.',
    prix: 15.000,
    image_url: '/صابون السدر  15الطبيعي الممتاز.jpg'
  },
  {
    id: 2,
    nom: 'صابون الشوفان والعسل المغذي',
    description: 'تركيبة طبيعية فاخرة تجمع بين دقيق الشوفان الملطف والعسل الجبلي المغذي مع زيت جوز الهند، مثالي لترطيب البشرة الجافة وتهدئة الحساسية.',
    prix: 15.000,
    image_url: '/صابون الشوفان والعسل المغذي.jpg'
  },
  {
    id: 3,
    nom: 'صابون القهوة والنشاء والكركم للتقشير',
    description: 'مزيج رائع من حبيبات القهوة المنشطة، النشاء المنعم، والكركم المفتح للبشرة. يقشر خلايا الجلد الميتة بلطف ويوحد لون البشرة لمنحها إشراقاً طبيعياً.',
    prix: 15.000,
    image_url: '/صابون القهوة والنشاء والكركم للتقشير.jpg'
  },
  {
    id: 4,
    nom: 'صابون زيت الزيتون وجوز الهند واللوز وفيتامين E',
    description: 'صابون طبيعي غني بزيت الزيتون البكر، زيت جوز الهند النقي، وزيت اللوز الحلو المغذي، معزز بفيتامين E لحماية البشرة وترطيبها بعمق.',
    prix: 15.000,
    image_url: '/صابون زيت الزيتون وجوز الهند واللوز وفيتامين E.jpg'
  },
  {
    id: 5,
    nom: 'صابون زيت الزيتون وجوز الهند واللوز وفيتامين E d',
    description: 'إصدار خاص وغني جداً بمزيج زيت الزيتون المغذي وزيت اللوز المنعم، مع رغوة غنية من زيت جوز الهند وفيتامين E لحماية خلايا البشرة وتجديدها.',
    prix: 15.000,
    image_url: '/صابون زيت الزيتون وجوز الهند واللوز وفيتامين E d.jpg'
  },
  {
    id: 6,
    nom: 'صابون طبيعي على البارد بزيت الزيتون واللوز رقم 1',
    description: 'صابون مصنوع يدوياً على البارد للحفاظ على جودة الزيوت الطبيعية (زيت زيتون، لوز حلو، وجوز هند) مع فيتامين E، لطيف جداً ومناسب للبشرة الحساسة.',
    prix: 15.000,
    image_url: '/صابون طبيعي على البارد بزيت الزيتون و زيت جوز الهند و زيت اللوز وڨيتامين E 1  c.jpg'
  },
  {
    id: 7,
    nom: 'صابون طبيعي على البارد بزيت الزيتون واللوز رقم 3',
    description: 'صابون بلدي فاخر مصنوع على البارد لترطيب فائق وتغذية تدوم طويلاً بمستخلص زيت اللوز وزيت الزيتون البكر، غني بمضادات الأكسدة وفيتامين E.',
    prix: 15.000,
    image_url: '/صابون طبيعي على البارد بزيت الزيتون و زيت جوز الهند و زيت اللوز وڨيتامين E 3.jpg'
  },
  {
    id: 8,
    nom: 'صابون طبيعي على البارد بزيت الزيتون واللوز رقم 5',
    description: 'تركيبة نقية بالكامل مصنوعة على البارد تجمع زيت الزيتون التونسي الفاخر وزيت جوز الهند العضوي مع فيتامين E الطبيعي، لترطيب وتطهير يومي آمن.',
    prix: 15.000,
    image_url: '/صابون طبيعي على البارد بزيت الزيتون و زيت جوز الهند و زيت اللوز وڨيتامين E 5.jpg'
  },
  {
    id: 9,
    nom: 'صابون عرق السوس والحبة السوداء',
    description: 'تركيبة علاجية فريدة تدمج مستخلص عرق السوس المفتح للبقع الداكنة وحبيبات الحبة السوداء المطهرة، تمنح البشرة إشراقاً وبياضاً وتنقّيها من السموم.',
    prix: 15.000,
    image_url: '/صابون عرق السوس والحبة السوداء.jpg'
  },
  {
    id: 10,
    nom: 'عرق السوس 100غ ب15د',
    description: 'مسحوق جذور عرق السوس النقي 100%، سر تفتيح البشرة وتبييض التصبغات والكلف طبيعياً. يمكن استخدامه كقناع للوجه مع الطين أو الحليب.',
    prix: 15.000,
    image_url: '/عرق السوس 100غ ب15د.jpg'
  },
  {
    id: 11,
    nom: 'مسحوق عرق السوس الطبيعي 100غ',
    description: 'مسحوق ناعم وصافٍ من عرق السوس الطبيعي لعمل خلطات لتفتيح وتوحيد لون الجسم والوجه ومكافحة البقع الناتجة عن أشعة الشمس.',
    prix: 15.000,
    image_url: '/مسحوق عرق السوس الطبيعي 100غ.jpg'
  },
  {
    id: 12,
    nom: 'للوبان الذكر ب15',
    description: 'حبيبات لبان الذكر الحر عالي الجودة، غني بالكولاجين الطبيعي لشد البشرة، مكافحة التجاعيد، وإعطاء الوجه مظهراً شاباً ومشدوداً بامتياز.',
    prix: 15.000,
    image_url: '/للوبان الذكر ب15.jpg'
  },
  {
    id: 13,
    nom: 'لبان ذكر طبيعي نقي 150غ',
    description: 'عبوة اقتصادية تحتوي على 150 غرام من صمغ لبان الذكر النقي 100%، يستخدم لشد ترهلات الجلد، تحفيز الكولاجين، وترطيب وتفتيح لون البشرة.',
    prix: 15.000,
    image_url: '/لبان ذكر طبيعي نقي 150غ.jpg'
  }
];

// High-fidelity editorial details for each Tunisian organic product (translated)
const productDetailsMap: Record<string, { ingredients: string[]; conseils: string; bienfaits: string; certification: string }> = {
  "صابون السدر الطبيعي الممتاز": {
    ingredients: [
      "مسحوق أوراق السدر الجبلية العضوية المطهرة",
      "زيت الزيتون البكر الممتاز المعصور على البارد",
      "زيت جوز الهند الطبيعي المرطب للبشرة",
      "زيت اللوز الحلو المغذي وفيتامين E الطبيعي"
    ],
    conseils: "يرغى بالماء ويدلك به الوجه أو الجسم بلطف بحركات دائرية ناعمة، يترك لنصف دقيقة لتغذية المسام ثم يشطف بالماء الفاتر.",
    bienfaits: "ينقي المسام بعمق، ينظف البشرة بلطف دون تجفيفها، يهدئ الالتهابات ويساعد على التخلص من البثور وحب الشباب.",
    certification: "صنع يدوي طبيعي 100% - خالي من الكيماويات"
  },
  "صابون الشوفان والعسل المغذي": {
    ingredients: [
      "رقائق الشوفان الطبيعية المطحونة ناعماً لتلطيف البشرة",
      "عسل نحل جبلي طبيعي نقي 100% من المناحل المحلية",
      "زيت الزيتون البكر التونسي المصبن على البارد",
      "زيت جوز الهند النقي، زيت اللوز المغذي، وفيتامين E"
    ],
    conseils: "يستعمل يومياً لغسيل الوجه والجسم. تدلك الرغوة بلطف بحركات دائرية ناعمة لتنشيط الدورة الدموية ثم يغسل بالماء الفاتر.",
    bienfaits: "يرطب البشرة الجافة ويغذيها بلطف، يهدئ الحكة والتهيجات الجلدية ويمنح ملمساً ناعماً كالحرير.",
    certification: "طبيعي 100% غني بالمكونات المغذية والمهدئة"
  },
  "صابون القهوة والنشاء والكركم للتقشير": {
    ingredients: [
      "حبيبات القهوة العضوية المطحونة لتقشير ميكانيكي ناعم وتنشيط الجلد",
      "مسحوق الكركم العلاجي لتفتيح البشرة وتصفيتها",
      "نشاء الذرة النقي لشد البشرة وتضييق المسام الواسعة",
      "زيت الزيتون البكر، زيت جوز الهند، زيت اللوز، وفيتامين E"
    ],
    conseils: "يستعمل 2 إلى 3 مرات في الأسبوع أثناء الاستحمام. دلكي الرغوة بحركات دائرية صاعدة لتقشير الخلايا الميتة برفق ثم اشطفي بالماء الفاتر.",
    bienfaits: "يقشر خلايا الجلد الميتة بلطف، يفتح ويوحد لون البشرة، ينشط الدورة الدموية السطحية ويزيل التصبغات والشوائب.",
    certification: "مقشر ومفتح طبيعي فعال ومغذي للبشرة"
  },
  "صابون زيت الزيتون وجوز الهند واللوز وفيتامين E": {
    ingredients: [
      "زيت زيتون بكر ممتاز معصور على البارد بنسبة عالية لترطيب مكثف",
      "زيت جوز الهند النقي لرغوة غنية وفاخرة",
      "زيت اللوز الحلو المغذي والمطري للبشرة الحساسة",
      "فيتامين E الطبيعي لتعزيز حماية الخلايا ومكافحة الجفاف"
    ],
    conseils: "يرغى بالماء ويدلك به الوجه أو الجسم بلطف بحركات دائرية ناعمة ثم يشطف جيداً بالماء الفاتر. مناسب لجميع أفراد العائلة.",
    bienfaits: "يمنح ترطيباً عميقاً جداً، يغذي خلايا الجلد بالفيتامينات الأساسية ويحميه من الجفاف والتهيجات والطقس الجاف.",
    certification: "تصبين على البارد - ترطيب وحماية يومية فائقة"
  },
  "صابون زيت الزيتون وجوز الهند واللوز وفيتامين E d": {
    ingredients: [
      "زيت زيتون بكر ممتاز ومعصور على البارد بجودة ممتازة",
      "زيت جوز الهند النقي للرغوة الكريمية الناعمة",
      "زيت اللوز الحلو المغذي، غليسرين طبيعي، وفيتامين E"
    ],
    conseils: "مثالي للاستخدام اليومي لجميع أنواع البشرة. رغي الصابون ودلكي به البشرة المبللة بلطف، ثم اشطفي برفق بالماء الفاتر.",
    bienfaits: "إصدار خاص بمزيج من الزيوت المصبوبة على البارد لترطيب فائق ونعومة تدوم طويلاً، ويعزز مرونة الجلد وحمايته.",
    certification: "صنع يدوي فاخر على البارد 100% في المهدية"
  },
  "صابون طبيعي على البارد بزيت الزيتون واللوز رقم 1": {
    ingredients: [
      "زيت الزيتون البكر معصور على البارد بالساحل التونسي",
      "زيت اللوز الحلو المنعم والمهدئ للبشرة الحساسة",
      "زيت جوز الهند العضوي النقي، وفيتامين E الطبيعي كمضاد للأكسدة"
    ],
    conseils: "رغي الصابون بين يديك بالماء الدافئ، دلكي الوجه والرقبة برفق لمدة دقيقة ثم اشطفي بالماء.",
    bienfaits: "يحفظ جودة الزيوت الطبيعية بفضل التصبين على البارد، لطيف للغاية لترطيب البشرة الحساسة ومنع تهيجاتها.",
    certification: "طبيعي ومصنوع على البارد بالكامل"
  },
  "صابون طبيعي على البارد بزيت الزيتون واللوز رقم 3": {
    ingredients: [
      "زيت الزيتون البكر الممتاز المعصور تقليدياً",
      "زيت اللوز الحلو المغذي والمطري للبشرة المجهدة",
      "زيت جوز الهند الطبيعي، وفيتامين E الطبيعي لحيوية البشرة"
    ],
    conseils: "يغسل به الوجه والجسم بشكل يومي للاستفادة من خصائص الزيوت الطبيعية المغذية، ثم يشطف بالماء الدافئ.",
    bienfaits: "يوفر ترطيباً عميقاً يغذي طبقات الجلد الداخلية، ينعم التجاعيد الخفيفة ويمنح مرونة وحماية طبيعية.",
    certification: "صنع يدوي تقليدي نقي 100%"
  },
  "صابون طبيعي على البارد بزيت الزيتون واللوز رقم 5": {
    ingredients: [
      "زيت الزيتون البكر الممتاز معصور على البارد للحفاظ على عناصره",
      "زيت اللوز الحلو المغذي والمطري للبشرة الجافة",
      "زيت جوز الهند الطبيعي النقي، وفيتامين E الطبيعي لتعزيز مرونة البشرة"
    ],
    conseils: "يرغى الصابون بالماء ويدلك به الوجه والجسم بلطف بحركات دائرية صاعدة ثم يشطف بالماء الفاتر.",
    bienfaits: "تركيبة غنية ومغذية للغاية، ينعم ملمس الجلد، يزيل الخشونة والجفاف، ويعيد الحيوية والتألق للبشرة الباهتة.",
    certification: "تصبين على البارد نقي 100%"
  },
  "صابون عرق السوس والحبة السوداء": {
    ingredients: [
      "مستخلص جذور عرق السوس الطبيعي الفعال في تفتيح التصبغات",
      "الحبة السوداء المطحونة ناعماً كمضاد طبيعي للبكتيريا والالتهابات",
      "زيت الزيتون البكر، زيت جوز الهند، زيت اللوز الحلو، وفيتامين E الطبيعي"
    ],
    conseils: "يرغى بالماء ويدلك به الوجه بلطف بحركات دائرية ويترك لنصف دقيقة قبل الشطف. يستعمل صباحاً ومساءً لنتائج تفتيح مثالية.",
    bienfaits: "يفتح البشرة بفعالية، يوحد لون الجلد، يزيل بقع الكلف والنمش الناتجة عن الشمس ويمنح نضارة فائقة.",
    certification: "تركيبة تفتيح طبيعية 100% - خالية من المبيضات الاصطناعية"
  },
  "عرق السوس 100غ ب15د": {
    ingredients: [
      "جذور عرق سوس مجففة ومطحونة ناعماً للغاية بجودة ممتازة وسحر علاجي فعال 100%"
    ],
    conseils: "يخلط المسحوق مع القليل من الزبادي، ماء الورد أو العسل ويوضع كقناع على الوجه والتصبغات لمدة 15-20 دقيقة ثم يشطف بالماء الفاتر.",
    bienfaits: "مبيض وتفتيح طبيعي فائق للبشرة، يعالج تصبغات أشعة الشمس والكلف والنمش ويمنح بشرة صافية خالية من العيوب والشوائب.",
    certification: "مسحوق نقي 100% لتفتيح البشرة العلاجي"
  },
  "مسحوق عرق السوس الطبيعي 100غ": {
    ingredients: [
      "مسحوق ناعم وصافٍ من عرق السوس الطبيعي 100% المستخلص من جذور النبات الفاخرة"
    ],
    conseils: "اخلطي ملعقة من المسحوق مع الطين الأبيض وماء الورد، ضعي الماسك على الوجه والرقبة لمدة 15 دقيقة ثم اشطفي بالماء الفاتر.",
    bienfaits: "يزيل البقع الداكنة، يوحد لون الجسم والوجه، يعالج آثار البثور ويمنح نضارة وإشراقاً فورياً بفضل مركب الجلابريدين الطبيعي.",
    certification: "أعشاب طبيعية علاجية نقية 100%"
  },
  "للوبان الذكر ب15": {
    ingredients: [
      "بلورات صمغ اللبان الذكر النقي والطبيعي 100% من أجود الغابات الطبيعية المحفزة للكولاجين"
    ],
    conseils: "تنقع حبات من لبان الذكر في ماء دافئ ليلة كاملة، واستخدمي الماء كمنظف أو تونر يومي للبشرة بقطنة ناعمة قبل النوم.",
    bienfaits: "يشد الجلد بفعالية كولاجين طبيعي، يسهم في ملء الخطوط الدقيقة والتجاعيد، ويفتح لون البشرة الباهتة والمجهدة.",
    certification: "بلورات صمغ اللبان الذكر الصافي 100%"
  },
  "لبان ذكر طبيعي نقي 150غ": {
    ingredients: [
      "عبوة اقتصادية 150غ من بلورات صمغ لبان ذكر طبيعي وحر ونقي 100% عالي الجودة"
    ],
    conseils: "يمكن نقعه في الماء الدافئ لعمل كولاجين طبيعي وتونر منشط، أو طحنه ودمجه مع النشاء وماء الورد لعمل ماسك لشد وتبييض البشرة.",
    bienfaits: "يحفز مرونة البشرة، يساعد على تجديد الخلايا المترهلة وشد الوجه والرقبة، تفتيح الهالات السوداء وإعطاء إشراقة شبابية.",
    certification: "لبان ذكر نقي 100% - غني بالكولاجين الطبيعي"
  }
};

const getProductDetails = (nom: string) => {
  const match = productDetailsMap[nom];
  if (match) return match;
  
  return {
    ingredients: [
      "زيت زيتون تونسي بكر ممتاز مصبن",
      "زيت جوز هند طبيعي معصور على البارد",
      "غليسرين نباتي نقي مستخلص طبيعياً",
      "مستخلصات نباتية وعطرية برية من المهدية"
    ],
    conseils: "دلكي الصابون بالماء بين يديك لتكوين رغوة كريمية غنية، ثم اغسلي بها بشرتك بلطف واشطفيها جيداً بالماء الفاتر.",
    bienfaits: "يرطب، يغذي، ويعيد الإشراق الطبيعي والنعومة لبشرتك باستخدام مكونات تونسية محلية نقية خالية من أي مواد كيميائية ضارة.",
    certification: "صنع يدوي 100% - فخر الصناعة التقليدية التونسية"
  };
};

function getProductTheme(nom: string) {
  if (nom.includes('الياسمين')) {
    return {
      bg: 'bg-[#fffafc] dark:bg-[#25181f]/50',
      border: 'border-pink-200/80 dark:border-pink-900/40',
      accentBg: 'bg-pink-100/40 dark:bg-pink-900/20 text-pink-800 dark:text-pink-300',
      tagColor: 'text-pink-900 dark:text-pink-300',
      badgeLabel: 'كريم الياسمين الفاخر 🌸',
      embeddedLabel: 'غني بخلاصة الياسمين التونسي النقي المقطر وزبدة الشيا'
    };
  }
  if (nom.includes('التين الشوكي')) {
    return {
      bg: 'bg-[#fbf4fa] dark:bg-[#221220]/50',
      border: 'border-purple-200/80 dark:border-purple-900/40',
      accentBg: 'bg-purple-100/40 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300',
      tagColor: 'text-purple-900 dark:text-purple-300',
      badgeLabel: 'زيت بذور التين الشوكي 🌵',
      embeddedLabel: 'مصنع بزيت بذور التين الشوكي الأكثر فخامة ونقاءً'
    };
  }
  if (nom.includes('طبلبة')) {
    return {
      bg: 'bg-[#fafaf4] dark:bg-[#1e2017]/50',
      border: 'border-yellow-200/80 dark:border-yellow-900/40',
      accentBg: 'bg-yellow-100/40 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      tagColor: 'text-yellow-900 dark:text-yellow-300',
      badgeLabel: 'صناعة طبلبة التقليدية 🏺',
      embeddedLabel: 'منتج تقليدي بخلطة تاريخية مصبوبة على البارد في طبلبة'
    };
  }
  if (nom.includes('السدر')) {
    return {
      bg: 'bg-[#f4faf6] dark:bg-[#122216]/50',
      border: 'border-emerald-200/80 dark:border-emerald-900/40',
      accentBg: 'bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300',
      tagColor: 'text-[#2C3E2E] dark:text-emerald-300',
      badgeLabel: 'خلاصة السدر الطبيعية 🌿',
      embeddedLabel: 'مرصع بأوراق السدر الجبلية المنقوعة بالكامل'
    };
  }
  if (nom.includes('الشوفان')) {
    return {
      bg: 'bg-[#fcf9f2] dark:bg-[#252018]/50',
      border: 'border-amber-200/80 dark:border-amber-900/40',
      accentBg: 'bg-amber-100/40 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300',
      tagColor: 'text-amber-900 dark:text-amber-300',
      badgeLabel: 'عسل حر وشوفان مغذٍّ 🍯',
      embeddedLabel: 'مغمور برقائق الشوفان الذهبية وقطرات العسل النقي'
    };
  }
  if (nom.includes('عرق السوس والحبة السوداء')) {
    return {
      bg: 'bg-[#f8f6f9] dark:bg-[#1d1a24]/50',
      border: 'border-indigo-200/70 dark:border-indigo-900/40',
      accentBg: 'bg-indigo-100/30 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300',
      tagColor: 'text-indigo-950 dark:text-indigo-300',
      badgeLabel: 'عرق سوس وتوحيد اللون ✨',
      embeddedLabel: 'مكثف بجزيئات الحبة السوداء ومستخلص عرق السوس'
    };
  }
  if (nom.includes('القهوة')) {
    return {
      bg: 'bg-[#faf7f3] dark:bg-[#201a14]/50',
      border: 'border-orange-300/50 dark:border-orange-900/40',
      accentBg: 'bg-orange-100/30 dark:bg-orange-900/20 text-orange-900 dark:text-orange-300',
      tagColor: 'text-amber-900 dark:text-amber-400',
      badgeLabel: 'مقشر القهوة والنشاء والكركم ☕',
      embeddedLabel: 'مزيج حبيبات البن العضوية الفاخرة والنشاء لتقشير مذهل'
    };
  }
  if (nom.includes('اللبان الذكر') || nom.includes('لبان ذكر')) {
    return {
      bg: 'bg-[#f8f8f6] dark:bg-[#1e1e1a]/50',
      border: 'border-stone-200/80 dark:border-stone-800/40',
      accentBg: 'bg-stone-100/50 dark:bg-stone-900/20 text-stone-800 dark:text-stone-300',
      tagColor: 'text-stone-900 dark:text-stone-300',
      badgeLabel: 'كولاجين طبيعي مشدود 💎',
      embeddedLabel: 'مدمج ببلورات صمغ اللبان الذكر الغنية بالكولاجين'
    };
  }
  if (nom.includes('مسحوق عرق السوس')) {
    return {
      bg: 'bg-[#faf9f0] dark:bg-[#242419]/40',
      border: 'border-yellow-200/70 dark:border-yellow-900/30',
      accentBg: 'bg-yellow-100/40 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      tagColor: 'text-yellow-950 dark:text-yellow-400',
      badgeLabel: 'بودرة عرق السوس النقي 100% 🧪',
      embeddedLabel: 'مسحوق جذور عرق السوس الصافي والمطحون فائق النعومة'
    };
  }
  if (nom.includes('زيت الزيتون')) {
    return {
      bg: 'bg-[#f6faf4] dark:bg-[#162013]/50',
      border: 'border-lime-200/70 dark:border-lime-900/30',
      accentBg: 'bg-lime-100/40 dark:bg-lime-900/20 text-lime-800 dark:text-lime-300',
      tagColor: 'text-lime-950 dark:text-lime-300',
      badgeLabel: 'تصبين على البارد وفيتامين E 🧴',
      embeddedLabel: 'مصبوب يدوياً بزيت الزيتون البكر وزيت اللوز مع فيتامين E'
    };
  }
  return {
    bg: 'bg-[#FAF9F5]/60 dark:bg-slate-900/30',
    border: 'border-[#E8E4DB]/80 dark:border-slate-800/50',
    accentBg: 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-300',
    tagColor: 'text-[#C18D5D]',
    badgeLabel: 'صنع يدوي بالمهدية 🌸',
    embeddedLabel: 'تركيبة نقية بالكامل مستخلصة يدوياً من الطبيعة التونسية'
  };
}

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

export interface CartItem {
  id: number;
  nom: string;
  prix: number;
  image_url: string;
  quantity: number;
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
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#E8E4DB] flex items-center justify-center animate-pulse">
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-[#2C3E2E]/25">بيور غلو</span>
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
  const [products, setProducts] = useState<Produit[]>(staticProducts);
  const [orders, setOrders] = useState<Commande[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState<'boutique' | 'admin' | 'suivi'>('boutique');
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Produit | null>(null);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminSession, setAdminSession] = useState<any>(null);

  // Persistent Shopping Cart state (local storage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('biocosmetique_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart:", e);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to local storage on change
  useEffect(() => {
    localStorage.setItem('biocosmetique_cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart handler
  const handleAddToCart = (product: Produit) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        setAlertMsg({
          type: 'success',
          text: `تم زيادة كمية "${product.nom}" في السلة بنجاح!`
        });
        setTimeout(() => setAlertMsg(null), 5000);
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        setAlertMsg({
          type: 'success',
          text: `تم إضافة "${product.nom}" إلى السلة بنجاح!`
        });
        setTimeout(() => setAlertMsg(null), 5000);
        return [
          ...prevCart,
          {
            id: product.id,
            nom: product.nom,
            prix: product.prix,
            image_url: product.image_url,
            quantity: 1,
          },
        ];
      }
    });
  };

  // Update item quantity in cart
  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId: number) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.id === productId);
      if (item) {
        setAlertMsg({
          type: 'success',
          text: `تم إزالة "${item.nom}" من السلة.`
        });
        setTimeout(() => setAlertMsg(null), 5000);
      }
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
    setAlertMsg({
      type: 'success',
      text: 'تم إفراغ السلة بنجاح.'
    });
    setTimeout(() => setAlertMsg(null), 5000);
  };

  // Finalize order via Chatbot handler
  const handleFinalizeOrderViaChat = () => {
    if (cart.length === 0) return;

    // Build the Arabic order summary text for Chatbot interaction
    const cartDetails = cart
      .map((item) => `- ${item.quantity}x ${item.nom} (${(item.prix * item.quantity).toFixed(3)} د.ت)`)
      .join('\n');
    const totalRaw = cart.reduce((sum, item) => sum + item.prix * item.quantity, 0);
    const shippingCost = totalRaw >= 60 ? 0 : 7;
    const totalWithShipping = totalRaw + shippingCost;

    const messagePrompt = `أهلاً سارة! أرغب في إتمام طلب شراء سلة المنتجات الخاصة بي مباشرة من هنا:
${cartDetails}

المجموع الفرعي للمنتجات: ${totalRaw.toFixed(3)} د.ت
مصاريف الشحن: ${shippingCost === 0 ? 'مجاني 🚚' : `${shippingCost.toFixed(3)} د.ت`}
المجموع الكلي: ${totalWithShipping.toFixed(3)} د.ت

الرجاء مساعدتي في إتمام عملية الشراء وتأكيد طلبيتي! ✨`;

    // Dispatch the custom event to Chatbot component
    const event = new CustomEvent('chat-order', {
      detail: { customPrompt: messagePrompt }
    });
    window.dispatchEvent(event);

    // Close cart panel
    setIsCartOpen(false);

    // Alert notification banner in Arabic
    setAlertMsg({
      type: 'success',
      text: 'تم تحويل السلة للدردشة! يرجى فتح نافذة المستشارة "سارة" في الأسفل لتأكيد الاسم ورقم الهاتف والعنوان لإتمام طلبكِ في ثوانٍ.'
    });
    setTimeout(() => setAlertMsg(null), 10000);
  };

  // Synthesize an elegant chime sound when a new order arrives
  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // Tone 1: gentle chime tone (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.35);
      
      // Tone 2: high clean note shortly after (E5)
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
          gain2.gain.setValueAtTime(0.12, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
          
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.55);
        } catch (e) {
          // Ignore potential context interaction limits
        }
      }, 100);
    } catch (err) {
      console.warn("Could not play synthesized chime:", err);
    }
  };

  // States for order tracking
  const [trackRef, setTrackRef] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Commande | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackLoading, setTrackLoading] = useState<boolean>(false);

  // Track order handler
  const handleTrackOrder = async (referenceId?: string) => {
    const refToUse = referenceId || trackRef;
    if (!refToUse.trim()) {
      setTrackError('الرجاء إدخال رقم الهاتف أو رقم الطلب لمتابعة الطلبية.');
      setTrackedOrder(null);
      return;
    }
    
    setTrackLoading(true);
    setTrackError(null);
    try {
      const cleanRef = refToUse.replace('#', '').trim();
      
      // Search in local orders state by ID or telephone number
      const found = orders.find(o => {
        const cleanId = String(o.id).trim();
        const cleanPhone = String(o.telephone).replace(/\s+/g, '').trim();
        const cleanQuery = cleanRef.replace(/\s+/g, '');
        return cleanId === cleanQuery || cleanPhone === cleanQuery;
      });
      
      if (found) {
        setTrackedOrder(found);
      } else {
        setTrackError('لم نتمكن من العثور على أي طلب بهذا الرقم أو رقم الهاتف. يرجى التثبت من الرقم والمحاولة مجدداً.');
        setTrackedOrder(null);
      }
    } catch (err) {
      console.error("Tracking error:", err);
      setTrackError('حدث خطأ أثناء البحث عن الطلبية. يرجى المحاولة مرة أخرى لاحقاً.');
      setTrackedOrder(null);
    } finally {
      setTrackLoading(false);
    }
  };

  // Update order status handler
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const success = await updateCommandeStatut(orderId, newStatus);
      if (success) {
        // Update local orders state
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statut: newStatus } : o));
        setAlertMsg({ type: 'success', text: 'تم تحديث حالة الطلبية بنجاح!' });
        setTimeout(() => setAlertMsg(null), 5000);
      } else {
        setAlertMsg({ type: 'error', text: 'فشل في تحديث حالة الطلبية. يرجى المحاولة مجدداً.' });
        setTimeout(() => setAlertMsg(null), 5000);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setAlertMsg({ type: 'error', text: 'حدث خطأ غير متوقع أثناء تحديث حالة الطلبية.' });
      setTimeout(() => setAlertMsg(null), 5000);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const products = await getProduits();
      const mapped = products.map((p: any) => {
        const matchStatic = staticProducts.find(sp => sp.id === p.id || sp.nom === p.nom);
        return {
          ...p,
          image_url: matchStatic ? matchStatic.image_url : p.image_url,
          prix: 15.000
        };
      });
      setProducts(mapped);
    } catch (e) {
      console.error("Erreur de récupération des produits, utilisation du local:", e);
      setProducts(staticProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch orders
  const fetchOrders = async (isSilent: boolean = false) => {
    if (!isSilent) setLoadingOrders(true);
    try {
      const orders = await getCommandes();
      setOrders(prevOrders => {
        // If we already have loaded some orders in previous renders, check for brand new orders
        if (prevOrders.length > 0) {
          const newOrders = orders.filter(
            (newO: Commande) => !prevOrders.some((oldO: Commande) => oldO.id === newO.id)
          );
          if (newOrders.length > 0) {
            // Trigger sound notification (chime)
            playNotificationSound();
            // Update badge count of new unread orders
            setNewOrdersCount(prev => prev + newOrders.length);
            // Trigger alert
            setAlertMsg({
              type: 'success',
              text: `🔔 تنبيه: تم استلام ${newOrders.length} طلبية جديدة وتحديث السجل تلقائياً!`
            });
            setTimeout(() => setAlertMsg(null), 8000);
          }
        }
        return orders;
      });
    } catch (e) {
      console.error("Erreur de récupération des commandes:", e);
    } finally {
      if (!isSilent) setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    
    // Vérifier la session Supabase au montage
    checkAdminSession();
    
    // Auto-refresh orders silently every 12 seconds to instantly capture new automated chat orders!
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Vérifier la session admin Supabase
  const checkAdminSession = async () => {
    if (!supabase) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setAdminSession(session);
        setIsAdminAuthenticated(true);
      } else {
        setAdminSession(null);
        setIsAdminAuthenticated(false);
      }
    } catch (error) {
      console.error('Erreur vérification session:', error);
      setAdminSession(null);
      setIsAdminAuthenticated(false);
    }
  };

  // Gérer le succès de login
  const handleLoginSuccess = () => {
    checkAdminSession();
  };

  // Déconnexion admin
  const handleAdminLogout = async () => {
    if (!supabase) return;
    
    try {
      await supabase.auth.signOut();
      setAdminSession(null);
      setIsAdminAuthenticated(false);
      setAlertMsg({ type: 'success', text: 'تم تسجيل الخروج بنجاح' });
      setTimeout(() => setAlertMsg(null), 3000);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      setAlertMsg({ type: 'error', text: 'Erreur lors de la déconnexion' });
      setTimeout(() => setAlertMsg(null), 3000);
    }
  };

  // Trigger custom event to open Chatbot with selected product pre-filled
  const handleOrderClick = (productNom: string) => {
    const event = new CustomEvent('chat-order', { detail: { productNom } });
    window.dispatchEvent(event);
    
    // Alert feedback in elegant Arabic
    setAlertMsg({
      type: 'success',
      text: `تم إرسال اختياركِ بنجاح! يرجى فتح نافذة الدردشة مع المستشارة "سارة" في الأسفل لإتمام طلب شراء "${productNom}" في ثوانٍ معدودة.`
    });
    setTimeout(() => setAlertMsg(null), 8000);
  };

  // Trigger custom event to ask about an order
  const handleAskSarraAboutOrder = (orderId: number) => {
    const event = new CustomEvent('chat-order', { 
      detail: { 
        customPrompt: `أهلاً سارة، أرغب في الاستفسار عن حالة طلبي ذو الرقم المرجعي #${orderId}. هل يمكن مساعدتي؟` 
      } 
    });
    window.dispatchEvent(event);
    
    setAlertMsg({
      type: 'success',
      text: `تم إرسال مرجع الطلب #${orderId} إلى سارة. يرجى مراجعة نافذة الدردشة في الأسفل للتحدث معها.`
    });
    setTimeout(() => setAlertMsg(null), 8000);
  };

  // Calculate statistics for Merchant Dashboard
  const totalRevenue = orders.reduce((sum, order) => {
    // Basic heuristics to calculate estimated total (defaulting to average of 15.000 TND per order if parsing fails)
    let amount = 15.000;
    if (order.details_produits) {
      if (order.details_produits.includes("التين الشوكي") || order.details_produits.includes("Barbarie")) amount = 15.000;
      if (order.details_produits.includes("الياسمين") || order.details_produits.includes("Jasmin")) amount = 24.500;
      if (order.details_produits.includes("القهوة") || order.details_produits.includes("Café")) amount = 15.000;
      if (order.details_produits.includes("طبلبة") || order.details_produits.includes("Teboulba")) amount = 15.000;
      if (order.details_produits.includes("السدر") || order.details_produits.includes("Sidr")) amount = 15.000;
    }
    return sum + amount;
  }, 0);

  // Setup styling colors based on theme mode
  const themeBgMain = isNightMode ? 'bg-[#141E15]' : 'bg-[#F9F7F2]';
  const themeBgCard = isNightMode ? 'bg-[#1D2A1E]' : 'bg-white';
  const themeBgBadge = isNightMode ? 'bg-[#253626]' : 'bg-[#E8E4DB]';
  const themeTextMain = isNightMode ? 'text-[#FAF9F5]' : 'text-[#2C3E2E]';
  const themeTextMuted = isNightMode ? 'text-[#A0A49B]' : 'text-[#5A5A40]';
  const themeBorder = isNightMode ? 'border-[#FAF9F5]/10' : 'border-[#2C3E2E]/10';

  return (
    <div 
      className={`min-h-screen ${themeBgMain} ${themeTextMain} font-sans transition-colors duration-500 overflow-x-hidden w-full`} 
      dir="rtl"
    >
      {/* In-App Browser Banner */}
      <InAppBrowserBanner isNightMode={isNightMode} />

      {/* Top Notification Banner */}
      <div className="bg-[#2C3E2E] text-[#F9F7F2] py-2 px-4 text-center text-xs tracking-wider border-b border-[#C18D5D]/20">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-[#C18D5D] animate-pulse" />
          <span>شحن مجاني لكافة الولايات التونسية للطلبات الأكثر من 60 د.ت والدفع نقداً عند الاستلام</span>
        </div>
      </div>

      {/* Main Elegant Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md ${isNightMode ? 'bg-[#141E15]/90' : 'bg-[#F9F7F2]/90'} border-b ${themeBorder} transition-colors duration-500 overflow-x-hidden`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between w-full">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-[#2C3E2E] flex items-center justify-center text-[#C18D5D] border border-[#C18D5D]/20">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg sm:text-xl font-bold text-[#C18D5D] tracking-wide">بيور غلو MH</span>
              <p className="text-[9px] uppercase tracking-wider text-emerald-700 font-semibold block">مستحضرات تجميل تونسية عضوية 🌸</p>
            </div>
            <div className="sm:hidden">
              <span className="font-display text-base font-bold text-[#C18D5D] tracking-wide">بيور غلو MH</span>
            </div>
          </div>

          {/* Navigation tabs in Arabic - Responsive */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FAF9F5]/20 p-1 rounded-sm border border-emerald-900/5 flex-shrink-0">
            <button
              onClick={() => setActiveTab('boutique')}
              className={`px-4 py-3 min-h-[48px] min-w-[44px] text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-sm flex items-center justify-center ${
                activeTab === 'boutique' 
                  ? 'bg-[#2C3E2E] text-white shadow-xs' 
                  : `${themeTextMuted} hover:text-[#C18D5D]`
              }`}
            >
              المتجر العضوي
            </button>
            <button
              onClick={() => setActiveTab('suivi')}
              className={`px-4 py-3 min-h-[48px] min-w-[44px] text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-sm flex items-center justify-center ${
                activeTab === 'suivi' 
                  ? 'bg-[#2C3E2E] text-white shadow-xs' 
                  : `${themeTextMuted} hover:text-[#C18D5D]`
              }`}
            >
              تتبع طلبيتك
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setNewOrdersCount(0);
              }}
              className={`px-4 py-3 min-h-[48px] min-w-[44px] text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-sm flex items-center justify-center gap-1.5 relative ${
                activeTab === 'admin' 
                  ? 'bg-[#2C3E2E] text-white shadow-xs' 
                  : `${themeTextMuted} hover:text-[#C18D5D]`
              }`}
            >
              <span>لوحة التحكم</span>
              {newOrdersCount > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C18D5D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C18D5D]"></span>
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Navigation Dropdown */}
          <div className="md:hidden relative">
            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value as any);
                if (e.target.value === 'admin') setNewOrdersCount(0);
              }}
              className={`px-3 py-2 min-h-[44px] min-w-[44px] text-xs font-medium rounded-sm border ${themeBorder} ${themeBgCard} ${themeTextMain} cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C18D5D]`}
            >
              <option value="boutique">المتجر العضوي</option>
              <option value="suivi">تتبع طلبيتك</option>
              <option value="admin">لوحة التحكم</option>
            </select>
          </div>

          {/* Theme & Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className={`p-2.5 sm:p-2.5 min-h-[44px] min-w-[44px] rounded-full border ${themeBorder} cursor-pointer hover:bg-[#C18D5D]/10 transition-colors relative`}
              title="عرض سلة المشتريات"
              id="header-cart-btn"
            >
              <ShoppingBag className="h-4.5 w-4.5 text-[#2C3E2E] dark:text-[#FAF9F5]" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-[#C18D5D] text-[10px] font-bold text-white items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </span>
              )}
            </button>

            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`p-2 sm:p-2 min-h-[44px] min-w-[44px] rounded-full border ${themeBorder} cursor-pointer hover:bg-[#C18D5D]/10 transition-colors`}
              title="تغيير مظهر الصفحة"
            >
              {isNightMode ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-[#2C3E2E]" />
              )}
            </button>
            
            <div className="hidden md:flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-100/40 px-3 py-1.5 rounded-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>المهدية، تونس</span>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Active Order Notification Alert Box */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-4 right-4 md:left-auto md:right-6 md:w-[450px] z-50 bg-[#2C3E2E] text-[#F9F7F2] p-4 rounded-sm shadow-2xl border border-[#C18D5D]/40"
          >
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-[#C18D5D]/20 text-[#C18D5D]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-xs text-[#C18D5D] mb-1">خطوة رائعة نحو الجمال الطبيعي!</h4>
                <p className="text-xs leading-relaxed text-[#E8E4DB]">{alertMsg.text}</p>
              </div>
              <button 
                onClick={() => setAlertMsg(null)}
                className="text-[#F9F7F2]/60 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Tab Views Switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: BOUTIQUE */}
        {activeTab === 'boutique' && (
          <div>
            
            {/* Elegant Hero Section with Arch Design */}
            <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C18D5D]/10 text-[#C18D5D] border border-[#C18D5D]/15 rounded-sm text-xs font-semibold">
                  <Award className="h-3.5 w-3.5" />
                  <span>مستحضرات تجميل عضوية نقية 100% مصنوعة على البارد</span>
                </div>
                
                <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-[#2C3E2E] dark:text-[#FAF9F5]">
                  سحر الطبيعة التونسية ونقاء <br className="hidden md:block"/>
                  <span className="text-[#C18D5D]">العناية الفاخرة بالبشرة</span>
                </h1>
                
                <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl">
                  اكتشفي مجموعتنا الاستثنائية من الصابون الطبيعي الفاخر والكريمات المغذية المصنوعة يدوياً بكل فخر في المهدية بالساحل التونسي. نعتمد أرقى تقنيات العصر والتصبين على البارد لنحفظ لكِ الأسرار العلاجية لزيت التين الشوكي، زيت الزيتون البكر، وعسل الجبل النقي لجمال يدوم وإشراق طبيعي لا يضاهى.
                </p>

                <div className="flex flex-wrap gap-4 pt-4 justify-start">
                  <a 
                    href="#catalog-view"
                    className="px-6 py-3.5 bg-[#2C3E2E] hover:bg-[#C18D5D] text-white font-medium text-xs sm:text-sm rounded-sm transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                    <span>تصفحي المنتجات الطبيعية</span>
                  </a>
                  
                  <button 
                    onClick={() => {
                      const event = new CustomEvent('chat-order', { detail: { customPrompt: "مرحباً سارة، أريد استشارتك في اختيار الصابون المناسب لنوع بشرتي." } });
                      window.dispatchEvent(event);
                    }}
                    className="px-6 py-3.5 bg-transparent hover:bg-[#2C3E2E]/5 border border-[#2C3E2E] dark:border-[#FAF9F5] text-[#2C3E2E] dark:text-[#FAF9F5] hover:text-emerald-950 font-medium text-xs sm:text-sm rounded-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5 text-[#C18D5D]" />
                    <span>استشارة مجانية مع سارة (IA)</span>
                  </button>
                </div>

                {/* Hero Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
                  <div>
                    <span className="font-display text-lg sm:text-xl font-bold text-[#C18D5D]">طبيعي 100%</span>
                    <p className="text-[10px] text-slate-500">خالٍ تماماً من البارابين والسيليكون</p>
                  </div>
                  <div>
                    <span className="font-display text-lg sm:text-xl font-bold text-[#C18D5D]">تصبين على البارد</span>
                    <p className="text-[10px] text-slate-500">للحفاظ على الفيتامينات والغليسرين</p>
                  </div>
                  <div>
                    <span className="font-display text-lg sm:text-xl font-bold text-[#C18D5D]">صنع يدوي تونسي</span>
                    <p className="text-[10px] text-slate-500">أصالة المهدية وتقاليد الساحل العريقة</p>
                  </div>
                </div>
              </div>

              {/* Editorial Arch Design Photo */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] rounded-t-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl relative bg-slate-100">
                  <LazyImage 
                    src="/savon_sidr_miel.jpg" 
                    alt="صابون السدر وعسل طبلبة الطبيعي الممتاز - بيور غلو"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 rounded-t-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-6 text-right">
                    <span className="text-[#C18D5D] text-xs font-semibold tracking-wider uppercase">المنتج الأكثر طلباً</span>
                    <h3 className="font-display text-[#FAF9F5] text-lg font-bold">صابون السدر وعسل طبلبة الطبيعي الممتاز</h3>
                    <p className="text-white/85 text-xs">مطهر، مغذٍ ومرطب فائق للبشرة الحساسة من خيرات تونس العريقة</p>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full border-4 border-[#C18D5D]/20 animate-pulse hidden md:block" />
                <div className="absolute -top-6 -right-6 h-20 w-20 bg-[#C18D5D]/10 rounded-sm blur-xl" />
              </div>
            </section>

            {/* Quality Charter / Why Choose Us */}
            <section className="py-12 px-6 rounded-2xl bg-emerald-950 text-[#F9F7F2] mb-20 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 h-64 w-64 bg-[#C18D5D]/5 rounded-full blur-3xl" />
              
              <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 relative z-10">
                <span className="text-[#C18D5D] text-xs font-bold tracking-wider uppercase">ميثاق الجودة والنقاء</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold">لماذا تختار مستحضراتنا الطبيعية؟</h2>
                <p className="text-xs sm:text-sm text-[#E8E4DB]/85 leading-relaxed">
                  نحن لا نصنع مستحضرات تجميل عادية؛ نحن نصنع قطعاً فنية علاجية مستخلصة من أرض تونس الطيبة تعتني بنضارة بشرتكِ وصحة عائلتكِ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10 text-right">
                <div className="space-y-2 border-r border-[#C18D5D]/20 pr-4">
                  <div className="h-9 w-9 rounded bg-[#C18D5D]/10 flex items-center justify-center text-[#C18D5D]">
                    <Award className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-white">زيت التين الشوكي النقي</h4>
                  <p className="text-xs text-[#E8E4DB]/80 leading-relaxed">أقوى مضاد أكسدة طبيعي في العالم لشد خلايا البشرة ومكافحة التجاعيد وعلامات الجفاف.</p>
                </div>
                
                <div className="space-y-2 border-r border-[#C18D5D]/20 pr-4">
                  <div className="h-9 w-9 rounded bg-[#C18D5D]/10 flex items-center justify-center text-[#C18D5D]">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-white">0% كيماويات ضارة</h4>
                  <p className="text-xs text-[#E8E4DB]/80 leading-relaxed">خالٍ تماماً من الكبريتات، الملونات الاصطناعية، المواد الرغوية السامة، والمثبتات الكيميائية.</p>
                </div>

                <div className="space-y-2 border-r border-[#C18D5D]/20 pr-4">
                  <div className="h-9 w-9 rounded bg-[#C18D5D]/10 flex items-center justify-center text-[#C18D5D]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-white">روائح تونسية أصيلة</h4>
                  <p className="text-xs text-[#E8E4DB]/80 leading-relaxed">عطور طبيعية دافئة ومقطرة كعطر ياسمين الحمامات الساحر ومياه الزهور الطبيعية الفواحة.</p>
                </div>

                <div className="space-y-2 border-r border-[#C18D5D]/20 pr-4">
                  <div className="h-9 w-9 rounded bg-[#C18D5D]/10 flex items-center justify-center text-[#C18D5D]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-white">دعم الحرفيات التونسيات</h4>
                  <p className="text-xs text-[#E8E4DB]/80 leading-relaxed">نقتني زيت الزيتون والأوراق العضوية مباشرة من النساء المزارعات والتعاونيات الفلاحية بالساحل.</p>
                </div>
              </div>
            </section>

            {/* Catalogue Section Header */}
            <div id="catalog-view" className="text-right space-y-3 mb-10">
              <span className="text-[#C18D5D] text-xs font-bold tracking-wider uppercase block">تشكيلة العناية المتميزة</span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#2C3E2E] dark:text-[#FAF9F5]">
                أحدث إبداعاتنا الطبيعية العضوية
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                اضغط على <span className="font-semibold text-[#C18D5D]">"تفاصيل المكونات"</span> لمعرفة الفوائد الكاملة لكل مستحضر، أو اضغط على <span className="font-semibold text-emerald-800">"طلب سريع عبر سارة"</span> للتحدث فوراً مع مستشارتنا الذكية وإرسال طلبيتك وعنوانك.
              </p>
            </div>

            {/* Product Cards Bento Grid Loading */}
            {loadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx} className="animate-pulse rounded-lg bg-[#E8E4DB]/20 h-96 border border-[#2C3E2E]/5" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-[#E8E4DB]/15 rounded-lg border border-dashed border-[#2C3E2E]/25">
                <Leaf className="h-10 w-10 text-[#C18D5D] mx-auto mb-3 animate-bounce" />
                <h3 className="font-display font-bold text-base">لا توجد منتجات متوفرة حالياً في المتجر</h3>
                <p className="text-xs text-slate-500 mt-1">يرجى التأكد من تشغيل الخادم وتحديث الصفحة لمزامنة المنتجات.</p>
              </div>
            ) : (
              <motion.div 
                variants={productContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 content-visibility-auto"
              >
                {products.map((p) => {
                  const cardTheme = getProductTheme(p.nom);
                  return (
                    <motion.div
                      key={p.id}
                      variants={productCardVariants}
                      className={`rounded-2xl overflow-hidden ${cardTheme.bg} border-2 ${cardTheme.border} shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group transform hover:-translate-y-1`}
                    >
                    
                    {/* Card Image Area with brass/gold golden plate */}
                    <div className="p-4 relative">
                      <div className="h-68 w-full overflow-hidden relative rounded-xl shadow-lg border border-[#E8E4DB]/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 group-hover:shadow-xl transition-all duration-300">
                        {/* Left-top/Right-top Ingredient Badge */}
                        <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border shadow-xs ${cardTheme.accentBg} backdrop-blur-md`}>
                          {cardTheme.badgeLabel}
                        </div>

                        {/* Gold Packaging Ribbon & Premium Brand Round Label "MH Pure Glow Natural Co." */}
                        <div className="absolute top-2 left-3 z-20 flex flex-col items-center">
                          {/* Hanging Golden Ribbon */}
                          <div className="w-1.5 h-6 bg-gradient-to-b from-[#bf953f] via-[#fcf6ba] to-[#b38728] shadow-sm"></div>
                          {/* Circular White & Gold Seal */}
                          <div className="w-11 h-11 rounded-full bg-white dark:bg-slate-900 border-2 border-[#bf953f] shadow-[0_3px_8px_rgba(180,140,40,0.25)] flex flex-col items-center justify-center select-none text-center transform hover:scale-105 transition-transform duration-300">
                            <span className="text-[6px] text-[#bf953f] font-bold tracking-tight leading-none">MH</span>
                            <span className="text-[4px] text-slate-800 dark:text-slate-200 font-extrabold uppercase leading-none mt-0.5 scale-90">Pure Glow</span>
                            <span className="text-[3px] text-[#bf953f] font-semibold leading-none mt-0.5 scale-90">Natural Co.</span>
                          </div>
                        </div>

                        {/* BRASS GOLDEN METALLIC PLAQUE on the left bottom */}
                        <div className="absolute bottom-3 left-3 z-10 bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] text-[#1c1404] text-xs font-extrabold px-3 py-1.5 rounded-md shadow-[0_4px_8px_rgba(0,0,0,0.25)] border border-[#8a6d29]/40 flex items-center justify-center gap-1 font-display tracking-tight hover:scale-105 transition-transform duration-300 select-none">
                          <span className="text-[9px] font-bold opacity-85">DT</span>
                          <span className="text-sm font-black">{p.prix.toFixed(3)}</span>
                        </div>

                        {/* TRANSLUCENT INNER BOTANICAL TEXTURE BANNER at the bottom of the image area */}
                        <div className="absolute bottom-3 right-3 left-24 z-10 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-white/40 dark:border-slate-800/40 text-right shadow-xs">
                          <p className="text-[9px] text-slate-800 dark:text-slate-100 font-bold leading-tight flex items-center justify-end gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            <span>{cardTheme.embeddedLabel}</span>
                          </p>
                        </div>

                        <LazyImage 
                          src={p.image_url} 
                          alt={p.nom} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Card Body Details */}
                    <div className="px-5 pb-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="font-display font-bold text-base leading-snug group-hover:text-[#C18D5D] transition-colors text-[#2C3E2E] dark:text-[#FAF9F5]">
                          {p.nom}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                      </div>

                      {/* Composition Area styled like a premium label */}
                      <div className={`p-3 rounded-xl border ${cardTheme.border} ${cardTheme.bg} shadow-2xs`}>
                        <span className={`text-[10px] font-bold block mb-1 font-display ${cardTheme.tagColor}`}>
                          🧪 المكونات والتركيبة:
                        </span>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed font-sans">
                          {productDetailsMap[p.nom]?.ingredients?.join(' • ') || 'زيوت نباتية طبيعية معصورة على البارد مع خلاصات المهدية النقية.'}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="space-y-2 pt-1 text-right">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="px-2 py-2 min-h-[48px] border border-[#C18D5D]/40 hover:border-[#C18D5D] hover:bg-[#C18D5D]/10 text-[#C18D5D] text-[11px] font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>تفاصيل المكونات</span>
                          </button>
                          
                          <button
                            onClick={() => handleOrderClick(p.nom)}
                            className="px-2 py-2 min-h-[48px] border border-transparent bg-[#C18D5D]/15 hover:bg-[#C18D5D]/30 text-[#2C3E2E] dark:text-[#FAF9F5] text-[11px] font-semibold rounded-md transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-[#C18D5D]" />
                            <span>طلب سريع</span>
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddToCart(p)}
                          className="w-full py-3 min-h-[48px] bg-[#2C3E2E] hover:bg-[#C18D5D] text-[#F9F7F2] text-xs font-bold rounded-md transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="h-4 w-4 text-amber-400" />
                          <span>أضف إلى السلة 🌸</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </motion.div>
            )}

            {/* High-Contrast Testimonials Section */}
            <section className="mt-28 py-16 px-6 rounded-2xl bg-[#E8E4DB]/20 border border-emerald-900/5 relative overflow-hidden">
              <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
                <span className="text-[#C18D5D] text-xs font-bold tracking-wider uppercase">تجارب حقيقية تلامس الروح</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold">آراء عملائنا الأوفياء في تونس</h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  نسعد بمشاركة بعض من التجارب الصادقة التي تلقيناها من عملائنا بعد تجربة مستحضراتنا الطبيعية المصنوعة على البارد.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`${themeBgCard} p-6 rounded-sm border ${themeBorder} shadow-xs relative flex flex-col justify-between text-right space-y-4`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "صابون التين الشوكي المصنوع على البارد هو أعجوبة حقيقية! بشرتي أصبحت ناعمة ومشرقة للغاية في غضون أيام قليلة فقط. فخورة بوجود منتج تونسي بهذه الجودة الفائقة!"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="h-8 w-8 rounded-full bg-[#C18D5D]/20 text-[#C18D5D] font-display font-bold flex items-center justify-center text-xs">أ</div>
                    <div>
                      <h5 className="font-display text-xs font-bold">أمينة قدور</h5>
                      <span className="text-[10px] text-slate-400">شراء مؤكد — المهدية</span>
                    </div>
                  </div>
                </div>

                <div className={`${themeBgCard} p-6 rounded-sm border ${themeBorder} shadow-xs relative flex flex-col justify-between text-right space-y-4`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "مقشر القهوة وكريم الياسمين مثاليان لروتيني اليومي. التوصيل إلى سوسة كان سريعاً جداً والتغليف في كرتون صديق للبيئة مع لمسة الورد المجفف غاية في الرقي والأناقة."
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="h-8 w-8 rounded-full bg-[#C18D5D]/20 text-[#C18D5D] font-display font-bold flex items-center justify-center text-xs">ي</div>
                    <div>
                      <h5 className="font-display text-xs font-bold">يوسف بوهلال</h5>
                      <span className="text-[10px] text-slate-400">شراء مؤكد — سوسة</span>
                    </div>
                  </div>
                </div>

                <div className={`${themeBgCard} p-6 rounded-sm border ${themeBorder} shadow-xs relative flex flex-col justify-between text-right space-y-4`}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      "تجربة شراء مذهلة! تحدثت مع المستشارة الذكية سارة بالدارجة التونسية، ونصحتني بالصابون المناسب لبشرتي وسجلت طلبي وعنواني في ثوانٍ معدودة. فكرة عبقرية!"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <div className="h-8 w-8 rounded-full bg-[#C18D5D]/20 text-[#C18D5D] font-display font-bold flex items-center justify-center text-xs">م</div>
                    <div>
                      <h5 className="font-display text-xs font-bold">مريم غربال</h5>
                      <span className="text-[10px] text-slate-400">شراء مؤكد — صفاقس</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Collapsible FAQ Section with Framer Motion Accordion */}
            <section className="mt-28 max-w-4xl mx-auto py-8">
              <div className="text-center space-y-3 mb-12">
                <HelpCircle className="h-8 w-8 text-[#C18D5D] mx-auto animate-pulse" />
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold">الأسئلة الشائعة حول مستحضراتنا</h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  كل ما تود معرفته عن عملية التصبين التقليدية على البارد والزيوت ومواعيد الشحن لكافة الولايات التونسية.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    q: "ما هي المكونات الرئيسية لمنتجاتكم ومن أين تأتي؟",
                    a: "ترتكز تركيباتنا الطبيعية على خيرات أرض تونس الغنية: زيت بذور التين الشوكي العضوي الثمين من تعاونيات القصرين (وهو أقوى مضاد أكسدة طبيعي للتجاعيد)، وزيت الزيتون البكر الممتاز من حقولنا العائلية بالساحل، وخلاصات ومقطرات الياسمين من الحمامات وزهر البرتقال من نابل. نمنع تماماً أي إضافات كيميائية ضارة لضمان نقاء مطلق وبشرة صحية."
                  },
                  {
                    q: "ما هي تكلفة ومدة التوصيل في تونس؟ وهل يتوفر الدفع عند الاستلام؟",
                    a: "نشحن طلبياتنا مباشرة إلى باب منزلك في جميع ولايات تونس في غضون 24 إلى 48 ساعة كحد أقصى. تبلغ تكلفة التوصيل 7 دنانير فقط، ونقدم التوصيل مجاناً بالكامل لكل طلب تفوق قيمته 60 ديناراً. الدفع يكون نقداً عند الاستلام بعد تسلم ومعاينة طلبيتك بنفسك للتأكد من جودتها."
                  },
                  {
                    q: "ما هي طريقة التصبين على البارد وما الذي يميزها عن الصابون التجاري؟",
                    a: "التصبين على البارد هو عملية يدوية تقليدية صعبة تتطلب تصنيع الصابون دون تعريض الزيوت لحرارة عالية، مما يحافظ على كامل الفوائد الطبيعية للزيوت، الفيتامينات، والغليسرين الطبيعي المرطب للبشرة. جميع منتجاتنا خالية تماماً من الكبريتات والبارابين والمثبتات الكيميائية المسببة لتهيجات وتحسس البشرة."
                  },
                  {
                    q: "كيف يمكنني تقديم طلب شراء أو تعديل بيانات التوصيل؟",
                    a: "يمكنك تقديم طلب الشراء ببساطة تامة من خلال التحدث مباشرة مع مستشارتنا الذكية سارة المتاحة في الزاوية اليمنى السفلية للموقع. ستجيب سارة على استفساراتك وتسجل معلومات التوصيل (الاسم، الهاتف والعنوان) وتدرجها في نظام الشحن تلقائياً دون تعقيد."
                  }
                ].map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`rounded-sm border ${themeBorder} ${themeBgCard} transition-all duration-300 overflow-hidden`}
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-5 py-4 flex items-center justify-between font-display font-bold text-sm sm:text-base text-right cursor-pointer text-[#2C3E2E] dark:text-[#FAF9F5] hover:text-[#C18D5D]"
                      >
                        <span>{faq.q}</span>
                        <span className={`text-[#C18D5D] transition-transform duration-300 text-lg font-bold ${isOpen ? 'rotate-45' : ''}`}>＋</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800"
                          >
                            <p>{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Large Interactive Call to Action Banner */}
            <section className="mt-28 p-8 sm:p-12 rounded-2xl bg-emerald-950 text-[#F9F7F2] relative overflow-hidden text-center space-y-6 shadow-2xl">
              <div className="absolute inset-0 bg-radial-at-t from-[#C18D5D]/20 via-transparent to-transparent pointer-events-none" />
              <div className="max-w-2xl mx-auto space-y-4">
                <span className="text-[#C18D5D] text-xs font-bold tracking-widest uppercase block">طلبية سريعة واستشارة فورية</span>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold leading-tight">جاهزة لترقية روتين جمالكِ؟</h2>
                <p className="text-xs sm:text-sm text-[#E8E4DB]/85 leading-relaxed">
                  تحدثي مع مستشارتنا الذكية سارة الآن. ستساعدكِ على تحديد احتياجات بشرتكِ بكل سرعة، وتسجيل طلب الشراء في ثوانٍ معدودة. الدفع كاش عند التسليم!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const event = new CustomEvent('chat-order', { detail: { customPrompt: "مرحباً سارة، أريد الاستفسار عن صابون التين الشوكي ومساعدتي في إعداد طلب شراء له." } });
                    window.dispatchEvent(event);
                  }}
                  className="px-8 py-4 min-h-[48px] bg-[#C18D5D] hover:bg-white hover:text-emerald-950 text-white font-bold text-xs sm:text-sm rounded-sm transition-all duration-300 shadow-xl inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>ابدئي المحادثة الفورية مع سارة الآن 💬</span>
                </button>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: ORDER TRACKING (SUIVI) */}
        {activeTab === 'suivi' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <ClipboardList className="h-8 w-8 text-[#C18D5D] mx-auto animate-pulse" />
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#2C3E2E] dark:text-[#FAF9F5]">
                تتبع طلبيتكِ الخاصة
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                أدخلي رقم الهاتف الخاص بكِ أو رقم الطلب المرجعي لمتابعة حالة شحنتكِ وموعد التوصيل الدقيق بكل سرية وخصوصية.
              </p>
            </div>

            {/* Tracking Input Bar */}
            <div className={`${themeBgCard} p-6 rounded-sm border ${themeBorder} shadow-md`}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={trackRef}
                    onChange={(e) => setTrackRef(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                    placeholder="أدخلي رقم الهاتف أو الرقم المرجعي للطلب..."
                    className="w-full pr-11 pl-4 py-3 text-sm rounded-sm border border-[#2C3E2E]/15 focus:border-[#C18D5D] bg-[#F9F7F2]/30 dark:bg-[#141E15]/30 focus:outline-none focus:ring-0 text-right"
                  />
                </div>
                <button
                  onClick={() => handleTrackOrder()}
                  disabled={trackLoading}
                  className="px-6 py-3 min-h-[48px] bg-[#2C3E2E] hover:bg-[#C18D5D] text-white text-xs sm:text-sm font-bold rounded-sm transition-all duration-300 disabled:bg-slate-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  {trackLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                  <span>تتبع حالة الشحن</span>
                </button>
              </div>

              {trackError && (
                <p className="text-xs text-rose-500 mt-3 text-right bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-sm border border-rose-100 dark:border-rose-900/35">
                  ⚠️ {trackError}
                </p>
              )}
            </div>

            {/* Dynamic Tracking Status Block */}
            <AnimatePresence mode="wait">
              {trackedOrder && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className={`rounded-sm border ${themeBorder} ${themeBgCard} p-6 sm:p-8 shadow-xl space-y-8`}
                >
                  
                  {/* Tracking Header Details */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200/50 dark:border-slate-800/50 gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">تاريخ التسجيل والمتابعة</span>
                      <span className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 mt-1 justify-end">
                        <Calendar className="h-4 w-4 text-[#C18D5D]" />
                        {trackedOrder.created_at ? new Date(trackedOrder.created_at).toLocaleDateString('ar-TN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "تاريخ مجهول"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#C18D5D] font-bold block uppercase">مرجع الطلبية الرسمي</span>
                      <h3 className="font-display font-extrabold text-lg text-[#2C3E2E] dark:text-[#FAF9F5] mt-1">
                        #{trackedOrder.id}
                      </h3>
                    </div>
                  </div>

                  {/* Stepper Timeline Progress */}
                  <div className="py-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                      
                      {/* Step 1: Registered */}
                      <div className="flex items-start gap-3 relative z-10">
                        <div className="h-8 w-8 rounded-full bg-[#2C3E2E] text-[#F9F7F2] font-bold flex items-center justify-center text-xs border border-[#C18D5D]">✓</div>
                        <div className="text-right">
                          <h4 className="text-xs font-bold text-[#2C3E2E] dark:text-[#FAF9F5]">تم تأكيد الطلب</h4>
                          <p className="text-[10px] text-slate-400 mt-1">تمت مراجعة طلبكِ وإدراجه بنجاح بنظام الشحن.</p>
                        </div>
                      </div>

                      {/* Step 2: Preparing */}
                      <div className="flex items-start gap-3 relative z-10">
                        <div className={`h-8 w-8 rounded-full font-bold flex items-center justify-center text-xs border ${
                          ['En attente', 'Préparation', 'Expédiée', 'En cours de livraison', 'Livrée', 'En préparation'].includes(trackedOrder.statut)
                            ? 'bg-[#2C3E2E] text-white border-[#C18D5D]'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          {['Préparation', 'Expédiée', 'En cours de livraison', 'Livrée', 'En préparation'].includes(trackedOrder.statut) ? "✓" : "2"}
                        </div>
                        <div className="text-right">
                          <h4 className="text-xs font-bold text-[#2C3E2E] dark:text-[#FAF9F5]">التجهيز والتوضيب</h4>
                          <p className="text-[10px] text-slate-400 mt-1">نقوم بصب وتغليف طلبيتكِ بعناية من ورشتنا بالمهدية.</p>
                        </div>
                      </div>

                      {/* Step 3: Shipping */}
                      <div className="flex items-start gap-3 relative z-10">
                        <div className={`h-8 w-8 rounded-full font-bold flex items-center justify-center text-xs border ${
                          ['Expédiée', 'En cours de livraison', 'Livrée', 'Expédié'].includes(trackedOrder.statut)
                            ? 'bg-[#2C3E2E] text-white border-[#C18D5D]'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          {['Livrée'].includes(trackedOrder.statut) ? "✓" : "3"}
                        </div>
                        <div className="text-right">
                          <h4 className="text-xs font-bold text-[#2C3E2E] dark:text-[#FAF9F5]">شحن جاري</h4>
                          <p className="text-[10px] text-slate-400 mt-1">الطرد في عهدة المندوب وسيتم الاتصال بكِ هاتفياً.</p>
                        </div>
                      </div>

                      {/* Step 4: Delivered */}
                      <div className="flex items-start gap-3 relative z-10">
                        <div className={`h-8 w-8 rounded-full font-bold flex items-center justify-center text-xs border ${
                          trackedOrder.statut === 'Livrée' || trackedOrder.statut === 'Livré'
                            ? 'bg-emerald-700 text-white border-emerald-500'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          {trackedOrder.statut === 'Livrée' || trackedOrder.statut === 'Livré' ? "✓" : "4"}
                        </div>
                        <div className="text-right">
                          <h4 className="text-xs font-bold text-[#2C3E2E] dark:text-[#FAF9F5]">تم التسليم</h4>
                          <p className="text-[10px] text-slate-400 mt-1">تم تسليم الطرد ودفع القيمة نقداً. نتمنى لكِ تجربة ممتازة!</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Order Items Receipt Summary */}
                  <div className="bg-[#FAF9F5]/30 dark:bg-[#141E15]/30 p-5 rounded-sm space-y-4 border border-dashed border-[#C18D5D]/20 text-right">
                    <h4 className="font-display font-bold text-sm text-[#C18D5D] pb-2 border-b border-emerald-900/10 flex items-center gap-1.5 justify-end">
                      <span>تفاصيل المستحضرات المطلوبة</span>
                      <ShoppingBag className="h-4.5 w-4.5" />
                    </h4>
                    
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {trackedOrder.details_produits || "مستحضرات تجميل طبيعية متنوعة"}
                        </span>
                        <span className="text-slate-400 font-medium">المنتجات :</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">الدفع نقداً عند الاستلام (كاش)</span>
                        <span className="text-slate-400 font-medium">طريقة الدفع :</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right pt-2">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">بيانات العميل المستلم</span>
                      <p className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 justify-end">
                        <span>{trackedOrder.nom_client}</span>
                        <User className="h-4.5 w-4.5 text-slate-400" />
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 justify-end mt-1">
                        <span>{trackedOrder.telephone}</span>
                        <Phone className="h-4 w-4 text-slate-400" />
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">عنوان التوصيل والشحن</span>
                      <p className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 justify-end leading-relaxed">
                        <span>{trackedOrder.adresse}</span>
                        <MapPin className="h-4.5 w-4.5 text-[#C18D5D]" />
                      </p>
                    </div>
                  </div>

                  {/* Contact Sarra / Edit order notice */}
                  <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 text-center sm:text-right leading-relaxed max-w-md">
                      هل ترغبين في تعديل عنوان التوصيل، تغيير المنتجات، أو الاستفسار عن موعد دقيق لوصول المندوب؟ سارة مستشارتنا الذكية هنا لمساعدتكِ فوراً.
                    </p>
                    
                    <button
                      onClick={() => handleAskSarraAboutOrder(trackedOrder.id)}
                      className="px-5 py-2.5 bg-transparent border border-[#C18D5D] hover:bg-[#C18D5D]/10 text-[#C18D5D] text-xs font-bold rounded-sm transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>اسألي سارة عن هذه الطلبية</span>
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* VIEW 3: ADMIN/MERCHANT DASHBOARD */}
        {activeTab === 'admin' && (
          !isAdminAuthenticated ? (
            <Login onLoginSuccess={handleLoginSuccess} isNightMode={isNightMode} />
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-right">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#2C3E2E] dark:text-[#FAF9F5] flex items-center gap-2 flex-row-reverse sm:justify-start">
                    <span>لوحة التحكم وإدارة الطلبات</span>
                    {newOrdersCount > 0 && (
                      <span className="relative flex h-3 w-3 sm:mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                    )}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    سجل المبيعات والطلبيات المسجلة للعملاء تلقائياً بواسطة المستشارة الذكية سارة (IA).
                  </p>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                  <button
                    onClick={handleAdminLogout}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </button>

                  <button
                    onClick={() => {
                      fetchOrders();
                      setNewOrdersCount(0);
                      setAlertMsg({ type: 'success', text: 'تم تحديث ومزامنة سجل الطلبات مباشرة من سوبابيس بنجاح!' });
                      setTimeout(() => setAlertMsg(null), 5000);
                    }}
                    disabled={loadingOrders}
                    className="px-4 py-2.5 bg-[#2C3E2E] hover:bg-[#C18D5D] text-white text-xs font-bold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingOrders ? 'animate-spin' : ''}`} />
                    <span>تحديث السجل</span>
                  </button>
                </div>
              </div>

            {/* Real-time background update notification banner */}
            <AnimatePresence>
              {newOrdersCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/30 dark:border-amber-500/20 p-4 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center text-right shadow-xs gap-3 overflow-hidden"
                >
                  <div className="flex items-center gap-3 flex-row-reverse">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <div className="text-xs space-y-0.5">
                      <span className="text-amber-800 dark:text-amber-300 font-extrabold block">
                        تنبيه: تم رصد طلبيات جديدة!
                      </span>
                      <span className="text-amber-700 dark:text-amber-400/90 font-medium">
                        التقط تحديث الخلفية {newOrdersCount} طلبية جديدة من سارة (الذكاء الاصطناعي). تم تضمينها بنجاح في السجل أدناه.
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setNewOrdersCount(0)}
                    className="px-3 py-1.5 text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-amber-300 rounded-sm font-bold transition-all shrink-0 cursor-pointer self-end sm:self-auto"
                  >
                    تأكيد القراءة ومسح التنبيه
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className={`${themeBgCard} p-6 rounded-sm border ${themeBorder} shadow-sm space-y-2 text-right`}>
                <div className="flex justify-between items-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <div className="p-2 rounded bg-[#C18D5D]/10 text-[#C18D5D]">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">إجمالي طلبات سارة الذكية</span>
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-[#2C3E2E] dark:text-[#FAF9F5]">
                  {orders.length} طلبية
                </h3>
              </div>

              <div className={`${themeBgCard} p-6 rounded-sm border ${themeBorder} shadow-sm space-y-2 text-right`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">محدث فورياً</span>
                  <div className="p-2 rounded bg-[#C18D5D]/10 text-[#C18D5D]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">قيمة المبيعات الإجمالية التقديرية</span>
                <h3 className="font-display font-extrabold text-2xl tracking-tight text-[#C18D5D]">
                  {totalRevenue.toFixed(3)} د.ت
                </h3>
              </div>

              <div className={`${themeBgCard} p-6 rounded-sm border ${themeBorder} shadow-sm space-y-2 text-right`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-400">شحن وطني</span>
                  <div className="p-2 rounded bg-[#C18D5D]/10 text-[#C18D5D]">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">مناطق الشحن الحالية للتوصيل</span>
                <h3 className="font-display font-extrabold text-base tracking-tight text-[#2C3E2E] dark:text-[#FAF9F5] leading-snug">
                  كامل التراب التونسي 🇹🇳
                </h3>
              </div>

            </div>

            {/* Orders Database Table */}
            <div className={`${themeBgCard} rounded-sm border ${themeBorder} shadow-lg overflow-hidden`}>
              <div className="p-5 border-b border-slate-200/50 dark:border-slate-800/50 bg-[#FAF9F5]/40 dark:bg-[#141E15]/40 text-right flex justify-between items-center">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <span className="text-[11px] text-slate-400 uppercase font-bold">سجل الطلبيات والمبيعات</span>
                  {newOrdersCount > 0 && (
                    <span className="bg-[#C18D5D]/15 text-[#C18D5D] px-2 py-0.5 rounded-full text-[10px] font-extrabold animate-pulse">
                      {newOrdersCount} جديد
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                  <span>مزامنة مباشرة مع سوبابيس وقاعدة البيانات</span>
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              </div>

              {loadingOrders && orders.length === 0 ? (
                <div className="text-center py-16">
                  <RefreshCw className="h-8 w-8 text-[#C18D5D] mx-auto animate-spin mb-3" />
                  <p className="text-xs text-slate-500">جاري تحميل ومزامنة الطلبيات الفاخرة...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ClipboardList className="h-10 w-10 text-slate-300 mx-auto" />
                  <h4 className="font-display font-bold text-sm">لا توجد طلبات مسجلة حالياً</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    قم بتجربة طلب منتج عبر سارة (أيقونة الدردشة في الركن الأيمن السفلي) لرؤية طلبيتك تسجل في هذه اللوحة تلقائياً في الوقت الحقيقي!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[#FAF9F5]/70 dark:bg-[#141E15]/60 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200/50 dark:border-slate-800/50">
                        <th className="p-4">المرجع / التاريخ</th>
                        <th className="p-4">الاسم واللقب للعميل</th>
                        <th className="p-4">رقم الهاتف / العنوان</th>
                        <th className="p-4">المنتجات المطلوبة والكمية</th>
                        <th className="p-4">حالة التوصيل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {orders.map((o) => (
                        <tr 
                          key={o.id} 
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="p-4 whitespace-nowrap">
                            <span className="font-bold text-[#C18D5D] block">#{o.id}</span>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {o.created_at ? new Date(o.created_at).toLocaleString('ar-TN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : "تاريخ مجهول"}
                            </span>
                          </td>
                          <td className="p-4 font-bold whitespace-nowrap">{o.nom_client}</td>
                          <td className="p-4">
                            <span className="block font-medium">{o.telephone}</span>
                            <span className="text-[11px] text-slate-400 block mt-0.5 max-w-xs truncate" title={o.adresse}>{o.adresse}</span>
                          </td>
                          <td className="p-4 font-semibold text-slate-600 dark:text-slate-300 max-w-xs truncate" title={o.details_produits}>
                            {o.details_produits}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <select
                              value={o.statut === 'Livré' ? 'Livrée' : o.statut}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className={`px-2 py-1 text-xs font-bold rounded-sm border cursor-pointer focus:outline-none focus:ring-0 ${
                                ['Livrée', 'Livré', 'تم التسليم'].includes(o.statut)
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 text-right'
                                  : ['Expédiée', 'En cours de livraison', 'Expédié'].includes(o.statut)
                                  ? 'bg-blue-100 text-blue-800 dark:bg-[#152335] dark:text-blue-300 border-blue-300 text-right'
                                  : 'bg-amber-100 text-amber-800 dark:bg-[#2e2311] dark:text-amber-300 border-amber-300 text-right'
                              }`}
                            >
                              <option value="En attente" className="bg-white dark:bg-[#1D2A1E]">قيد الانتظار (En attente)</option>
                              <option value="En cours de livraison" className="bg-white dark:bg-[#1D2A1E]">جاري الشحن (En cours)</option>
                              <option value="Livrée" className="bg-white dark:bg-[#1D2A1E]">تم التسليم (Livré)</option>
                            </select>
                            <span className="block text-[9px] text-slate-400 mt-1 font-semibold uppercase">كاش عند التسليم 🚚</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
      )}

      </main>

      {/* Exquisite Product Details Modal Overlay Sheet */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className={`${themeBgCard} text-right rounded-lg overflow-hidden border ${themeBorder} w-full max-w-2xl shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-y-visible`}
            >
              
              {/* Close Button absolute top */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 left-4 z-10 p-2 rounded-full bg-[#2C3E2E] text-white hover:bg-[#C18D5D] transition-colors shadow-lg cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Product Card Image portion - Styled with rounded corners, border, and shadow */}
              <div className="w-full md:w-1/2 p-4 md:p-6 flex items-center justify-center bg-[#FAF9F5] dark:bg-slate-900/30">
                <div className="h-64 md:h-full w-full min-h-[250px] relative overflow-hidden rounded-2xl shadow-lg border border-[#E8E4DB]/80 dark:border-slate-800/80">
                  <div className="absolute top-4 right-4 z-10 bg-[#C18D5D] text-white text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md shadow-sm">
                    مكونات طبيعية نقية 🌿
                  </div>
                  <LazyImage 
                    src={selectedProduct.image_url} 
                    alt={selectedProduct.nom} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5" />
                </div>
              </div>

              {/* Product Text/Specs details portion */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-[#C18D5D] font-bold uppercase block tracking-wider">مستحضر تجميل طبيعي فاخر</span>
                    <h3 className="font-display font-extrabold text-xl text-[#2C3E2E] dark:text-[#FAF9F5] mt-1 leading-tight">
                      {selectedProduct.nom}
                    </h3>
                    <p className="font-display font-extrabold text-base text-[#C18D5D] mt-2">
                      {selectedProduct.prix.toFixed(3)} د.ت
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  <div className="space-y-3 pt-2">
                    {/* Ingredients list mapping */}
                    <div>
                      <h4 className="text-xs font-bold text-[#2C3E2E] dark:text-[#FAF9F5] mb-1.5 flex items-center gap-1 justify-end">
                        <span>المكونات الثمينة النشطة :</span>
                        <Leaf className="h-3.5 w-3.5 text-emerald-600" />
                      </h4>
                      <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-none pr-0">
                        {getProductDetails(selectedProduct.nom).ingredients.map((ing, i) => (
                          <li key={i} className="flex items-center gap-1.5 justify-end">
                            <span>{ing}</span>
                            <span className="text-[#C18D5D] font-bold text-xs">✦</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Usage Instructions mapping */}
                    <div>
                      <h4 className="text-xs font-bold text-[#2C3E2E] dark:text-[#FAF9F5] mb-1 flex items-center gap-1 justify-end">
                        <span>نصائح وطريقة الاستخدام :</span>
                        <Award className="h-3.5 w-3.5 text-[#C18D5D]" />
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {getProductDetails(selectedProduct.nom).conseils}
                      </p>
                    </div>

                    {/* Skin benefits mapping */}
                    <div>
                      <h4 className="text-xs font-bold text-[#2C3E2E] dark:text-[#FAF9F5] mb-1 flex items-center gap-1 justify-end">
                        <span>فوائد ومميزات المستحضر :</span>
                        <Sparkles className="h-3.5 w-3.5 text-[#C18D5D] animate-pulse" />
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {getProductDetails(selectedProduct.nom).bienfaits}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom modal actions */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">{getProductDetails(selectedProduct.nom).certification}</span>
                    <span className="text-slate-400">الشهادة والجودة :</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="px-4 py-2.5 min-h-[48px] border border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-sm transition-all cursor-pointer flex items-center justify-center"
                      >
                        إغلاق النافذة
                      </button>
                      
                      <button
                        onClick={() => {
                          handleOrderClick(selectedProduct.nom);
                          setSelectedProduct(null);
                        }}
                        className="px-4 py-2.5 min-h-[48px] bg-[#C18D5D] hover:bg-[#b07d50] text-white text-xs font-semibold rounded-sm transition-all cursor-pointer shadow-xs flex items-center justify-center text-center"
                      >
                        طلب سريع عبر سارة
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full py-2.5 min-h-[48px] bg-[#2C3E2E] hover:bg-[#C18D5D] text-white text-xs font-bold rounded-sm transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="h-4 w-4 text-amber-400" />
                      <span>أضف هذا المنتج للسلة 🌸</span>
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Shopping Cart Drawer Overlay Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            {/* Panel */}
            <div className="absolute inset-y-0 left-0 max-w-full flex">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`w-screen max-w-md ${themeBgCard} border-r ${themeBorder} shadow-2xl flex flex-col`}
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-[#2C3E2E] flex items-center justify-center text-[#C18D5D]">
                      <ShoppingBag className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-base text-[#2C3E2E] dark:text-[#FAF9F5]">سلة المشتريات</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">مستحضراتكِ العضوية المفضلة</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                      <button
                        onClick={handleClearCart}
                        className="text-[10px] px-2 py-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded border border-rose-200/40 font-bold transition-all cursor-pointer"
                      >
                        إفراغ السلة
                      </button>
                    )}
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-[#E8E4DB]/25 flex items-center justify-center text-[#C18D5D]">
                        <ShoppingBag className="h-8 w-8 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-[#2C3E2E] dark:text-[#FAF9F5]">سلة التسوق فارغة حالياً</h4>
                        <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                          تصفحي مجموعتنا الفاخرة من الصابون الطبيعي والكريمات العضوية وأضيفي ما يسعد بشرتكِ اليوم! 🌸
                        </p>
                      </div>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-5 py-2 bg-[#2C3E2E] hover:bg-[#C18D5D] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                      >
                        العودة للمتجر
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => {
                        const cardTheme = getProductTheme(item.nom);
                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border ${cardTheme.border} ${cardTheme.bg} flex gap-3 items-center justify-between shadow-2xs`}
                          >
                            {/* Product Image */}
                            <div className="h-16 w-16 rounded-lg overflow-hidden border border-slate-200 bg-white flex-shrink-0">
                              <img
                                src={item.image_url}
                                alt={item.nom}
                                className="h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Product details and actions */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-[#2C3E2E] dark:text-[#FAF9F5] truncate mb-0.5 text-right">
                                {item.nom}
                              </h4>
                              <p className="text-[11px] text-[#C18D5D] font-black text-right">
                                {item.prix.toFixed(3)} د.ت
                              </p>

                              {/* Quantities controller row */}
                              <div className="flex items-center gap-2 mt-1.5">
                                <button
                                  onClick={() => handleUpdateCartQuantity(item.id, item.quantity - 1)}
                                  className="p-1 rounded bg-[#FAF9F5] dark:bg-[#1D2A1E] border border-slate-200/50 hover:border-[#C18D5D] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-xs font-bold w-6 text-center text-slate-800 dark:text-slate-200">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateCartQuantity(item.id, item.quantity + 1)}
                                  className="p-1 rounded bg-[#FAF9F5] dark:bg-[#1D2A1E] border border-slate-200/50 hover:border-[#C18D5D] text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            {/* Item total and delete */}
                            <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                              <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                                title="إزالة من السلة"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 font-mono">
                                {(item.prix * item.quantity).toFixed(3)} د.ت
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Drawer Footer summary and checkout */}
                {cart.length > 0 && (
                  <div className={`p-5 border-t border-slate-200/60 dark:border-slate-800/60 ${themeBgCard} space-y-4`}>
                    <div className="space-y-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between">
                        <span>المجموع الفرعي للمنتجات :</span>
                        <span className="text-slate-800 dark:text-slate-200 font-mono">
                          {cart.reduce((sum, item) => sum + item.prix * item.quantity, 0).toFixed(3)} د.ت
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>تكلفة التوصيل في تونس :</span>
                        <span className="font-mono">
                          {cart.reduce((sum, item) => sum + item.prix * item.quantity, 0) >= 60 ? (
                            <span className="text-emerald-600 font-bold">مجاني 🚚</span>
                          ) : (
                            <span className="text-slate-800 dark:text-slate-200">7.000 د.ت</span>
                          )}
                        </span>
                      </div>

                      {cart.reduce((sum, item) => sum + item.prix * item.quantity, 0) < 60 && (
                        <div className="text-[10px] text-[#C18D5D] bg-amber-500/10 p-2 rounded border border-amber-500/15 text-center leading-normal">
                          💡 أضيفي منتجات بقيمة <b>{(60 - cart.reduce((sum, item) => sum + item.prix * item.quantity, 0)).toFixed(3)} د.ت</b> إضافية للحصول على <b>شحن مجاني تماماً!</b>
                        </div>
                      )}

                      <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between text-sm text-[#2C3E2E] dark:text-[#FAF9F5]">
                        <span className="font-extrabold">المجموع الكلي للدفع :</span>
                        <span className="font-black text-[#C18D5D] font-mono">
                          {(
                            cart.reduce((sum, item) => sum + item.prix * item.quantity, 0) +
                            (cart.reduce((sum, item) => sum + item.prix * item.quantity, 0) >= 60 ? 0 : 7)
                          ).toFixed(3)}{' '}
                          د.ت
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={handleFinalizeOrderViaChat}
                        className="w-full py-3 min-h-[48px] bg-[#C18D5D] hover:bg-[#b07d50] text-[#F9F7F2] text-xs font-bold rounded-md shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 animate-pulse"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>إتمام الطلب عبر الدردشة مع سارة 🌸</span>
                      </button>
                      
                      <p className="text-[9px] text-center text-slate-400 font-semibold leading-normal">
                        🔒 الدفع نقداً عند الاستلام بعد فحص طردكِ بكل سرية وراحة بال.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Action AI Advisor Chatbot Bubble */}
      <Chatbot isNightMode={isNightMode} />

      {/* Main Footer Block */}
      <footer className={`border-t ${themeBorder} ${themeBgCard} py-12 transition-colors duration-500 mt-28`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="flex items-center justify-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#2C3E2E] flex items-center justify-center text-[#C18D5D]">
              <Leaf className="h-4.5 w-4.5" />
            </div>
            <span className="font-display font-extrabold text-base text-[#C18D5D]">بيور غلو MH — المهدية</span>
          </div>
          
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            مستحضرات تجميل وصابون طبيعي مصنوع على البارد وعسل مهدى من خيرات تونس العائلية. نلتزم بنقاء المكونات الطبيعية وحفظ جودة الحرف التونسية التقليدية. شحن وتوصيل لكافة ولايات تونس والدفع عند الاستلام.
          </p>

          <div className="flex justify-center gap-8 text-[11px] text-slate-400 font-bold uppercase">
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-[#C18D5D]" /> توصيل لجميع الولايات (7 د.ت أو مجاني)</span>
            <span className="flex items-center gap-1.5"><ShoppingBag className="h-3.5 w-3.5 text-[#C18D5D]" /> الدفع نقداً عند الاستلام</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#C18D5D]" /> مكونات طبيعية 100%</span>
          </div>

          <div className="pt-6 border-t border-slate-200/40 dark:border-slate-800/40 text-[10px] text-slate-400">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} بيور غلو MH. فخر الصناعة التقليدية التونسية 🇹🇳</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
