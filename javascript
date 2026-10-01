const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const senha =
        document.getElementById("senha").value;

    const mensagem =
        document.getElementById("mensagem");


    if (
        email === "admin@shalom.com" &&
        senha === "123456"
    ) {

        sessionStorage.setItem(
            "adminLogado",
            "true"
        );

        window.location.href = "admin.html";

    } else {

        mensagem.textContent =
            "E-mail ou senha incorretos.";

    }

});


document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginAdminForm");
    const mensagem = document.getElementById("mensagem");

    if (!form) {
        console.error("Não encontrou o loginAdminForm.");
        return;
    }

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document
            .getElementById("email")
            .value
            .trim()
            .toLowerCase();

        const senha = document
            .getElementById("senha")
            .value;


        // ==============================
        // LOGIN DO ADMIN
        // ==============================

        if (
            email === "admin@shalom.com" &&
            senha === "123456"
        ) {

            // SALVAR LOGIN
            localStorage.setItem(
                "tipoUsuario",
                "admin"
            );

            localStorage.setItem(
                "usuarioLogado",
                email
            );

            localStorage.setItem(
                "nomeUsuario",
                "Administrador"
            );


            // ABRIR PAINEL
            window.location.href = "admin.html";

            return;
        }


        // ==============================
        // ERRO
        // ==============================

        if (mensagem) {

            mensagem.textContent =
                "E-mail ou senha incorretos.";

            mensagem.style.color = "red";

        }

    });

});