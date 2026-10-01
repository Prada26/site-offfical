// ==========================================
// ADMIN.JS
// LOJA SHALOM EMBALAGENS
// ==========================================

(() => {

    "use strict";


    // ==========================================
    // PROTEÇÃO DO ADMIN
    // ==========================================

    if (localStorage.getItem("tipoUsuario") !== "admin") {

        window.location.href = "login.html";

        return;
    }


    // ==========================================
    // CHAVES DO LOCALSTORAGE
    // ==========================================

    const CHAVES = {

        depositos: "depositosShalom",

        produtos: "produtosShalom",

        usuarios: "usuariosShalom",

        pedidos: "pedidosShalom"

    };


    // ==========================================
    // PRODUTOS PADRÃO
    // ==========================================

    const produtosPadrao = [

        {
            id: "caixa",
            nome: "Caixa de Papelão",
            preco: 10.90,
            estoque: 0,
            observacao: "",
            imagem: "caixa-de-papelao.webp"
        },

        {
            id: "sacola",
            nome: "Sacola Kraft",
            preco: 10.50,
            estoque: 0,
            observacao: "",
            imagem: ""
        },

        {
            id: "delivery",
            nome: "Embalagem Delivery",
            preco: 10.00,
            estoque: 0,
            observacao: "",
            imagem: "embalagens.jpg"
        },

        {
            id: "copo",
            nome: "Copo Descartável",
            preco: 10.90,
            estoque: 0,
            observacao: "",
            imagem: "copos.png.webp"
        }

    ];


    // ==========================================
    // FUNÇÕES GERAIS
    // ==========================================

    function lerLista(chave) {

        try {

            const dados = JSON.parse(
                localStorage.getItem(chave) || "[]"
            );

            return Array.isArray(dados)
                ? dados
                : [];

        } catch (erro) {

            console.error(
                "Erro ao ler localStorage:",
                chave,
                erro
            );

            return [];
        }
    }


    function salvarLista(chave, lista) {

        localStorage.setItem(
            chave,
            JSON.stringify(lista)
        );

    }


    function dinheiro(valor) {

        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


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

    function mostrarMensagem(texto, cor = "") {

        const elemento =
            document.getElementById(
                "mensagemDeposito"
            );

        if (!elemento) return;

        elemento.textContent = texto;

        elemento.style.color = cor;

    }


    // ==========================================
    // DEPÓSITOS
    // ==========================================

    function registrarDeposito(event) {

        event.preventDefault();


        const campoValor =
            document.getElementById(
                "valorDeposito"
            );


        const campoDescricao =
            document.getElementById(
                "descricaoDeposito"
            );


        const valor = Number(
            String(
                campoValor?.value || ""
            ).replace(",", ".")
        );


        if (
            !Number.isFinite(valor) ||
            valor <= 0
        ) {

            mostrarMensagem(
                "❌ Digite um valor válido.",
                "red"
            );

            campoValor?.focus();

            return;
        }


        const depositos =
            lerLista(CHAVES.depositos);


        depositos.push({

            id: Date.now(),

            valor: valor,

            descricao:
                campoDescricao?.value.trim() ||
                "Depósito",

            data:
                new Date().toLocaleString(
                    "pt-BR"
                )

        });


        salvarLista(
            CHAVES.depositos,
            depositos
        );


        if (campoValor) {
            campoValor.value = "";
        }


        if (campoDescricao) {
            campoDescricao.value = "";
        }


        mostrarMensagem(
            "✅ Depósito registrado com sucesso!",
            "green"
        );


        carregarDepositos();

        atualizarResumo();

    }


    function carregarDepositos() {

        const lista =
            document.getElementById(
                "listaDepositos"
            );


        if (!lista) return;


        const depositos =
            lerLista(CHAVES.depositos)
                .sort(
                    (a, b) =>
                        Number(b.id || 0) -
                        Number(a.id || 0)
                );


        if (!depositos.length) {

            lista.innerHTML = `
                <p class="vazio">
                    📭 Nenhum depósito registrado.
                </p>
            `;

            return;
        }


        lista.innerHTML = "";


        depositos.forEach(deposito => {

            const item =
                document.createElement("div");


            item.className =
                "item item-linha";


            item.innerHTML = `

                <div>

                    <strong class="valor">
                        ${dinheiro(deposito.valor)}
                    </strong>

                    <div>
                        ${escapeHTML(
                            deposito.descricao ||
                            "Depósito"
                        )}
                    </div>

                    <small>
                        📅 ${escapeHTML(
                            deposito.data || ""
                        )}
                    </small>

                </div>


                <button
                    type="button"
                    class="btn-excluir"
                >
                    🗑️ Excluir
                </button>

            `;


            item
                .querySelector(".btn-excluir")
                ?.addEventListener(
                    "click",
                    () =>
                        excluirDeposito(
                            deposito.id
                        )
                );


            lista.appendChild(item);

        });

    }


    function excluirDeposito(id) {

        if (
            !confirm(
                "Tem certeza que deseja excluir este depósito?"
            )
        ) {

            return;
        }


        const depositos =
            lerLista(CHAVES.depositos)
                .filter(
                    deposito =>
                        String(deposito.id) !==
                        String(id)
                );


        salvarLista(
            CHAVES.depositos,
            depositos
        );


        carregarDepositos();

        atualizarResumo();

    }


    // ==========================================
    // PRODUTOS
    // ==========================================

    function obterProdutos() {

        const produtos =
            lerLista(CHAVES.produtos);


        if (produtos.length) {

            return produtos.map(produto => ({

                ...produto,

                observacao:
                    produto.observacao || "",

                imagem:
                    produto.imagem || ""

            }));

        }


        salvarLista(
            CHAVES.produtos,
            produtosPadrao
        );


        return [...produtosPadrao];

    }


    // ==========================================
    // ABRIR FORMULÁRIO DE PRODUTO
    // ==========================================

    function abrirFormularioProduto(produto = null) {

        const formulario =
            document.getElementById(
                "formularioProduto"
            );


        if (!formulario) return;


        formulario.classList.remove(
            "oculto"
        );


        const produtoId =
            document.getElementById(
                "produtoId"
            );

        const nomeProduto =
            document.getElementById(
                "nomeProduto"
            );

        const precoProduto =
            document.getElementById(
                "precoProduto"
            );

        const estoqueProduto =
            document.getElementById(
                "estoqueProduto"
            );

        const observacaoProduto =
            document.getElementById(
                "observacaoProduto"
            );

        const imagemProduto =
            document.getElementById(
                "imagemProduto"
            );


        if (produtoId) {

            produtoId.value =
                produto?.id ?? "";

        }


        if (nomeProduto) {

            nomeProduto.value =
                produto?.nome ?? "";

        }


        if (precoProduto) {

            precoProduto.value =
                produto?.preco ?? "";

        }


        if (estoqueProduto) {

            estoqueProduto.value =
                produto?.estoque ?? 0;

        }


        if (observacaoProduto) {

            observacaoProduto.value =
                produto?.observacao ?? "";

        }


        if (imagemProduto) {

            imagemProduto.value =
                produto?.imagem ?? "";

        }


        nomeProduto?.focus();

    }


    // ==========================================
    // FECHAR FORMULÁRIO
    // ==========================================

    function fecharFormularioProduto() {

        const formulario =
            document.getElementById(
                "formularioProduto"
            );


        formulario?.classList.add(
            "oculto"
        );


        const campos = [

            "produtoId",

            "nomeProduto",

            "precoProduto",

            "estoqueProduto",

            "observacaoProduto",

            "imagemProduto"

        ];


        campos.forEach(id => {

            const campo =
                document.getElementById(id);


            if (campo) {

                campo.value = "";

            }

        });

    }


    // ==========================================
    // SALVAR PRODUTO
    // ==========================================

    function salvarProduto(event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "produtoId"
            )?.value.trim() || "";


        const nome =
            document.getElementById(
                "nomeProduto"
            )?.value.trim() || "";


        const preco =
            Number(
                String(
                    document.getElementById(
                        "precoProduto"
                    )?.value || ""
                ).replace(",", ".")
            );


        const estoque =
            Number(
                document.getElementById(
                    "estoqueProduto"
                )?.value || 0
            );


        const observacao =
            document.getElementById(
                "observacaoProduto"
            )?.value.trim() || "";


        const imagem =
            document.getElementById(
                "imagemProduto"
            )?.value.trim() || "";


        if (!nome) {

            alert(
                "Digite o nome do produto."
            );

            return;
        }


        if (
            !Number.isFinite(preco) ||
            preco < 0
        ) {

            alert(
                "Digite um preço válido."
            );

            return;
        }


        if (
            !Number.isInteger(estoque) ||
            estoque < 0
        ) {

            alert(
                "Digite um estoque válido."
            );

            return;
        }


        const produtos =
            obterProdutos();


        // EDITAR
        if (id) {

            const index =
                produtos.findIndex(
                    produto =>
                        String(produto.id) ===
                        String(id)
                );


            if (index === -1) {

                alert(
                    "Produto não encontrado."
                );

                return;
            }


            produtos[index] = {

                ...produtos[index],

                nome,

                preco,

                estoque,

                observacao,

                imagem

            };

        }

        // NOVO
        else {

            produtos.push({

                id:
                    Date.now(),

                nome,

                preco,

                estoque,

                observacao,

                imagem

            });

        }


        salvarLista(
            CHAVES.produtos,
            produtos
        );


        fecharFormularioProduto();

        carregarProdutos();

        atualizarResumo();


        alert(
            "✅ Produto salvo com sucesso!"
        );

    }


    // ==========================================
    // MOSTRAR PRODUTOS
    // ==========================================

    function carregarProdutos() {

        const lista =
            document.getElementById(
                "listaProdutos"
            );


        if (!lista) return;


        const produtos =
            obterProdutos();


        if (!produtos.length) {

            lista.innerHTML = `
                <p class="vazio">
                    Nenhum produto cadastrado.
                </p>
            `;

            return;
        }


        lista.innerHTML = "";


        produtos.forEach(produto => {

            const item =
                document.createElement("div");


            item.className =
                "item item-linha";


            const imagem =
                produto.imagem
                    ? `
                        <img
                            class="produto-imagem"
                            src="${escapeHTML(
                                produto.imagem
                            )}"
                            alt="${escapeHTML(
                                produto.nome
                            )}"
                        >
                    `
                    : "";


            const observacao =
                produto.observacao
                    ? `
                        <div class="observacao-produto">

                            📝
                            <strong>
                                Obs.:
                            </strong>

                            ${escapeHTML(
                                produto.observacao
                            )}

                        </div>
                    `
                    : "";


            item.innerHTML = `

                <div class="produto-conteudo">

                    ${imagem}

                    <div>

                        <strong>
                            ${escapeHTML(
                                produto.nome
                            )}
                        </strong>

                        <div>
                            Preço:
                            ${dinheiro(
                                produto.preco
                            )}
                        </div>

                        <small>
                            Estoque:
                            ${Number(
                                produto.estoque
                            ) || 0}
                        </small>

                        ${observacao}

                    </div>

                </div>


                <div class="acoes">

                    <button
                        type="button"
                        class="btn-editar"
                    >
                        ✏️ Editar
                    </button>


                    <button
                        type="button"
                        class="btn-excluir"
                    >
                        🗑️ Excluir
                    </button>

                </div>

            `;


            item
                .querySelector(".btn-editar")
                ?.addEventListener(
                    "click",
                    () =>
                        abrirFormularioProduto(
                            produto
                        )
                );


            item
                .querySelector(".btn-excluir")
                ?.addEventListener(
                    "click",
                    () =>
                        excluirProduto(
                            produto.id
                        )
                );


            lista.appendChild(item);

        });

    }


    // ==========================================
    // EXCLUIR PRODUTO
    // ==========================================

    function excluirProduto(id) {

        if (
            !confirm(
                "Tem certeza que deseja excluir este produto?"
            )
        ) {

            return;
        }


        const produtos =
            obterProdutos()
                .filter(
                    produto =>
                        String(produto.id) !==
                        String(id)
                );


        salvarLista(
            CHAVES.produtos,
            produtos
        );


        carregarProdutos();

        atualizarResumo();

    }


    // ==========================================
    // CLIENTES
    // ==========================================

    function carregarClientes() {

        const lista =
            document.getElementById(
                "listaClientes"
            );


        if (!lista) return;


        const clientes =
            lerLista(
                CHAVES.usuarios
            )
            .filter(
                usuario =>
                    usuario.tipo !== "admin"
            );


        if (!clientes.length) {

            lista.innerHTML = `
                <p class="vazio">
                    Nenhum cliente cadastrado.
                </p>
            `;

            return;
        }


        lista.innerHTML = "";


        clientes.forEach(cliente => {

            const item =
                document.createElement("div");


            item.className = "item";


            item.innerHTML = `

                <strong>
                    👤 ${escapeHTML(
                        cliente.nome ||
                        "Cliente"
                    )}
                </strong>

                <div>
                    📧 ${escapeHTML(
                        cliente.email ||
                        ""
                    )}
                </div>

            `;


            lista.appendChild(item);

        });

    }


    // ==========================================
    // PEDIDOS DOS CLIENTES
    // ==========================================

    function carregarPedidos() {

        const lista =
            document.getElementById(
                "listaPedidos"
            );


        if (!lista) {

            console.warn(
                "⚠️ #listaPedidos não encontrado no admin.html."
            );

            return;
        }


        const pedidos =
            lerLista(
                CHAVES.pedidos
            )
            .sort(
                (a, b) =>
                    Number(b.id || 0) -
                    Number(a.id || 0)
            );


        // --------------------------------------
        // NENHUM PEDIDO
        // --------------------------------------

        if (!pedidos.length) {

            lista.innerHTML = `

                <div class="vazio">

                    🛒 Nenhum pedido registrado.

                </div>

            `;

            return;
        }


        lista.innerHTML = "";


        // --------------------------------------
        // PEDIDOS
        // --------------------------------------

        pedidos.forEach(pedido => {

            const item =
                document.createElement("div");


            item.className =
                "item pedido-admin";


            // ----------------------------------
            // PRODUTOS
            // ----------------------------------

            let itensHTML = "";


            if (
                Array.isArray(
                    pedido.produtos
                )
            ) {

                itensHTML =
                    pedido.produtos
                        .map(produto => {

                            const quantidade =
                                Number(
                                    produto.quantidade
                                ) || 0;


                            const preco =
                                Number(
                                    produto.preco
                                ) || 0;


                            const subtotal =
                                Number(
                                    produto.subtotal
                                ) ||
                                preco * quantidade;


                            return `

                                <li>

                                    ${escapeHTML(
                                        produto.nome ||
                                        "Produto"
                                    )}

                                    x${quantidade}

                                    -

                                    ${dinheiro(
                                        subtotal
                                    )}

                                </li>

                            `;

                        })
                        .join("");

            }


            // ----------------------------------
            // OBSERVAÇÃO
            // ----------------------------------

            const observacao =
                pedido.observacao ||
                pedido.obs ||
                pedido.observacaoPedido ||
                "";


            // ----------------------------------
            // TELEFONE
            // ----------------------------------

            const telefone =
                pedido.telefone ||
                pedido.celular ||
                "";


            // ----------------------------------
            // ENDEREÇO
            // ----------------------------------

            const endereco =
                pedido.endereco ||
                "";


            const numero =
                pedido.numero ||
                "";


            const cidade =
                pedido.cidade ||
                "";


            // ----------------------------------
            // CLIENTE
            // ----------------------------------

            const nomeCliente =
                pedido.nome ||
                pedido.nomeCliente ||
                "Cliente";


            // ----------------------------------
            // PAGAMENTO
            // ----------------------------------

            const pagamento =
                pedido.pagamento ||
                pedido.formaPagamento ||
                "Não informado";


            // ----------------------------------
            // DATA
            // ----------------------------------

            const data =
                pedido.data ||
                pedido.dataPedido ||
                "";


            // ----------------------------------
            // HTML DO PEDIDO
            // ----------------------------------

            item.innerHTML = `

                <div class="item-linha">

                    <strong>

                        🛒 Pedido
                        #${escapeHTML(
                            pedido.id
                        )}

                    </strong>


                    <strong class="valor">

                        ${dinheiro(
                            pedido.total
                        )}

                    </strong>

                </div>


                <hr>


                <div>

                    👤

                    <strong>
                        Cliente:
                    </strong>

                    ${escapeHTML(
                        nomeCliente
                    )}

                </div>


                ${
                    telefone
                        ? `
                            <div>

                                📞

                                <strong>
                                    Telefone:
                                </strong>

                                ${escapeHTML(
                                    telefone
                                )}

                            </div>
                        `
                        : ""
                }


                ${
                    pedido.email
                        ? `
                            <div>

                                📧

                                <strong>
                                    E-mail:
                                </strong>

                                ${escapeHTML(
                                    pedido.email
                                )}

                            </div>
                        `
                        : ""
                }


                ${
                    endereco
                        ? `
                            <div>

                                🏠

                                <strong>
                                    Endereço:
                                </strong>

                                ${escapeHTML(
                                    endereco
                                )}

                            </div>
                        `
                        : ""
                }


                ${
                    numero
                        ? `
                            <div>

                                🔢

                                <strong>
                                    Número:
                                </strong>

                                ${escapeHTML(
                                    numero
                                )}

                            </div>
                        `
                        : ""
                }


                ${
                    cidade
                        ? `
                            <div>

                                📍

                                <strong>
                                    Cidade:
                                </strong>

                                ${escapeHTML(
                                    cidade
                                )}

                            </div>
                        `
                        : ""
                }


                <div>

                    💳

                    <strong>
                        Pagamento:
                    </strong>

                    ${escapeHTML(
                        pagamento
                    )}

                </div>


                ${
                    data
                        ? `
                            <div>

                                📅

                                <strong>
                                    Data:
                                </strong>

                                ${escapeHTML(
                                    data
                                )}

                            </div>
                        `
                        : ""
                }


                ${
                    observacao
                        ? `
                            <div class="observacao-pedido">

                                📝

                                <strong>
                                    Observação:
                                </strong>

                                ${escapeHTML(
                                    observacao
                                )}

                            </div>
                        `
                        : ""
                }


                <div class="pedido-produtos">

                    <strong>
                        📦 Produtos:
                    </strong>


                    <ul class="pedido-itens">

                        ${
                            itensHTML ||
                            "<li>Nenhum produto informado.</li>"
                        }

                    </ul>

                </div>

            `;


            lista.appendChild(item);

        });

    }


    // ==========================================
    // RESUMO
    // ==========================================

    function atualizarResumo() {

        const depositos =
            lerLista(
                CHAVES.depositos
            );


        const produtos =
            obterProdutos();


        const clientes =
            lerLista(
                CHAVES.usuarios
            )
            .filter(
                usuario =>
                    usuario.tipo !== "admin"
            );


        const saldo =
            depositos.reduce(
                (
                    soma,
                    deposito
                ) => {

                    return soma +
                        (
                            Number(
                                deposito.valor
                            ) || 0
                        );

                },
                0
            );


        const saldoElemento =
            document.getElementById(
                "saldo"
            );


        const produtosElemento =
            document.getElementById(
                "totalProdutos"
            );


        const clientesElemento =
            document.getElementById(
                "totalClientes"
            );


        const depositosElemento =
            document.getElementById(
                "totalDepositos"
            );


        if (saldoElemento) {

            saldoElemento.textContent =
                dinheiro(saldo);

        }


        if (produtosElemento) {

            produtosElemento.textContent =
                produtos.length;

        }


        if (clientesElemento) {

            clientesElemento.textContent =
                clientes.length;

        }


        if (depositosElemento) {

            depositosElemento.textContent =
                depositos.length;

        }

    }


    // ==========================================
    // SAIR
    // ==========================================

    function sair() {

        const chaves = [

            "tipoUsuario",

            "usuarioLogado",

            "usuarioNome",

            "nomeUsuario",

            "clienteNome",

            "clienteEmail"

        ];


        chaves.forEach(chave => {

            localStorage.removeItem(chave);

        });


        sessionStorage.clear();


        window.location.href =
            "login.html";

    }


    // ==========================================
    // INICIALIZAÇÃO
    // ==========================================

    function iniciarAdmin() {

        // DEPÓSITOS

        document
            .getElementById(
                "depositoForm"
            )
            ?.addEventListener(
                "submit",
                registrarDeposito
            );


        // NOVO PRODUTO

        document
            .getElementById(
                "btnNovoProduto"
            )
            ?.addEventListener(
                "click",
                () =>
                    abrirFormularioProduto()
            );


        // CANCELAR

        document
            .getElementById(
                "btnCancelarProduto"
            )
            ?.addEventListener(
                "click",
                fecharFormularioProduto
            );


        // FORMULÁRIO

        document
            .getElementById(
                "formularioProduto"
            )
            ?.addEventListener(
                "submit",
                salvarProduto
            );


        // SAIR

        document
            .getElementById(
                "btnSair"
            )
            ?.addEventListener(
                "click",
                sair
            );


        // CARREGAR DADOS

        carregarDepositos();

        carregarProdutos();

        carregarClientes();

        carregarPedidos();

        atualizarResumo();

    }


    // ==========================================
    // DOM PRONTO
    // ==========================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarAdmin
        );

    } else {

        iniciarAdmin();

    }


})();