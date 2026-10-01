# Mandy Delivery

Uma experiência de delivery de bebidas construída com HTML, CSS e JavaScript puro. O projeto começou como trabalho final do curso **Programação Web Tech para Manas**, realizado no SENAI Vitória, e foi evoluído para demonstrar uma jornada de compra funcional no front-end.

## Funcionalidades

- catálogo gerado dinamicamente a partir de dados em JavaScript;
- busca por nome, categoria ou descrição;
- filtros por categoria;
- carrinho com inclusão, remoção e alteração de quantidade;
- persistência do carrinho com `localStorage`;
- cálculo automático do total em reais;
- confirmação de maioridade;
- formulário validado e simulação de fechamento do pedido;
- layout responsivo e recursos básicos de acessibilidade.

> Este é um projeto educacional. O fechamento do pedido é uma simulação e não processa pagamentos nem entregas reais.

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
