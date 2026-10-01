// ==========================================
// PAGAMENTO.JS
// LOJA SHALOM EMBALAGENS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    // ==========================================
    // PROTEÇÃO DO CLIENTE
    // ==========================================

    const tipoUsuario =
        localStorage.getItem("tipoUsuario");

    const usuarioLogado =
        localStorage.getItem("usuarioLogado");


    if (
        tipoUsuario !== "cliente" ||
        usuarioLogado !== "true"
    ) {

        window.location.href = "login.html";

        return;
    }


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const resumoPedido =
        document.getElementById(
            "resumoPedido"
        );


    const formulario =
        document.getElementById(
            "formPagamento"
        );


    const mensagem =
        document.getElementById(
            "mensagem"
        );


    const btnConfirmar =
        document.getElementById(
            "btnConfirmar"
        );


    // ==========================================
    // DINHEIRO
    // ==========================================

    function dinheiro(valor) {

        return Number(
            valor || 0
        ).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
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
    // MENSAGEM
    // ==========================================

    function mostrarMensagem(
        texto,
        tipo
    ) {

        if (!mensagem) {
            return;
        }


        mensagem.textContent =
            texto;


        mensagem.className =
            "mensagem " +
            (tipo || "");
    }


    // ==========================================
    // CARREGAR CARRINHO
    // ==========================================

    let dadosCarrinho = null;


    try {

        dadosCarrinho =
            JSON.parse(
                localStorage.getItem(
                    "carrinhoCompra"
                ) || "null"
            );

    } catch (erro) {

        console.error(
            "Erro ao carregar carrinho:",
            erro
        );

        dadosCarrinho = null;
    }


    // ==========================================
    // COMPATIBILIDADE COM OS DOIS FORMATOS
    // ==========================================

    let carrinho = [];


    /*
        FORMATO NOVO:

        {
            itens: [],
            total: 100,
            data: "..."
        }
    */


    if (
        dadosCarrinho &&
        !Array.isArray(dadosCarrinho) &&
        Array.isArray(dadosCarrinho.itens)
    ) {

        carrinho =
            dadosCarrinho.itens;

    }


    /*
        FORMATO ANTIGO:

        [
            {...},
            {...}
        ]
    */

    else if (
        Array.isArray(dadosCarrinho)
    ) {

        carrinho =
            dadosCarrinho;

    }


    // ==========================================
    // VERIFICAR CARRINHO
    // ==========================================

    if (
        !Array.isArray(carrinho) ||
        carrinho.length === 0
    ) {

        if (resumoPedido) {

            resumoPedido.innerHTML = `

                <p>
                    ❌ Nenhum produto foi selecionado.
                </p>

            `;
        }


        if (btnConfirmar) {

            btnConfirmar.disabled =
                true;
        }


        return;
    }


    // ==========================================
    // CALCULAR TOTAL
    // ==========================================

    const total =
        carrinho.reduce(
            (soma, item) => {

                const subtotal =
                    Number(
                        item.subtotal
                    ) || 0;


                return soma + subtotal;

            },
            0
        );


    // ==========================================
    // MOSTRAR RESUMO
    // ==========================================

    function mostrarResumo() {

        if (!resumoPedido) {
            return;
        }


        resumoPedido.innerHTML = "";


        carrinho.forEach(item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "item-pedido";


            const observacaoProduto =
                item.observacao &&
                String(
                    item.observacao
                ).trim()
                    ? `

                        <small class="item-observacao">

                            📝
                            ${escapeHTML(
                                item.observacao
                            )}

                        </small>

                    `
                    : "";


            div.innerHTML = `

                <div class="item-info">

                    <div class="item-nome">

                        ${escapeHTML(
                            item.nome
                        )}

                    </div>


                    <div class="item-quantidade">

                        Quantidade:
                        ${Number(
                            item.quantidade
                        ) || 0}

                    </div>


                    <div class="item-unitario">

                        Valor unitário:
                        ${dinheiro(
                            item.preco
                        )}

                    </div>


                    ${observacaoProduto}

                </div>


                <div class="item-preco">

                    ${dinheiro(
                        item.subtotal
                    )}

                </div>

            `;


            resumoPedido.appendChild(
                div
            );

        });


        // ======================================
        // TOTAL
        // ======================================

        const totalDiv =
            document.createElement(
                "div"
            );


        totalDiv.className =
            "total-pedido";


        totalDiv.innerHTML = `

            <span>
                Total:
            </span>

            <strong>
                ${dinheiro(total)}
            </strong>

        `;


        resumoPedido.appendChild(
            totalDiv
        );
    }


    mostrarResumo();


    // ==========================================
    // PREENCHER NOME DO CLIENTE
    // ==========================================

    const campoNome =
        document.getElementById(
            "nome"
        );


    if (campoNome) {

        campoNome.value =
            localStorage.getItem(
                "usuarioNome"
            ) ||
            localStorage.getItem(
                "clienteNome"
            ) ||
            localStorage.getItem(
                "nomeUsuario"
            ) ||
            "";
    }


    // ==========================================
    // CONFIRMAR PEDIDO
    // ==========================================

    if (formulario) {

        formulario.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                // ==================================
                // DADOS DO CLIENTE
                // ==================================

                const nome =
                    document
                        .getElementById(
                            "nome"
                        )
                        ?.value
                        .trim() || "";


                const telefone =
                    document
                        .getElementById(
                            "telefone"
                        )
                        ?.value
                        .trim() || "";


                const endereco =
                    document
                        .getElementById(
                            "endereco"
                        )
                        ?.value
                        .trim() || "";


                const numero =
                    document
                        .getElementById(
                            "numero"
                        )
                        ?.value
                        .trim() || "";


                const cidade =
                    document
                        .getElementById(
                            "cidade"
                        )
                        ?.value
                        .trim() || "";


                // ==================================
                // OBSERVAÇÃO DO PEDIDO
                // ==================================

                const observacaoPedido =
                    document
                        .getElementById(
                            "observacaoPedido"
                        )
                        ?.value
                        .trim() || "";


                // ==================================
                // PAGAMENTO
                // ==================================

                const pagamentoSelecionado =
                    document.querySelector(
                        'input[name="pagamento"]:checked'
                    );


                const pagamento =
                    pagamentoSelecionado
                        ? pagamentoSelecionado.value
                        : "";


                // ==================================
                // VALIDAÇÕES
                // ==================================

                if (!nome) {

                    mostrarMensagem(
                        "❌ Informe seu nome.",
                        "erro"
                    );

                    document
                        .getElementById(
                            "nome"
                        )
                        ?.focus();

                    return;
                }


                if (!telefone) {

                    mostrarMensagem(
                        "❌ Informe seu telefone.",
                        "erro"
                    );

                    document
                        .getElementById(
                            "telefone"
                        )
                        ?.focus();

                    return;
                }


                if (!endereco) {

                    mostrarMensagem(
                        "❌ Informe seu endereço.",
                        "erro"
                    );

                    document
                        .getElementById(
                            "endereco"
                        )
                        ?.focus();

                    return;
                }


                if (!numero) {

                    mostrarMensagem(
                        "❌ Informe o número.",
                        "erro"
                    );

                    document
                        .getElementById(
                            "numero"
                        )
                        ?.focus();

                    return;
                }


                if (!cidade) {

                    mostrarMensagem(
                        "❌ Informe sua cidade.",
                        "erro"
                    );

                    document
                        .getElementById(
                            "cidade"
                        )
                        ?.focus();

                    return;
                }


                if (!pagamento) {

                    mostrarMensagem(
                        "❌ Escolha uma forma de pagamento.",
                        "erro"
                    );

                    return;
                }


                if (total <= 0) {

                    mostrarMensagem(
                        "❌ O valor do pedido é inválido.",
                        "erro"
                    );

                    return;
                }


                // ==================================
                // CRIAR PEDIDO
                // ==================================

                const pedido = {

                    id:
                        Date.now(),

                    nome:
                        nome,

                    email:
                        localStorage.getItem(
                            "clienteEmail"
                        ) || "",

                    telefone:
                        telefone,

                    endereco:
                        endereco,

                    numero:
                        numero,

                    cidade:
                        cidade,

                    pagamento:
                        pagamento,

                    observacao:
                        observacaoPedido,

                    produtos:
                        carrinho,

                    total:
                        total,

                    data:
                        new Date()
                            .toLocaleString(
                                "pt-BR"
                            ),

                    status:
                        "Novo"

                };


                // ==================================
                // CARREGAR PEDIDOS
                // ==================================

                let pedidos = [];


                try {

                    pedidos =
                        JSON.parse(
                            localStorage.getItem(
                                "pedidosShalom"
                            ) || "[]"
                        );


                    if (
                        !Array.isArray(
                            pedidos
                        )
                    ) {

                        pedidos = [];
                    }

                } catch (erro) {

                    console.error(
                        "Erro ao carregar pedidos:",
                        erro
                    );

                    pedidos = [];
                }


                // ==================================
                // ADICIONAR PEDIDO
                // ==================================

                pedidos.push(
                    pedido
                );


                // ==================================
                // SALVAR PEDIDO
                // ==================================

                localStorage.setItem(
                    "pedidosShalom",
                    JSON.stringify(
                        pedidos
                    )
                );


                // ==================================
                // ATUALIZAR ESTOQUE
                // ==================================

                atualizarEstoque();


                // ==================================
                // LIMPAR CARRINHO
                // ==================================

                localStorage.removeItem(
                    "carrinhoCompra"
                );


                // ==================================
                // MENSAGEM
                // ==================================

                mostrarMensagem(
                    "✅ Pedido realizado com sucesso!",
                    "sucesso"
                );


                // ==================================
                // BOTÃO
                // ==================================

                if (btnConfirmar) {

                    btnConfirmar.disabled =
                        true;

                    btnConfirmar.textContent =
                        "✅ Pedido confirmado";
                }


                // ==================================
                // VOLTAR PARA COMPRAS
                // ==================================

                setTimeout(
                    () => {

                        /*
                         * IMPORTANTE:
                         * Não apagamos:
                         *
                         * tipoUsuario
                         * usuarioLogado
                         * usuarioNome
                         * clienteNome
                         * clienteEmail
                         *
                         * Portanto o cliente continua logado.
                         */

                        window.location.href =
                            "comprar.html";

                    },
                    1500
                );

            }
        );

    }


    // ==========================================
    // ATUALIZAR ESTOQUE
    // ==========================================

    function atualizarEstoque() {

        let produtos = [];


        try {

            produtos =
                JSON.parse(
                    localStorage.getItem(
                        "produtosShalom"
                    ) || "[]"
                );

        } catch (erro) {

            console.error(
                "Erro ao carregar produtos:",
                erro
            );

            return;
        }


        if (!Array.isArray(produtos)) {
            return;
        }


        carrinho.forEach(item => {

            const produto =
                produtos.find(
                    p =>
                        String(p.id) ===
                        String(item.id)
                );


            if (!produto) {
                return;
            }


            const estoqueAtual =
                Number(
                    produto.estoque
                ) || 0;


            const quantidade =
                Number(
                    item.quantidade
                ) || 0;


            produto.estoque =
                Math.max(
                    0,
                    estoqueAtual -
                    quantidade
                );

        });


        localStorage.setItem(
            "produtosShalom",
            JSON.stringify(
                produtos
            )
        );
    }

});