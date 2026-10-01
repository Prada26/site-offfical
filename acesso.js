const acessoForm = document.getElementById("acessoForm");
const mensagem = document.getElementById("mensagem");

acessoForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value;

    const usuarioSalvo = localStorage.getItem("usuarioShalom");

    if (!usuarioSalvo) {
        mensagem.textContent = "Você ainda não possui cadastro.";
        mensagem.style.color = "red";
        return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    if (email === usuario.email && senha === usuario.senha) {

        sessionStorage.setItem("clienteLogado", "true");
        sessionStorage.setItem("nomeCliente", usuario.nome);

        mensagem.textContent = "Login realizado! Entrando na loja...";
        mensagem.style.color = "green";

        setTimeout(function() {
            window.location.href = "comprar.html";
        }, 800);

    } else {

        mensagem.textContent = "E-mail ou senha incorretos.";
        mensagem.style.color = "red";

    }

});