import Link from 'next/link'
import { XCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErroPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Pagamento nao Aprovado
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Houve um problema ao processar seu pagamento. 
          Por favor, verifique os dados do cartao ou tente outro metodo de pagamento.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/venda">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
