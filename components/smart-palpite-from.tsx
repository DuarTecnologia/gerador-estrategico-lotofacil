// components/smart-palpite-form.tsx
"use client"

import { useState, useEffect } from "react"
import { NumberGrid } from "./number-grid"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Save, 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Zap,
  Sparkles,
  BarChart3
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { LotofacilStats, GeneratedGame } from "@/lib/lotofacil/stats"
import { LotofacilResult } from "@/lib/types"

interface SmartPalpiteFormProps {
  historicalResults: LotofacilResult[]
  onSaved?: () => void
}

export function SmartPalpiteForm({ historicalResults, onSaved }: SmartPalpiteFormProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<LotofacilStats | null>(null)
  const [generatedGames, setGeneratedGames] = useState<GeneratedGame[]>([])
  const [activeStrategy, setActiveStrategy] = useState<string>("balanced")

  useEffect(() => {
    if (historicalResults.length > 0) {
      setStats(new LotofacilStats(historicalResults))
    }
  }, [historicalResults])

  const handleGenerateGames = () => {
    if (!stats) {
      toast.error("Carregando estatísticas...")
      return
    }

    const games = stats.generateMultipleGames(6)
    setGeneratedGames(games)
    setSelectedNumbers([])
  }

  const handleSelectGame = (game: GeneratedGame) => {
    setSelectedNumbers(game.numbers)
    toast.success(`Jogo selecionado! ${game.stats.hotCount} números quentes, ${game.stats.coldCount} frios`)
  }

  const handlePredict = () => {
    if (!stats) {
      toast.error("Carregando estatísticas...")
      return
    }

    const prediction = stats.predictNextDraw()
    setSelectedNumbers(prediction)
    toast.success("Previsão baseada em padrões estatísticos!")
  }

  const handleSave = async () => {
    if (selectedNumbers.length !== 15) {
      toast.error("Selecione exatamente 15 números")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("palpites")
        .insert({ numeros: selectedNumbers })

      if (error) throw error

      toast.success("Palpite salvo com sucesso!")
      setSelectedNumbers([])
      onSaved?.()
    } catch {
      toast.error("Erro ao salvar palpite")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Gerador Inteligente
          </CardTitle>
          <CardDescription>
            Baseado em estatísticas dos últimos {historicalResults.length} concursos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerateGames} variant="default">
              <Sparkles className="mr-2 h-4 w-4" />
              Gerar 6 Jogos
            </Button>
            <Button onClick={handlePredict} variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Previsão para Próximo
            </Button>
          </div>

          {generatedGames.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Jogos sugeridos:</p>
              <div className="grid gap-2">
                {generatedGames.map((game, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border p-3 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleSelectGame(game)}
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-mono">
                        Jogo {idx + 1}
                      </Badge>
                      <div className="flex gap-1 text-sm">
                        {game.numbers.slice(0, 5).map(n => (
                          <span key={n} className="font-mono">{n.toString().padStart(2, '0')}</span>
                        ))}
                        ...
                      </div>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <Badge variant={game.stats.hotCount > 8 ? "default" : "secondary"}>
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {game.stats.hotCount} quentes
                      </Badge>
                      <Badge variant={game.stats.coldCount > 8 ? "default" : "secondary"}>
                        <TrendingDown className="mr-1 h-3 w-3" />
                        {game.stats.coldCount} frios
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Seu Palpite</CardTitle>
              <CardDescription>Selecione 15 números de 01 a 25</CardDescription>
            </div>
            <Badge
              variant={selectedNumbers.length === 15 ? "default" : "secondary"}
              className="text-lg px-3 py-1"
            >
              {selectedNumbers.length}/15
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <NumberGrid
            selectedNumbers={selectedNumbers}
            onToggle={(num) => {
              if (selectedNumbers.includes(num)) {
                setSelectedNumbers(selectedNumbers.filter(n => n !== num))
              } else if (selectedNumbers.length < 15) {
                setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b))
              }
            }}
          />

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSave}
              disabled={selectedNumbers.length !== 15 || isLoading}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Salvando..." : "Salvar Palpite"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}