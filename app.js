const IMAGE_ROOT = "Mandy Delivery/img/";

const products = [
  { id: "brahma-duplo-malte", name: "Brahma Duplo Malte", category: "Cervejas", detail: "Lata 350 ml", price: 4.99, image: "BrahmaDuploMalte cat.jpg" },
  { id: "stella-artois", name: "Stella Artois", category: "Cervejas", detail: "Lata 350 ml", price: 6.49, image: "stella-lata-350 cat.jpg" },
  { id: "skol-pilsen", name: "Skol Pilsen", category: "Cervejas", detail: "Lata 350 ml", price: 4.29, image: "skol cat.jpg" },
  { id: "coca-cola", name: "Coca-Cola", category: "Sem álcool", detail: "Garrafa 2 L", price: 11.9, image: "COCACOLA.jpg" },
  { id: "agua-mineral", name: "Água Mineral", category: "Sem álcool", detail: "Garrafa 500 ml", price: 3.5, image: "agua.png" },
  { id: "suco-integral", name: "Suco Integral", category: "Sem álcool", detail: "Garrafa 1 L", price: 13.9, image: "sucoin.webp" },
  { id: "red-bull", name: "Red Bull", category: "Energéticos", detail: "Lata 250 ml", price: 10.9, image: "redbull.webp" },
  { id: "beefeater-pink", name: "Beefeater Pink", category: "Destilados", detail: "Garrafa 750 ml", price: 109.9, image: "Gin-Beefeater-Pink-Strawberry-750ml.png" },
  { id: "tanqueray", name: "Gin Tanqueray", category: "Destilados", detail: "Garrafa 750 ml", price: 129.9, image: "tanq.webp" },
  { id: "absolut", name: "Vodka Absolut", category: "Destilados", detail: "Garrafa 1 L", price: 99.9, image: "absolut.webp" },
  { id: "black-label", name: "Johnnie Walker Black", category: "Whiskies", detail: "Garrafa 1 L", price: 189.9, image: "whisky_johnnie_walker_black_label_1l.webp" },
  { id: "white-horse", name: "White Horse", category: "Whiskies", detail: "Garrafa 1 L", price: 89.9, image: "whitehorse1l.webp" }
];

const state = {
  category: "Todos",
  search: "",
  cart: loadCart()
};

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
  total: document.querySelector("#cart-total"),
  toast: document.querySelector("#toast"),
  ageModal: document.querySelector("#age-modal"),
  checkoutModal: document.querySelector("#checkout-modal"),
  successModal: document.querySelector("#success-modal")
};

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("mandy-cart"));
    if (!saved || typeof saved !== "object") return {};
    return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) => products.some((product) => product.id === id) && Number.isInteger(quantity) && quantity > 0));
  } catch {
    return {};
  }
}

function saveCart() {
  localStorage.setItem("mandy-cart", JSON.stringify(state.cart));
}

