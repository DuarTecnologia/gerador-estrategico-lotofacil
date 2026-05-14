import { LotofacilResult } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy } from "lucide-react"

interface ResultDisplayProps {
  result: LotofacilResult
  compact?: boolean
}

export function ResultDisplay({ result, compact = false }: ResultDisplayProps) {
  return (
    <Card className={compact ? "bg-card" : "bg-card border-primary/20"}>
      <CardHeader className={compact ? "pb-2" : ""}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn("flex items-center gap-2", compact ? "text-base" : "text-lg")}>
            <Trophy className={compact ? "h-4 w-4" : "h-5 w-5"} />
            Concurso {result.concurso}
          </CardTitle>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{result.data}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("flex flex-wrap gap-2", compact ? "justify-start" : "justify-center")}>
          {result.dezenas.map((dezena) => (
            <Badge
              key={dezena}
              variant="default"
              className={cn(
                "font-bold",
                compact
                  ? "h-8 w-8 justify-center text-sm"
                  : "h-10 w-10 justify-center text-base sm:h-12 sm:w-12 sm:text-lg"
              )}
            >
              {dezena}
            </Badge>
          ))}
        </div>

        {!compact && result.premiacao && result.premiacao.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Premiacao:</p>
            <div className="grid gap-2 text-sm">
              {result.premiacao.slice(0, 3).map((premio) => (
                <div
                  key={premio.acertos}
                  className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
                >
                  <span>{premio.acertos} acertos</span>
                  <span className="font-medium">
                    {premio.ganhadores} ganhador{premio.ganhadores !== 1 ? "es" : ""} - {premio.premio}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
