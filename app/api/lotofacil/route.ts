import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
  try {
    const { numeros } = await request.json()
    
    if (!numeros || numeros.length !== 15) {
      return NextResponse.json(
        { error: 'Selecione exatamente 15 números' },
        { status: 400 }
      )
    }
    
    const { data, error } = await supabase
      .from('palpites')
      .insert([{ 
        numeros: numeros,
        data_criacao: new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      message: 'Palpite salvo com sucesso!'
    })
    
  } catch (error) {
    console.error('Erro ao salvar:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar palpite' },
      { status: 500 }
    )
  }
}