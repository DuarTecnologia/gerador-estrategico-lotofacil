// app/api/mercadopago/create-payment/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createPaymentPreference } from "@/lib/mercadopago/payment"

export async function POST(req: NextRequest) {
  try {
    const { gameCount, userId } = await req.json()
    
    const pricePerGame = 2.50 // R$ 2,50 por jogo
    const totalPrice = gameCount * pricePerGame
    
    const preferenceId = await createPaymentPreference(
      [
        {
          title: `${gameCount} jogos da Lotofácil`,
          quantity: 1,
          unit_price: totalPrice,
          description: `${gameCount} palpites gerados para Lotofácil`
        }
      ],
      `${userId}-${Date.now()}`,
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`
    )
    
    return NextResponse.json({ preferenceId })
  } catch (error) {
    console.error("Erro ao criar pagamento:", error)
    return NextResponse.json(
      { error: "Erro ao criar pagamento" },
      { status: 500 }
    )
  }
}