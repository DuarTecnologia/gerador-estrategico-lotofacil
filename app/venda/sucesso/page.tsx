"use client"

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

function SucessoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    const externalReference = searchParams.get('external_reference')

    const params = new URLSearchParams()
    if (paymentId) params.set('payment_id', paymentId)
    if (status) params.set('status', status)
    if (externalReference) params.set('external_reference', externalReference)

    router.replace(`/venda/obrigado?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <Spinner className="w-8 h-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Processando pagamento...</p>
      </div>
    </div>
  )
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <Spinner className="w-8 h-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  )
}
