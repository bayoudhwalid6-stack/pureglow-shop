import { createClient } from '@supabase/supabase-js';

// Client-side Vite environment variables only
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Initialize Supabase Client if keys are present
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Mock database for offline/pre-config fallback
export interface Produit {
  id: number;
  nom: string;
  description: string;
  prix: number;
  image_url: string;
}

export interface Commande {
  id: number;
  nom_client: string;
  telephone: string;
  adresse: string;
  details_produits: string;
  statut: string;
  created_at?: string;
}

// High-quality seed data for fallback
export const mockProduits: Produit[] = [
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


// Helper database getters and setters with fallback
export async function getProduits(): Promise<Produit[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('produits').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Produit[];
      }
    } catch (e) {
      console.warn('Erreur lors de la récupération des produits Supabase, utilisation du mock:', e);
    }
  }
  return mockProduits;
}

export async function addCommande(commande: Omit<Commande, 'id' | 'statut' | 'created_at'>): Promise<Commande> {
  const nouvelle: Commande = {
    id: Math.floor(Math.random() * 1000000),
    statut: 'En attente',
    created_at: new Date().toISOString(),
    ...commande
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('commandes')
        .insert([{
          nom_client: commande.nom_client,
          telephone: commande.telephone,
          adresse: commande.adresse,
          details_produits: commande.details_produits,
          statut: 'En attente'
        }])
        .select();
      if (!error && data && data[0]) {
        return data[0] as Commande;
      } else if (error) {
        console.error('Erreur Supabase lors de l\'enregistrement de la commande:', error);
      }
    } catch (e) {
      console.error('Exception lors de l\'enregistrement de la commande:', e);
    }
  }

  // Fallback to localStorage if in-browser
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biocosmetique_commandes');
    const list: Commande[] = local ? JSON.parse(local) : [];
    list.push(nouvelle);
    localStorage.setItem('biocosmetique_commandes', JSON.stringify(list));
  }
  return nouvelle;
}

export async function getCommandes(): Promise<Commande[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('commandes').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data as Commande[];
      }
    } catch (e) {
      console.warn('Erreur lors de la récupération des commandes Supabase:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biocosmetique_commandes');
    return local ? JSON.parse(local) : [];
  }
  return [];
}

export async function updateCommandeStatut(id: number, statut: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('commandes')
        .update({ statut })
        .eq('id', id);
      if (!error) {
        return true;
      } else {
        console.error('Erreur Supabase lors de la mise à jour du statut:', error);
      }
    } catch (e) {
      console.error('Exception lors de la mise à jour du statut:', e);
    }
  }

  // Fallback to localStorage if in-browser
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biocosmetique_commandes');
    if (local) {
      const list: Commande[] = JSON.parse(local);
      const index = list.findIndex(o => o.id === id);
      if (index !== -1) {
        list[index].statut = statut;
        localStorage.setItem('biocosmetique_commandes', JSON.stringify(list));
        return true;
      }
    }
  }
  return false;
}
