# 💌 Correio Elegante (Dyzo Elegante)

Uma aplicação web interativa e temática de Festa Junina que moderniza a tradição do "Correio Elegante". Em vez de recadinhos de papel, o projeto utiliza **Inteligência Artificial Generativa** para criar mensagens personalizadas e divertidas em tempo real, baseadas no destinatário e no "tom" escolhido pelo usuário.

## ✨ Funcionalidades

* **Geração Dinâmica com IA:** Integração com LLM via backend em Node.js para redigir textos criativos em 4 estilos diferentes (Fofo 🥰, Engraçado 😂, Caipira 🤠, Ousado 😏).
* **Animações e Interface Temática:**
  * Fundo imersivo simulando uma colcha de retalhos (poá, xadrez e listrado) gerada inteiramente via CSS.
  * Varal de bandeirinhas renderizado dinamicamente com base no redimensionamento da tela (clip-path).
  * Chuva responsiva de emojis juninos limitados às margens (Mobile/Desktop friendly).
* **Segurança de API:** Backend em Node.js blindado com variáveis de ambiente (`.env`) para ocultar a chave da IA do lado do cliente.
* **Layout Responsivo:** A interface se adapta perfeitamente tanto a telas de celular (mobile-first) quanto a monitores desktop.

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Flexbox, Animações Keyframes, Clip-path, Gradientes), Vanilla JavaScript.
* **Backend:** Node.js, Express.
* **Integração:** API de IA Generativa (Prompt Engineering para personificação do correio elegante).

## 🚀 Como rodar o projeto localmente

Siga os passos abaixo para executar a aplicação na sua máquina:

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

### 2. Clonar o repositório
```bash
git clone [https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git](https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git)
cd NOME_DO_REPOSITORIO

```

### 3. Instalar dependências

O projeto utiliza bibliotecas básicas do ecossistema Node (como o `express` e o `dotenv`).

```bash
npm install

```

### 4. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto e adicione a sua chave de API secreta:

```env
MINHA_CHAVE_IA=sk-sua-chave-aqui
PORT=3000

```

*(Nota: O arquivo `.env` já está no `.gitignore` para não vazar credenciais).*

### 5. Iniciar o servidor

```bash
node server.js

```

O servidor estará rodando. Basta abrir o navegador e acessar: `http://localhost:3000`

## ☁️ Deploy

A aplicação está configurada para ser facilmente hospedada como um *Web Service* em plataformas de nuvem modernas (como **Render**, **Railway** ou **Vercel**), exigindo apenas a injeção da variável de ambiente `MINHA_CHAVE_IA` no painel da provedora.

---

**Desenvolvido com 🌽 e muito código para a @festadyzo.**

```