import Link from 'next/link'
import { Clock, Home, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PendentePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-yellow-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Pagamento Pendente
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Seu pagamento esta sendo processado. Se voce escolheu Pix ou boleto, 
          aguarde a confirmacao do pagamento. Voce recebera um email assim que for aprovado.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Inicio
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/venda">
              <HelpCircle className="w-4 h-4 mr-2" />
              Preciso de Ajuda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
