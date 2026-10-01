const tipo = localStorage.getItem("tipoUsuario");
const logado = localStorage.getItem("usuarioLogado");

if (
    tipo !== "admin" &&
    logado !== "admin@shalom.com"
) {
    window.location.replace("login.html");
    return;
}

// Corrige a sessão do administrador
localStorage.setItem("tipoUsuario", "admin");
localStorage.setItem("usuarioLogado", "true");
localStorage.setItem("usuarioNome", "Administrador");
localStorage.setItem("nomeUsuario", "Administrador");
localStorage.setItem("clienteNome", "Administrador");
localStorage.setItem("clienteEmail", "admin@shalom.com");