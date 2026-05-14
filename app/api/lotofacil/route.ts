import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('palpites')
      .select('*')
      .order('data_criacao', { ascending: false })
    
    if (error) throw error
    
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Erro ao buscar:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar palpites' },
      { status: 500 }
    )
  }
}