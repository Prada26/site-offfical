LOJA SHALOM EMBALAGENS — VERSÃO ORGANIZADA

ARQUIVOS
index.html             Página inicial
login.html/js/css      Login único de administrador e cliente
cadastro.html/js/css   Cadastro de clientes
comprar.html/js/css    Produtos, seleção, quantidades e carrinho
pagamento.html/js/css  Dados de entrega e forma de pagamento
finalizacao.html       Confirmação do pedido
admin.html/js/css      Painel administrativo

LOGIN DO ADMINISTRADOR
E-mail: admin@shalom.comadmin@shalom.com
Senha: 123456

DADOS USADOS NO LOCALSTORAGE
usuariosShalom
usuarioShalom (compatibilidade)
tipoUsuario
usuarioLogado
usuarioNome
nomeUsuario
clienteNome
clienteEmail
produtosShalom
depositosShalom
carrinhoCompra
pedidoTemporario
pedidosShalom

IMAGENS
Os nomes foram normalizados:
caixa-de-papelao.webp
copos.png.webp
embalagens.jpg

IMPORTANTE
Este projeto é uma aplicação HTML/CSS/JavaScript com localStorage.
O login não é um sistema seguro para produção porque as senhas ficam no navegador.
Para uso real com clientes, o próximo passo é colocar autenticação e banco de dados em um servidor.

ESTOQUE
Os produtos usam o estoque salvo em produtosShalom. O administrador deve cadastrar/ajustar o estoque antes da venda.

OBSERVAÇÃO DO PRODUTO
Ao cadastrar ou editar um produto no painel administrativo, existe o campo Observação. A informação é salva junto do produto e aparece para o cliente na tela de compras.
