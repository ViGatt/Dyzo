require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Pegando a sua chave que estará configurada na Vercel
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
        // Fazendo a chamada direta para o endpoint do OpenRouter
        const respostaOpenRouter = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://vercel.com", // Opcional (ajuda no ranking do OpenRouter)
                "X-Title": "Dyzo Elegante"          // Opcional
            },
            body: JSON.stringify({
                // Usando o Llama 3 8B Gratuito (Excelente para tarefas rápidas e criativas)
                model: "meta-llama/llama-3-8b-instruct:free", 
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0.9
            })
        });

        const dados = await respostaOpenRouter.json();

        if (!respostaOpenRouter.ok) {
            console.error("Erro retornado pelo OpenRouter:", dados);
            throw new Error("Falha na comunicação com OpenRouter");
        }

        // Extraindo o texto gerado pelo modelo do OpenRouter
        const textoGerado = dados.choices[0].message.content.trim();

        res.json({ mensagem: textoGerado });
        
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Eita, deu problema na fogueira!" });
    }
});

// Trava de segurança para ambiente local vs produção (Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Correio elegante rodando na porta ${PORT}`);
    });
}

module.exports = app;