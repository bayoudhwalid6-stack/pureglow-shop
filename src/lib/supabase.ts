export interface Produit {
  id: string;
  nom: string;
  description: string;
  prix: number;
  image_url: string;
  categorie?: string;
  stock?: number;
}

export interface Commande {
  id: string | number;
  created_at?: string;
  nom_client: string;
  telephone: string;
  adresse: string;
  details_produits: string;
  statut?: string; // 'En attente' | 'En cours' | 'Préparation' | 'Expédiée' | 'En cours de livraison' | 'Livrée' | 'Livré' | 'Confirmée'
}
