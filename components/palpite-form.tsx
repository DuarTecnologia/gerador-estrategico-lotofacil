"use client"

import { useState } from "react"
import { NumberGrid } from "./number-grid"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, BarChart3, Shuffle, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface PalpiteFormProps {
  lastResultNumbers?: string[]
  onSaved?: () => void
}

export function PalpiteForm({ lastResultNumbers = [], onSaved }: PalpiteFormProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [comparison, setComparison] = useState<{ matches: number[]; count: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== num))
    } else if (selectedNumbers.length < 15) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b))
    }
    setComparison(null)
  }

  const handleRandomize = () => {
    const numbers: number[] = []
    while (numbers.length < 15) {
      const random = Math.floor(Math.random() * 25) + 1
      if (!numbers.includes(random)) {
        numbers.push(random)
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b))
    setComparison(null)
  }

  const handleClear = () => {
    setSelectedNumbers([])
    setComparison(null)
  }

  const handleSave = async () => {
    if (selectedNumbers.length !== 15) {
      toast.error("Selecione exatamente 15 numeros")
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
      setComparison(null)
      onSaved?.()
    } catch {
      toast.error("Erro ao salvar palpite")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompare = () => {
    if (selectedNumbers.length !== 15) {
      toast.error("Selecione exatamente 15 numeros para comparar")
      return
    }

    if (lastResultNumbers.length === 0) {
      toast.error("Nenhum resultado disponivel para comparacao")
      return
    }

    const resultNumbers = lastResultNumbers.map((n) => parseInt(n))
    const matches = selectedNumbers.filter((n) => resultNumbers.includes(n))
    setComparison({ matches, count: matches.length })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fazer Palpite</CardTitle>
            <CardDescription>Selecione 15 numeros de 01 a 25</CardDescription>
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
          onToggle={handleToggle}
          highlightNumbers={comparison?.matches}
        />

        {comparison && (
          <div
            className={`rounded-lg p-4 text-center ${
              comparison.count >= 11
                ? "bg-primary/20 text-primary"
                : comparison.count >= 8
                ? "bg-chart-4/20 text-chart-4"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <p className="text-2xl font-bold">{comparison.count} acertos!</p>
            <p className="text-sm mt-1">
              {comparison.count >= 15
                ? "Parabens! Voce acertou todos os numeros!"
                : comparison.count >= 14
                ? "Excelente! Quase perfeito!"
                : comparison.count >= 13
                ? "Muito bom! Continue assim!"
                : comparison.count >= 11
                ? "Bom resultado!"
                : "Continue tentando!"}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleRandomize}
            className="flex-1 sm:flex-none"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Aleatorio
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={selectedNumbers.length === 0}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Limpar
          </Button>
          <Button
            variant="secondary"
            onClick={handleCompare}
            disabled={selectedNumbers.length !== 15 || lastResultNumbers.length === 0}
            className="flex-1 sm:flex-none"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Comparar
          </Button>
          <Button
            onClick={handleSave}
            disabled={selectedNumbers.length !== 15 || isLoading}
            className="flex-1 sm:flex-none"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Salvando..." : "Salvar Palpite"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
