// ==========================================
// LOGIN - LOJA SHALOM EMBALAGENS
// ==========================================

"use strict";

const ADMIN_EMAIL = "admin@shalom.com";
const ADMIN_SENHA = "123456";


// ==========================================
// ELEMENTOS
// ==========================================

const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");


// ==========================================
// MOSTRAR MENSAGEM
// ==========================================

function mostrarMensagem(texto, tipo = "erro") {

    if (!mensagem) return;

    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;
}


// ==========================================
// LIMPAR SESSÃO ANTERIOR
// ==========================================

function limparSessao() {

    localStorage.removeItem("tipoUsuario");
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioNome");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("clienteNome");
    localStorage.removeItem("clienteEmail");
    localStorage.removeItem("usuarioAtual");
}


// ==========================================
// LOGIN
// ==========================================

if (form) {

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const emailInput = document.getElementById("email");
        const senhaInput = document.getElementById("senha");

        const email = emailInput.value.trim().toLowerCase();
        const senha = senhaInput.value;

        // ------------------------------------------
        // VALIDAÇÃO
        // ------------------------------------------

        if (!email || !senha) {

            mostrarMensagem(
                "Digite o e-mail e a senha.",
                "erro"
            );

            return;
        }


        // ==========================================
        // LOGIN DO ADMINISTRADOR
        // ==========================================

        if (
            email === ADMIN_EMAIL &&
            senha === ADMIN_SENHA
        ) {

            // Limpa qualquer login anterior
            limparSessao();


            // Salva sessão de administrador
            localStorage.setItem(
                "tipoUsuario",
                "admin"
            );

            localStorage.setItem(
                "usuarioLogado",
                "true"
            );

            localStorage.setItem(
                "usuarioNome",
                "Administrador"
            );

            localStorage.setItem(
                "nomeUsuario",
                "Administrador"
            );

            localStorage.setItem(
                "clienteEmail",
                ADMIN_EMAIL
            );


            localStorage.setItem(
                "usuarioAtual",
                JSON.stringify({
                    id: "admin",
                    nome: "Administrador",
                    email: ADMIN_EMAIL,
                    tipo: "admin"
                })
            );


            // --------------------------------------
            // ENTRA NO PAINEL
            // --------------------------------------

            window.location.replace("admin.html");

            return;
        }


        // ==========================================
        // LOGIN DO CLIENTE
        // ==========================================

        let usuarios = [];

        try {

            usuarios = JSON.parse(
                localStorage.getItem("usuariosShalom")
            ) || [];

        } catch (erro) {

            console.error(
                "Erro ao ler usuariosShalom:",
                erro
            );

            usuarios = [];
        }


        const usuario = usuarios.find(function (item) {

            return (
                String(item.email || "")
                    .trim()
                    .toLowerCase() === email
                &&
                String(item.senha || "") === senha
            );

        });


        if (!usuario) {

            mostrarMensagem(
                "E-mail ou senha incorretos.",
                "erro"
            );

            return;
        }


        // ------------------------------------------
        // SALVA CLIENTE
        // ------------------------------------------

        limparSessao();

        localStorage.setItem(
            "tipoUsuario",
            "cliente"
        );

        localStorage.setItem(
            "usuarioLogado",
            "true"
        );

        localStorage.setItem(
            "usuarioNome",
            usuario.nome || "Cliente"
        );

        localStorage.setItem(
            "nomeUsuario",
            usuario.nome || "Cliente"
        );

        localStorage.setItem(
            "clienteNome",
            usuario.nome || "Cliente"
        );

        localStorage.setItem(
            "clienteEmail",
            usuario.email || email
        );

        localStorage.setItem(
            "usuarioAtual",
            JSON.stringify({
                id: usuario.id || Date.now().toString(),
                nome: usuario.nome || "Cliente",
                email: usuario.email || email,
                tipo: "cliente"
            })
        );


        // ------------------------------------------
        // ENTRA NA LOJA
        // ------------------------------------------

        window.location.replace("comprar.html");

    });

}