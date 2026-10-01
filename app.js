/* ================================================================
   1. CONFIGURAÇÃO DA LOJA
   Edite apenas este bloco para adaptar o site a outro delivery.
   No WhatsApp, use somente números: 55 + DDD + telefone.
   Exemplo fictício: 5527999999999
================================================================ */
const storeConfig = {
  name: "Mandy Delivery",
  whatsapp: "",
  minimumOrder: 15,
  acceptsOrders: true,
  deliveryAreas: [
    { id: "perto", label: "Até 5 km", fee: 5 },
    { id: "media", label: "De 5 a 10 km", fee: 9 },
    { id: "consultar", label: "Outra região — consultar", fee: 0, needsQuote: true }
  ],
  paymentMethods: ["Pix", "Cartão na entrega", "Dinheiro"]
};

/* ================================================================
   2. CATÁLOGO
   Cada objeto abaixo representa um produto. Para cadastrar outro,
   copie uma linha, troque os dados e use um id que ainda não exista.
================================================================ */
const IMAGE_ROOT = "Mandy Delivery/img/";

const products = [
  { id: "brahma-duplo-malte", name: "Brahma Duplo Malte", category: "Cervejas", detail: "Lata 350 ml", price: 4.99, image: "BrahmaDuploMalte cat.jpg", alcoholic: true, available: true },
  { id: "stella-artois", name: "Stella Artois", category: "Cervejas", detail: "Lata 350 ml", price: 6.49, image: "stella-lata-350 cat.jpg", alcoholic: true, available: true },
  { id: "skol-pilsen", name: "Skol Pilsen", category: "Cervejas", detail: "Lata 350 ml", price: 4.29, image: "skol cat.jpg", alcoholic: true, available: true },
  { id: "coca-cola", name: "Coca-Cola", category: "Sem álcool", detail: "Garrafa 2 L", price: 11.9, image: "COCACOLA.jpg", alcoholic: false, available: true },
  { id: "agua-mineral", name: "Água Mineral", category: "Sem álcool", detail: "Garrafa 500 ml", price: 3.5, image: "assets/agua-mineral.png", alcoholic: false, available: true },
  { id: "suco-integral", name: "Suco Integral", category: "Sem álcool", detail: "Garrafa 1 L", price: 13.9, image: "sucoin.webp", alcoholic: false, available: true },
  { id: "red-bull", name: "Red Bull", category: "Energéticos", detail: "Lata 250 ml", price: 10.9, image: "redbull.webp", alcoholic: false, available: true },
  { id: "beefeater-pink", name: "Beefeater Pink", category: "Destilados", detail: "Garrafa 750 ml", price: 109.9, image: "Gin-Beefeater-Pink-Strawberry-750ml.png", alcoholic: true, available: true },
  { id: "tanqueray", name: "Gin Tanqueray", category: "Destilados", detail: "Garrafa 750 ml", price: 129.9, image: "tanq.webp", alcoholic: true, available: true },
  { id: "absolut", name: "Vodka Absolut", category: "Destilados", detail: "Garrafa 1 L", price: 99.9, image: "absolut.webp", alcoholic: true, available: true },
  { id: "black-label", name: "Johnnie Walker Black", category: "Whiskies", detail: "Garrafa 1 L", price: 189.9, image: "whisky_johnnie_walker_black_label_1l.webp", alcoholic: true, available: true },
  { id: "white-horse", name: "White Horse", category: "Whiskies", detail: "Garrafa 1 L", price: 89.9, image: "whitehorse1l.webp", alcoholic: true, available: true }
];

/* ================================================================
   3. ESTADO DA TELA
   Guarda filtros, restrição de idade, carrinho e pedido atual.
================================================================ */
const state = {
  category: "Todos",
  search: "",
  restrictedMode: false,
  cart: loadCart(),
  currentOrder: ""
};

