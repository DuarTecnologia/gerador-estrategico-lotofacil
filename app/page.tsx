"use client"

import useSWR from "swr"
import { PalpiteForm } from "@/components/palpite-form"
import { ResultDisplay } from "@/components/result-display"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomePage() {
  const { data: results, error, isLoading, mutate } = useSWR("/api/lotofacil?quantidade=1", fetcher)

  const lastResult = results?.[0]

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />
      
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Lotofacil
        </h1>
        <p className="mt-2 text-muted-foreground">
          Faca seus palpites e confira os resultados
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Último Resultado */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Ultimo Resultado
          </h2>
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-12 rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-destructive/50 bg-destructive/10">
              <CardContent className="flex items-center gap-3 py-6">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-destructive">Erro ao carregar resultado</p>
              </CardContent>
            </Card>
          ) : lastResult ? (
            <ResultDisplay result={lastResult} />
          ) : null}
        </section>

        {/* Formulário de Palpite */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Novo Palpite
          </h2>
          <PalpiteForm
            lastResultNumbers={lastResult?.dezenas || []}
            onSaved={() => mutate()}
          />
        </section>
      </div>
    </div>
  )
}
