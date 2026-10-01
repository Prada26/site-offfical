// ==========================================
// PAGAMENTO.JS
// LOJA SHALOM EMBALAGENS
// ==========================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // PROTEÇÃO
    // ==========================================

    if (
        localStorage.getItem("tipoUsuario") !== "cliente" ||
        localStorage.getItem("usuarioLogado") !== "true"
    ) {
        window.location.replace("login.html");
        return;
    }

    // ==========================================
    // ELEMENTOS
    // ==========================================

    const resumo = document.getElementById("resumoPedido");
    const formulario = document.getElementById("pagamentoForm");
    const mensagem = document.getElementById("mensagem");
    const botao = document.getElementById("btnConfirmar");

    // ==========================================
    // FUNÇÕES
    // ==========================================

    function dinheiro(valor) {
        return Number(valor || 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function escapar(valor) {
        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function mensagemTela(texto, tipo = "") {
        if (!mensagem) return;

        mensagem.textContent = texto;
        mensagem.className = "mensagem " + tipo;
    }

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

    // ==========================================
    // CARREGAR CARRINHO
    // ==========================================

    let dadosCarrinho = null;

    try {
        dadosCarrinho = JSON.parse(
            localStorage.getItem("carrinhoCompra") || "null"
        );
    } catch {
        dadosCarrinho = null;
    }

    let carrinho = [];

    // Formato atual
    if (
        dadosCarrinho &&
        !Array.isArray(dadosCarrinho) &&
        Array.isArray(dadosCarrinho.itens)
    ) {
        carrinho = dadosCarrinho.itens;
    }

    // Formato antigo
    else if (Array.isArray(dadosCarrinho)) {
        carrinho = dadosCarrinho;
    }

    // ==========================================
    // VERIFICAR CARRINHO
    // ==========================================

    if (!carrinho.length) {

        if (resumo) {
            resumo.innerHTML = `
                <p class="vazio">
                    🛒 Nenhum produto foi selecionado.
                </p>
            `;
        }

        if (botao) {
            botao.disabled = true;
        }

        return;
    }

    // ==========================================
    // NORMALIZAR PRODUTOS
    // ==========================================

    carrinho = carrinho.map(item => {

        const quantidade =
            Number(item.quantidade) || 1;

        const preco =
            Number(item.preco) || 0;

        const subtotal =
            Number(item.subtotal) ||
            preco * quantidade;

        return {
            id: item.id || "",
            nome: item.nome || "Produto",
            preco,
            quantidade,
            subtotal,
            observacao: item.observacao || ""
        };
    });

    // ==========================================
    // TOTAL
    // ==========================================

    const total = carrinho.reduce(
        (soma, item) => soma + item.subtotal,
        0
    );

    // ==========================================
    // MOSTRAR RESUMO
    // ==========================================

    function mostrarResumo() {

        if (!resumo) return;

        resumo.innerHTML = "";

        carrinho.forEach(item => {

            const div = document.createElement("div");

            div.className = "item-pedido";

            div.innerHTML = `
                <div class="item-info">

                    <div class="item-nome">
                        ${escapar(item.nome)}
                    </div>

                    <div class="item-quantidade">
                        Quantidade: ${item.quantidade}
                    </div>

                    <div class="item-unitario">
                        Valor unitário:
                        ${dinheiro(item.preco)}
                    </div>

                    ${
                        item.observacao
                            ? `
                                <small class="item-observacao">
                                    📝 ${escapar(item.observacao)}
                                </small>
                            `
                            : ""
                    }

                </div>

                <div class="item-preco">
                    ${dinheiro(item.subtotal)}
                </div>
            `;

            resumo.appendChild(div);
        });

        const totalDiv =
            document.createElement("div");

        totalDiv.className = "total-pedido";

        totalDiv.innerHTML = `
            <span>Total:</span>
            <strong>${dinheiro(total)}</strong>
        `;

        resumo.appendChild(totalDiv);
    }

    mostrarResumo();

    // ==========================================
    // PREENCHER NOME
    // ==========================================

    const campoNome =
        document.getElementById("nome");

    if (campoNome) {
        campoNome.value =
            localStorage.getItem("usuarioNome") ||
            localStorage.getItem("clienteNome") ||
            localStorage.getItem("nomeUsuario") ||
            "";
    }

    // ==========================================
    // FINALIZAR PEDIDO
    // ==========================================

    formulario?.addEventListener("submit", event => {

        event.preventDefault();

        if (botao?.disabled) return;

        // ======================================
        // DADOS DO CLIENTE
        // ======================================

        const nome =
            document.getElementById("nome")?.value.trim() || "";

        const telefone =
            document.getElementById("telefone")?.value.trim() || "";

        const endereco =
            document.getElementById("endereco")?.value.trim() || "";

        const numero =
            document.getElementById("numero")?.value.trim() || "";

        const cidade =
            document.getElementById("cidade")?.value.trim() || "";

        const observacao =
            document
                .getElementById("observacaoPedido")
                ?.value.trim() || "";

        // ======================================
        // PAGAMENTO
        // ======================================

        const pagamento =
            document.querySelector(
                'input[name="pagamento"]:checked'
            )?.value || "";

        // ======================================
        // VALIDAÇÕES
        // ======================================

        const campos = [
            ["nome", nome, "Informe seu nome."],
            ["telefone", telefone, "Informe seu telefone."],
            ["endereco", endereco, "Informe seu endereço."],
            ["numero", numero, "Informe o número."],
            ["cidade", cidade, "Informe sua cidade."]
        ];

        for (const [id, valor, erro] of campos) {

            if (!valor) {

                mensagemTela(
                    "❌ " + erro,
                    "erro"
                );

                document
                    .getElementById(id)
                    ?.focus();

                return;
            }
        }

        if (!pagamento) {

            mensagemTela(
                "❌ Escolha uma forma de pagamento.",
                "erro"
            );

            return;
        }

        if (total <= 0) {

            mensagemTela(
                "❌ O valor do pedido é inválido.",
                "erro"
            );

            return;
        }

        // ======================================
        // PEDIDOS EXISTENTES
        // ======================================

        const pedidos =
            lerLista("pedidosShalom");

        const numeroPedido =
            pedidos.length + 1;

        // ======================================
        // CRIAR PEDIDO
        // ======================================

        const pedido = {

            id: Date.now(),

            numeroPedido,

            nome,

            email:
                localStorage.getItem("clienteEmail") || "",

            telefone,

            endereco,

            numero,

            cidade,

            pagamento,

            observacao,

            // Mantém também esses nomes
            // para compatibilidade com versões antigas
            observacaoPedido: observacao,
            formaPagamento: pagamento,

            produtos: carrinho,

            total,

            data:
                new Date().toLocaleString("pt-BR"),

            status: "Novo"
        };

        // ======================================
        // SALVAR PEDIDO
        // ======================================

        pedidos.push(pedido);

        localStorage.setItem(
            "pedidosShalom",
            JSON.stringify(pedidos)
        );

        // ======================================
        // ATUALIZAR ESTOQUE
        // ======================================

        atualizarEstoque();

        // ======================================
        // LIMPAR CARRINHO
        // ======================================

        localStorage.removeItem("carrinhoCompra");

        // ======================================
        // SUCESSO
        // ======================================

        mensagemTela(
            "✅ Pedido realizado com sucesso!",
            "sucesso"
        );

        if (botao) {

            botao.disabled = true;

            botao.textContent =
                "✅ Pedido confirmado";
        }

        // ======================================
        // VOLTAR PARA LOJA
        // ======================================

        setTimeout(() => {

            window.location.replace(
                "comprar.html"
            );

        }, 1200);

    });

    // ==========================================
    // ATUALIZAR ESTOQUE
    // ==========================================

    function atualizarEstoque() {

        const produtos =
            lerLista("produtosShalom");

        if (!produtos.length) return;

        carrinho.forEach(item => {

            const produto =
                produtos.find(p =>
                    String(p.id) ===
                    String(item.id)
                );

            if (!produto) return;

            const estoque =
                Number(produto.estoque) || 0;

            produto.estoque =
                Math.max(
                    0,
                    estoque - item.quantidade
                );
        });

        localStorage.setItem(
            "produtosShalom",
            JSON.stringify(produtos)
        );
    }

});