/* Atalhos para os elementos do HTML usados pelo JavaScript. */
const elements = {
  grid: document.querySelector("#product-grid"),
  resultCount: document.querySelector("#result-count"),
  filters: document.querySelector("#category-filters"),
  search: document.querySelector("#search-input"),
  empty: document.querySelector("#empty-state"),
  cartDrawer: document.querySelector("#cart-drawer"),
  overlay: document.querySelector("#overlay"),
  cartItems: document.querySelector("#cart-items"),
  cartEmpty: document.querySelector("#cart-empty"),
  cartSummary: document.querySelector("#cart-summary"),
  cartCount: document.querySelector("#cart-count"),
  subtotal: document.querySelector("#cart-subtotal"),
  cartDelivery: document.querySelector("#cart-delivery"),
  total: document.querySelector("#cart-total"),
  toast: document.querySelector("#toast"),
  ageModal: document.querySelector("#age-modal"),
  checkoutModal: document.querySelector("#checkout-modal"),
  checkoutForm: document.querySelector("#checkout-form"),
  deliveryFields: document.querySelector("#delivery-fields"),
  deliveryArea: document.querySelector("#delivery-area"),
  payment: document.querySelector("#payment-method"),
  changeField: document.querySelector("#change-field"),
  changeFor: document.querySelector("#change-for"),
  checkoutSubtotal: document.querySelector("#checkout-subtotal"),
  checkoutDelivery: document.querySelector("#checkout-delivery"),
  checkoutTotal: document.querySelector("#checkout-total"),
  successModal: document.querySelector("#success-modal"),
  successText: document.querySelector("#success-message"),
  orderNumber: document.querySelector("#order-number"),
  openWhatsapp: document.querySelector("#open-whatsapp"),
  copyOrder: document.querySelector("#copy-order")
};

/* ================================================================
   4. FUNÇÕES AUXILIARES
================================================================ */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("mandy-cart")) || {};
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem("mandy-cart", JSON.stringify(state.cart));
}

function formatMoney(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

function productImage(product) {
  return product.image.includes("/") ? product.image : `${IMAGE_ROOT}${product.image}`;
}

function createOrderId() {
  const now = new Date();
  return `MD${String(now.getDate()).padStart(2, "0")}${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

function openModal(modal) {
  if (!modal.open) modal.showModal();
}

function closeModal(modal) {
  if (modal.open) modal.close();
}

/* ================================================================
   5. CÁLCULOS DO CARRINHO
================================================================ */
function cartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity }))
    .filter((item) => item.product && item.quantity > 0);
}

function cartSubtotal() {
  return cartEntries().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

function selectedArea() {
  return storeConfig.deliveryAreas.find((area) => area.id === elements.deliveryArea.value);
}

function currentOrderType() {
  return new FormData(elements.checkoutForm).get("orderType") || "delivery";
}

function deliveryFee() {
  if (currentOrderType() === "pickup") return 0;
  return selectedArea()?.fee || 0;
}

/* ================================================================
   6. CATÁLOGO, BUSCA E FILTROS
================================================================ */
function allowedProducts() {
  return state.restrictedMode ? products.filter((product) => !product.alcoholic) : products;
}

function visibleProducts() {
  const search = normalize(state.search);
  return allowedProducts().filter((product) => {
    const sameCategory = state.category === "Todos" || product.category === state.category;
    const searchableText = normalize(`${product.name} ${product.detail} ${product.category}`);
    return sameCategory && searchableText.includes(search);
  });
}

function renderFilters() {
  const categories = ["Todos", ...new Set(allowedProducts().map((product) => product.category))];
  if (!categories.includes(state.category)) state.category = "Todos";

  elements.filters.innerHTML = categories.map((category) => `
    <button class="filter-button ${category === state.category ? "active" : ""}" type="button" data-category="${category}">
      ${category}
    </button>
  `).join("");
}

function renderProducts() {
  const visible = visibleProducts();
  elements.resultCount.textContent = `${visible.length} ${visible.length === 1 ? "produto" : "produtos"}`;
  elements.empty.hidden = visible.length > 0;

  elements.grid.innerHTML = visible.map((product) => `
    <article class="product-card ${product.available ? "" : "unavailable"}">
      <div class="product-image">
        <img src="${productImage(product)}" alt="${product.name}" loading="lazy">
        <span class="category-tag">${product.category}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.detail}</p>
        <div class="product-bottom">
          <strong class="product-price">${formatMoney(product.price)}</strong>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name}" ${product.available ? "" : "disabled"}>
            ${product.available ? "+" : "×"}
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

/* ================================================================
   7. CARRINHO
================================================================ */
function updateQuantity(id, amount) {
  const product = products.find((item) => item.id === id);
  if (!product?.available) return;

  state.cart[id] = Math.max(0, (state.cart[id] || 0) + amount);
  if (state.cart[id] === 0) delete state.cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartSubtotal();

  elements.cartCount.textContent = count;
  elements.cartEmpty.hidden = entries.length > 0;
  elements.cartSummary.hidden = entries.length === 0;
  elements.cartItems.innerHTML = entries.map(({ product, quantity }) => `
    <article class="cart-item">
      <img src="${productImage(product)}" alt="">
      <div>
        <h3>${product.name}</h3>
        <span class="cart-item-price">${formatMoney(product.price)} cada</span>
        <div class="quantity" aria-label="Quantidade de ${product.name}">
          <button type="button" data-minus="${product.id}" aria-label="Diminuir">−</button>
          <b>${quantity}</b>
          <button type="button" data-plus="${product.id}" aria-label="Aumentar">+</button>
        </div>
      </div>
      <strong>${formatMoney(product.price * quantity)}</strong>
    </article>
  `).join("");

  elements.subtotal.textContent = formatMoney(subtotal);
  elements.cartDelivery.textContent = "calculada no checkout";
  elements.total.textContent = formatMoney(subtotal);
}

