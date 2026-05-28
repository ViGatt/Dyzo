require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

const apiKey = process.env.MINHA_CHAVE_IA;

// --- PLANO DE CONTINGÊNCIA (FALLBACK) ---
// Se a IA gratuita congestionar no pico da festa, o sistema sorteia uma dessas.
const frasesDeEmergencia = {
    fofo: [
        "[PARA], o(a) [DE] mandou avisar que o sorriso seu é mais doce que maçã do amor!",
        "Atenção [PARA]: você é a fogueira que aquece o coração do(a) [DE] nessa festa.",
        "[PARA], se beleza fosse flor, você seria o jardim inteiro do(a) [DE]! 🥰"
    ],
    engracado: [
        "[PARA], o(a) [DE] não é barraca do beijo, mas tá aceitando negócio!",
        "Avisa o(a) [PARA] que o(a) [DE] disse que você é o milho que faltava na pamonha dele(a)!",
        "[PARA], o(a) [DE] quer saber se você é fogueira, porque ele(a) tá derretendo por você! 😂"
    ],
    caipira: [
        "Ô [PARA], o(a) [DE] mandou avisar que o coração dele(a) pula por ocê que nem pipoca na panela!",
        "Êta trem bão! O(a) [DE] tá arrastando a asa pro ce, [PARA]! 🤠",
        "[PARA], o(a) [DE] disse que ocê é mais cobiçado(a) que o prêmio do bingo!"
    ],
    ousado: [
        "[PARA], o(a) [DE] quer saber se tem espaço pra ele(a) pular a fogueira do seu coração. 😏",
        "A festa tá boa, [PARA], mas o(a) [DE] quer saber que horas a boca de vocês vai se encontrar.",
        "[PARA], o(a) [DE] mandou o correio, mas o que ele(a) quer mesmo é te entregar um beijo."
    ]
};

app.post('/api/correio', async (req, res) => {
    let de = req.body.de || "Alguém secreto";
    let para = req.body.para;
    let tom = req.body.tom || "fofo";

    let prompt = `Escreva um correio elegante de festa junina.
    REMETENTE: ${de}
    DESTINATÁRIO: ${para}
    TOM DA MENSAGEM: ${tom}
    
    Crie uma mensagem muito curta (no máximo 2 linhas).
    
    REGRAS ESTABELECIDAS (OBRIGATÓRIO SEGUIR TODAS):
    1. DIRECIONAMENTO EXATO: A mensagem DEVE ser escrita em primeira pessoa. O REMETENTE (${de}) está falando diretamente com o DESTINATÁRIO (${para}).
    2. ZERO CONFUSÃO: Nunca trate o remetente como se fosse o destinatário. O destinatário é o único foco da cantada.
    3. PROIBIDO REPETIÇÕES: NUNCA repita a mesma palavra para forçar uma rima (ex: não rime "roça" com "roça") e NÃO repita o nome das pessoas duas vezes na mesma frase.
    4. VOCABULÁRIO LÓGICO: Use elementos naturais de festa junina (fogueira, quentão, milho, pipoca, balão, quadrilha), mas garanta que a frase tenha sentido real no português. Não invente expressões sem nexo.
    
    RESPONDA APENAS COM O TEXTO FINAL DA MENSAGEM.`;

    try {
        // Tenta a sorte com a IA gratuita
        const respostaOpenRouter = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://festadyzo.com",
                "X-Title": "Dyzo Elegante"
            },
            body: JSON.stringify({
                model: "openrouter/free", 
                messages: [{ role: "user", content: prompt }],
                temperature: 0.9
            })
        });

        const dados = await respostaOpenRouter.json();

        // Se o OpenRouter der erro ou congestionar, nós mesmos forçamos o erro para cair no "catch"
        if (!respostaOpenRouter.ok || !dados.choices) {
            throw new Error("Servidor da IA ocupado");
        }

        const textoGerado = dados.choices[0].message.content.trim();
        res.json({ mensagem: textoGerado });
        
    } catch (erro) {
        console.warn("IA congestionada. Acionando Plano B (Fallback) para não travar o usuário...");
        
        // 1. Pega a lista de frases do tom que a pessoa escolheu (ou cai no fofo se der erro)
        const listaFrases = frasesDeEmergencia[tom] || frasesDeEmergencia.fofo;
        
        // 2. Sorteia uma frase aleatória dessa lista
        const fraseSorteada = listaFrases[Math.floor(Math.random() * listaFrases.length)];
        
        // 3. Substitui as tags [DE] e [PARA] pelos nomes digitados
        const mensagemFinal = fraseSorteada.replace("[DE]", de).replace("[PARA]", para);
        
        // 4. Devolve para o celular como se tivesse sido a IA que pensou!
        res.json({ mensagem: mensagemFinal });
    }
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Correio elegante rodando na porta ${PORT}`);
    });
}

module.exports = app;