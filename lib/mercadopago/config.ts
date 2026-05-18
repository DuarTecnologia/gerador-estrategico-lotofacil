// lib/mercadopago/config.ts
import MercadoPago from "mercadopago"

export const initMercadoPago = () => {
  MercadoPago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    sandbox: process.env.NODE_ENV !== "production"
  })
}

export interface PaymentItem {
  title: string
  quantity: number
  unit_price: number
  description?: string
}

// lib/mercadopago/payment.ts
import { initMercadoPago } from "./config"
import { PaymentItem } from "./config"

export async function createPaymentPreference(
  items: PaymentItem[],
  externalReference: string,
  successUrl: string,
  failureUrl: string,
  pendingUrl: string
) {
  initMercadoPago()
  
  const preference = {
    items,
    back_urls: {
      success: successUrl,
      failure: failureUrl,
      pending: pendingUrl
    },
    auto_return: "approved",
    external_reference: externalReference,
    notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`
  }
  
  try {
    const response = await MercadoPago.preferences.create(preference)
    return response.body.id
  } catch (error) {
    console.error("Erro ao criar preferência:", error)
    throw error
  }
}