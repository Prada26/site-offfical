// ==========================================
// ADMIN.JS - LOJA SHALOM EMBALAGENS
// ==========================================

(() => {
    "use strict";

    // ==========================================
    // PROTEÇÃO DO ADMIN
    // ==========================================

    if (
        localStorage.getItem("tipoUsuario") !== "admin" ||
        localStorage.getItem("usuarioLogado") !== "true"
    ) {
        window.location.replace("login.html");
        return;
    }

    // ==========================================
    // CHAVES
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

            return Array.isArray(dados) ? dados : [];
        } catch {
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
    // DEPÓSITOS
    // ==========================================

    function registrarDeposito(event) {
        event.preventDefault();

        const campoValor =
            document.getElementById("valorDeposito");

        const campoDescricao =
            document.getElementById("descricaoDeposito");

        const valor = Number(
            String(campoValor?.value || "")
                .replace(",", ".")
        );

        if (!Number.isFinite(valor) || valor <= 0) {
            alert("Digite um valor válido.");
            campoValor?.focus();
            return;
        }

        const depositos = lerLista(CHAVES.depositos);

        depositos.push({
            id: Date.now(),
            valor,
            descricao:
                campoDescricao?.value.trim() ||
                "Depósito",
            data: new Date().toLocaleString("pt-BR")
        });

        salvarLista(
            CHAVES.depositos,
            depositos
        );

        if (campoValor) campoValor.value = "";
        if (campoDescricao) campoDescricao.value = "";

        carregarDepositos();
        atualizarResumo();

        alert("✅ Depósito registrado!");
    }

    function carregarDepositos() {
        const lista =
            document.getElementById("listaDepositos");

        if (!lista) return;

        const depositos = lerLista(
            CHAVES.depositos
        ).sort(
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

            item.className = "item item-linha";

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
                    () => excluirDeposito(deposito.id)
                );

            lista.appendChild(item);
        });
    }

    function excluirDeposito(id) {
        if (!confirm("Excluir este depósito?")) {
            return;
        }

        const depositos = lerLista(
            CHAVES.depositos
        ).filter(
            item =>
                String(item.id) !== String(id)
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
        let produtos = lerLista(
            CHAVES.produtos
        );

        if (!produtos.length) {
            produtos = [...produtosPadrao];

            salvarLista(
                CHAVES.produtos,
                produtos
            );
        }

        return produtos.map(produto => ({
            ...produto,
            observacao: produto.observacao || "",
            imagem: produto.imagem || ""
        }));
    }

    function abrirFormularioProduto(produto = null) {
        const formulario =
            document.getElementById(
                "formularioProduto"
            );

        if (!formulario) return;

        formulario.classList.remove("oculto");

        document.getElementById("produtoId").value =
            produto?.id ?? "";

        document.getElementById("nomeProduto").value =
            produto?.nome ?? "";

        document.getElementById("precoProduto").value =
            produto?.preco ?? "";

        document.getElementById("estoqueProduto").value =
            produto?.estoque ?? 0;

        document.getElementById("observacaoProduto").value =
            produto?.observacao ?? "";

        document.getElementById("imagemProduto").value =
            produto?.imagem ?? "";

        document
            .getElementById("nomeProduto")
            ?.focus();
    }

    function fecharFormularioProduto() {
        document
            .getElementById("formularioProduto")
            ?.classList.add("oculto");

        [
            "produtoId",
            "nomeProduto",
            "precoProduto",
            "estoqueProduto",
            "observacaoProduto",
            "imagemProduto"
        ].forEach(id => {
            const campo =
                document.getElementById(id);

            if (campo) campo.value = "";
        });
    }

    function salvarProduto(event) {
        event.preventDefault();

        const id =
            document.getElementById("produtoId")
                ?.value.trim() || "";

        const nome =
            document.getElementById("nomeProduto")
                ?.value.trim() || "";

        const preco = Number(
            String(
                document.getElementById("precoProduto")
                    ?.value || ""
            ).replace(",", ".")
        );

        const estoque = Number(
            document.getElementById("estoqueProduto")
                ?.value || 0
        );

        const observacao =
            document.getElementById("observacaoProduto")
                ?.value.trim() || "";

        const imagem =
            document.getElementById("imagemProduto")
                ?.value.trim() || "";

        if (!nome) {
            alert("Digite o nome do produto.");
            return;
        }

        if (!Number.isFinite(preco) || preco < 0) {
            alert("Digite um preço válido.");
            return;
        }

        if (!Number.isInteger(estoque) || estoque < 0) {
            alert("Digite um estoque válido.");
            return;
        }

        const produtos = obterProdutos();

        if (id) {
            const index = produtos.findIndex(
                produto =>
                    String(produto.id) === String(id)
            );

            if (index === -1) {
                alert("Produto não encontrado.");
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
        } else {
            produtos.push({
                id: Date.now(),
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

        alert("✅ Produto salvo!");
    }

    function carregarProdutos() {
        const lista =
            document.getElementById("listaProdutos");

        if (!lista) return;

        const produtos = obterProdutos();

        lista.innerHTML = "";

        produtos.forEach(produto => {
            const item =
                document.createElement("div");

            item.className = "item item-linha";

            const imagem = produto.imagem
                ? `
                    <img
                        class="produto-imagem"
                        src="${escapeHTML(produto.imagem)}"
                        alt="${escapeHTML(produto.nome)}"
                    >
                `
                : "";

            const observacao =
                produto.observacao
                    ? `
                        <div class="observacao-produto">
                            📝 <strong>Obs.:</strong>
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
                            ${escapeHTML(produto.nome)}
                        </strong>

                        <div>
                            Preço:
                            ${dinheiro(produto.preco)}
                        </div>

                        <small>
                            Estoque:
                            ${Number(produto.estoque) || 0}
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
                    () => abrirFormularioProduto(produto)
                );

            item
                .querySelector(".btn-excluir")
                ?.addEventListener(
                    "click",
                    () => excluirProduto(produto.id)
                );

            lista.appendChild(item);
        });
    }

    function excluirProduto(id) {
        if (!confirm("Excluir este produto?")) {
            return;
        }

        const produtos = obterProdutos().filter(
            produto =>
                String(produto.id) !== String(id)
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
            document.getElementById("listaClientes");

        if (!lista) return;

        const clientes = lerLista(
            CHAVES.usuarios
        ).filter(
            usuario =>
                usuario.tipo !== "admin"
        );

        if (!clientes.length) {
            lista.innerHTML = `
                <p class="vazio">
                    👤 Nenhum cliente cadastrado.
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
                        cliente.nome || "Cliente"
                    )}
                </strong>

                <div>
                    📧 ${escapeHTML(
                        cliente.email || ""
                    )}
                </div>
            `;

            lista.appendChild(item);
        });
    }

    // ==========================================
    // PEDIDOS
    // ==========================================

    function carregarPedidos() {
        const lista =
            document.getElementById("listaPedidos");

        if (!lista) return;

        const pedidos = lerLista(
            CHAVES.pedidos
        ).sort(
            (a, b) =>
                Number(b.id || 0) -
                Number(a.id || 0)
        );

        if (!pedidos.length) {
            lista.innerHTML = `
                <p class="vazio">
                    🛒 Nenhum pedido registrado.
                </p>
            `;
            return;
        }

        lista.innerHTML = "";

        pedidos.forEach((pedido, indice) => {

            const item =
                document.createElement("div");

            item.className =
                "item pedido-admin";

            // --------------------------------------
            // CLIENTE
            // --------------------------------------

            const nomeCliente =
                pedido.nome ||
                pedido.nomeCliente ||
                pedido.clienteNome ||
                pedido.usuarioNome ||
                "Cliente";

            const email =
                pedido.email ||
                pedido.clienteEmail ||
                "";

            // --------------------------------------
            // CONTATO
            // --------------------------------------

            const telefone =
                pedido.telefone ||
                pedido.celular ||
                pedido.whatsapp ||
                "";

            // --------------------------------------
            // ENDEREÇO
            // --------------------------------------

            const endereco =
                pedido.endereco ||
                pedido.enderecoEntrega ||
                "";

            const numero =
                pedido.numero ||
                pedido.numeroEndereco ||
                "";

            const cidade =
                pedido.cidade ||
                pedido.localidade ||
                pedido.cidadeEntrega ||
                "";

            const estado =
                pedido.estado ||
                pedido.uf ||
                "";

            // --------------------------------------
            // PAGAMENTO
            // --------------------------------------

            const pagamento =
                pedido.pagamento ||
                pedido.formaPagamento ||
                "Não informado";

            // --------------------------------------
            // DATA
            // --------------------------------------

            const data =
                pedido.data ||
                pedido.dataPedido ||
                pedido.criadoEm ||
                "";

            // --------------------------------------
            // TOTAL
            // --------------------------------------

            const total = Number(
                pedido.total ||
                pedido.valor ||
                0
            );

            // --------------------------------------
            // OBSERVAÇÃO
            // --------------------------------------

            const observacao =
                pedido.observacao ||
                pedido.obs ||
                pedido.observacaoPedido ||
                "";

            // --------------------------------------
            // NÚMERO DO PEDIDO
            // --------------------------------------

            const numeroPedido =
                pedido.numeroPedido ||
                pedido.id ||
                pedidos.length - indice;

            // --------------------------------------
            // PRODUTOS
            // --------------------------------------

            const produtos =
                Array.isArray(pedido.produtos)
                    ? pedido.produtos
                    : Array.isArray(pedido.itens)
                        ? pedido.itens
                        : [];

            let itensHTML = "";

            produtos.forEach(produto => {
                const quantidade =
                    Number(
                        produto.quantidade ||
                        produto.qtd ||
                        1
                    );

                const preco =
                    Number(produto.preco || 0);

                const subtotal =
                    Number(
                        produto.subtotal ||
                        preco * quantidade
                    );

                itensHTML += `
                    <li>
                        ${escapeHTML(
                            produto.nome ||
                            "Produto"
                        )}
                        x${quantidade}
                        -
                        ${dinheiro(subtotal)}
                    </li>
                `;
            });

            if (!itensHTML) {
                itensHTML =
                    "<li>Nenhum produto informado.</li>";
            }

            // --------------------------------------
            // ENDEREÇO COMPLETO
            // --------------------------------------

            let enderecoCompleto =
                endereco || "Não informado";

            if (numero) {
                enderecoCompleto +=
                    `, ${numero}`;
            }

            // --------------------------------------
            // CIDADE COMPLETA
            // --------------------------------------

            let cidadeCompleta =
                cidade || "Não informada";

            if (estado) {
                cidadeCompleta +=
                    ` - ${estado}`;
            }

            // --------------------------------------
            // HTML
            // --------------------------------------

            item.innerHTML = `
                <div class="item-linha">

                    <strong>
                        📦 Pedido ${escapeHTML(
                            numeroPedido
                        )}
                    </strong>

                    <strong class="valor">
                        ${dinheiro(total)}
                    </strong>

                </div>

                <hr>

                <div>
                    👤 <strong>Cliente:</strong>
                    ${escapeHTML(nomeCliente)}
                </div>

                <div>
                    📞 <strong>Telefone:</strong>
                    ${escapeHTML(
                        telefone || "Não informado"
                    )}
                </div>

                <div>
                    📧 <strong>E-mail:</strong>
                    ${escapeHTML(
                        email || "Não informado"
                    )}
                </div>

                <div>
                    🏠 <strong>Endereço:</strong>
                    ${escapeHTML(
                        enderecoCompleto
                    )}
                </div>

                <div>
                    📍 <strong>Cidade:</strong>
                    ${escapeHTML(
                        cidadeCompleta
                    )}
                </div>

                <div>
                    💳 <strong>Pagamento:</strong>
                    ${escapeHTML(pagamento)}
                </div>

                <div>
                    📅 <strong>Data:</strong>
                    ${escapeHTML(
                        data || "Não informada"
                    )}
                </div>

                ${
                    observacao
                        ? `
                            <div class="observacao-pedido">
                                📝 <strong>Observação:</strong>
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
                        ${itensHTML}
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
            lerLista(CHAVES.depositos);

        const produtos =
            obterProdutos();

        const clientes =
            lerLista(CHAVES.usuarios)
                .filter(
                    usuario =>
                        usuario.tipo !== "admin"
                );

        const saldo =
            depositos.reduce(
                (total, deposito) =>
                    total +
                    Number(deposito.valor || 0),
                0
            );

        const saldoElemento =
            document.getElementById("saldo");

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
        [
            "tipoUsuario",
            "usuarioLogado",
            "usuarioNome",
            "nomeUsuario",
            "clienteNome",
            "clienteEmail",
            "usuarioAtual"
        ].forEach(chave => {
            localStorage.removeItem(chave);
        });

        sessionStorage.clear();

        window.location.replace("login.html");
    }

    // ==========================================
    // INICIAR
    // ==========================================

    function iniciarAdmin() {

        document
            .getElementById("depositoForm")
            ?.addEventListener(
                "submit",
                registrarDeposito
            );

        document
            .getElementById("btnNovoProduto")
            ?.addEventListener(
                "click",
                () => abrirFormularioProduto()
            );

        document
            .getElementById("btnCancelarProduto")
            ?.addEventListener(
                "click",
                fecharFormularioProduto
            );

        document
            .getElementById("formularioProduto")
            ?.addEventListener(
                "submit",
                salvarProduto
            );

        document
            .getElementById("btnSair")
            ?.addEventListener(
                "click",
                sair
            );

        carregarDepositos();
        carregarProdutos();
        carregarClientes();
        carregarPedidos();
        atualizarResumo();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            iniciarAdmin
        );
    } else {
        iniciarAdmin();
    }

})();