# Guia do código — Mandy Delivery

Este guia mostra onde alterar cada parte do projeto sem precisar decorar o código inteiro. O site usa apenas HTML, CSS e JavaScript puro.

## Mapa dos arquivos

- `index.html`: textos, seções, formulários e estrutura da página.
- `styles.css`: cores, tamanhos, espaçamentos, cartões e adaptação para celular.
- `app.js`: produtos, carrinho, cálculo da entrega e mensagem do WhatsApp.
- `assets/mandy-logo.png`: logo com fundo transparente.
- `assets/agua-mineral.png`: imagem da água com fundo transparente.

Os arquivos também têm comentários numerados. Procure por `1.`, `2.`, `3.` e assim por diante para localizar cada bloco.

## 1. Configurar a loja

No começo do `app.js`, existe o objeto `storeConfig`:

```js
const storeConfig = {
  name: "Mandy Delivery",
  whatsapp: "",
  minimumOrder: 15,
  acceptsOrders: true,
  // ...
};
```

- `name`: nome usado na mensagem do pedido.
- `whatsapp`: número que receberá os pedidos. Use somente números, incluindo `55` e o DDD. Exemplo fictício: `5527999999999`.
- `minimumOrder`: valor mínimo dos produtos, sem a entrega.
- `acceptsOrders`: use `false` para pausar novos pedidos.

Sem um número configurado, o cliente ainda consegue montar e copiar o pedido, mas o botão para abrir o WhatsApp fica oculto.

## 2. Alterar entrega e pagamento

Ainda em `storeConfig`, edite `deliveryAreas` para mudar regiões e taxas:

```js
{ id: "perto", label: "Até 5 km", fee: 5 }
```

- `id`: identificador interno, sem espaços.
- `label`: texto mostrado para o cliente.
- `fee`: taxa cobrada.
- `needsQuote: true`: use quando o valor precisar ser combinado.

As opções de pagamento ficam em `paymentMethods`. Você pode adicionar ou remover textos da lista.

## 3. Cadastrar produtos

Cada item da lista `products` tem este formato:

```js
{
  id: "agua-mineral",
  name: "Água Mineral",
  category: "Sem álcool",
  detail: "Garrafa 500 ml",
  price: 3.5,
  image: "assets/agua-mineral.png",
  alcoholic: false,
  available: true
}
```

- Use ponto nos preços: `13.90`, e não `13,90`.
- Marque `alcoholic: true` para esconder o produto quando a pessoa informar que é menor de 18 anos.
- Troque `available` para `false` quando o produto estiver esgotado.
- Guarde novas imagens dentro de `assets` e informe o caminho completo.

## 4. Como o pedido funciona

1. O cliente adiciona produtos ao carrinho.
2. O carrinho é salvo no navegador com `localStorage`.
3. No checkout, o cliente escolhe entrega ou retirada, endereço e pagamento.
4. O JavaScript calcula o total e prepara uma mensagem organizada.
5. O botão abre o WhatsApp para o cliente enviar e aguardar a confirmação da loja.

O site não cobra pagamentos e não confirma estoque automaticamente. A loja deve confirmar valor, disponibilidade e prazo pelo WhatsApp.

## 5. Personalizar as cores

As principais cores estão no começo do `styles.css`, dentro de `:root`:

```css
--brand: #ff3060;
--accent: #fff56d;
--ink: #111111;
```

Alterar essas variáveis atualiza vários elementos ao mesmo tempo sem apagar o estilo original.

## 6. Limites desta versão

Esta versão é adequada para validar a ideia e começar a receber pedidos manualmente. Para uma operação maior, a próxima etapa deve incluir:

- painel administrativo com login;
- banco de dados para produtos, estoque e pedidos;
- mudança de status do pedido;
- cálculo de entrega por CEP ou mapa;
- política de privacidade e regras de retenção dos dados;
- integração com pagamento somente por um provedor confiável.

Nunca coloque senhas, tokens ou chaves privadas diretamente no JavaScript do site.