function formatMoney(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function productImage(product) {
  return `${IMAGE_ROOT}${encodeURIComponent(product.image)}`;
}

function renderFilters() {
  const categories = ["Todos", ...new Set(products.map((product) => product.category))];
  elements.filters.innerHTML = categories.map((category) => `
    <button class="filter-button ${state.category === category ? "active" : ""}" type="button" data-category="${category}" aria-pressed="${state.category === category}">${category}</button>
  `).join("");
}

function visibleProducts() {
  const term = normalize(state.search.trim());
  return products.filter((product) => {
    const matchesCategory = state.category === "Todos" || product.category === state.category;
    const matchesSearch = !term || normalize(`${product.name} ${product.category} ${product.detail}`).includes(term);
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const filtered = visibleProducts();
  elements.grid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-image">
        <span class="category-tag">${product.category}</span>
        <img src="${productImage(product)}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.detail}</p>
        <div class="product-bottom">
          <span class="product-price">${formatMoney(product.price)}</span>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">+</button>
        </div>
      </div>
    </article>
  `).join("");
  elements.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "produto" : "produtos"}`;
  elements.empty.hidden = filtered.length > 0;
  elements.grid.hidden = filtered.length === 0;
}

function cartEntries() {
  return Object.entries(state.cart).map(([id, quantity]) => ({ product: products.find((item) => item.id === id), quantity })).filter((item) => item.product);
}

function renderCart() {
  const entries = cartEntries();
  const itemCount = entries.reduce((sum, item) => sum + item.quantity, 0);
  const total = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  elements.cartCount.textContent = itemCount;
  elements.cartCount.setAttribute("aria-label", `${itemCount} ${itemCount === 1 ? "item" : "itens"}`);
  elements.cartItems.innerHTML = entries.map(({ product, quantity }) => `
    <article class="cart-item">
      <img src="${productImage(product)}" alt="" />
      <div>
        <h3>${product.name}</h3>
        <span class="cart-item-price">${formatMoney(product.price)} cada</span>
        <div class="quantity" aria-label="Quantidade de ${product.name}">
          <button type="button" data-decrease="${product.id}" aria-label="Diminuir quantidade">−</button>
          <strong>${quantity}</strong>
          <button type="button" data-increase="${product.id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <button class="remove-button" type="button" data-remove="${product.id}" aria-label="Remover ${product.name}">×</button>
    </article>
  `).join("");

  elements.cartEmpty.hidden = entries.length > 0;
  elements.cartSummary.hidden = entries.length === 0;
  elements.subtotal.textContent = formatMoney(total);
  elements.total.textContent = formatMoney(total);
  saveCart();
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  state.cart[id] = (state.cart[id] || 0) + 1;
  renderCart();
  showToast(`${product.name} adicionado ao carrinho`);
}

function changeQuantity(id, amount) {
  if (!state.cart[id]) return;
  state.cart[id] += amount;
  if (state.cart[id] <= 0) delete state.cart[id];
  renderCart();
}

function openCart() {
  elements.cartDrawer.classList.add("open");
  elements.cartDrawer.setAttribute("aria-hidden", "false");
  document.querySelector("#open-cart").setAttribute("aria-expanded", "true");
  elements.overlay.hidden = false;
  document.body.classList.add("no-scroll");
  document.querySelector("#close-cart").focus();
}

function closeCart() {
  elements.cartDrawer.classList.remove("open");
  elements.cartDrawer.setAttribute("aria-hidden", "true");
  document.querySelector("#open-cart").setAttribute("aria-expanded", "false");
  elements.overlay.hidden = true;
  document.body.classList.remove("no-scroll");
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2300);
}

elements.filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderFilters();
  renderProducts();
});

elements.search.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

elements.grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

elements.cartItems.addEventListener("click", (event) => {
  const increase = event.target.closest("[data-increase]");
  const decrease = event.target.closest("[data-decrease]");
  const remove = event.target.closest("[data-remove]");
  if (increase) changeQuantity(increase.dataset.increase, 1);
  if (decrease) changeQuantity(decrease.dataset.decrease, -1);
  if (remove) {
    delete state.cart[remove.dataset.remove];
    renderCart();
  }
});

document.querySelector("#clear-filters").addEventListener("click", () => {
  state.category = "Todos";
  state.search = "";
  elements.search.value = "";
  renderFilters();
  renderProducts();
});
document.querySelector("#open-cart").addEventListener("click", openCart);
document.querySelector("#close-cart").addEventListener("click", closeCart);
elements.overlay.addEventListener("click", closeCart);
document.querySelector("#clear-cart").addEventListener("click", () => {
  state.cart = {};
  renderCart();
  showToast("Carrinho esvaziado");
});

document.querySelector("#checkout-button").addEventListener("click", () => {
  closeCart();
  elements.checkoutModal.showModal();
});
document.querySelector("#close-checkout").addEventListener("click", () => elements.checkoutModal.close());
document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const firstName = String(data.get("name")).trim().split(" ")[0];
  const orderId = `MD-${Date.now().toString().slice(-6)}`;
  elements.checkoutModal.close();
  document.querySelector("#success-message").textContent = `${firstName}, sua simulação foi concluída. Em uma loja real, você receberia agora os dados de acompanhamento.`;
  document.querySelector("#order-number").textContent = `Pedido ${orderId}`;
  elements.successModal.showModal();
  state.cart = {};
  renderCart();
  event.currentTarget.reset();
});
document.querySelector("#finish-order").addEventListener("click", () => {
  elements.successModal.close();
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#age-confirm").addEventListener("click", () => {
  localStorage.setItem("mandy-age-confirmed", "true");
  elements.ageModal.close();
});
document.querySelector("#age-deny").addEventListener("click", () => {
  elements.ageModal.close();
  state.category = "Sem álcool";
  renderFilters();
  renderProducts();
  document.querySelector("#catalogo").scrollIntoView();
  showToast("Mostrando somente opções sem álcool");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && elements.cartDrawer.classList.contains("open")) closeCart();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderFilters();
renderProducts();
renderCart();
if (localStorage.getItem("mandy-age-confirmed") !== "true") elements.ageModal.showModal();
