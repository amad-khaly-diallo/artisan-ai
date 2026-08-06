import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
          <span className="text-xl font-bold text-white">A</span>
        </div>
        <CardTitle className="text-2xl">Inscriptions désactivées</CardTitle>
        <CardDescription>Ce site est une démonstration</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          La création de compte est fermée sur cet environnement de démo.
          Utilisez le compte de test fourni pour explorer l&apos;application.
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Link href="/login" className="w-full">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Se connecter</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
