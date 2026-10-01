// ==========================================
// CADASTRO.JS
// LOJA SHALOM EMBALAGENS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const form =
        document.getElementById("cadastroForm");

    const mensagem =
        document.getElementById("mensagem");


    if (!form) {
        return;
    }


    // ==========================================
    // FUNÇÃO DE MENSAGEM
    // ==========================================

    function mostrarMensagem(texto, cor) {

        if (!mensagem) {
            return;
        }

        mensagem.textContent = texto;

        mensagem.style.color = cor || "";

    }


    // ==========================================
    // LER USUÁRIOS
    // ==========================================

    function lerUsuarios() {

        try {

            const dados =
                JSON.parse(
                    localStorage.getItem(
                        "usuariosShalom"
                    ) || "[]"
                );


            return Array.isArray(dados)
                ? dados
                : [];

        } catch (erro) {

            console.error(
                "Erro ao ler usuários:",
                erro
            );

            return [];
        }

    }


    // ==========================================
    // SALVAR USUÁRIOS
    // ==========================================

    function salvarUsuarios(lista) {

        localStorage.setItem(
            "usuariosShalom",
            JSON.stringify(lista)
        );

    }


    // ==========================================
    // CADASTRO
    // ==========================================

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            // --------------------------------------
            // CAMPOS
            // --------------------------------------

            const campoNome =
                document.getElementById("nome");

            const campoEmail =
                document.getElementById("email");

            const campoSenha =
                document.getElementById("senha");

            const campoConfirmar =
                document.getElementById(
                    "confirmarSenha"
                );


            const nome =
                campoNome?.value.trim() || "";


            const email =
                campoEmail?.value
                    .trim()
                    .toLowerCase() || "";


            const senha =
                campoSenha?.value || "";


            const confirmar =
                campoConfirmar?.value || "";


            // --------------------------------------
            // VALIDAR NOME
            // --------------------------------------

            if (!nome) {

                mostrarMensagem(
                    "❌ Digite seu nome.",
                    "red"
                );

                campoNome?.focus();

                return;
            }


            // --------------------------------------
            // VALIDAR E-MAIL
            // --------------------------------------

            if (!email) {

                mostrarMensagem(
                    "❌ Digite seu e-mail.",
                    "red"
                );

                campoEmail?.focus();

                return;
            }


            // --------------------------------------
            // VALIDAR SENHA
            // --------------------------------------

            if (senha.length < 6) {

                mostrarMensagem(
                    "❌ A senha precisa ter pelo menos 6 caracteres.",
                    "red"
                );

                campoSenha?.focus();

                return;
            }


            // --------------------------------------
            // CONFIRMAR SENHA
            // --------------------------------------

            if (senha !== confirmar) {

                mostrarMensagem(
                    "❌ As senhas não são iguais.",
                    "red"
                );

                campoConfirmar?.focus();

                return;
            }


            // --------------------------------------
            // E-MAIL DO ADMIN
            // --------------------------------------

            if (
                email === "admin@shalom.com"
            ) {

                mostrarMensagem(
                    "❌ Este e-mail é reservado para o administrador.",
                    "red"
                );

                campoEmail?.focus();

                return;
            }


            // --------------------------------------
            // LER USUÁRIOS
            // --------------------------------------

            const lista =
                lerUsuarios();


            // --------------------------------------
            // VERIFICAR E-MAIL EXISTENTE
            // --------------------------------------

            const existe =
                lista.some(
                    usuario =>
                        String(
                            usuario?.email || ""
                        )
                            .trim()
                            .toLowerCase() ===
                        email
                );


            if (existe) {

                mostrarMensagem(
                    "❌ Este e-mail já está cadastrado.",
                    "red"
                );

                campoEmail?.focus();

                return;
            }


            // --------------------------------------
            // CRIAR USUÁRIO
            // --------------------------------------

            const usuario = {

                id: Date.now(),

                nome: nome,

                email: email,

                senha: senha,

                tipo: "cliente"

            };


            // --------------------------------------
            // ADICIONAR USUÁRIO
            // --------------------------------------

            lista.push(usuario);


            salvarUsuarios(lista);


            // --------------------------------------
            // COMPATIBILIDADE
            // --------------------------------------

            localStorage.setItem(
                "usuarioShalom",
                JSON.stringify(usuario)
            );


            // --------------------------------------
            // SUCESSO
            // --------------------------------------

            mostrarMensagem(
                "✅ Cadastro realizado com sucesso!",
                "green"
            );


            // --------------------------------------
            // LIMPAR FORMULÁRIO
            // --------------------------------------

            form.reset();


            // --------------------------------------
            // IR PARA LOGIN
            // --------------------------------------

            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1000
            );

        }
    );

});