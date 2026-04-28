// api/criar-cobranca.js - Função serverless para GitHub Pages
// Esta função atua como um "proxy" para chamar a API do Asaas com segurança

export async function onRequest(context) {
    // Permitir requisições de qualquer origem (CORS)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    // Responder requisições OPTIONS (pré-voo CORS)
    if (context.request.method === 'OPTIONS') {
        return new Response(null, { headers, status: 204 });
    }
    
    // Aceitar apenas POST
    if (context.request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Método não permitido' }), { headers, status: 405 });
    }
    
    try {
        // Pegar dados enviados pelo checkout
        const dados = await context.request.json();
        
        // Configuração do Asaas
        const ASAAS_API_TOKEN = dados.token; // Token enviado do frontend
        const ASAAS_API_URL = 'https://api.asaas.com/v3';
        
        // 1. Criar cliente no Asaas
        const clienteResponse = await fetch(`${ASAAS_API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access_token': ASAAS_API_TOKEN
            },
            body: JSON.stringify({
                name: dados.nome,
                email: dados.email,
                phone: dados.telefone?.replace(/\D/g, ''),
                cpfCnpj: dados.cpf
            })
        });
        
        const cliente = await clienteResponse.json();
        
        if (!clienteResponse.ok) {
            throw new Error(cliente.errors?.[0]?.description || 'Erro ao criar cliente');
        }
        
        // 2. Criar cobrança
        const cobrancaData = {
            customer: cliente.id,
            billingType: dados.formaPagamento === 'pix' ? 'PIX' : 'CREDIT_CARD',
            value: dados.preco,
            dueDate: new Date().toISOString().split('T')[0],
            description: dados.nomePlano,
            installmentCount: dados.formaPagamento === 'cartao' ? dados.parcelas : undefined,
            installmentValue: dados.formaPagamento === 'cartao' ? (dados.preco / dados.parcelas).toFixed(2) : undefined
        };
        
        const cobrancaResponse = await fetch(`${ASAAS_API_URL}/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'access_token': ASAAS_API_TOKEN
            },
            body: JSON.stringify(cobrancaData)
        });
        
        const cobranca = await cobrancaResponse.json();
        
        if (!cobrancaResponse.ok) {
            throw new Error(cobranca.errors?.[0]?.description || 'Erro ao criar cobrança');
        }
        
        // Retornar os dados da cobrança
        return new Response(JSON.stringify({
            success: true,
            paymentId: cobranca.id,
            pixQrCode: cobranca.pixQrCode,
            pixQrCodeUrl: cobranca.pixQrCodeUrl,
            invoiceUrl: cobranca.invoiceUrl
        }), { headers, status: 200 });
        
    } catch (error) {
        console.error('Erro:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), { headers, status: 500 });
    }
}
