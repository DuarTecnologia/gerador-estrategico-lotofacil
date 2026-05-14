export interface Palpite {
  id: string
  numeros: number[]
  created_at: string
}

export interface LotofacilResult {
  concurso: number
  data: string
  dezenas: string[]
  premiacao: {
    acertos: number
    ganhadores: number
    premio: string
  }[]
}
