document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");
    const mensagem = document.getElementById("mensagem");

    if (!form) {
        console.error("Formulário loginForm não encontrado.");
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const emailInput = document.getElementById("email");
        const senhaInput = document.getElementById("senha");


        if (!emailInput || !senhaInput) {

            console.error(
                "Campo de e-mail ou senha não encontrado."
            );

            return;
        }


        const email =
            emailInput.value
                .trim()
                .toLowerCase();


        const senha =
            senhaInput.value;


        // =====================================
        // LIMPAR MENSAGEM
        // =====================================

        if (mensagem) {
            mensagem.textContent = "";
        }


        // =====================================
        // ADMINISTRADOR
        // =====================================

        if (
            email === "admin@shalom.com" &&
            senha === "123456"
        ) {


            localStorage.setItem(
                "tipoUsuario",
                "admin"
            );


            localStorage.setItem(
                "usuarioLogado",
                email
            );


            localStorage.setItem(
                "usuarioNome",
                "Administrador"
            );


            // Compatibilidade com versões antigas
            localStorage.setItem(
                "nomeUsuario",
                "Administrador"
            );


            if (mensagem) {

                mensagem.textContent =
                    "✅ Login de administrador realizado!";

                mensagem.style.color = "green";

            }


            setTimeout(function () {

                window.location.href =
                    "admin.html";

            }, 500);


            return;
        }


        // =====================================
        // CARREGAR CLIENTES
        // =====================================

        let usuarios = [];


        try {

            const dados =
                localStorage.getItem(
                    "usuariosShalom"
                );


            if (dados) {

                usuarios = JSON.parse(dados);

            }


            if (!Array.isArray(usuarios)) {

                usuarios = [];

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar usuários:",
                erro
            );

            usuarios = [];

        }


        // =====================================
        // PROCURAR CLIENTE
        // =====================================

        const usuario =
            usuarios.find(function (u) {


                if (!u) {
                    return false;
                }


                const emailUsuario =
                    String(
                        u.email || ""
                    )
                    .trim()
                    .toLowerCase();


                const senhaUsuario =
                    String(
                        u.senha || ""
                    );


                return (
                    emailUsuario === email &&
                    senhaUsuario === senha
                );

            });


        // =====================================
        // CLIENTE ENCONTRADO
        // =====================================

        if (usuario) {


            localStorage.setItem(
                "tipoUsuario",
                "cliente"
            );


            localStorage.setItem(
                "usuarioLogado",
                usuario.email || email
            );


            localStorage.setItem(
                "usuarioNome",
                usuario.nome || "Cliente"
            );


            // Compatibilidade
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


            if (mensagem) {

                mensagem.textContent =
                    "✅ Login realizado! Entrando na loja...";

                mensagem.style.color = "green";

            }


            setTimeout(function () {

                window.location.href =
                    "index.html";

            }, 500);


            return;
        }


        // =====================================
        // LOGIN INCORRETO
        // =====================================

        if (mensagem) {

            mensagem.textContent =
                "❌ E-mail ou senha incorretos.";

            mensagem.style.color =
                "red";

        }

    });

});