// app/api/lotofacil/latest/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Buscar do último concurso da Caixa Econômica Federal
    const response = await fetch(
      "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/1",
      {
        next: { revalidate: 3600 } // Cache por 1 hora
      }
    )
    
    if (!response.ok) {
      throw new Error("Erro ao buscar resultado")
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      concurso: data.numero,
      data: data.dataApuracao,
      dezenas: data.listaDezenas,
      premiacao: data.listaRateioPremio.map((premio: any) => ({
        acertos: premio.descricaoFaixa,
        ganhadores: premio.numeroGanhadores,
        premio: `R$ ${premio.valorPremio.toFixed(2).replace('.', ',')}`
      }))
    })
  } catch (error) {
    console.error("Erro ao buscar resultado:", error)
    return NextResponse.json(
      { error: "Erro ao buscar resultado" },
      { status: 500 }
    )
  }
}