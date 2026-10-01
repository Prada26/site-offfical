// ==========================================
// LOGIN.JS
// LOJA SHALOM EMBALAGENS
// ==========================================

(function () {

    "use strict";


    // ==========================================
    // ELEMENTOS
    // ==========================================

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const senhaInput =
        document.getElementById("senha");

    const mensagem =
        document.getElementById("mensagem");


    if (!loginForm) {
        return;
    }


    // ==========================================
    // MENSAGEM
    // ==========================================

    function mostrarMensagem(texto, tipo) {

        if (!mensagem) {
            return;
        }

        mensagem.textContent = texto;

        mensagem.className =
            "mensagem " + (tipo || "");

    }


    // ==========================================
    // PEGAR USUÁRIOS
    // ==========================================

    function pegarUsuarios() {

        let usuarios = [];

        try {

            usuarios =
                JSON.parse(
                    localStorage.getItem(
                        "usuariosShalom"
                    )
                ) || [];

        } catch (erro) {

            console.error(
                "Erro ao carregar usuários:",
                erro
            );

            usuarios = [];
        }


        if (!Array.isArray(usuarios)) {
            usuarios = [];
        }


        return usuarios;
    }


    // ==========================================
    // LOGIN
    // ==========================================

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                emailInput.value
                    .trim()
                    .toLowerCase();


            const senha =
                senhaInput.value;


            if (!email || !senha) {

                mostrarMensagem(
                    "Digite seu e-mail e sua senha.",
                    "erro"
                );

                return;
            }


            // ======================================
            // USUÁRIOS CADASTRADOS
            // ======================================

            const usuarios =
                pegarUsuarios();


            const usuario =
                usuarios.find(function (item) {

                    return String(
                        item.email || ""
                    )
                        .trim()
                        .toLowerCase() === email
                        &&
                        String(
                            item.senha || ""
                        ) === senha;

                });


            // ======================================
            // ADMIN PADRÃO
            // ======================================

            let usuarioFinal =
                usuario;


            if (!usuarioFinal) {

                if (
                    email === "admin@shalom.com" &&
                    senha === "123456"
                ) {

                    usuarioFinal = {

                        id: "admin",

                        nome: "Administrador",

                        email: "admin@shalom.com",

                        senha: "123456",

                        tipo: "admin"

                    };

                }

            }


            // ======================================
            // LOGIN INVÁLIDO
            // ======================================

            if (!usuarioFinal) {

                mostrarMensagem(
                    "E-mail ou senha incorretos.",
                    "erro"
                );

                return;
            }


            // ======================================
            // DEFINIR TIPO
            // ======================================

            let tipo =
                String(
                    usuarioFinal.tipo || ""
                )
                    .trim()
                    .toLowerCase();


            // Usuário antigo sem tipo
            // será considerado cliente.

            if (
                tipo !== "admin" &&
                tipo !== "cliente"
            ) {

                tipo = "cliente";

            }


            // ======================================
            // SALVAR LOGIN
            // ======================================

            localStorage.setItem(
                "tipoUsuario",
                tipo
            );


            localStorage.setItem(
                "usuarioLogado",
                "true"
            );


            localStorage.setItem(
                "usuarioNome",
                usuarioFinal.nome || "Cliente"
            );


            localStorage.setItem(
                "nomeUsuario",
                usuarioFinal.nome || "Cliente"
            );


            localStorage.setItem(
                "clienteNome",
                usuarioFinal.nome || "Cliente"
            );


            localStorage.setItem(
                "clienteEmail",
                usuarioFinal.email || email
            );


            // ======================================
            // SALVAR DADOS COMPLETOS
            // ======================================

            localStorage.setItem(
                "usuarioAtual",
                JSON.stringify({

                    id: usuarioFinal.id || "",

                    nome:
                        usuarioFinal.nome ||
                        "Cliente",

                    email:
                        usuarioFinal.email ||
                        email,

                    tipo: tipo

                })
            );


            // ======================================
            // REDIRECIONAMENTO
            // ======================================

            mostrarMensagem(
                "Login realizado com sucesso!",
                "sucesso"
            );


            setTimeout(function () {

                if (tipo === "admin") {

                    window.location.href =
                        "admin.html";

                } else {

                    window.location.href =
                        "comprar.html";

                }

            }, 300);

        }
    );

})();