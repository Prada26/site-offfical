// ==========================================
// ADMIN.JS
// LOJA SHALOM EMBALAGENS
// ==========================================

(function(){

"use strict";


// ==========================================
// PROTEÇÃO ADMIN
// ==========================================

const tipoUsuario = localStorage.getItem("tipoUsuario");

if(tipoUsuario !== "admin"){

    alert("Acesso permitido somente ao administrador.");

    window.location.href = "login.html";

    return;

}



// ==========================================
// PEGAR LISTAS
// ==========================================

function pegarLista(chave){

    try{

        const dados = localStorage.getItem(chave);

        if(!dados){
            return [];
        }


        const lista = JSON.parse(dados);


        if(Array.isArray(lista)){
            return lista;
        }


        return [];


    }catch(e){

        console.error(
            "Erro lendo:",
            chave,
            e
        );

        return [];

    }

}



function salvarLista(chave,dados){

    localStorage.setItem(
        chave,
        JSON.stringify(dados)
    );

}




// ==========================================
// FORMATA DINHEIRO
// ==========================================

function dinheiro(valor){

return Number(valor || 0)
.toLocaleString(
"pt-BR",
{
style:"currency",
currency:"BRL"
}
);

}



// ==========================================
// HISTÓRICO DE DEPÓSITOS
// ==========================================

function mostrarDepositos() {

    const lista =
        document.getElementById(
            "listaDepositos"
        );


    if (!lista) {

        console.log(
            "⚠️ listaDepositos não existe no HTML"
        );

        return;

    }


    const depositos =
        pegarLista(
            "depositosShalom"
        );


    // ==========================================
    // NENHUM DEPÓSITO
    // ==========================================

    if (
        !Array.isArray(depositos) ||
        depositos.length === 0
    ) {

        lista.innerHTML = `
            <p class="vazio">
                📭 Nenhum depósito registrado.
            </p>
        `;

        return;

    }


    // ==========================================
    // LIMPAR LISTA
    // ==========================================

    lista.innerHTML = "";


    // ==========================================
    // MOSTRAR DO MAIS RECENTE PARA O MAIS ANTIGO
    // ==========================================

    [...depositos]
        .sort(function (a, b) {

            return Number(b.id || 0) -
                   Number(a.id || 0);

        })
        .forEach(function (dep) {


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "deposito";


            // ==================================
            // VALOR
            // ==================================

            const valor =
                document.createElement(
                    "strong"
                );


            valor.textContent =
                dinheiro(
                    dep.valor
                );


            // ==================================
            // DESCRIÇÃO
            // ==================================

            const descricao =
                document.createElement(
                    "p"
                );


            descricao.textContent =
                dep.descricao ||
                "Depósito";


            // ==================================
            // DATA
            // ==================================

            const data =
                document.createElement(
                    "small"
                );


            data.textContent =
                "📅 " +
                (
                    dep.data ||
                    ""
                );


            // ==================================
            // BOTÃO EXCLUIR
            // ==================================

            const botao =
                document.createElement(
                    "button"
                );


            botao.type =
                "button";


            botao.textContent =
                "🗑 Excluir";


            botao.addEventListener(
                "click",
                function () {

                    excluirDeposito(
                        dep.id
                    );

                }
            );


            // ==================================
            // MONTAR
            // ==================================

            div.appendChild(
                valor
            );


            div.appendChild(
                descricao
            );


            div.appendChild(
                data
            );


            div.appendChild(
                document.createElement(
                    "br"
                )
            );


            div.appendChild(
                botao
            );


            lista.appendChild(
                div
            );

        });

}



// ==========================================
// REGISTRAR DEPÓSITO
// ==========================================

window.registrarDeposito =
function () {


    console.log(
        "🟢 Registrando depósito..."
    );


    const valorCampo =
        document.getElementById(
            "valorDeposito"
        );


    const descricaoCampo =
        document.getElementById(
            "descricaoDeposito"
        );


    // ==========================================
    // VERIFICAR CAMPOS
    // ==========================================

    if (!valorCampo) {

        alert(
            "Campo valorDeposito não encontrado."
        );

        return;

    }


    // ==========================================
    // PEGAR VALOR
    // ==========================================

    let textoValor =
        String(
            valorCampo.value || ""
        ).trim();


    // Aceita:
    // 500
    // 500.50
    // 500,50

    textoValor =
        textoValor.replace(
            ",",
            "."
        );


    const numero =
        Number(
            textoValor
        );


    // ==========================================
    // VALIDAR VALOR
    // ==========================================

    if (
        !Number.isFinite(numero) ||
        numero <= 0
    ) {

        alert(
            "Digite um valor válido."
        );

        valorCampo.focus();

        return;

    }


    // ==========================================
    // DESCRIÇÃO
    // ==========================================

    let descricao =
        "Depósito";


    if (descricaoCampo) {

        descricao =
            String(
                descricaoCampo.value || ""
            ).trim();


        if (!descricao) {

            descricao =
                "Depósito";

        }

    }


    // ==========================================
    // PEGAR DEPÓSITOS EXISTENTES
    // ==========================================

    const depositos =
        pegarLista(
            "depositosShalom"
        );


    // ==========================================
    // NOVO DEPÓSITO
    // ==========================================

    const novoDeposito = {

        id:
            Date.now(),

        valor:
            numero,

        descricao:
            descricao,

        data:
            new Date().toLocaleString(
                "pt-BR"
            )

    };


    // ==========================================
    // ADICIONAR
    // ==========================================

    depositos.push(
        novoDeposito
    );


    // ==========================================
    // SALVAR
    // ==========================================

    localStorage.setItem(
        "depositosShalom",
        JSON.stringify(
            depositos
        )
    );


    // ==========================================
    // LIMPAR CAMPOS
    // ==========================================

    valorCampo.value = "";


    if (descricaoCampo) {

        descricaoCampo.value = "";

    }


    // ==========================================
    // ATUALIZAR HISTÓRICO
    // ==========================================

    mostrarDepositos();


    // ==========================================
    // ATUALIZAR RESUMO
    // ==========================================

    if (
        typeof atualizarResumo ===
        "function"
    ) {

        atualizarResumo();

    }


    // ==========================================
    // MENSAGEM
    // ==========================================

    alert(
        "✅ Depósito registrado com sucesso!"
    );


    console.log(
        "✅ Depósito salvo:",
        novoDeposito
    );

};



// ==========================================
// EXCLUIR DEPÓSITO
// ==========================================

window.excluirDeposito =
function (id) {


    const confirmar =
        confirm(
            "Tem certeza que deseja excluir este depósito?"
        );


    if (!confirmar) {
        return;
    }


    let depositos =
        pegarLista(
            "depositosShalom"
        );


    depositos =
        depositos.filter(
            function (dep) {

                return Number(
                    dep.id
                ) !== Number(id);

            }
        );


    localStorage.setItem(
        "depositosShalom",
        JSON.stringify(
            depositos
        )
    );


    // ==========================================
    // ATUALIZAR HISTÓRICO
    // ==========================================

    mostrarDepositos();


    // ==========================================
    // ATUALIZAR RESUMO
    // ==========================================

    if (
        typeof atualizarResumo ===
        "function"
    ) {

        atualizarResumo();

    }


    console.log(
        "🗑 Depósito excluído:",
        id
    );

};



// ==========================================
// CARREGAR HISTÓRICO AO ABRIR A PÁGINA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        mostrarDepositos();

    }
);