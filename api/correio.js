require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const apiKey = process.env.MINHA_CHAVE_IA;

app.post('/api/correio', async (req, res) => {
    let de = req.body.de;
    let para = req.body.para;
    let tom = req.body.tom;

    let prompt = `Você é um cupido de festa junina extremamente criativo, imprevisível e original. 
    Crie um correio elegante bem curto (máximo 2 linhas) de ${de} para ${para}. 
    O tom da mensagem deve ser: ${tom}. 
    
    REGRAS OBRIGATÓRIAS:
    - Evite frases clichês clássicas (fuja do óbvio).
    - Invente rimas inusitadas, trocadilhos novos ou cantadas caipiras originais.
    - Nunca repita a mesma estrutura de texto.
    - Responda apenas com a mensagem final, sem aspas ou introduções.`;

    try {
        const respostaOpenRouter = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://festadyzo.com", // Ajuda a evitar bloqueios
                "X-Title": "Dyzo Elegante"
            },
            body: JSON.stringify({
                // TROCAMOS O MODELO: Este modelo gratuito da Mistral é super rápido e raramente congestiona
                model: "mistralai/mistral-7b-instruct:free", 
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0.9
            })
        });

        const dados = await respostaOpenRouter.json();

        // SE O OPENROUTER NEGAR, VAMOS MANDAR O ERRO REAL PARA A TELA DO CELULAR
        if (!respostaOpenRouter.ok) {
            console.error("Erro OpenRouter:", dados);
            // Captura o erro exato (ex: 401 Unauthorized, 429 Rate Limit)
            const erroReal = dados.error?.message || `Erro código ${respostaOpenRouter.status}`;
            return res.status(500).json({ erro: `ERRO DO OPENROUTER: ${erroReal}` });
        }

        const textoGerado = dados.choices[0].message.content.trim();
        res.json({ mensagem: textoGerado });
        
    } catch (erro) {
        console.error("Erro no servidor da Vercel:", erro);
        res.status(500).json({ erro: "Erro interno do servidor Node.js. Verifique os logs da Vercel." });
    }
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Correio elegante rodando na porta ${PORT}`);
    });
}

module.exports = app;