function setCart(open) {
  elements.cartDrawer.classList.toggle("open", open);
  elements.overlay.classList.toggle("show", open);
  elements.overlay.hidden = !open;
  elements.cartDrawer.setAttribute("aria-hidden", String(!open));
  document.querySelector("#open-cart").setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("no-scroll", open);
}

/* ================================================================
   8. CHECKOUT: ENTREGA, PAGAMENTO E TOTAL
================================================================ */
function populateCheckoutOptions() {
  elements.deliveryArea.innerHTML = `<option value="">Selecione a região</option>${storeConfig.deliveryAreas.map((area) => `
    <option value="${area.id}">${area.label}${area.needsQuote ? "" : ` — ${formatMoney(area.fee)}`}</option>
  `).join("")}`;

  elements.payment.innerHTML = `<option value="">Selecione</option>${storeConfig.paymentMethods.map((method) => `
    <option value="${method}">${method}</option>
  `).join("")}`;
}

function toggleDeliveryFields() {
  const isDelivery = currentOrderType() === "delivery";
  elements.deliveryFields.hidden = !isDelivery;

  ["delivery-area", "address", "address-number", "neighborhood"].forEach((id) => {
    document.querySelector(`#${id}`).required = isDelivery;
  });

  updateCheckoutTotal();
}

function updateCheckoutTotal() {
  const subtotal = cartSubtotal();
  const area = selectedArea();
  const isDelivery = currentOrderType() === "delivery";
  const fee = deliveryFee();

  elements.checkoutSubtotal.textContent = formatMoney(subtotal);

  if (!isDelivery) {
    elements.checkoutDelivery.textContent = "Retirada — grátis";
  } else if (!area) {
    elements.checkoutDelivery.textContent = "Selecione a região";
  } else {
    elements.checkoutDelivery.textContent = area.needsQuote ? "A combinar" : formatMoney(fee);
  }

  elements.checkoutTotal.textContent = isDelivery && area?.needsQuote
    ? `${formatMoney(subtotal)} + entrega`
    : formatMoney(subtotal + fee);
}

function openCheckout() {
  const subtotal = cartSubtotal();

  if (!storeConfig.acceptsOrders) {
    showToast("A loja não está recebendo pedidos agora.");
    return;
  }

  if (subtotal < storeConfig.minimumOrder) {
    showToast(`O pedido mínimo é ${formatMoney(storeConfig.minimumOrder)}.`);
    return;
  }

  setCart(false);
  elements.checkoutForm.reset();
  elements.changeField.hidden = true;
  elements.changeFor.required = false;
  toggleDeliveryFields();
  openModal(elements.checkoutModal);
}

/* ================================================================
   9. MONTAGEM DO PEDIDO PARA O WHATSAPP
   Nenhum pagamento é feito no site: ele organiza os dados e abre
   uma mensagem pronta para a loja confirmar o pedido.
================================================================ */
function buildOrderMessage(formData) {
  const type = formData.get("orderType");
  const area = selectedArea();
  const subtotal = cartSubtotal();
  const fee = deliveryFee();
  const orderId = createOrderId();

  const items = cartEntries().map(({ product, quantity }) =>
    `• ${quantity}x ${product.name} — ${formatMoney(product.price * quantity)}`
  ).join("\n");

  const location = type === "pickup"
    ? "Retirada no local"
    : `${formData.get("address")}, ${formData.get("addressNumber")} — ${formData.get("neighborhood")}${formData.get("complement") ? `, ${formData.get("complement")}` : ""}${formData.get("reference") ? `\nReferência: ${formData.get("reference")}` : ""}\nRegião: ${area?.label || "não informada"}`;

  const deliveryText = type === "pickup"
    ? "Grátis"
    : area?.needsQuote ? "A combinar" : formatMoney(fee);

  const totalText = type === "delivery" && area?.needsQuote
    ? `${formatMoney(subtotal)} + entrega`
    : formatMoney(subtotal + fee);

  return [
    `*NOVO PEDIDO — ${storeConfig.name}*`,
    `Código: ${orderId}`,
    "",
    `*Cliente:* ${formData.get("name")}`,
    `*Telefone:* ${formData.get("phone")}`,
    "",
    "*Itens:*",
    items,
    "",
    `Subtotal: ${formatMoney(subtotal)}`,
    `Entrega: ${deliveryText}`,
    `*Total: ${totalText}*`,
    "",
    `*Recebimento:* ${location}`,
    `*Pagamento:* ${formData.get("payment")}${formData.get("payment") === "Dinheiro" && formData.get("changeFor") ? ` (troco para ${formData.get("changeFor")})` : ""}`,
    formData.get("notes") ? `*Observações:* ${formData.get("notes")}` : "",
    "",
    "Aguardo a confirmação do pedido e do prazo de entrega."
  ].filter(Boolean).join("\n");
}

