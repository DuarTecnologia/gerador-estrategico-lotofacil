// components/payment-form.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Barcode, QrCode, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface PaymentFormProps {
  userId?: string
  gameCount?: number
}

export function PaymentForm({ userId = "guest", gameCount = 6 }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/mercadopago/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameCount, userId })
      })
      
      const data = await response.json()
      
      if (data.preferenceId) {
        // Redirecionar para o checkout do Mercado Pago
        const checkoutUrl = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.preferenceId}`
        router.push(checkoutUrl)
      } else {
        throw new Error("Erro ao criar pagamento")
      }
    } catch (error) {
      console.error("Erro:", error)
      toast.error("Erro ao processar pagamento")
    } finally {
      setIsLoading(false)
    }
  }

  const totalPrice = gameCount * 2.50

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Finalizar Compra
        </CardTitle>
        <CardDescription>
          {gameCount} jogos gerados por apenas R$ {totalPrice.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted p-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit_card" id="credit" />
            <Label htmlFor="credit" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Cartão de Crédito
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="boleto" id="boleto" />
            <Label htmlFor="boleto" className="flex items-center gap-2">
              <Barcode className="h-4 w-4" />
              Boleto Bancário
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              PIX
            </Label>
          </div>
        </RadioGroup>

        <Button onClick={handlePayment} disabled={isLoading} className="w-full">
          {isLoading ? "Processando..." : `Pagar R$ ${totalPrice.toFixed(2)}`}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Pagamento seguro processado pelo Mercado Pago
        </p>
      </CardContent>
    </Card>
  )
}