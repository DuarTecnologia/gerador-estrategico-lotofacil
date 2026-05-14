import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || ''
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product } = body

    if (!product || !product.title || !product.price) {
      return NextResponse.json(
        { error: 'Dados do produto invalidos' },
        { status: 400 }
      )
    }

    const preference = new Preference(client)

    const preferenceData = await preference.create({
      body: {
        items: [
          {
            id: 'lotofacil-license',
            title: product.title,
            description: product.description || 'Licenca do Sistema Lotofacil',
            quantity: 1,
            currency_id: 'BRL',
            unit_price: product.price
          }
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/venda/sucesso`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/venda/erro`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/venda/pendente`
        },
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_types: [],
          installments: 3
        }
      }
    })

    return NextResponse.json({
      id: preferenceData.id,
      initPoint: preferenceData.init_point
    })

  } catch (error) {
    console.error('Erro ao criar preferencia:', error)
    return NextResponse.json(
      { error: 'Erro ao criar preferencia de pagamento' },
      { status: 500 }
    )
  }
}
