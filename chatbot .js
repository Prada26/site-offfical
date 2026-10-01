// ==========================================
// CHATBOT SHALOM EMBALAGENS
// ==========================================

(function () {

    "use strict";

    // ==========================================
    // SÓ MOSTRAR NA LOJA
    // ==========================================

    const pagina =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

    if (
        pagina !== "comprar.html" &&
        pagina !== ""
    ) {
        return;
    }


    // ==========================================
    // NÃO CRIAR DUAS VEZES
    // ==========================================

    if (document.getElementById("chatbotShalom")) {
        return;
    }


    // ==========================================
    // CSS DO CHAT
    // ==========================================

    const estilo =
        document.createElement("style");

    estilo.textContent = `

        #chatbotShalom {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 99999;
            font-family: Arial, sans-serif;
        }

        #chatbotBotao {
            width: 60px;
            height: 60px;
            border: none;
            border-radius: 50%;
            background: #25D366;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.25);
        }

        #chatbotBotao:hover {
            transform: scale(1.05);
        }

        #chatbotJanelaShalom {
            display: none;
            position: absolute;
            right: 0;
            bottom: 75px;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 18px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.30);
            overflow: hidden;
            flex-direction: column;
        }

        #chatbotJanelaShalom.aberto {
            display: flex;
        }

        #chatbotTopo {
            background: #198754;
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #chatbotTopo strong {
            display: block;
            font-size: 16px;
        }

        #chatbotTopo small {
            opacity: 0.9;
        }

        #chatbotFechar {
            border: none;
            background: transparent;
            color: white;
            font-size: 22px;
            cursor: pointer;
        }

        #chatbotMensagensShalom {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f5f5f5;
        }

        .shalomBot {
            background: white;
            padding: 11px 13px;
            border-radius: 12px;
            margin-bottom: 10px;
            max-width: 85%;
            line-height: 1.45;
            color: #222;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .shalomCliente {
            background: #dcf8c6;
            padding: 11px 13px;
            border-radius: 12px;
            margin-bottom: 10px;
            margin-left: auto;
            max-width: 85%;
            line-height: 1.45;
            color: #222;
        }

        #chatbotSugestoesShalom {
            display: flex;
            gap: 5px;
            padding: 8px;
            overflow-x: auto;
            background: white;
            border-top: 1px solid #ddd;
        }

        #chatbotSugestoesShalom button {
            white-space: nowrap;
            border: 1px solid #198754;
            background: white;
            color: #198754;
            border-radius: 20px;
            padding: 7px 10px;
            cursor: pointer;
        }

        #chatbotSugestoesShalom button:hover {
            background: #198754;
            color: white;
        }

        #chatbotFormShalom {
            display: flex;
            padding: 10px;
            gap: 8px;
            background: white;
            border-top: 1px solid #ddd;
        }

        #chatbotInputShalom {
            flex: 1;
            border: 1px solid #ccc;
            border-radius: 20px;
            padding: 11px 14px;
            outline: none;
            font-size: 14px;
        }

        #chatbotFormShalom button {
            width: 42px;
            border: none;
            border-radius: 50%;
            background: #198754;
            color: white;
            font-size: 18px;
            cursor: pointer;
        }

        @media (max-width: 500px) {

            #chatbotJanelaShalom {
                width: calc(100vw - 30px);
                right: -5px;
                height: 70vh;
            }

            #chatbotShalom {
                right: 15px;
                bottom: 15px;
            }

        }

    `;

    document.head.appendChild(estilo);


    // ==========================================
    // CRIAR CHAT
    // ==========================================

    const chat =
        document.createElement("div");

    chat.id =
        "chatbotShalom";


    chat.innerHTML = `

        <button
            id="chatbotBotao"
            type="button"
            aria-label="Abrir atendimento"
        >
            💬
        </button>


        <div id="chatbotJanelaShalom">

            <div id="chatbotTopo">

                <div>

                    <strong>
                        🤖 Assistente Shalom
                    </strong>

                    <small>
                        Atendimento automático
                    </small>

                </div>

                <button
                    id="chatbotFechar"
                    type="button"
                >
                    ✕
                </button>

            </div>


            <div id="chatbotMensagensShalom">

                <div class="shalomBot">

                    👋 Olá! Seja bem-vindo à
                    <strong>Loja Shalom Embalagens</strong>!

                    <br><br>

                    Sou o assistente virtual da loja.

                    <br><br>

                    Pode me perguntar sobre:

                    <br><br>

                    📦 Produtos<br>
                    💰 Preços<br>
                    📊 Estoque<br>
                    🛒 Como comprar<br>
                    💳 Pagamento<br>
                    📋 Pedidos

                    <br><br>

                    Como posso ajudar?

                </div>

            </div>


            <div id="chatbotSugestoesShalom">

                <button type="button" data-chat="produtos">
                    📦 Produtos
                </button>

                <button type="button" data-chat="precos">
                    💰 Preços
                </button>

                <button type="button" data-chat="estoque">
                    📊 Estoque
                </button>

                <button type="button" data-chat="comprar">
                    🛒 Comprar
                </button>

            </div>


            <form id="chatbotFormShalom">

                <input
                    id="chatbotInputShalom"
                    type="text"
                    placeholder="Digite sua dúvida..."
                    autocomplete="off"
                >

                <button type="submit">
                    ➤
                </button>

            </form>

        </div>

    `;


    document.body.appendChild(chat);


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const botao =
        document.getElementById(
            "chatbotBotao"
        );

    const janela =
        document.getElementById(
            "chatbotJanelaShalom"
        );

    const fechar =
        document.getElementById(
            "chatbotFechar"
        );

    const mensagens =
        document.getElementById(
            "chatbotMensagensShalom"
        );

    const form =
        document.getElementById(
            "chatbotFormShalom"
        );

    const input =
        document.getElementById(
            "chatbotInputShalom"
        );


    // ==========================================
    // ABRIR
    // ==========================================

    botao.addEventListener(
        "click",
        function () {

            janela.classList.add("aberto");

            input.focus();

        }
    );


    // ==========================================
    // FECHAR
    // ==========================================

    fechar.addEventListener(
        "click",
        function () {

            janela.classList.remove("aberto");

        }
    );


    // ==========================================
    // PRODUTOS
    // ==========================================

    function produtos() {

        try {

            const dados =
                localStorage.getItem(
                    "produtosShalom"
                );

            if (!dados) {

                return [];

            }

            const lista =
                JSON.parse(dados);

            if (!Array.isArray(lista)) {

                return [];

            }

            return lista;

        } catch (erro) {

            console.error(erro);

            return [];

        }

    }


    // ==========================================
    // DINHEIRO
    // ==========================================

    function dinheiro(valor) {

        return Number(valor || 0)
            .toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

    }


    // ==========================================
    // NORMALIZAR
    // ==========================================

    function normalizar(texto) {

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .trim();

    }


    // ==========================================
    // ADICIONAR CLIENTE
    // ==========================================

    function cliente(texto) {

        const div =
            document.createElement("div");

        div.className =
            "shalomCliente";

        div.textContent =
            texto;

        mensagens.appendChild(div);

        mensagens.scrollTop =
            mensagens.scrollHeight;

    }


    // ==========================================
    // ADICIONAR BOT
    // ==========================================

    function bot(texto) {

        const div =
            document.createElement("div");

        div.className =
            "shalomBot";

        div.innerHTML =
            texto;

        mensagens.appendChild(div);

        mensagens.scrollTop =
            mensagens.scrollHeight;

    }


    // ==========================================
    // RESPONDER
    // ==========================================

    function responder(pergunta) {

        const texto =
            normalizar(pergunta);


        // ==============================
        // OLÁ
        // ==============================

        if (
            texto === "oi" ||
            texto === "ola" ||
            texto.includes("bom dia") ||
            texto.includes("boa tarde") ||
            texto.includes("boa noite") ||
            texto.includes("tudo bem")
        ) {

            return `
                👋 Olá!
                <br><br>

                Tudo bem! 😊
                <br><br>

                Sou o assistente da
                <strong>Loja Shalom Embalagens</strong>.
                <br><br>

                Como posso ajudar você?
            `;

        }


        // ==============================
        // PRODUTOS
        // ==============================

        if (
            texto.includes("produto") ||
            texto.includes("produtos") ||
            texto.includes("vende") ||
            texto.includes("venda") ||
            texto.includes("o que tem")
        ) {

            const lista =
                produtos();

            if (!lista.length) {

                return `
                    📦 No momento não encontrei
                    produtos cadastrados.
                `;

            }

            let resposta =
                "📦 <strong>Produtos da loja:</strong><br><br>";

            lista.forEach(
                function (p) {

                    resposta += `
                        📦 <strong>
                            ${p.nome || "Produto"}
                        </strong>
                        <br>

                        💰 ${dinheiro(p.preco)}

                        <br><br>
                    `;

                }
            );

            return resposta;

        }


        // ==============================
        // PREÇO
        // ==============================

        if (
            texto.includes("preco") ||
            texto.includes("precos") ||
            texto.includes("valor") ||
            texto.includes("quanto custa") ||
            texto.includes("quanto e")
        ) {

            const lista =
                produtos();

            if (!lista.length) {

                return `
                    💰 Não encontrei produtos
                    cadastrados.
                `;

            }

            let resposta =
                "💰 <strong>Preços:</strong><br><br>";

            lista.forEach(
                function (p) {

                    resposta += `
                        • ${p.nome || "Produto"}
                        —
                        <strong>
                            ${dinheiro(p.preco)}
                        </strong>
                        <br>
                    `;

                }
            );

            return resposta;

        }


        // ==============================
        // ESTOQUE
        // ==============================

        if (
            texto.includes("estoque") ||
            texto.includes("disponivel") ||
            texto.includes("disponibilidade") ||
            texto.includes("tem ainda")
        ) {

            const lista =
                produtos();

            if (!lista.length) {

                return `
                    📊 Não encontrei
                    informações de estoque.
                `;

            }

            let resposta =
                "📊 <strong>Estoque:</strong><br><br>";

            lista.forEach(
                function (p) {

                    const estoque =
                        Number(
                            p.estoque || 0
                        );

                    resposta += `
                        • ${p.nome || "Produto"}
                        —
                        ${
                            estoque > 0
                                ? "✅ Disponível"
                                : "❌ Sem estoque"
                        }
                        <br>
                    `;

                }
            );

            return resposta;

        }


        // ==============================
        // COMPRAR
        // ==============================

        if (
            texto.includes("comprar") ||
            texto.includes("compra") ||
            texto.includes("como faco") ||
            texto.includes("como comprar")
        ) {

            return `
                🛒 <strong>Para comprar:</strong>
                <br><br>

                1️⃣ Escolha o produto.<br>
                2️⃣ Informe a quantidade.<br>
                3️⃣ Confira o resumo.<br>
                4️⃣ Clique em
                <strong>Continuar para pagamento</strong>.<br>
                5️⃣ Informe seus dados.<br>
                6️⃣ Escolha o pagamento.<br>
                7️⃣ Confirme o pedido.
            `;

        }


        // ==============================
        // PAGAMENTO
        // ==============================

        if (
            texto.includes("pagamento") ||
            texto.includes("pagar") ||
            texto.includes("pix") ||
            texto.includes("cartao") ||
            texto.includes("credito") ||
            texto.includes("debito")
        ) {

            return `
                💳 <strong>Pagamento</strong>
                <br><br>

                Avance para a página de pagamento
                depois de selecionar seus produtos.
                <br><br>

                Lá você poderá escolher a forma
                de pagamento disponível na loja.
            `;

        }


        // ==============================
        // PEDIDO
        // ==============================

        if (
            texto.includes("pedido") ||
            texto.includes("pedidos") ||
            texto.includes("encomenda")
        ) {

            return `
                📋 <strong>Pedido</strong>
                <br><br>

                Escolha seus produtos, informe
                as quantidades e avance para
                o pagamento.
                <br><br>

                Depois confirme seu pedido.
            `;

        }


        // ==============================
        // ENTREGA
        // ==============================

        if (
            texto.includes("entrega") ||
            texto.includes("entregar") ||
            texto.includes("frete")
        ) {

            return `
                🚚 <strong>Entrega</strong>
                <br><br>

                As informações de entrega
                dependem das opções configuradas
                pela loja.
                <br><br>

                Consulte as informações disponíveis
                durante a finalização do pedido.
            `;

        }


        // ==============================
        // OBRIGADO
        // ==============================

        if (
            texto.includes("obrigado") ||
            texto.includes("obrigada") ||
            texto.includes("valeu")
        ) {

            return `
                😊 Por nada!
                <br><br>

                Estou à disposição.
            `;

        }


        // ==============================
        // NÃO ENTENDEU
        // ==============================

        return `
            🤔 Ainda estou aprendendo.
            <br><br>

            Tente perguntar:
            <br><br>

            📦 <strong>Quais produtos vocês vendem?</strong>
            <br>
            💰 <strong>Quais são os preços?</strong>
            <br>
            📊 <strong>Tem estoque?</strong>
            <br>
            🛒 <strong>Como faço para comprar?</strong>
            <br>
            💳 <strong>Como funciona o pagamento?</strong>
            <br>
            📋 <strong>Como funciona o pedido?</strong>
        `;

    }


    // ==========================================
    // ENVIAR
    // ==========================================

    function enviar(texto) {

        texto =
            String(texto || "").trim();


        if (!texto) {

            return;

        }


        cliente(texto);

        input.value = "";


        setTimeout(
            function () {

                bot(
                    responder(texto)
                );

            },
            400
        );

    }


    // ==========================================
    // FORMULÁRIO
    // ==========================================

    form.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            enviar(input.value);

        }
    );


    // ==========================================
    // BOTÕES
    // ==========================================

    document
        .querySelectorAll(
            "#chatbotSugestoesShalom button"
        )
        .forEach(
            function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        const tipo =
                            botao.dataset.chat;


                        const perguntas = {

                            produtos:
                                "Quais produtos vocês vendem?",

                            precos:
                                "Quais são os preços?",

                            estoque:
                                "Tem estoque?",

                            comprar:
                                "Como faço para comprar?"

                        };


                        enviar(
                            perguntas[tipo] || ""
                        );  "eu vendo saco de lixo"
                            "tenho sacolas "

                    }
                );

            }
        );


    // ==========================================
    // ENTER
    // ==========================================

    input.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.key === "Enter"
            ) {

                evento.preventDefault();

                form.requestSubmit();

            }

        }
    );


    console.log(
        "🤖 CHATBOT SHALOM FUNCIONANDO"
    );

})();