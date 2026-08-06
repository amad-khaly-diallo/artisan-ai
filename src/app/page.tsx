import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  Bell,
  Bot,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "IA qui répond à votre place",
    description:
      "Notre IA comprend la demande du client et répond de façon professionnelle en votre nom sur WhatsApp.",
  },
  {
    icon: Bell,
    title: "Notifications instantanées",
    description:
      "Recevez un SMS ou une alerte sur votre dashboard dès qu'un client envoie un message.",
  },
  {
    icon: MessageSquare,
    title: "Toutes vos conversations",
    description:
      "Retrouvez chaque échange dans un dashboard clair. Répondez manuellement quand vous avez le temps.",
  },
  {
    icon: BarChart3,
    title: "Suivi de vos demandes",
    description:
      "Visualisez le nombre de contacts, les créneaux demandés et les types de travaux les plus fréquents.",
  },
  {
    icon: Zap,
    title: "Réponse en moins de 30 secondes",
    description:
      "Plus de client qui attend. L'IA répond immédiatement, 24h/24 et 7j/7, même quand vous êtes sur un chantier.",
  },
  {
    icon: Shield,
    title: "Vos données sont sécurisées",
    description:
      "Hébergement en Europe, chiffrement de bout en bout. Aucune donnée client partagée.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "19€",
    description: "Pour démarrer sereinement",
    features: [
      "50 réponses IA / mois",
      "1 numéro WhatsApp",
      "Dashboard web",
      "Notifications par email",
    ],
    cta: "Commencer gratuitement",
    highlight: false,
  },
  {
    name: "Pro",
    price: "49€",
    description: "Pour les artisans actifs",
    features: [
      "Réponses IA illimitées",
      "1 numéro WhatsApp",
      "Dashboard web",
      "Notifications SMS + email",
      "Profil personnalisable",
      "Support prioritaire",
    ],
    cta: "Choisir Pro",
    highlight: true,
  },
  {
    name: "Équipe",
    price: "99€",
    description: "Pour les petites entreprises",
    features: [
      "Tout ce qui est dans Pro",
      "Jusqu'à 5 artisans",
      "5 numéros WhatsApp",
      "Tableau de bord équipe",
      "Statistiques avancées",
    ],
    cta: "Contacter l'équipe",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">ArtisanAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Se connecter</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Essayer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32 bg-gradient-to-b from-indigo-50 to-white">
        <Badge className="mb-6 bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-100 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Disponible sur WhatsApp
        </Badge>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 max-w-3xl leading-tight">
          Votre assistant WhatsApp qui répond{" "}
          <span className="text-indigo-600">à votre place</span>
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl">
          Vous êtes sur un chantier, vous ne pouvez pas répondre. ArtisanAI
          s&apos;en charge — il répond professionnellement à vos clients et vous
          notifie des nouvelles demandes.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
              Démarrer gratuitement <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="#fonctionnalites">
            <Button size="lg" variant="outline">
              Voir comment ça marche
            </Button>
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-12">
          {[
            { value: "< 30s", label: "Temps de réponse" },
            { value: "24/7",  label: "Disponibilité" },
            { value: "100%",  label: "Automatisé" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-indigo-600">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Pensé pour les artisans qui n&apos;ont pas le temps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Des tarifs simples et transparents
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Sans engagement. Annulez quand vous voulez.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative border ${
                  plan.highlight
                    ? "border-indigo-500 shadow-lg shadow-indigo-100"
                    : "border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white hover:bg-indigo-600">
                      Le plus populaire
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-1">/mois</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/login">
                    <Button
                      className={`w-full ${plan.highlight ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">ArtisanAI</span>
          </div>
          <p className="text-sm text-gray-400">© 2025 ArtisanAI. Tous droits réservés.</p>
        </div>
      </footer>
    </main>
  );
}
