# Mandy Delivery

Uma experiência de delivery de bebidas construída com HTML, CSS e JavaScript puro. O projeto começou como trabalho final do curso **Programação Web Tech para Manas**, realizado no SENAI Vitória, e foi evoluído para demonstrar uma jornada de compra funcional no front-end.

## Funcionalidades

- catálogo gerado dinamicamente a partir de dados em JavaScript;
- busca por nome, categoria ou descrição;
- filtros por categoria;
- carrinho com inclusão, remoção e alteração de quantidade;
- persistência do carrinho com `localStorage`;
- cálculo automático de subtotal, taxa de entrega e total;
- confirmação de maioridade com catálogo restrito para menores;
- entrega ou retirada, endereço, pagamento e observações;
- pedido organizado para envio pelo WhatsApp;
- disponibilidade de produtos configurável;
- layout responsivo e recursos básicos de acessibilidade.

> O site monta o pedido e encaminha a mensagem ao WhatsApp da loja. A confirmação do estoque, prazo, pagamento e entrega continua sendo feita pela pessoa responsável pelo negócio.

Para adaptar o projeto a um pequeno delivery, siga o [guia comentado de configuração](GUIA_DO_CODIGO.md).

## Tecnologias

- HTML5 semântico
- CSS3 responsivo
- JavaScript (ES6+)
- Web Storage API
- GitHub Pages

## Executar localmente

Você pode abrir o arquivo `index.html` diretamente no navegador. Para testar em um servidor local:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Estrutura

```text
.
├── index.html          # interface principal
├── styles.css          # identidade visual e responsividade
├── app.js              # catálogo, filtros, carrinho e checkout
├── GUIA_DO_CODIGO.md   # explicação e pontos de personalização
├── assets/              # logo e imagem da água sem fundo
└── Mandy Delivery/     # primeira versão, mantida como histórico
```

## Evolução do projeto

A primeira versão foi importante para praticar estruturação de páginas, estilização e interações básicas. A versão atual reorganiza o código, corrige a navegação e transforma o protótipo em uma experiência utilizável de ponta a ponta no navegador.

Próximos passos possíveis:

- integração com uma API e banco de dados;
- autenticação de clientes;
- consulta de CEP e cálculo de entrega;
- testes automatizados;
- painel administrativo de produtos e pedidos.

## Autora

Desenvolvido por **Amanda Ribeiro** como parte da sua trajetória de transição e formação em tecnologia.
