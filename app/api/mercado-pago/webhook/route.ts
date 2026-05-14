import { NextRequest, NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"
import { createClient } from "@supabase/supabase-js"

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verifica se é uma notificação de pagamento
    if (body.type === "payment") {
      const paymentId = body.data.id

      // Busca os detalhes do pagamento
      const payment = new Payment(client)
      const paymentData = await payment.get({ id: paymentId })

      if (paymentData) {
        // Salva ou atualiza a venda no banco de dados
        const { error } = await supabase
          .from("vendas")
          .upsert({
            payment_id: paymentData.id?.toString(),
            status: paymentData.status,
            amount: paymentData.transaction_amount,
            payer_email: paymentData.payer?.email,
            payment_method: paymentData.payment_method_id,
            external_reference: paymentData.external_reference,
          }, {
            onConflict: "payment_id"
          })

        if (error) {
          console.error("[v0] Erro ao salvar venda:", error)
          return NextResponse.json({ error: "Erro ao salvar venda" }, { status: 500 })
        }

        console.log("[v0] Pagamento processado:", paymentData.id, paymentData.status)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro no webhook:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// Mercado Pago também pode enviar GET para verificar o endpoint
export async function GET() {
  return NextResponse.json({ status: "ok" })
}
