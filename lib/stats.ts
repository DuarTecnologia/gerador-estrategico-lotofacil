// lib/lotofacil/stats.ts
import { LotofacilResult } from "@/lib/types"

export interface NumberStats {
  number: number
  frequency: number
  percentage: number
  lastAppearance: number | null
  streak: number
  isHot: boolean
  isCold: boolean
}

export interface GeneratedGame {
  numbers: number[]
  stats: {
    totalFrequency: number
    averageFrequency: number
    hotCount: number
    coldCount: number
    repeatedFromLast: number
  }
}

export class LotofacilStats {
  private results: LotofacilResult[] = []
  
  constructor(results: LotofacilResult[]) {
    this.results = results.sort((a, b) => b.concurso - a.concurso)
  }
  
  // Calcular frequência de cada número
  calculateFrequencies(): NumberStats[] {
    const frequencies: { [key: number]: number } = {}
    const lastAppearance: { [key: number]: number | null } = {}
    
    // Inicializar
    for (let i = 1; i <= 25; i++) {
      frequencies[i] = 0
      lastAppearance[i] = null
    }
    
    // Contar frequências
    this.results.forEach((result, index) => {
      result.dezenas.forEach((dezena) => {
        const num = parseInt(dezena)
        frequencies[num]++
        if (lastAppearance[num] === null) {
          lastAppearance[num] = index
        }
      })
    })
    
    const totalDraws = this.results.length
    const avgFrequency = totalDraws * 15 / 25 // Média esperada
    
    return Object.keys(frequencies).map((key) => {
      const num = parseInt(key)
      const frequency = frequencies[num]
      const percentage = (frequency / (totalDraws * 15)) * 100
      const lastAppear = lastAppearance[num]
      const isHot = frequency > avgFrequency * 1.2
      const isCold = frequency < avgFrequency * 0.8
      
      // Calcular streak (vezes consecutivas que apareceu)
      let streak = 0
      for (let i = 0; i < Math.min(10, this.results.length); i++) {
        if (this.results[i].dezenas.includes(num.toString().padStart(2, '0'))) {
          streak++
        } else {
          break
        }
      }
      
      return {
        number: num,
        frequency,
        percentage,
        lastAppearance: lastAppear,
        streak,
        isHot,
        isCold
      }
    })
  }
  
  // Gerar jogo baseado em estatísticas
  generateSmartGame(strategy: 'balanced' | 'hot' | 'cold' | 'mixed' = 'balanced'): GeneratedGame {
    const stats = this.calculateFrequencies()
    const lastResult = this.results[0]
    const lastNumbers = lastResult ? lastResult.dezenas.map(n => parseInt(n)) : []
    
    let selectedNumbers: number[] = []
    const weights: { [key: number]: number } = {}
    
    switch (strategy) {
      case 'hot':
        // Dar mais peso para números quentes
        stats.forEach(stat => {
          weights[stat.number] = stat.isHot ? 3 : stat.isCold ? 0.5 : 1
        })
        break
        
      case 'cold':
        // Dar mais peso para números frios
        stats.forEach(stat => {
          weights[stat.number] = stat.isCold ? 3 : stat.isHot ? 0.5 : 1
        })
        break
        
      case 'mixed':
        // Misturar quentes e frios
        stats.forEach(stat => {
          weights[stat.number] = 1
          if (stat.isHot) weights[stat.number] *= 1.5
          if (stat.isCold) weights[stat.number] *= 1.5
        })
        break
        
      default: // balanced
        // Distribuição equilibrada
        stats.forEach(stat => {
          weights[stat.number] = 1 / (Math.abs(stat.frequency - 15) + 1)
        })
        break
    }
    
    // Seleção ponderada
    while (selectedNumbers.length < 15) {
      const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
      let random = Math.random() * totalWeight
      
      for (const [num, weight] of Object.entries(weights)) {
        const number = parseInt(num)
        if (selectedNumbers.includes(number)) continue
        
        random -= weight
        if (random <= 0) {
          selectedNumbers.push(number)
          break
        }
      }
    }
    
    selectedNumbers.sort((a, b) => a - b)
    
    // Calcular estatísticas do jogo gerado
    const gameStats = {
      totalFrequency: selectedNumbers.reduce((sum, num) => {
        const stat = stats.find(s => s.number === num)
        return sum + (stat?.frequency || 0)
      }, 0),
      averageFrequency: 0,
      hotCount: selectedNumbers.filter(num => {
        const stat = stats.find(s => s.number === num)
        return stat?.isHot || false
      }).length,
      coldCount: selectedNumbers.filter(num => {
        const stat = stats.find(s => s.number === num)
        return stat?.isCold || false
      }).length,
      repeatedFromLast: selectedNumbers.filter(num => lastNumbers.includes(num)).length
    }
    
    gameStats.averageFrequency = gameStats.totalFrequency / 15
    
    return {
      numbers: selectedNumbers,
      stats: gameStats
    }
  }
  
  // Gerar múltiplos jogos
  generateMultipleGames(count: number = 5): GeneratedGame[] {
    const games: GeneratedGame[] = []
    const strategies: Array<'balanced' | 'hot' | 'cold' | 'mixed'> = [
      'balanced', 'hot', 'cold', 'mixed', 'balanced'
    ]
    
    for (let i = 0; i < count; i++) {
      const strategy = strategies[i % strategies.length]
      games.push(this.generateSmartGame(strategy))
    }
    
    return games
  }
  
  // Prever números para próximo sorteio baseado em padrões
  predictNextDraw(): number[] {
    const stats = this.calculateFrequencies()
    const lastResult = this.results[0]
    const lastNumbers = lastResult ? lastResult.dezenas.map(n => parseInt(n)) : []
    
    // Análise de padrões
    const predictions: number[] = []
    
    // Números que estão há mais tempo sem sair
    const coldNumbers = stats
      .filter(s => s.isCold && s.lastAppearance !== null)
      .sort((a, b) => (a.lastAppearance || 0) - (b.lastAppearance || 0))
      .slice(0, 5)
      .map(s => s.number)
    
    // Números quentes que saíram no último resultado
    const hotFromLast = lastNumbers.filter(num => {
      const stat = stats.find(s => s.number === num)
      return stat?.isHot
    })
    
    // Combinar
    predictions.push(...coldNumbers.slice(0, 8))
    predictions.push(...hotFromLast.slice(0, 5))
    
    // Completar com números aleatórios balanceados
    const remaining = stats
      .filter(s => !predictions.includes(s.number))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 15 - predictions.length)
      .map(s => s.number)
    
    predictions.push(...remaining)
    predictions.sort((a, b) => a - b)
    
    return predictions.slice(0, 15)
  }
}