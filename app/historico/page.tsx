"use client"

import useSWR from "swr"
import { ResultDisplay } from "@/components/result-display"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, History } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HistoricoPage() {
  const { data: results, error, isLoading } = useSWR(
    "/api/lotofacil?quantidade=5",
    fetcher
  )

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Historico de Sorteios
        </h1>
        <p className="mt-2 text-muted-foreground">
          Confira os ultimos 5 resultados da Lotofacil
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 15 }).map((_, j) => (
                    <Skeleton key={j} className="h-10 w-10 rounded-lg" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="mx-auto max-w-md border-destructive/50 bg-destructive/10">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="rounded-full bg-destructive/20 p-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-destructive">
                Erro ao carregar historico
              </p>
              <p className="text-sm text-destructive/80">
                Tente novamente mais tarde
              </p>
            </div>
          </CardContent>
        </Card>
      ) : results && results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result: any, index: number) => (
            <ResultDisplay
              key={result.concurso || index}
              result={result}
              compact={index > 0}
            />
          ))}
        </div>
      ) : (
        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="rounded-full bg-muted p-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                Nenhum resultado disponivel
              </p>
              <p className="text-sm text-muted-foreground">
                Os resultados serao exibidos aqui quando disponiveis
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
