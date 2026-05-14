'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { CreditCard, QrCode, ShieldCheck, CheckCircle, Lock } from 'lucide-react'

export default function VendaPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const produto = {
    nome: 'Sistema Lotofacil - Licenca Completa',
    preco: 24.90,
    descricao: 'Sistema completo para gestao de palpites da Lotofacil. Inclui:',
    beneficios: [
      'Cadastro ilimitado de palpites',
      'Comparacao automatica com sorteios',
      'Historico completo de resultados',
      'Estatisticas personalizadas',
      'Suporte por 30 dias',
      'Atualizacoes gratuitas'
    ]
  }

  const criarPagamento = async () => {
    setLoading(true)
    
    try {
      const resposta = await fetch('/api/mercado-pago/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: {
            title: produto.nome,
            description: produto.descricao,
            price: produto.preco
          }
        })
      })
      
      const data = await resposta.json()
      
      if (data.initPoint) {
        window.open(data.initPoint, '_blank')
        
        toast({
          title: "Redirecionando para pagamento",
          description: "Voce sera redirecionado para o ambiente seguro do Mercado Pago"
        })
      } else {
        throw new Error('Erro ao criar preferencia')
      }
      
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: "Erro ao processar",
        description: "Nao foi possivel iniciar o pagamento. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/30 to-primary/10">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* COLUNA ESQUERDA - INFO DO PRODUTO */}
          <div className="space-y-6">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">
                Lancamento
              </span>
              <h1 className="text-4xl font-bold text-foreground mt-2">
                Sistema Lotofacil
              </h1>
              <p className="text-muted-foreground mt-4 text-lg">
                Gerencie seus palpites, acompanhe resultados e aumente suas chances de ganhar na Lotofacil.
              </p>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <div className="mb-4">
                <span className="text-3xl font-bold text-foreground">R$ 24,90</span>
                <span className="text-muted-foreground ml-2">/ licenca vitalicia</span>
              </div>
              
              <button
                onClick={criarPagamento}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Comprar Agora - R$ 24,90
                  </>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  Pagamento Seguro
                </div>
                <div className="flex items-center gap-1">
                  <QrCode className="w-4 h-4" />
                  Pix ou Cartao
                </div>
              </div>
            </div>
            
            <div className="bg-accent/50 rounded-xl p-6 border border-primary/20">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Garantia de 7 dias
              </h3>
              <p className="text-muted-foreground text-sm">
                Teste o sistema por 7 dias. Se nao ficar satisfeito, devolvemos 100% do seu dinheiro.
              </p>
            </div>
          </div>
          
          {/* COLUNA DIREITA - BENEFICIOS */}
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              O que voce vai receber
            </h2>
            
            <div className="space-y-4">
              {produto.beneficios.map((beneficio, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{beneficio}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-muted-foreground">Total</span>
                  <p className="text-2xl font-bold text-foreground">R$ 24,90</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">ou em ate</span>
                  <p className="text-lg font-semibold text-foreground">3x de R$ 8,30</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <img src="https://http2.mlstatic.com/frontend-assets/ml-payments/pictures/mastercard.svg" alt="Mastercard" className="h-6" />
                <img src="https://http2.mlstatic.com/frontend-assets/ml-payments/pictures/visa.svg" alt="Visa" className="h-6" />
                <img src="https://http2.mlstatic.com/frontend-assets/ml-payments/pictures/pix.svg" alt="Pix" className="h-6" />
              </div>
            </div>
          </div>
        </div>
        
        {/* SECAO DE GARANTIA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            Ambiente seguro e criptografado
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
