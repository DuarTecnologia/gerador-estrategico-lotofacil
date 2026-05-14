'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Clock, Home } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function ObrigadoContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  
  const statusConfig = {
    approved: {
      icon: <CheckCircle className="w-16 h-16 text-primary" />,
      title: 'Pagamento Aprovado!',
      message: 'Seu pagamento foi confirmado. Em breve voce recebera um e-mail com as instrucoes de acesso ao sistema.',
      bgColor: 'bg-primary/10'
    },
    failure: {
      icon: <XCircle className="w-16 h-16 text-destructive" />,
      title: 'Falha no Pagamento',
      message: 'Infelizmente seu pagamento nao foi aprovado. Por favor, tente novamente ou utilize outro metodo de pagamento.',
      bgColor: 'bg-destructive/10'
    },
    pending: {
      icon: <Clock className="w-16 h-16 text-yellow-500" />,
      title: 'Pagamento Pendente',
      message: 'Seu pagamento esta sendo processado. Assim que for confirmado, enviaremos um e-mail com as instrucoes.',
      bgColor: 'bg-yellow-500/10'
    }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center">
          <div className={`inline-flex p-4 rounded-full mb-6 ${config.bgColor}`}>
            {config.icon}
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-foreground">
            {config.title}
          </h1>
          
          <p className="text-muted-foreground mb-8">
            {config.message}
          </p>
          
          <Button asChild>
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="w-5 h-5" />
              Voltar para o inicio
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    }>
      <ObrigadoContent />
    </Suspense>
  )
}
