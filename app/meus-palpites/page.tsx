'use client'

import { useEffect, useState } from 'react'

interface Palpite {
  id: number
  numeros: number[]
  data_criacao: string
}

export default function MeusPalpites() {
  const [palpites, setPalpites] = useState<Palpite[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarPalpites()
  }, [])

  const buscarPalpites = async () => {
    try {
      const resposta = await fetch('/api/lotofacil/buscar')
      const dados = await resposta.json()
      setPalpites(dados)
    } catch (error) {
      console.error('Erro ao buscar:', error)
    } finally {
      setCarregando(false)
    }
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold text-green-800 mb-6">📋 Meus Palpites</h1>

          {carregando ? (
            <div className="text-center py-8 text-gray-500">Carregando seus palpites...</div>
          ) : palpites.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Você ainda não tem palpites salvos.
              <br />
              <a href="/" className="text-green-600 hover:underline mt-2 inline-block">
                Voltar e fazer seu primeiro palpite →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {palpites.map((palpite) => (
                <div key={palpite.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm text-gray-500">
                      📅 {formatarData(palpite.data_criacao)}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      #{palpite.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {palpite.numeros.map((num) => (
                      <span
                        key={num}
                        className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm"
                      >
                        {num.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}