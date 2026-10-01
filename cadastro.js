const cadastroForm = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagem");

cadastroForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;


    // =====================================
    // VERIFICAR SENHAS
    // =====================================

    if (senha !== confirmarSenha) {

        mensagem.textContent =
            "❌ As senhas não são iguais.";

        mensagem.style.color = "red";

        return;
    }


    // =====================================
    // TAMANHO DA SENHA
    // =====================================

    if (senha.length < 6) {

        mensagem.textContent =
            "❌ A senha precisa ter pelo menos 6 caracteres.";

        mensagem.style.color = "red";

        return;
    }


    // =====================================
    // CARREGAR CLIENTES
    // =====================================

    let usuarios = [];

    try {

        usuarios = JSON.parse(
            localStorage.getItem("usuariosShalom") || "[]"
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar usuários:",
            erro
        );

        usuarios = [];

    }


    // =====================================
    // VERIFICAR E-MAIL
    // =====================================

    const emailExiste = usuarios.some(function(usuario) {

        return (
            String(usuario.email).toLowerCase() === email
        );

    });


    if (emailExiste) {

        mensagem.textContent =
            "❌ Este e-mail já está cadastrado.";

        mensagem.style.color = "red";

        return;
    }


    // =====================================
    // CRIAR CLIENTE
    // =====================================

    const usuario = {

        id: Date.now(),

        nome: nome,

        email: email,

        senha: senha

    };


    usuarios.push(usuario);


    // =====================================
    // SALVAR CLIENTE
    // =====================================

    localStorage.setItem(
        "usuariosShalom",
        JSON.stringify(usuarios)
    );


    // =====================================
    // MENSAGEM
    // =====================================

    mensagem.textContent =
        "✅ Cadastro realizado com sucesso!";

    mensagem.style.color = "green";


    // =====================================
    // IR PARA LOGIN
    // =====================================

    setTimeout(function() {

        window.location.href = "login.html";

    }, 1000);

});