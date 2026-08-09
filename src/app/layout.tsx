import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtisanAI - Votre assistant WhatsApp intelligent",
  description:
    "Ne ratez plus aucun client. ArtisanAI répond automatiquement à vos messages WhatsApp et vous notifie des nouvelles demandes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} h-full antialiased`}
      // Certaines extensions de navigateur ajoutent des attributs sur <html>
      // avant l'hydratation. Ne concerne que les attributs de cette balise :
      // les vrais écarts dans l'application restent signalés.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
