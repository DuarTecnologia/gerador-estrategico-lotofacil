"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import { Palpite } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, Calendar, AlertCircle, ListX } from "lucide-react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function MeusPalpitesPage() {
  const [palpites, setPalpites] = useState<Palpite[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: results } = useSWR("/api/lotofacil?quantidade=1", fetcher)
  const lastResultNumbers = results?.[0]?.dezenas?.map((n: string) => parseInt(n)) || []

  const fetchPalpites = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("palpites")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPalpites(data || [])
    } catch {
      toast.error("Erro ao carregar palpites")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPalpites()
  }, [])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("palpites").delete().eq("id", id)

      if (error) throw error

      setPalpites(palpites.filter((p) => p.id !== id))
      toast.success("Palpite excluido com sucesso")
    } catch {
      toast.error("Erro ao excluir palpite")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const countMatches = (numeros: number[]) => {
    if (lastResultNumbers.length === 0) return 0
    return numeros.filter((n) => lastResultNumbers.includes(n)).length
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          Meus Palpites
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie todos os seus palpites salvos
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 15 }).map((_, j) => (
                    <Skeleton key={j} className="h-7 w-7 rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : palpites.length === 0 ? (
        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="rounded-full bg-muted p-4">
              <ListX className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                Nenhum palpite salvo
              </p>
              <p className="text-sm text-muted-foreground">
                Faca seu primeiro palpite na pagina inicial
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {palpites.map((palpite) => {
            const matches = countMatches(palpite.numeros)
            return (
              <Card key={palpite.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(palpite.created_at)}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          disabled={deletingId === palpite.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir palpite?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acao nao pode ser desfeita. O palpite sera
                            permanentemente removido.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(palpite.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {palpite.numeros.map((num) => {
                      const isMatch = lastResultNumbers.includes(num)
                      return (
                        <Badge
                          key={num}
                          variant={isMatch ? "default" : "secondary"}
                          className="h-7 w-7 justify-center text-xs font-bold"
                        >
                          {num.toString().padStart(2, "0")}
                        </Badge>
                      )
                    })}
                  </div>
                  {lastResultNumbers.length > 0 && (
                    <div
                      className={`text-center text-sm font-medium rounded-md py-1 ${
                        matches >= 11
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {matches} acerto{matches !== 1 ? "s" : ""} no ultimo sorteio
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
