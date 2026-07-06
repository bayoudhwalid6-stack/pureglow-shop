import { Product, TrackingInfo } from "./types";

// Enhanced Product interface with Arabic support
interface ProductWithArabic extends Product {
  nameAr: string;
  descriptionAr: string;
  categoryLabelAr: string;
  benefitsAr: string[];
  ingredientsAr: string[];
  howToUseAr: string;
}

export const PRODUCTS: ProductWithArabic[] = [
  {
    id: "savon-reglisse",
    name: "Savon à la Réglisse",
    nameAr: "صابون عرق السوس وبودرة الأرز للتفتيح",
    category: "savon",
    categoryLabel: "Savons Artisanaux",
    categoryLabelAr: "صابون يدوي تقليدي",
    price: 15.0,
    rating: 4.9,
    reviewsCount: 148,
    image: "/licorice-soap-100g-15dt.jpeg",
    description: "Un soin éclaircissant d'exception, formulé à la réglisse et à la poudre de riz pour harmoniser le teint et atténuer les taches pigmentaires. Saponifié à froid selon les méthodes ancestrales de Mahdia.",
    descriptionAr: "صابون التفتيح الفائق بخلاصة عرق السوس وبودرة الأرز للقضاء على البقع الداكنة والتصبغات ومنحك إشراقة مخملية. مصنوع يدوياً بتقنية الصب على البارد وفق التقاليد العريقة للمهدية.",
    benefits: [
      "Hydratation intense et naturelle",
      "Riche en vitamines A, D, E et K antioxydantes",
      "Formule hypoallergénique adaptée aux peaux les plus sensibles",
      "Éclaircit le teint et atténue les taches pigmentaires"
    ],
    benefitsAr: [
      "ترطيب عميق وطبيعي للبشرة",
      "غني بالفيتامينات A, D, E, K المضادة للأكسدة",
      "تركيبة مضادة للحساسية مناسبة للبشرة الحساسة جداً",
      "يفتح لون البشرة ويخفي البقع الداكنة والتصبغات"
    ],
    ingredients: [
      "Extrait pur de racine de réglisse (Glabridine)",
      "Poudre de riz extra-fine",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile d'amande douce vierge",
      "Beurre de karité brut"
    ],
    ingredientsAr: [
      "خلاصة جذور عرق السوس النقيّة",
      "بودرة الأرز التونسية فائقة النعومة",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت اللوز الحلو المغذي للبشرة",
      "زبدة الشيا الخام غير المكررة"
    ],
    howToUse: "Faire mousser sur peau humide, masser délicatement sur le visage ou le corps, puis rincer abondamment à l'eau tiède. Conserver sur un porte-savon sec pour prolonger sa durée de vie.",
    howToUseAr: "يستعمل يومياً صباحاً ومساءً على وجه مبلل. تترك الرغوة الغنية على البشرة لمدة دقيقة واحدة قبل الشطف بالماء الدافئ لتحقيق أفضل نتائج التفتيح.",
    stock: 25,
    weight: "100g",
    isPopular: true
  },
  {
    id: "savon-louban-dakar",
    name: "Savon au Louban Dakar 150g",
    nameAr: "صابون لبان الذكر الفاخر",
    category: "savon",
    categoryLabel: "Savons Artisanaux",
    categoryLabelAr: "صابون يدوي تقليدي",
    price: 18.0,
    rating: 5.0,
    reviewsCount: 215,
    image: "/louban-soap-150g-18dt.jpeg",
    description: "Un soin anti-âge impérial saponifié à froid au précieux Louban Dakar (Oliban) pour raffermir, unifier et lisser le grain de peau. Trésor de la médecine traditionnelle arabe.",
    descriptionAr: "إكسير الشباب الأبدي بتركيبة ملكية غنية بلبان الذكر الفاخر لشد البشرة وتوحيد لونها ومكافحة التجاعيد. كنز من الطب العربي التقليدي.",
    benefits: [
      "Effet tenseur et anti-âge naturel ultra-puissant",
      "Régénère les cellules cutanées en profondeur",
      "Unifie le teint et raffermit l'épiderme",
      "Parfum boisé et spirituel apaisant"
    ],
    benefitsAr: [
      "مفعول شد ومكافحة الشيخوخة طبيعي قوي جداً",
      "يجدد خلايا البشرة بعمق",
      "يوحد لون البشرة ويشد الجلد",
      "رائحة خشبية مهدئة للروح"
    ],
    ingredients: [
      "Résine pure de Louban Dakar (Oliban mâle)",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile d'argan biologique pressée à froid",
      "Huile de coco brute",
      "Huile de ricin adoucissante"
    ],
    ingredientsAr: [
      "صمغ لبان الذكر النقي (اللبان الذكر الأصلي)",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت أرغان بيولوجي معصور على البارد",
      "زيت جوز الهند الخام المغذي",
      "زيت الخروع المرطب والمنعم"
    ],
    howToUse: "Faire mousser délicatement sur le visage ou le corps humide. Effectuer de légers mouvements circulaires pour stimuler l'effet anti-âge et raffermissant. Rincer abondamment à l'eau claire.",
    howToUseAr: "يُرغى الصابون بلطف على الوجه أو الجسم المبلل، مع التدليك الدائري الخفيف لتنشيط الخلايا وشد البشرة، ثم يشطف جيداً بالماء النقي.",
    stock: 18,
    weight: "150g",
    isPopular: true
  },
  {
    id: "savon-duo-reglisse-louban",
    name: "Savon Duo Réglisse & Louban",
    nameAr: "صابون عرق السوس ولبان الذكر الثنائي",
    category: "savon",
    categoryLabel: "Savons Artisanaux",
    categoryLabelAr: "صابون يدوي تقليدي",
    price: 15.0,
    rating: 4.8,
    reviewsCount: 96,
    image: "/licorice-louban-soap-15dt.jpeg",
    description: "L'alliance parfaite de la réglisse illuminatrice et du louban dakar raffermissant pour une double action jeunesse et éclat. Synergie des meilleurs ingrédients de Mahdia.",
    descriptionAr: "ثنائي الجمال الفاخر الذي يجمع بين قوة عرق السوس في تفتيح البشرة ولبان الذكر في شد الجلد ومقاومة علامات التقدم في السن. تآزر أفضل مكونات المهدية.",
    benefits: [
      "Double action : éclaircissant + raffermissant",
      "Unifie le teint tout en retendant l'ovale du visage",
      "Combat les signes de vieillissement",
      "Texture crémeuse et onctueuse"
    ],
    benefitsAr: [
      "مفعول مزدوج: تفتيح + شد",
      "يوحد لون البشرة مع شد الوجه",
      "يحارب علامات التقدم في السن",
      "قوام كريمي وناعم"
    ],
    ingredients: [
      "Extrait de racine de réglisse pure",
      "Résine de Louban Dakar infusée",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile d'amande douce",
      "Beurre de karité"
    ],
    ingredientsAr: [
      "خلاصة عرق السوس المفتحة",
      "مستخلص لبان الذكر لشد البشرة",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت اللوز الحلو",
      "زبدة الشيا المغذية"
    ],
    howToUse: "Appliquer matin ou soir sur visage humide en effectuant de doux mouvements circulaires. Laisser poser 30 secondes, puis rincer à l'eau claire.",
    howToUseAr: "يوضع على بشرة رطبة مع تدليك خفيف بحركات دائرية. يترك لمدة نصف دقيقة لتتغلغل المكونات ثم يشطف بالماء.",
    stock: 22,
    weight: "100g",
    isPopular: true
  },
  {
    id: "savon-avoine-miel",
    name: "Savon Flocons d'Avoine & Miel",
    nameAr: "صابون الشوفان والعسل المهدئ",
    category: "savon",
    categoryLabel: "Savons Artisanaux",
    categoryLabelAr: "صابون يدوي تقليدي",
    price: 12.0,
    rating: 4.7,
    reviewsCount: 82,
    image: "/oatmeal-honey-soap-12dt.jpeg",
    description: "Un véritable havre de douceur aux flocons d'avoine apaisants et au miel pur pour réparer et hydrater les peaux délicates. Idéal pour les peaux sèches et irritées.",
    descriptionAr: "صابون الشوفان والعسل الطبيعي المهدئ للبشرة الحساسة والجافة، يغذي بعمق، يهدئ التهيج، ويمنح رطوبة فائقة ونعومة مخملية.",
    benefits: [
      "Apaise les irritations et rougeurs",
      "Hydrate intensément les peaux sèches",
      "Exfoliation douce et naturelle",
      "Répare la barrière cutanée"
    ],
    benefitsAr: [
      "يهدئ الاحمرار والتهيج",
      "يرطب البشرة الجافة بعمق",
      "تقشير لطيف وطبيعي",
      "يصلح حاجز البشرة الطبيعي"
    ],
    ingredients: [
      "Miel sauvage tunisien pur",
      "Flocons d'avoine biologique finement moulus",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile de coco brute",
      "Huile d'amande douce apaisante"
    ],
    ingredientsAr: [
      "عسل جبلي طبيعي حر",
      "شوفان عضوي مطحون ناعم",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت جوز هند خام",
      "زيت اللوز الحلو الملطف"
    ],
    howToUse: "Utiliser au quotidien pour la toilette du visage et du corps. Masser doucement pour bénéficier de l'action calmante et nutritive du miel et de l'avoine.",
    howToUseAr: "يستعمل يومياً للوجه والجسم. يدلك بلطف لتنشيط البشرة والاستفادة من التأثير المرطب والمهدئ للعسل والشوفان.",
    stock: 30,
    weight: "100g"
  },
  {
    id: "savon-reglisse-nigelle",
    name: "Savon Réglisse & Graine Noire / Nigelle",
    nameAr: "صابون عرق السوس والحبة السوداء المنقي",
    category: "savon",
    categoryLabel: "Savons Artisanaux",
    categoryLabelAr: "صابون يدوي تقليدي",
    price: 15.0,
    rating: 4.8,
    reviewsCount: 112,
    image: "/licorice-nigella-soap-15dt.jpeg",
    description: "Une synergie purifiante qui combine l'action anti-taches de la réglisse et les vertus antibactériennes de l'huile de nigelle. Parfait pour les peaux à imperfections.",
    descriptionAr: "صابون منقّ ومطهر يجمع بين خصائص عرق السوس المفتحة وفوائد الحبة السوداء المعقمة لتنقية البشرة ومحاربة الشوائب وحب الشباب.",
    benefits: [
      "Purifie les pores en profondeur",
      "Combat l'acné et les imperfections",
      "Atténue les cicatrices et taches résiduelles",
      "Régule la production de sébum"
    ],
    benefitsAr: [
      "ينقي المسام بعمق",
      "يحارب حب الشباب والعيوب",
      "يخفي آثار البثور والبقع",
      "ينظم إفرازات الدهون"
    ],
    ingredients: [
      "Extrait pur de racine de réglisse",
      "Huile de nigelle de première pression (Habba Sawda)",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Argile verte purifiante",
      "Huile essentielle de tea tree"
    ],
    ingredientsAr: [
      "خلاصة جذور عرق السوس",
      "زيت الحبة السوداء الأصلي المعصور على البارد",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "طين أخضر منقي للبشرة",
      "زيت شجرة الشاي الأساسي المطهر"
    ],
    howToUse: "Faire mousser sur visage humide en insistant sur la zone T (front, nez, menton) sujette aux imperfections. Rincer à l'eau fraîche.",
    howToUseAr: "يُرغى على وجه رطب مع التركيز على المناطق المعرضة للبثور والدهون، ثم يشطف بماء فاتر ثم بارد لغلق المسام.",
    stock: 20,
    weight: "100g"
  },
  {
    id: "savon-cafe-amidon-curcuma",
    name: "Savon Café, Amidon & Curcuma",
    nameAr: "صابون القهوة والنشاء والكركم المنشط",
    category: "savon",
    categoryLabel: "Savons Artisanaux",
    categoryLabelAr: "صابون يدوي تقليدي",
    price: 15.0,
    rating: 4.6,
    reviewsCount: 64,
    image: "/coffee-starch-turmeric-soap-15dt.jpeg",
    description: "Un exfoliant et antioxydant remarquable au marc de café tonifiant, à l'amidon lissant et au curcuma illuminateur. Réveille l'éclat naturel de votre peau.",
    descriptionAr: "تركيبة فريدة مقشرة ومفتحة تجمع بين تفل القهوة المنشط، النشاء لشد المسام، والكركم لإعادة النضارة والإشراق الطبيعي للبشرة.",
    benefits: [
      "Exfoliation énergique et naturelle",
      "Améliore la circulation sanguine",
      "Lisse et resserre les pores",
      "Illumine le teint terne"
    ],
    benefitsAr: [
      "تقشير نشيط وطبيعي",
      "يحسن الدورة الدموية",
      "يصقل ويسد المسام",
      "يمنح إشراقة للبشرة الباهتة"
    ],
    ingredients: [
      "Marc de café de haute qualité",
      "Amidon de maïs (amidon lissant)",
      "Extrait de curcuma illuminateur",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Beurre de karité"
    ],
    ingredientsAr: [
      "تفل قهوة طبيعي ناعم",
      "نشا الذرة المنعم للمسام",
      "مسحوق الكركم الصافي المفتح",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زبدة الشيا المرطبة"
    ],
    howToUse: "Utiliser 2 à 3 fois par semaine comme exfoliant corporel et visage sous la douche. Masser par mouvements circulaires doux puis rincer.",
    howToUseAr: "يستعمل مرتين إلى 3 مرات أسبوعياً كقناع ومقشر لطيف أثناء الاستحمام. يدلك بحركات دائرية ثم يشطف بالماء.",
    stock: 15,
    weight: "100g"
  },
  {
    id: "savon-sidr-jujubier",
    name: "Savon au Sidr / Jujubier",
    nameAr: "صابون السدر الطبيعي المطهر",
    category: "savon",
    categoryLabel: "Savons Artisanaux",
    categoryLabelAr: "صابون يدوي تقليدي",
    price: 15.0,
    rating: 4.9,
    reviewsCount: 128,
    image: "/sidr-soap-15dt.jpeg",
    description: "Un nettoyant ancestral d'exception aux feuilles de Sidr (jujubier) pour purifier en profondeur, calmer les peaux sensibles et unifier le teint. Secret de beauté des femmes de Mahdia.",
    descriptionAr: "صابون السدر التقليدي الفاخر لتنظيف البشرة وتطهيرها بعمق، يهدئ الحكة والالتهابات، ويضفي نعومة ونقاء طبيعياً لا يضاهى. سر جمال نساء المهدية.",
    benefits: [
      "Purifie et désinfecte en douceur",
      "Apaise les démangeaisons et irritations",
      "Régule le sébum naturellement",
      "Convient aux peaux acnéiques"
    ],
    benefitsAr: [
      "ينقي ويعقم بلطف",
      "يهدئ الحكة والتهيج",
      "ينظم الدهون طبيعياً",
      "مناسب للبشرة المعرضة لحب الشباب"
    ],
    ingredients: [
      "Poudre de feuilles de Sidr (Jujubier)",
      "Huile d'olive extra-vierge saponifiée à froid",
      "Huile de coco",
      "Huile de amande douce",
      "Argile blanche (Kaolin)"
    ],
    ingredientsAr: [
      "مسحوق أوراق السدر (النبق) الطبيعي",
      "زيت زيتون بكر ممتاز مصبن على البارد",
      "زيت جوز الهند النقي",
      "زيت اللوز الحلو",
      "الطين الأبيض اللطيف (الكاولين)"
    ],
    howToUse: "Idéal pour laver les peaux sensibles ou sujettes aux irritations, démangeaisons ou acné. Faire mousser sur la peau, laisser poser quelques secondes, puis rincer.",
    howToUseAr: "يُرغى على وجه أو جسم مبلل، يترك لبضع ثوانٍ لتستفيد البشرة من خصائص السدر المهدئة والمطهرة، ثم يشطف جيداً.",
    stock: 25,
    weight: "100g",
    isPopular: true
  }
];

