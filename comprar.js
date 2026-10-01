// ==========================================
// COMPRAR.JS
// LOJA SHALOM EMBALAGENS
// ==========================================

(function () {

    "use strict";

    // ==========================================
    // PROTEÇÃO DO CLIENTE
    // ==========================================

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (tipoUsuario !== "cliente") {
        window.location.href = "login.html";
        return;
    }


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const listaProdutos = document.getElementById("listaProdutos");
    const listaResumo = document.getElementById("listaResumo");
    const totalElemento = document.getElementById("total");
    const btnContinuar = document.getElementById("btnContinuar");
    const nomeCliente = document.getElementById("nomeCliente");
    const btnSair = document.getElementById("btnSair");


    // ==========================================
    // PRODUTOS PADRÃO
    // ==========================================

    const produtosPadrao = [

        {
            id: "caixa",
            nome: "Caixa de Papelão",
            preco: 10.90,
            estoque: 0,
            observacao: "Produto da Loja Shalom.",
            imagem: "caixa-de-papelao.webp"
        },

        {
            id: "sacola",
            nome: "Sacola Kraft",
            preco: 10.50,
            estoque: 0,
            observacao: "Produto da Loja Shalom.",
            imagem: ""
        },

        {
            id: "delivery",
            nome: "Embalagem Delivery",
            preco: 10.00,
            estoque: 0,
            observacao: "Produto da Loja Shalom.",
            imagem: "embalagens.jpg"
        },

        {
            id: "copo",
            nome: "Copo Descartável",
            preco: 10.90,
            estoque: 0,
            observacao: "Produto da Loja Shalom.",
            imagem: "copos.png.webp"
        }
    ];


    // ==========================================
    // NOME DO CLIENTE
    // ==========================================

    function mostrarNomeCliente() {

        if (!nomeCliente) {
            return;
        }

        const nome =
            localStorage.getItem("clienteNome") ||
            localStorage.getItem("usuarioNome") ||
            localStorage.getItem("nomeUsuario") ||
            "Cliente";

        nomeCliente.textContent = nome;
    }


    // ==========================================
    // ESCAPAR HTML
    // ==========================================

    function escapeHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ==========================================
    // FORMATAR DINHEIRO
    // ==========================================

    function formatarMoeda(valor) {

        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    // ==========================================
    // PEGAR PRODUTOS
    // ==========================================

    function pegarProdutos() {

        let produtos = [];

        try {

            produtos =
                JSON.parse(
                    localStorage.getItem("produtosShalom")
                ) || [];

        } catch (erro) {

            console.error(
                "Erro ao ler produtos:",
                erro
            );

            produtos = [];
        }


        // Se não existir nenhum produto,
        // usa os produtos padrão.

        if (!Array.isArray(produtos) || produtos.length === 0) {

            produtos = produtosPadrao;

            localStorage.setItem(
                "produtosShalom",
                JSON.stringify(produtos)
            );
        }


        return produtos;
    }


    // ==========================================
    // NORMALIZAR PRODUTO
    // ==========================================

    function normalizarProduto(produto, index) {

        return {

            id:
                produto.id ??
                `produto-${index}`,

            nome:
                produto.nome ??
                "Produto",

            preco:
                Number(produto.preco) || 0,

            estoque:
                Math.max(
                    0,
                    parseInt(produto.estoque, 10) || 0
                ),

            observacao:
                produto.observacao ??
                "Produto da Loja Shalom.",

            imagem:
                produto.imagem ??
                ""
        };
    }


    // ==========================================
    // PRODUTOS
    // ==========================================

    let produtos = pegarProdutos()
        .map(normalizarProduto);


    // ==========================================
    // RENDERIZAR PRODUTOS
    // ==========================================

    function renderizarProdutos() {

        if (!listaProdutos) {
            return;
        }


        if (produtos.length === 0) {

            listaProdutos.innerHTML = `
                <p>
                    Nenhum produto disponível.
                </p>
            `;

            return;
        }


        listaProdutos.innerHTML =
            produtos.map((produto, index) => {

                const semEstoque =
                    produto.estoque <= 0;

                const idProduto =
                    `produto_${index}`;

                const idQuantidade =
                    `quantidade_${index}`;


                return `

                    <div
                        class="produto-card"
                        data-produto-id="${escapeHTML(produto.id)}"
                    >

                        ${
                            produto.imagem
                            ?
                            `
                            <div class="produto-imagem">
                                <img
                                    src="${escapeHTML(produto.imagem)}"
                                    alt="${escapeHTML(produto.nome)}"
                                    onerror="this.style.display='none'"
                                >
                            </div>
                            `
                            :
                            ""
                        }


                        <h3>
                            ${escapeHTML(produto.nome)}
                        </h3>


                        <p class="produto-observacao">
                            ${escapeHTML(produto.observacao)}
                        </p>


                        <strong class="produto-preco">
                            ${formatarMoeda(produto.preco)}
                        </strong>


                        <p class="produto-estoque">

                            ${
                                semEstoque
                                ?
                                `
                                <span style="color:red;">
                                    Produto sem estoque
                                </span>
                                `
                                :
                                `
                                Estoque disponível:
                                ${produto.estoque}
                                `
                            }

                        </p>


                        <label
                            for="${idProduto}"
                            style="
                                display:block;
                                margin-top:10px;
                                cursor:pointer;
                            "
                        >

                            <input
                                type="checkbox"
                                id="${idProduto}"
                                class="produto-check"
                                data-index="${index}"
                                ${
                                    semEstoque
                                    ? "disabled"
                                    : ""
                                }
                            >

                            Selecionar item

                        </label>


                        <label
                            for="${idQuantidade}"
                            style="
                                display:block;
                                margin-top:10px;
                            "
                        >
                            Quantidade:
                        </label>


                        <input
                            type="number"
                            id="${idQuantidade}"
                            class="produto-quantidade"
                            data-index="${index}"
                            min="1"
                            max="${produto.estoque}"
                            step="1"
                            value="1"
                            ${
                                semEstoque
                                ? "disabled"
                                : ""
                            }
                        >

                    </div>

                `;

            }).join("");


        adicionarEventosProdutos();
    }


    // ==========================================
    // CORRIGIR QUANTIDADE
    // ==========================================

    function corrigirQuantidade(input, produto) {

        if (!input) {
            return 1;
        }


        let quantidade =
            parseInt(input.value, 10);


        // Evita NaN

        if (isNaN(quantidade)) {
            quantidade = 1;
        }


        // Nunca permite quantidade menor que 1

        if (quantidade < 1) {
            quantidade = 1;
        }


        // Nunca permite quantidade maior que o estoque

        if (
            produto.estoque > 0 &&
            quantidade > produto.estoque
        ) {

            quantidade = produto.estoque;
        }


        // IMPORTANTE:
        // remove zeros à esquerda.
        //
        // Exemplo:
        // 01 -> 1
        // 0111 -> 111

        input.value = String(quantidade);


        return quantidade;
    }


    // ==========================================
    // EVENTOS DOS PRODUTOS
    // ==========================================

    function adicionarEventosProdutos() {

        const checks =
            document.querySelectorAll(
                ".produto-check"
            );


        const quantidades =
            document.querySelectorAll(
                ".produto-quantidade"
            );


        // ======================================
        // CHECKBOX
        // ======================================

        checks.forEach(check => {

            check.addEventListener(
                "change",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    const produto =
                        produtos[index];


                    const inputQuantidade =
                        document.querySelector(
                            `.produto-quantidade[data-index="${index}"]`
                        );


                    if (this.checked) {

                        corrigirQuantidade(
                            inputQuantidade,
                            produto
                        );
                    }


                    atualizarResumo();
                }
            );

        });


        // ======================================
        // QUANTIDADE
        // ======================================

        quantidades.forEach(input => {

            input.addEventListener(
                "input",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    const produto =
                        produtos[index];


                    // Remove tudo que não seja número

                    this.value =
                        this.value.replace(
                            /\D/g,
                            ""
                        );


                    // Se ficar vazio,
                    // não força imediatamente no input.

                    if (this.value === "") {

                        atualizarResumo();

                        return;
                    }


                    // Remove zeros à esquerda

                    let valor =
                        parseInt(
                            this.value,
                            10
                        );


                    if (isNaN(valor)) {
                        valor = 1;
                    }


                    if (valor < 1) {
                        valor = 1;
                    }


                    if (
                        produto.estoque > 0 &&
                        valor > produto.estoque
                    ) {

                        valor =
                            produto.estoque;
                    }


                    this.value =
                        String(valor);


                    atualizarResumo();
                }
            );


            input.addEventListener(
                "blur",
                function () {

                    const index =
                        Number(
                            this.dataset.index
                        );


                    const produto =
                        produtos[index];


                    corrigirQuantidade(
                        this,
                        produto
                    );


                    atualizarResumo();
                }
            );

        });

    }


    // ==========================================
    // PEGAR ITENS SELECIONADOS
    // ==========================================

    function pegarSelecionados() {

        const selecionados = [];


        const checks =
            document.querySelectorAll(
                ".produto-check:checked"
            );


        checks.forEach(check => {

            const index =
                Number(
                    check.dataset.index
                );


            const produto =
                produtos[index];


            if (!produto) {
                return;
            }


            const inputQuantidade =
                document.querySelector(
                    `.produto-quantidade[data-index="${index}"]`
                );


            const quantidade =
                corrigirQuantidade(
                    inputQuantidade,
                    produto
                );


            if (quantidade <= 0) {
                return;
            }


            const subtotal =
                produto.preco *
                quantidade;


            selecionados.push({

                id: produto.id,

                nome: produto.nome,

                preco: produto.preco,

                quantidade: quantidade,

                subtotal: subtotal,

                observacao:
                    produto.observacao || "",

                imagem:
                    produto.imagem || ""
            });

        });


        return selecionados;
    }


    // ==========================================
    // ATUALIZAR RESUMO
    // ==========================================

    function atualizarResumo() {

        if (!listaResumo || !totalElemento) {
            return;
        }


        const selecionados =
            pegarSelecionados();


        // ======================================
        // NENHUM PRODUTO
        // ======================================

        if (selecionados.length === 0) {

            listaResumo.innerHTML = `
                <p>
                    Nenhum produto selecionado.
                </p>
            `;

            totalElemento.textContent =
                formatarMoeda(0);

            if (btnContinuar) {
                btnContinuar.disabled = true;
            }

            return;
        }


        // ======================================
        // CALCULAR TOTAL
        // ======================================

        let total = 0;


        listaResumo.innerHTML =
            selecionados.map(item => {

                total += item.subtotal;


                return `

                    <div
                        class="resumo-item"
                        style="
                            padding:10px 0;
                            border-bottom:1px solid #ddd;
                        "
                    >

                        <strong>
                            ${escapeHTML(item.nome)}
                        </strong>

                        <br>

                        Quantidade:
                        ${item.quantidade}

                        <br>

                        Valor unitário:
                        ${formatarMoeda(item.preco)}

                        <br>

                        Subtotal:
                        <strong>
                            ${formatarMoeda(item.subtotal)}
                        </strong>

                    </div>

                `;

            }).join("");


        totalElemento.textContent =
            formatarMoeda(total);


        if (btnContinuar) {
            btnContinuar.disabled = false;
        }
    }


    // ==========================================
    // CONTINUAR PARA PAGAMENTO
    // ==========================================

    function continuarPagamento() {

        const selecionados =
            pegarSelecionados();


        if (selecionados.length === 0) {

            alert(
                "Selecione pelo menos um produto."
            );

            return;
        }


        const total =
            selecionados.reduce(
                (soma, item) =>
                    soma + item.subtotal,
                0
            );


        const carrinho = {

            itens: selecionados,

            total: total,

            data:
                new Date().toISOString()
        };


        localStorage.setItem(
            "carrinhoCompra",
            JSON.stringify(carrinho)
        );


        window.location.href =
            "pagamento.html";
    }


    // ==========================================
    // BOTÃO CONTINUAR
    // ==========================================

    if (btnContinuar) {

        btnContinuar.addEventListener(
            "click",
            continuarPagamento
        );
    }


    // ==========================================
    // SAIR
    // ==========================================

    if (btnSair) {

        btnSair.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "tipoUsuario"
                );

                localStorage.removeItem(
                    "usuarioLogado"
                );

                localStorage.removeItem(
                    "usuarioNome"
                );

                localStorage.removeItem(
                    "nomeUsuario"
                );

                localStorage.removeItem(
                    "clienteNome"
                );

                localStorage.removeItem(
                    "clienteEmail"
                );


                window.location.href =
                    "login.html";
            }
        );
    }


    // ==========================================
    // INICIAR
    // ==========================================

    mostrarNomeCliente();

    renderizarProdutos();

    atualizarResumo();

})();