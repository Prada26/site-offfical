// =====================================================
// ADMIN.JS - LOJA SHALOM EMBALAGENS
// =====================================================

(function () {

    "use strict";

    // =====================================================
    // PROTEÇÃO DO ADMIN
    // =====================================================

    if (localStorage.getItem("tipoUsuario") !== "admin") {
        window.location.href = "login.html";
        return;
    }


    // =====================================================
    // INICIALIZAÇÃO
    // =====================================================

    function iniciarAdmin() {

        console.log("✅ ADMIN.JS carregado");

        carregarDepositos();
        carregarProdutos();
        carregarClientes();
        atualizarResumo();
        configurarDeposito();

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarAdmin
        );

    } else {

        iniciarAdmin();

    }


    // =====================================================
    // DINHEIRO
    // =====================================================

    function formatarDinheiro(valor) {

        valor = Number(valor);

        if (!Number.isFinite(valor)) {
            valor = 0;
        }

        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    }


    // =====================================================
    // DEPÓSITOS
    // =====================================================

    function obterDepositos() {

        try {

            const dados =
                localStorage.getItem(
                    "depositosShalom"
                );

            if (!dados) {
                return [];
            }

            const depositos =
                JSON.parse(dados);

            if (!Array.isArray(depositos)) {
                return [];
            }

            return depositos;

        } catch (erro) {

            console.error(
                "❌ Erro ao carregar depósitos:",
                erro
            );

            return [];

        }

    }


    // =====================================================
    // SALVAR DEPÓSITOS
    // =====================================================

    function salvarDepositos(depositos) {

        try {

            localStorage.setItem(
                "depositosShalom",
                JSON.stringify(depositos)
            );

            return true;

        } catch (erro) {

            console.error(
                "❌ Erro ao salvar depósitos:",
                erro
            );

            return false;

        }

    }


    // =====================================================
    // PEGAR CAMPO VALOR
    // =====================================================

    function pegarCampoValor() {

        const campo =
            document.getElementById(
                "valorDeposito"
            );

        if (campo) {
            return campo;
        }

        const formulario =
            document.getElementById(
                "depositoForm"
            );

        if (!formulario) {
            return null;
        }

        return formulario.querySelector(
            'input[type="number"], input[type="text"]'
        );

    }


    // =====================================================
    // PEGAR DESCRIÇÃO
    // =====================================================

    function pegarCampoDescricao() {

        const campo =
            document.getElementById(
                "descricaoDeposito"
            );

        if (campo) {
            return campo;
        }

        const formulario =
            document.getElementById(
                "depositoForm"
            );

        if (!formulario) {
            return null;
        }

        const campos =
            formulario.querySelectorAll(
                'input[type="text"], textarea'
            );

        if (campos.length > 1) {
            return campos[1];
        }

        return null;

    }


    // =====================================================
    // MENSAGEM
    // =====================================================

    function mostrarMensagem(texto, cor) {

        const mensagem =
            document.getElementById(
                "mensagemDeposito"
            );

        if (!mensagem) {
            console.log(texto);
            return;
        }

        mensagem.textContent = texto;
        mensagem.style.color =
            cor || "black";

    }


    // =====================================================
    // CONFIGURAR DEPÓSITO
    // =====================================================

    function configurarDeposito() {

        const formulario =
            document.getElementById(
                "depositoForm"
            );

        if (!formulario) {

            console.warn(
                "⚠️ #depositoForm não encontrado."
            );

            return;

        }


        // Evita configurar duas vezes
        if (
            formulario.dataset.configurado === "true"
        ) {
            return;
        }

        formulario.dataset.configurado = "true";


        // =================================================
        // GARANTIR QUE O BOTÃO SEJA SUBMIT
        // =================================================

        const botao =
            formulario.querySelector(
                'button[type="submit"], button:not([type])'
            );

        if (botao) {

            botao.type = "submit";

        }


        // =================================================
        // EVENTO DO FORMULÁRIO
        // =================================================

        formulario.addEventListener(
            "submit",
            function (evento) {

                evento.preventDefault();
                evento.stopPropagation();

                registrarDeposito();

            }
        );


        console.log(
            "✅ Formulário de depósito configurado"
        );

    }


    // =====================================================
    // REGISTRAR DEPÓSITO
    // =====================================================

    function registrarDeposito() {

        console.log(
            "🟢 Iniciando registro de depósito..."
        );


        const campoValor =
            pegarCampoValor();

        const campoDescricao =
            pegarCampoDescricao();


        // =================================================
        // VERIFICAR CAMPO
        // =================================================

        if (!campoValor) {

            console.error(
                "❌ Campo de valor não encontrado."
            );

            alert(
                "Erro: campo de valor do depósito não encontrado.\n\n" +
                "Verifique se existe:\n" +
                'id="valorDeposito"'
            );

            return;

        }


        // =================================================
        // PEGAR VALOR
        // =================================================

        let textoValor =
            String(
                campoValor.value || ""
            ).trim();


        textoValor =
            textoValor.replace(
                /\s/g,
                ""
            );


        // Aceita 500,50 e 500.50
        if (
            textoValor.includes(",") &&
            textoValor.includes(".")
        ) {

            textoValor =
                textoValor
                    .replace(/\./g, "")
                    .replace(",", ".");

        } else {

            textoValor =
                textoValor.replace(",", ".");

        }


        const valor =
            Number(textoValor);


        // =================================================
        // VALIDAR VALOR
        // =================================================

        if (
            !Number.isFinite(valor) ||
            valor <= 0
        ) {

            mostrarMensagem(
                "❌ Digite um valor válido.",
                "red"
            );

            alert(
                "Digite um valor válido."
            );

            campoValor.focus();

            return;

        }


        // =================================================
        // DESCRIÇÃO
        // =================================================

        let descricao =
            "Depósito";


        if (campoDescricao) {

            descricao =
                String(
                    campoDescricao.value || ""
                ).trim();


            if (!descricao) {
                descricao = "Depósito";
            }

        }


        // =================================================
        // PEGAR DEPÓSITOS
        // =================================================

        const depositos =
            obterDepositos();


        // =================================================
        // CRIAR DEPÓSITO
        // =================================================

        const novoDeposito = {

            id:
                Date.now(),

            valor:
                valor,

            descricao:
                descricao,

            data:
                new Date().toLocaleString(
                    "pt-BR"
                )

        };


        // =================================================
        // ADICIONAR
        // =================================================

        depositos.push(
            novoDeposito
        );


        // =================================================
        // SALVAR
        // =================================================

        const salvou =
            salvarDepositos(
                depositos
            );


        if (!salvou) {

            alert(
                "❌ Não foi possível salvar o depósito."
            );

            return;

        }


        // =================================================
        // LIMPAR
        // =================================================

        campoValor.value = "";

        if (campoDescricao) {
            campoDescricao.value = "";
        }


        // =================================================
        // ATUALIZAR
        // =================================================

        carregarDepositos();
        atualizarResumo();


        // =================================================
        // MENSAGEM
        // =================================================

        mostrarMensagem(
            "✅ Depósito registrado com sucesso!",
            "green"
        );


        console.log(
            "✅ Depósito salvo:",
            novoDeposito
        );

    }


    window.registrarDeposito =
        registrarDeposito;


    // =====================================================
    // HISTÓRICO DE DEPÓSITOS
    // =====================================================

    function carregarDepositos() {

        const lista =
            document.getElementById(
                "listaDepositos"
            );


        if (!lista) {

            console.warn(
                "⚠️ #listaDepositos não encontrado."
            );

            return;

        }


        const depositos =
            obterDepositos();


        // =================================================
        // NENHUM DEPÓSITO
        // =================================================

        if (depositos.length === 0) {

            lista.innerHTML = `

                <div class="vazio">
                    📭 Nenhum depósito registrado.
                </div>

            `;

            return;

        }


        // =================================================
        // ORDENAR
        // =================================================

        const ordenados =
            [...depositos].sort(
                function (a, b) {

                    return (
                        Number(b.id || 0) -
                        Number(a.id || 0)
                    );

                }
            );


        lista.innerHTML = "";


        // =================================================
        // MOSTRAR
        // =================================================

        ordenados.forEach(
            function (deposito) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "deposito";


                item.style.display =
                    "flex";

                item.style.justifyContent =
                    "space-between";

                item.style.alignItems =
                    "center";

                item.style.gap =
                    "15px";

                item.style.padding =
                    "15px";

                item.style.marginBottom =
                    "10px";

                item.style.background =
                    "#f5f5f5";

                item.style.borderRadius =
                    "10px";


                // =================================================
                // INFORMAÇÕES
                // =================================================

                const informacoes =
                    document.createElement(
                        "div"
                    );


                const valor =
                    document.createElement(
                        "strong"
                    );


                valor.textContent =
                    formatarDinheiro(
                        deposito.valor
                    );


                valor.style.fontSize =
                    "20px";


                const descricao =
                    document.createElement(
                        "div"
                    );


                descricao.textContent =
                    deposito.descricao ||
                    "Depósito";


                const data =
                    document.createElement(
                        "small"
                    );


                data.textContent =
                    "📅 " +
                    (
                        deposito.data ||
                        ""
                    );


                informacoes.appendChild(
                    valor
                );

                informacoes.appendChild(
                    document.createElement("br")
                );

                informacoes.appendChild(
                    descricao
                );

                informacoes.appendChild(
                    document.createElement("br")
                );

                informacoes.appendChild(
                    data
                );


                // =================================================
                // BOTÃO EXCLUIR
                // =================================================

                const botao =
                    document.createElement(
                        "button"
                    );


                botao.type =
                    "button";


                botao.className =
                    "btn-excluir";


                botao.textContent =
                    "🗑️ Excluir";


                botao.addEventListener(
                    "click",
                    function () {

                        excluirDeposito(
                            deposito.id
                        );

                    }
                );


                item.appendChild(
                    informacoes
                );

                item.appendChild(
                    botao
                );


                lista.appendChild(
                    item
                );

            }
        );

    }


    // =====================================================
    // EXCLUIR DEPÓSITO
    // =====================================================

    function excluirDeposito(id) {

        if (
            !confirm(
                "Tem certeza que deseja excluir este depósito?"
            )
        ) {
            return;
        }


        let depositos =
            obterDepositos();


        depositos =
            depositos.filter(
                function (deposito) {

                    return Number(
                        deposito.id
                    ) !== Number(id);

                }
            );


        if (
            !salvarDepositos(
                depositos
            )
        ) {

            alert(
                "❌ Não foi possível excluir o depósito."
            );

            return;

        }


        carregarDepositos();
        atualizarResumo();

    }


    window.excluirDeposito =
        excluirDeposito;


    // =====================================================
    // PRODUTOS
    // =====================================================

    function obterProdutos() {

        try {

            const dados =
                localStorage.getItem(
                    "produtosShalom"
                );

            if (!dados) {
                return [];
            }

            const produtos =
                JSON.parse(dados);

            return Array.isArray(produtos)
                ? produtos
                : [];

        } catch (erro) {

            console.error(
                "❌ Erro nos produtos:",
                erro
            );

            return [];

        }

    }


    // =====================================================
    // ABRIR FORMULÁRIO PRODUTO
    // =====================================================

    function abrirFormularioProduto() {

        const formulario =
            document.getElementById(
                "formularioProduto"
            );

        if (!formulario) {
            return;
        }


        formulario.classList.remove(
            "oculto"
        );


        const produtoId =
            document.getElementById(
                "produtoId"
            );

        const nome =
            document.getElementById(
                "nomeProduto"
            );

        const preco =
            document.getElementById(
                "precoProduto"
            );

        const estoque =
            document.getElementById(
                "estoqueProduto"
            );

        const imagem =
            document.getElementById(
                "imagemProduto"
            );


        if (produtoId)
            produtoId.value = "";

        if (nome)
            nome.value = "";

        if (preco)
            preco.value = "";

        if (estoque)
            estoque.value = "";

        if (imagem)
            imagem.value = "";


        if (nome) {
            nome.focus();
        }

    }


    window.abrirFormularioProduto =
        abrirFormularioProduto;


    // =====================================================
    // FECHAR FORMULÁRIO
    // =====================================================

    function fecharFormularioProduto() {

        const formulario =
            document.getElementById(
                "formularioProduto"
            );

        if (formulario) {

            formulario.classList.add(
                "oculto"
            );

        }

    }


    window.fecharFormularioProduto =
        fecharFormularioProduto;


    // =====================================================
    // SALVAR PRODUTO
    // =====================================================

    function salvarProduto() {

        const idCampo =
            document.getElementById(
                "produtoId"
            );

        const nomeCampo =
            document.getElementById(
                "nomeProduto"
            );

        const precoCampo =
            document.getElementById(
                "precoProduto"
            );

        const estoqueCampo =
            document.getElementById(
                "estoqueProduto"
            );

        const imagemCampo =
            document.getElementById(
                "imagemProduto"
            );


        if (
            !nomeCampo ||
            !precoCampo ||
            !estoqueCampo ||
            !imagemCampo
        ) {

            alert(
                "Erro: campos do produto não encontrados."
            );

            return;

        }


        const id =
            idCampo
                ? idCampo.value
                : "";


        const nome =
            nomeCampo.value.trim();


        const preco =
            Number(
                String(
                    precoCampo.value
                ).replace(",", ".")
            );


        const estoque =
            Number(
                estoqueCampo.value
            );


        const imagem =
            imagemCampo.value.trim();


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
            !Number.isFinite(estoque) ||
            estoque < 0
        ) {

            alert(
                "Digite um estoque válido."
            );

            return;

        }


        let produtos =
            obterProdutos();


        if (id) {

            const indice =
                produtos.findIndex(
                    function (produto) {

                        return String(
                            produto.id
                        ) === String(id);

                    }
                );


            if (indice !== -1) {

                produtos[indice] = {

                    ...produtos[indice],

                    nome:
                        nome,

                    preco:
                        preco,

                    estoque:
                        estoque,

                    imagem:
                        imagem

                };

            }

        } else {

            produtos.push({

                id:
                    Date.now(),

                nome:
                    nome,

                preco:
                    preco,

                estoque:
                    estoque,

                imagem:
                    imagem

            });

        }


        localStorage.setItem(
            "produtosShalom",
            JSON.stringify(produtos)
        );


        fecharFormularioProduto();
        carregarProdutos();
        atualizarResumo();


        alert(
            "✅ Produto salvo com sucesso!"
        );

    }


    window.salvarProduto =
        salvarProduto;


    // =====================================================
    // CARREGAR PRODUTOS
    // =====================================================

    function carregarProdutos() {

        const lista =
            document.getElementById(
                "listaProdutos"
            );


        if (!lista) {
            return;
        }


        const produtos =
            obterProdutos();


        if (produtos.length === 0) {

            lista.innerHTML = `

                <p class="vazio">
                    Nenhum produto cadastrado.
                </p>

            `;

            return;

        }


        lista.innerHTML = "";


        produtos.forEach(
            function (produto) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "produto";


                const imagem =
                    produto.imagem
                        ? `

                            <img
                                src="${escapeAttribute(produto.imagem)}"
                                alt="${escapeAttribute(produto.nome)}"
                                style="
                                    width:70px;
                                    height:70px;
                                    object-fit:contain;
                                    border-radius:8px;
                                "
                                onerror="this.style.display='none'"
                            >

                        `
                        : "";


                item.innerHTML = `

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:15px;
                        "
                    >

                        ${imagem}

                        <div>

                            <strong>
                                ${escapeHTML(produto.nome)}
                            </strong>

                            <br>

                            <span>
                                Preço:
                                ${formatarDinheiro(produto.preco)}
                            </span>

                            <br>

                            <span>
                                Estoque:
                                ${Number(produto.estoque) || 0}
                            </span>

                        </div>

                    </div>

                    <div class="acoes">

                        <button
                            type="button"
                            class="btn-editar"
                            onclick="editarProduto(${Number(produto.id)})"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            onclick="excluirProduto(${Number(produto.id)})"
                        >
                            🗑️ Excluir
                        </button>

                    </div>

                `;


                lista.appendChild(
                    item
                );

            }
        );

    }


    // =====================================================
    // EDITAR PRODUTO
    // =====================================================

    function editarProduto(id) {

        const produtos =
            obterProdutos();


        const produto =
            produtos.find(
                function (item) {

                    return Number(
                        item.id
                    ) === Number(id);

                }
            );


        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;

        }


        const produtoId =
            document.getElementById(
                "produtoId"
            );

        const nome =
            document.getElementById(
                "nomeProduto"
            );

        const preco =
            document.getElementById(
                "precoProduto"
            );

        const estoque =
            document.getElementById(
                "estoqueProduto"
            );

        const imagem =
            document.getElementById(
                "imagemProduto"
            );

        const formulario =
            document.getElementById(
                "formularioProduto"
            );


        if (produtoId)
            produtoId.value =
                produto.id;


        if (nome)
            nome.value =
                produto.nome || "";


        if (preco)
            preco.value =
                produto.preco || 0;


        if (estoque)
            estoque.value =
                produto.estoque || 0;


        if (imagem)
            imagem.value =
                produto.imagem || "";


        if (formulario)
            formulario.classList.remove(
                "oculto"
            );


        if (nome)
            nome.focus();

    }


    window.editarProduto =
        editarProduto;


    // =====================================================
    // EXCLUIR PRODUTO
    // =====================================================

    function excluirProduto(id) {

        if (
            !confirm(
                "Tem certeza que deseja excluir este produto?"
            )
        ) {
            return;
        }


        let produtos =
            obterProdutos();


        produtos =
            produtos.filter(
                function (produto) {

                    return Number(
                        produto.id
                    ) !== Number(id);

                }
            );


        localStorage.setItem(
            "produtosShalom",
            JSON.stringify(produtos)
        );


        carregarProdutos();
        atualizarResumo();

    }


    window.excluirProduto =
        excluirProduto;


    // =====================================================
    // CLIENTES
    // =====================================================

    function obterClientes() {

        try {

            const dados =
                localStorage.getItem(
                    "usuariosShalom"
                );

            if (!dados) {
                return [];
            }

            const clientes =
                JSON.parse(dados);

            return Array.isArray(clientes)
                ? clientes
                : [];

        } catch (erro) {

            console.error(
                "❌ Erro nos clientes:",
                erro
            );

            return [];

        }

    }


    // =====================================================
    // CARREGAR CLIENTES
    // =====================================================

    function carregarClientes() {

        const lista =
            document.getElementById(
                "listaClientes"
            );


        if (!lista) {
            return;
        }


        const clientes =
            obterClientes();


        if (clientes.length === 0) {

            lista.innerHTML = `

                <p class="vazio">
                    Nenhum cliente cadastrado.
                </p>

            `;

            return;

        }


        lista.innerHTML = "";


        clientes.forEach(
            function (cliente) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "cliente";


                const nome =
                    document.createElement(
                        "strong"
                    );


                nome.textContent =
                    "👤 " +
                    (
                        cliente.nome ||
                        "Cliente"
                    );


                const email =
                    document.createElement(
                        "div"
                    );


                email.textContent =
                    "📧 " +
                    (
                        cliente.email ||
                        ""
                    );


                item.appendChild(
                    nome
                );

                item.appendChild(
                    email
                );


                lista.appendChild(
                    item
                );

            }
        );

    }


    // =====================================================
    // ATUALIZAR RESUMO
    // =====================================================

    function atualizarResumo() {

        const depositos =
            obterDepositos();


        const produtos =
            obterProdutos();


        const clientes =
            obterClientes();


        // =================================================
        // SALDO
        // =================================================

        const saldo =
            depositos.reduce(
                function (
                    total,
                    deposito
                ) {

                    return total +
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


        if (saldoElemento) {

            saldoElemento.textContent =
                formatarDinheiro(
                    saldo
                );

        }


        // =================================================
        // PRODUTOS
        // =================================================

        const totalProdutos =
            document.getElementById(
                "totalProdutos"
            );


        if (totalProdutos) {

            totalProdutos.textContent =
                produtos.length;

        }


        // =================================================
        // CLIENTES
        // =================================================

        const totalClientes =
            document.getElementById(
                "totalClientes"
            );


        if (totalClientes) {

            totalClientes.textContent =
                clientes.length;

        }


        // =================================================
        // DEPÓSITOS
        // =================================================

        const totalDepositos =
            document.getElementById(
                "totalDepositos"
            );


        if (totalDepositos) {

            totalDepositos.textContent =
                depositos.length;

        }


        // =================================================
        // CORRIGIR "DEPÓSITOS 0" MESMO SEM ID
        // =================================================

        if (!totalDepositos) {

            const elementos =
                document.querySelectorAll(
                    "h1, h2, h3, h4, h5, h6, div, span, p"
                );


            elementos.forEach(
                function (elemento) {

                    if (
                        elemento.children.length !== 0
                    ) {
                        return;
                    }


                    const texto =
                        (
                            elemento.textContent ||
                            ""
                        ).trim();


                    if (
                        /^📇?\s*Depósitos\s+\d+$/.test(
                            texto
                        )
                        ||
                        /^💳\s*Depósitos\s+\d+$/.test(
                            texto
                        )
                        ||
                        /^Depósito\s+\d+$/.test(
                            texto
                        )
                    ) {

                        const novoTexto =
                            texto.replace(
                                /\d+$/,
                                String(
                                    depositos.length
                                )
                            );


                        elemento.textContent =
                            novoTexto;

                    }

                }
            );

        }


        console.log(
            "📊 RESUMO ATUALIZADO:",
            {
                saldo:
                    saldo,

                produtos:
                    produtos.length,

                clientes:
                    clientes.length,

                depositos:
                    depositos.length
            }
        );

    }


    // =====================================================
    // SAIR
    // =====================================================

    function sair() {

        localStorage.removeItem(
            "tipoUsuario"
        );

        localStorage.removeItem(
            "usuarioNome"
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


    window.sair =
        sair;


    // =====================================================
    // SEGURANÇA
    // =====================================================

    function escapeHTML(valor) {

        return String(
            valor ?? ""
        )
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function escapeAttribute(valor) {

        return String(
            valor ?? ""
        )
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    }

})();