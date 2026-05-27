require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json());

const apiKey = process.env.MINHA_CHAVE_IA;
const genAI = new GoogleGenerativeAI(apiKey);

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
        const model = genAI.getGenerativeModel({ 
            model: "gemini-3.5-flash",
            generationConfig: {
                temperature: 0.9, 
            }
        });
        
        const resultado = await model.generateContent(prompt);
        const textoGerado = resultado.response.text();

        res.json({ mensagem: textoGerado });
        
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Eita, deu problema na fogueira!" });
    }
});
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Correio elegante rodando na porta ${PORT}`);
    });
}

// A linha que a Vercel precisa para ler o seu backend
module.exports = app;