function whatsappLink(message) {
  const phone = onlyNumbers(storeConfig.whatsapp);
  return phone.length >= 12 ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : "";
}

function prepareOrder(event) {
  event.preventDefault();
  const formData = new FormData(elements.checkoutForm);
  state.currentOrder = buildOrderMessage(formData);
  const link = whatsappLink(state.currentOrder);

  closeModal(elements.checkoutModal);
  elements.successText.textContent = link
    ? "Tudo certo! Agora envie a mensagem no WhatsApp para a loja confirmar seu pedido."
    : "Pedido pronto! O WhatsApp da loja ainda não foi configurado, mas você pode copiar a mensagem.";
  elements.openWhatsapp.hidden = !link;
  elements.openWhatsapp.dataset.link = link;
  elements.orderNumber.textContent = state.currentOrder.split("\n").find((line) => line.startsWith("Código:")) || "";
  openModal(elements.successModal);
}

async function copyCurrentOrder() {
  try {
    await navigator.clipboard.writeText(state.currentOrder);
    showToast("Pedido copiado!");
  } catch {
    showToast("Não foi possível copiar automaticamente.");
  }
}

function openOrderOnWhatsApp() {
  const link = elements.openWhatsapp.dataset.link;
  if (!link) return;
  window.open(link, "_blank", "noopener,noreferrer");
  state.cart = {};
  saveCart();
  renderCart();
}

/* ================================================================
   10. EVENTOS: conectam cliques e campos às funções acima.
================================================================ */
document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const plusButton = event.target.closest("[data-plus]");
  const minusButton = event.target.closest("[data-minus]");
  const filterButton = event.target.closest("[data-category]");

  if (addButton) {
    updateQuantity(addButton.dataset.add, 1);
    showToast("Produto adicionado ao carrinho!");
  }
  if (plusButton) updateQuantity(plusButton.dataset.plus, 1);
  if (minusButton) updateQuantity(minusButton.dataset.minus, -1);
  if (filterButton) {
    state.category = filterButton.dataset.category;
    renderFilters();
    renderProducts();
  }
});

elements.search.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

document.querySelector("#open-cart").addEventListener("click", () => setCart(true));
document.querySelector("#close-cart").addEventListener("click", () => setCart(false));
elements.overlay.addEventListener("click", () => setCart(false));
document.querySelector("#checkout-button").addEventListener("click", openCheckout);
document.querySelector("#close-checkout").addEventListener("click", () => closeModal(elements.checkoutModal));
elements.checkoutForm.addEventListener("submit", prepareOrder);
elements.checkoutForm.addEventListener("change", (event) => {
  if (event.target.name === "orderType") toggleDeliveryFields();
  if (event.target.id === "delivery-area") updateCheckoutTotal();
  if (event.target.id === "payment") {
    const needsChange = event.target.value === "Dinheiro";
    elements.changeField.hidden = !needsChange;
    elements.changeFor.required = needsChange;
  }
});

document.querySelector("#age-confirm").addEventListener("click", () => {
  closeModal(elements.ageModal);
});

document.querySelector("#age-deny").addEventListener("click", () => {
  state.restrictedMode = true;
  products.filter((product) => product.alcoholic).forEach((product) => delete state.cart[product.id]);
  saveCart();
  renderCart();
  closeModal(elements.ageModal);
  renderFilters();
  renderProducts();
  showToast("Mostrando apenas produtos sem álcool.");
});

elements.openWhatsapp.addEventListener("click", openOrderOnWhatsApp);
elements.copyOrder.addEventListener("click", copyCurrentOrder);
document.querySelector("#finish-order").addEventListener("click", () => closeModal(elements.successModal));
document.querySelector("#clear-filters").addEventListener("click", () => {
  state.category = "Todos";
  state.search = "";
  elements.search.value = "";
  renderFilters();
  renderProducts();
});
document.querySelector("#clear-cart").addEventListener("click", () => {
  state.cart = {};
  saveCart();
  renderCart();
});

/* ================================================================
   11. INICIALIZAÇÃO
   Estas funções montam a página assim que o arquivo é carregado.
================================================================ */
populateCheckoutOptions();
renderFilters();
renderProducts();
renderCart();
document.querySelector("#current-year").textContent = new Date().getFullYear();
openModal(elements.ageModal);
