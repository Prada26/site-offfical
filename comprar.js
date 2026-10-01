document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // PRODUTOS
    // ================================

    const produtos = {
        "qtd-caixa": {
            nome: "Caixa de Papelão",
            preco: 10.90
        },

        "qtd-sacola": {
            nome: "Sacola Kraft",
            preco: 10.50
        },

        "qtd-delivery": {
            nome: "Embalagem Delivery",
            preco: 10.00
        },

        "qtd-copo": {
            nome: "Copo Descartável",
            preco: 10.90
        }
    };


    // ================================
    // ATUALIZAR RESUMO
    // ================================

    function atualizarResumo() {

        const listaResumo = document.getElementById("listaResumo");
        const totalElemento = document.getElementById("total");

        let total = 0;
        let produtosSelecionados = [];


        document.querySelectorAll(".produto-selecao").forEach(function (checkbox) {

            if (checkbox.checked) {

                const idQuantidade = checkbox.dataset.id;
                const quantidadeInput =
                    document.getElementById(idQuantidade);

                const quantidade =
                    Number(quantidadeInput.value);

                const produto = produtos[idQuantidade];


                if (quantidade > 0 && produto) {

                    const subtotal =
                        produto.preco * quantidade;

                    total += subtotal;

                    produtosSelecionados.push({
                        nome: produto.nome,
                        quantidade: quantidade,
                        subtotal: subtotal
                    });
                }
            }
        });


        // ================================
        // MOSTRAR RESUMO
        // ================================

        if (produtosSelecionados.length === 0) {

            listaResumo.innerHTML = `
                <div class="nenhum">
                    Nenhum produto selecionado.
                </div>
            `;

        } else {

            listaResumo.innerHTML = "";

            produtosSelecionados.forEach(function (produto) {

                const item =
                    document.createElement("div");

                item.className = "item-resumo";

                item.innerHTML = `
                    <span>
                        ${produto.nome} x${produto.quantidade}
                    </span>

                    <strong>
                        R$ ${produto.subtotal
                            .toFixed(2)
                            .replace(".", ",")}
                    </strong>
                `;

                listaResumo.appendChild(item);
            });
        }


        // ================================
        // TOTAL
        // ================================

        totalElemento.textContent =
            total.toFixed(2).replace(".", ",");
    }


    // ================================
    // SELEÇÃO DO PRODUTO
    // ================================

    document
        .querySelectorAll(".produto-selecao")
        .forEach(function (checkbox) {

            checkbox.addEventListener("change", function () {

                const idQuantidade =
                    this.dataset.id;

                const quantidadeInput =
                    document.getElementById(idQuantidade);


                if (this.checked) {

                    if (Number(quantidadeInput.value) < 1) {
                        quantidadeInput.value = 1;
                    }

                } else {

                    quantidadeInput.value = 0;
                }


                atualizarResumo();
            });
        });


    // ================================
    // ALTERAR QUANTIDADE
    // ================================

    document
        .querySelectorAll(".quantidade-input")
        .forEach(function (input) {

            input.addEventListener("input", function () {

                const id = this.id;

                const checkbox =
                    document.querySelector(
                        `.produto-selecao[data-id="${id}"]`
                    );


                if (Number(this.value) > 0) {

                    checkbox.checked = true;

                } else {

                    checkbox.checked = false;
                    this.value = 0;
                }


                atualizarResumo();
            });
        });


    // ================================
    // CONTINUAR COMPRA
    // ================================

    window.continuarCompra = function () {

        const total =
            Number(
                document
                    .getElementById("total")
                    .textContent
                    .replace(",", ".")
            );


        if (total <= 0) {

            alert(
                "Selecione pelo menos um produto antes de continuar."
            );

            return;
        }


        window.location.href = "pagamento.html";
    };


    // ================================
    // INICIAR
    // ================================

    atualizarResumo();

});