export const MOCK_TRACKING_DATA: Record<string, TrackingInfo> = {
  "MH-2026-001": {
    number: "MH-2026-001",
    senderName: "Atelier Pure Glow MH",
    recipientName: "Amine Ben Ali",
    destination: "Tunis, La Marsa",
    estimatedDelivery: "Demain, entre 10:00 et 14:00",
    carrier: "Aramex Express",
    steps: [
      {
        status: "En cours de livraison",
        description: "Le livreur Aramex est en route vers votre domicile à La Marsa.",
        date: "26 Juin 2026, 11:30",
        location: "Tunis, Centre de Tri",
        completed: true,
        isCurrent: true
      },
      {
        status: "Arrivé au centre régional",
        description: "Colis trié et prêt pour l'intégration dans la tournée locale.",
        date: "26 Juin 2026, 07:15",
        location: "Tunis, Hub Aramex",
        completed: true,
        isCurrent: false
      },
      {
        status: "Expédié de Mahdia",
        description: "Le camion de transport régional a quitté Mahdia vers le hub de Tunis.",
        date: "25 Juin 2026, 17:00",
        location: "Mahdia, Agence Aramex",
        completed: true,
        isCurrent: false
      },
      {
        status: "Préparé avec soin",
        description: "Votre commande de savons et sérums a été mise sous pli écologique.",
        date: "25 Juin 2026, 10:30",
        location: "Atelier Pure Glow MH",
        completed: true,
        isCurrent: false
      }
    ]
  },
  "MH-2026-002": {
    number: "MH-2026-002",
    senderName: "Atelier Pure Glow MH",
    recipientName: "Yasmine Mansour",
    destination: "Sousse, Kantaoui",
    estimatedDelivery: "Livré hier",
    carrier: "First Delivery Tunisia",
    steps: [
      {
        status: "Colis Livré",
        description: "Le colis a été remis en mains propres contre signature. Merci de votre confiance !",
        date: "25 Juin 2026, 14:20",
        location: "Sousse, Kantaoui",
        completed: true,
        isCurrent: true
      },
      {
        status: "En cours de livraison",
        description: "Colis pris en charge par le livreur local de Sousse.",
        date: "25 Juin 2026, 09:00",
        location: "Sousse, Centre régional",
        completed: true,
        isCurrent: false
      },
      {
        status: "Prise en charge transporteur",
        description: "Le colis a été récupéré à notre atelier par le coursier.",
        date: "24 Juin 2026, 15:45",
        location: "Mahdia, Atelier",
        completed: true,
        isCurrent: false
      }
    ]
  },
  "MH-2026-003": {
    number: "MH-2026-003",
    senderName: "Atelier Pure Glow MH",
    recipientName: "Khaled Trabelsi",
    destination: "Sfax, Route de Téniour",
    estimatedDelivery: "Lundi, 29 Juin 2026",
    carrier: "Express Courier Tunisia",
    steps: [
      {
        status: "Commande Reçue",
        description: "La commande a été validée par notre atelier. Nous préparons la récolte et la saponification.",
        date: "26 Juin 2026, 14:00",
        location: "Atelier Pure Glow MH",
        completed: true,
        isCurrent: true
      }
    ]
  }
};
