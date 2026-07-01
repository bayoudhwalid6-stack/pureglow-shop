# Guide d'Interface Vocale - Pure Glow MH

## 🎤 Fonctionnalités Vocales Implémentées

### Architecture Modulaire
L'interface vocale utilise une architecture modulaire avec deux services indépendants :

1. **Speech Recognition (STT)** - `src/lib/speechRecognition.ts`
   - Reconnaissance vocale via Web Speech API
   - Support de l'arabe tunisien (ar-TN)
   - Résultats intermédiaires pour feedback visuel en temps réel
   - Auto-rétry en cas d'erreurs temporaires
   - Gestion complète des erreurs et permissions

2. **Speech Synthesis (TTS)** - `src/lib/speechSynthesis.ts`
   - Synthèse vocale via Web Speech API
   - Nettoyage automatique des caractères Markdown
   - Sélection automatique des voix (arabe → français → fallback)
   - Paramètres optimisés pour conversation naturelle
   - Contrôle de vitesse, pitch et volume

### Interface Utilisateur
Le composant `Chatbot.tsx` inclut :

- **Bouton Toggle Vocal** : Active/désactive le mode vocal
- **Bouton Microphone** : Démarre/arrête l'écoute (visible uniquement en mode vocal)
- **Bouton Stop Speaking** : Arrête la synthèse en cours (visible quand Sarra parle)
- **Indicateur de Transcript** : Affiche le texte en temps réel pendant l'écoute
- **Indicateurs de Statut** : 
  - 🔴 "جاري الاستماع" (En écoute)
  - 🟠 "جاري الحديث" (En cours de parole)
  - ⚪ "الوضع الصوتي نشط" (Mode vocal actif)
- **Gestion des Erreurs** : Messages d'erreur clairs avec possibilité de fermeture

## 🚀 Utilisation

### Pour les Utilisateurs

1. **Activer le mode vocal** : Cliquez sur l'icône 🔊/🔇 dans le chatbot
2. **Parler à Sarra** : Cliquez sur l'icône 🎤 pour commencer l'écoute
3. **Conversation naturelle** : 
   - Parlez naturellement en arabe ou en français
   - Sarra répondra automatiquement par voix
   - Les réponses sont lues avec nettoyage automatique du Markdown
4. **Contrôles** :
   - Cliquez sur 🎤 pour arrêter l'écoute
   - Cliquez sur 🔇 pour arrêter la parole de Sarra
   - Utilisez toujours le champ texte comme alternative

### Pour les Développeurs

#### Compatibilité Navigateur
- **Chrome/Edge** : Support complet (Speech Recognition + Synthesis)
- **Safari** : Support partiel (Synthesis uniquement)
- **Firefox** : Support partiel (Synthesis uniquement)
- **Fallback** : Interface textuelle toujours disponible

#### Configuration des Langues
```typescript
// Changer la langue de reconnaissance
speechRecognitionRef.current?.setLanguage('ar-TN'); // Arabe tunisien
speechRecognitionRef.current?.setLanguage('fr-FR'); // Français

// Changer la voix de synthèse
const voices = speechSynthesisRef.current?.getAvailableVoices();
speechSynthesisRef.current?.setVoice(voices[0]);
```

#### Personnalisation des Paramètres TTS
```typescript
// Vitesse (0.1 à 10, défaut: 0.9)
speechSynthesisRef.current?.setRate(1.0);

// Pitch (0 à 2, défaut: 1.0)
speechSynthesisRef.current?.setPitch(1.1);
```

## 🔧 Fonctionnalités Techniques

### Nettoyage Markdown pour TTS
Le système nettoie automatiquement :
- **Bold** `**text**` → `text`
- *Italic* `*text*` → `text`
- `Code` `` `text` `` → `text`
- Headers `#` → supprimés
- Émojis → supprimés (optionnel)
- Espaces multiples → normalisés

### Gestion des Erreurs
- **Permission refusée** : Message clair + alternative textuelle
- **Microphone indisponible** : Détection automatique
- **Réseau** : Auto-rétry jusqu'à 3 tentatives
- **Synthèse échouée** : Fallback silencieux vers texte

### Performance
- **Architecture légère** : < 50KB total
- **Pas de dépendances externes** : Web Speech API native
- **Optimisé mobile** : Écoute une phrase à la fois
- **Non-bloquant** : Interface réactive pendant reconnaissance

## 📱 Déploiement Netlify

L'interface vocale est prête pour le déploiement sur Netlify :

1. **Aucune configuration serveur nécessaire** : Tout s'exécute côté client
2. **HTTPS requis** : Les APIs Speech nécessitent HTTPS (automatique sur Netlify)
3. **Permissions utilisateur** : Le navigateur demandera la permission microphone
4. **Fallback gracieux** : Fonctionne même si les APIs ne sont pas supportées

## 🎯 Cas d'Usage

### Scénario 1 : Conversation "Mains Libres"
1. Utilisateur active le mode vocal
2. Clique sur 🎤 et dit : "أريد طلب صابون التين الشوكي"
3. Sarra répond par voix : "بكل سرور! صابون التين الشوكي متوفر بـ 15.000 د.ت..."
4. Utilisateur continue la conversation naturellement

### Scénario 2 : Commande par Voix
1. Utilisateur : "أريد شراء صابون السدر"
2. Sarra : "ممتاز! الصابون متوفر. ما هو اسمك الكامل؟"
3. Utilisateur : "اسمي فاطمة بن علي"
4. Sarra : "شكراً فاطمة. ما هو رقم هاتفك؟"
5. Utilisateur : [donne le numéro]
6. Sarra : "ممتاز. ما هو عنوان التوصيل؟"
7. Utilisateur : [donne l'adresse]
8. Sarra : "تم تسجيل طلبك بنجاح! رقم الطلب..."

## 🔒 Sécurité et Confidentialité

- **Traitement local** : La reconnaissance vocale s'effectue localement dans le navigateur
- **Pas d'enregistrement** : Aucun enregistrement audio stocké
- **HTTPS** : Communications chiffrées
- **Permissions explicites** : L'utilisateur doit autoriser le microphone

## 🐛 Dépannage

### Le microphone ne fonctionne pas
- Vérifiez les permissions du navigateur
- Assurez-vous que le site est en HTTPS
- Vérifiez que le microphone n'est pas utilisé par une autre application

### La voix ne fonctionne pas
- Vérifiez que le navigateur supporte Speech Synthesis
- Testez avec un autre navigateur (Chrome recommandé)
- Vérifiez que le volume du système est activé

### La reconnaissance est imprécise
- Parlez clairement et à un rythme normal
- Réduisez le bruit ambiant
- Utilisez un microphone de bonne qualité

## 📝 Notes de Développement

### Extensions Futures Possibles
- Support de langues additionnelles
- Personnalisation de la voix de Sarra
- Commandes vocales personnalisées
- Mode "conversation continue"
- Historique vocal

### Maintenance
- Les modules sont indépendants et réutilisables
- Le code est documenté avec TypeScript
- Les erreurs sont loggées pour debugging
- L'architecture facilite les tests unitaires

---

**Développé pour Pure Glow MH** - Interface conversationnelle avec Sarra
