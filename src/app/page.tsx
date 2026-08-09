import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WhatsAppDemo } from "@/components/landing/whatsapp-demo";
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
  Smartphone,
  BrainCircuit,
  LayoutDashboard,
} from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    step: "01",
    title: "Votre client écrit sur WhatsApp",
    description:
      "Il utilise le numéro que vous affichez déjà sur vos devis, votre camion ou votre fiche Google.",
  },
  {
    icon: BrainCircuit,
    step: "02",
    title: "L'IA répond à votre place",
    description:
      "Elle connaît votre métier, vos services et votre façon de parler. Elle répond en quelques secondes, jamais comme un robot.",
  },
  {
    icon: LayoutDashboard,
    step: "03",
    title: "Vous reprenez la main quand vous voulez",
    description:
      "Chaque échange atterrit dans votre dashboard. Vous êtes notifié et pouvez répondre vous-même à tout moment.",
  },
];

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
    <main className="flex min-h-screen flex-col bg-white">
      {/* Bandeau démo */}
      <div className="bg-neutral-900 px-4 py-2.5 text-[13px] text-neutral-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1.5">
          <span className="font-medium text-white">Projet de démonstration</span>
          <span className="hidden text-neutral-600 sm:inline">•</span>
          <span className="flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-neutral-400">Connexion&nbsp;:</span>
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-white">
              khalyamad.d@test.com
            </code>
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px] text-white">
              Demo-ArtisanAI-2026!
            </code>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-500/30">
              <MessageSquare className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ArtisanAI</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#fonctionnement"
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Fonctionnement
            </Link>
            <Link
              href="#fonctionnalites"
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#tarifs"
              className="text-sm text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Tarifs
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="sm"
                className="bg-neutral-900 text-white shadow-sm hover:bg-neutral-800"
              >
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 lg:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e9e9ef_1px,transparent_1px),linear-gradient(to_bottom,#e9e9ef_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_50%,transparent_100%)]" />
          <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/40 via-violet-300/30 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          {/* Colonne texte */}
          <div className="text-center lg:text-left">
            <Badge className="mb-6 inline-flex items-center gap-1.5 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
              <Sparkles className="h-3.5 w-3.5" />
              Propulsé par Claude — sur WhatsApp
            </Badge>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.4rem]">
              Votre assistant WhatsApp qui répond{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                à votre place
              </span>
            </h1>

            <p className="mt-6 text-pretty text-lg leading-relaxed text-neutral-600 lg:max-w-lg">
              Vous êtes sur un chantier, les mains dans le ciment. Pendant ce
              temps, ArtisanAI répond à vos clients, qualifie leur demande et
              vous prévient. Vous ne perdez plus un seul devis.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-neutral-900 px-7 text-white shadow-lg shadow-neutral-900/15 transition-transform hover:bg-neutral-800 hover:-translate-y-0.5 sm:w-auto"
                >
                  Essayer la démo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#fonctionnement" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Voir comment ça marche
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 lg:justify-start">
              {[
                { value: "< 30s", label: "Temps de réponse" },
                { value: "24/7", label: "Disponibilité" },
                { value: "100%", label: "Automatisé" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-extrabold tracking-tight text-neutral-900">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-xs text-neutral-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Colonne démo */}
          <div className="lg:pl-8">
            <WhatsAppDemo />
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section
        id="fonctionnement"
        className="border-y border-neutral-200/80 bg-neutral-50/60 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Trois étapes, zéro effort
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Vous n&apos;avez rien à installer. Vos clients continuent
              d&apos;utiliser WhatsApp comme avant.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className="group relative rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <span className="text-xs font-bold tracking-widest text-indigo-500">
                  {s.step}
                </span>
                <div className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-500/25">
                  <s.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-5 font-semibold text-neutral-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Pensé pour les artisans qui n&apos;ont pas le temps
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 transition-colors group-hover:bg-indigo-100">
                  <feature.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="mt-4 font-semibold text-neutral-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section
        id="tarifs"
        className="border-y border-neutral-200/80 bg-neutral-50/60 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Des tarifs simples et transparents
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Sans engagement. Annulez quand vous voulez.
            </p>
          </div>

          <div className="grid items-start gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl bg-white p-8 transition-all ${
                  plan.highlight
                    ? "border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 md:-translate-y-3"
                    : "border border-neutral-200 shadow-sm hover:border-neutral-300 hover:shadow-md"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="border-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-600 hover:to-violet-600">
                      Le plus populaire
                    </Badge>
                  </div>
                )}

                <h3 className="text-lg font-bold text-neutral-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {plan.description}
                </p>

                <div className="mt-5 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-neutral-900">
                    {plan.price}
                  </span>
                  <span className="ml-1.5 text-sm text-neutral-500">/mois</span>
                </div>

                <ul className="mt-7 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                      <span className="text-neutral-600">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/login" className="mt-8 block">
                  <Button
                    className={`w-full ${
                      plan.highlight
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700"
                        : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-white px-6 py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
          >
            <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-indigo-600/40 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-violet-600/40 blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Chaque message sans réponse est un devis perdu
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-neutral-300">
              Explorez le dashboard, les conversations et le parcours complet
              avec le compte de démonstration.
            </p>
            <Link href="/login" className="mt-9 inline-block">
              <Button
                size="lg"
                className="bg-white px-8 text-neutral-900 shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-neutral-100"
              >
                Accéder à la démo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-neutral-900">ArtisanAI</span>
          </div>

          <p className="text-center text-sm text-neutral-500">
            Projet personnel de démonstration — Next.js, Supabase, Stripe,
            Twilio &amp; Claude
          </p>

          <p className="text-sm text-neutral-400">© 2026 ArtisanAI</p>
        </div>
      </footer>
    </main>
  );
}
