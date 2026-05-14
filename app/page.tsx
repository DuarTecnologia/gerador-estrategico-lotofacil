'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [numeros, setNumeros] = useState<number[]>([])
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [ultimoSorteio, setUltimoSorteio] = useState<any>(null)

  // Buscar último sorteio ao carregar a página
  useEffect(() => {
    buscarUltimoSorteio()
  }, [])

  const buscarUltimoSorteio = async () => {
    try {
      const resposta = await fetch('/api/lotofacil')
      const dados = await resposta.json()
      setUltimoSorteio(dados)
    } catch (error) {
      console.error('Erro ao buscar sorteio:', error)
    }
  }

  const toggleNumero = (num: number) => {
    if (numeros.includes(num)) {
      setNumeros(numeros.filter(n => n !== num))
    } else if (numeros.length < 15) {
      setNumeros([...numeros, num].sort((a, b) => a - b))
    }
  }

  const limparSelecao = () => {
    setNumeros([])
    setMensagem('')
  }

  const gerarAleatorio = () => {
    const novosNumeros: number[] = []
    while (novosNumeros.length < 15) {
      const num = Math.floor(Math.random() * 25) + 1
      if (!novosNumeros.includes(num)) {
        novosNumeros.push(num)
      }
    }
    setNumeros(novosNumeros.sort((a, b) => a - b))
  }

  const salvarPalpite = async () => {
    if (numeros.length !== 15) {
      setMensagem('⚠️ Selecione exatamente 15 números!')
      return
    }

    setCarregando(true)
    setMensagem('')

    try {
      const resposta = await fetch('/api/lotofacil/salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeros })
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        setMensagem('✅ Palpite salvo com sucesso!')
        setNumeros([])
      } else {
        setMensagem(`❌ ${dados.error || 'Erro ao salvar'}`)
      }
    } catch (error) {
      setMensagem('❌ Erro de conexão. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const compararComSorteio = () => {
    if (!ultimoSorteio || !ultimoSorteio.numeros) {
      setMensagem('⚠️ Aguardando dados do sorteio...')
      return
    }

    if (numeros.length !== 15) {
      setMensagem('⚠️ Selecione 15 números primeiro!')
      return
    }

    const acertos = numeros.filter(n => ultimoSorteio.numeros.includes(n))
    setMensagem(`🎯 Você acertou ${acertos.length} números! ${acertos.length >= 11 ? 'Parabéns!' : ''}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">🎯 Sistema Lotofácil</h1>
          <p className="text-gray-600 mt-2">Selecione 15 números para seu palpite</p>
        </div>

        {/* Último resultado */}
        {ultimoSorteio && (
          <div className="bg-green-100 rounded-xl p-4 mb-6 text-center">
            <span className="text-sm text-green-800 font-semibold">Último sorteio (Concurso {ultimoSorteio.concurso})</span>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {ultimoSorteio.numeros?.map((num: number) => (
                <span key={num} className="bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {num.toString().padStart(2, '0')}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          
          <div className="text-center mb-6">
            <span className="text-lg font-semibold">
              Números selecionados: {numeros.length}/15
            </span>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${(numeros.length / 15) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => toggleNumero(num)}
                className={`
                  p-3 rounded-lg font-bold text-lg transition-all
                  ${numeros.includes(num) 
                    ? 'bg-green-500 text-white shadow-lg scale-105' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }
                `}
              >
                {num.toString().padStart(2, '0')}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={gerarAleatorio}
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              🎲 Números Aleatórios
            </button>
            <button
              onClick={limparSelecao}
              className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
            >
              🧹 Limpar
            </button>
            <button
              onClick={compararComSorteio}
              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              📊 Comparar
            </button>
            <button
              onClick={salvarPalpite}
              disabled={carregando}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {carregando ? 'Salvando...' : '💾 Salvar'}
            </button>
          </div>

          {mensagem && (
            <div className={`text-center p-3 rounded-lg ${mensagem.includes('✅') || mensagem.includes('🎯') ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {mensagem}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}