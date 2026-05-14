// Fichier importable côté client ET serveur — pas d'import Stripe ici

export const PLANS = {
  starter: {
    name: 'Starter',
    price: '19€',
    description: 'Pour démarrer sereinement',
    features: ['50 réponses IA / mois', '1 numéro WhatsApp', 'Dashboard web', 'Notifications par email'],
  },
  pro: {
    name: 'Pro',
    price: '49€',
    description: 'Pour les artisans actifs',
    features: ['Réponses IA illimitées', '1 numéro WhatsApp', 'Dashboard web', 'Notifications SMS + email', 'Profil personnalisable', 'Support prioritaire'],
  },
  team: {
    name: 'Équipe',
    price: '99€',
    description: 'Pour les petites entreprises',
    features: ["Tout ce qui est dans Pro", "Jusqu'à 5 artisans", '5 numéros WhatsApp', 'Tableau de bord équipe', 'Statistiques avancées'],
  },
} as const

export type PlanKey = keyof typeof PLANS
