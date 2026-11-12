// ROXXY 3D PRINTS — complete storefront script
// WhatsApp number: country code + number, digits only.
const WHATSAPP_NUMBER = "919398882855";

// Product catalogue. Confirm commercial-use rights for downloaded models before selling them.
const products = [
  {
    id: "r01",
    name: "ROXXY R-01 Mini Car",
    category: "Miniatures",
    price: 399,
    desc: "A bold miniature car concept, printed to order.",
    symbol: "🏎️",
    glow: "#3a5624",
    code: "RX-M01"
  },
  {
    id: "bike",
    name: "Mini Bike Model",
    category: "Miniatures",
    price: 349,
    desc: "A compact display model for bike lovers.",
    symbol: "🏍️",
    glow: "#263c51",
    code: "RX-M02"
  },
  {
    id: "key",
    name: "Custom Name Keychain",
    category: "Gifts",
    price: 99,
    desc: "Personalised name or initials. Price from.",
    symbol: "🔑",
    glow: "#514027",
    code: "RX-G01"
  },
  {
    id: "phone",
    name: "Desktop Phone Stand",
    category: "Accessories",
    price: 199,
    desc: "A clean stand for your desk setup.",
    symbol: "📱",
    glow: "#263d49",
    code: "RX-A01"
  },
  {
    id: "head",
    name: "Headphone Stand",
    category: "Gaming",
    price: 349,
    desc: "Give your gaming headset a proper home.",
    symbol: "🎧",
    glow: "#3b2d52",
    code: "RX-GM01"
  },
  {
    id: "controller",
    name: "Controller Display Stand",
    category: "Gaming",
    price: 249,
    desc: "A desk display stand for your controller.",
    symbol: "🎮",
    glow: "#24423f",
    code: "RX-GM02"
  },
  {
    id: "planter",
    name: "Geometric Mini Planter",
    category: "Accessories",
    price: 199,
    desc: "A modern little planter for your space.",
    symbol: "🪴",
    glow: "#4a3c2c",
    code: "RX-A02"
  },
  {
    id: "plate",
    name: "Custom Name Plate",
    category: "Gifts",
    price: 249,
    desc: "A personalised desk or room name plate.",
    symbol: "✦",
    glow: "#4b3c22",
    code: "RX-G02"
  },
  {
    id: "spider01",
    name: "ROXXY Spider Emblem",
    category: "Accessories",
    price: 149,
    desc: "White 3D printed spider emblem.",
    symbol: "🕷️",
    glow: "#3b2452",
    code: "RX-A03"
  }
];

const money = amount => "₹" + Number(amount).toLocaleString("en-IN");
const grid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

// Remove old cart entries that no longer exist in the catalogue.
let cart = [];
try {
  const savedCart = JSON.parse(localStorage.getItem("roxxyCart") || "[]");
  cart = Array.isArray(savedCart)
    ? savedCart.filter(item => products.some(product => product.id === item.id) && Number(item.qty) > 0)
        .map(item => ({ id: item.id, qty: Math.floor(Number(item.qty)) }))
    : [];
} catch (error) {
  cart = [];
}

function renderProducts(filter = "All") {
  const visibleProducts = products.filter(product =>
    filter === "All" || product.category === filter
  );

  grid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-art" style="--glow:${product.glow}">
        <span class="product-code">${product.code}</span>
        <span class="product-symbol" aria-hidden="true">${product.symbol}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category.toUpperCase()}</div>
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <div class="product-bottom">
          <span class="price">${money(product.price)}</span>
          <button class="add-btn" type="button" data-add="${product.id}">+ ADD TO CART</button>
        </div>
      </div>
    </article>
  `).join("");
}

function saveCart() {
  localStorage.setItem("roxxyCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) existingItem.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  showToast("Added to your cart");
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;

  const cartItems = cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    if (!product) return "";
    return `
      <div class="cart-row">
        <div>
          <h4>${product.name}</h4>
          <small>${money(product.price)} each</small>
          <div class="qty-controls">
            <button type="button" data-minus="${product.id}" aria-label="Decrease quantity">−</button>
            <b>${item.qty}</b>
            <button type="button" data-plus="${product.id}" aria-label="Increase quantity">+</button>
            <button class="remove" type="button" data-remove="${product.id}">REMOVE</button>
          </div>
        </div>
        <b>${money(product.price * item.qty)}</b>
      </div>`;
  }).join("");

  document.getElementById("cartItems").innerHTML = cartItems ||
    '<p class="empty-cart">Your cart is empty. Find something you like.</p>';

  const total = cart.reduce((sum, item) => {
    const product = products.find(entry => entry.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  document.getElementById("cartTotal").textContent = money(total);
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function sendWhatsApp(message) {
  if (!/^91\d{10}$/.test(WHATSAPP_NUMBER)) {
    showToast("Please check the WhatsApp number in script.js");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Product cards: add to cart.
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(button.dataset.add);
});

// Product category filters.
document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  document.querySelectorAll(".filter").forEach(filterButton => {
    filterButton.classList.toggle("active", filterButton === button);
  });
  renderProducts(button.dataset.filter);
});

// Cart drawer controls.
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("cartItems").addEventListener("click", event => {
  const target = event.target;
  const id = target.dataset.plus || target.dataset.minus || target.dataset.remove;
  if (!id) return;
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  if (target.dataset.plus) item.qty += 1;
  else if (target.dataset.minus) item.qty -= 1;
  else item.qty = 0;
  cart = cart.filter(entry => entry.qty > 0);
  saveCart();
});

// WhatsApp checkout with product names, quantities and subtotal.
document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your cart is empty");
    return;
  }
  const lines = cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    return `• ${product.name} x ${item.qty} — ${money(product.price * item.qty)}`;
  });
  const total = cart.reduce((sum, item) => {
    const product = products.find(entry => entry.id === item.id);
    return sum + product.price * item.qty;
  }, 0);
  sendWhatsApp(
    `Hello ROXXY 3D PRINTS! I'd like to enquire about this order:\n\n${lines.join("\n")}\n\nEstimated subtotal: ${money(total)}\n\nPlease confirm availability, customisation, shipping and final price.`
  );
});

// Custom print enquiry form.
document.getElementById("customForm").addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(event.target);
  sendWhatsApp(
    `Hello ROXXY 3D PRINTS! I have a custom print request.\nName: ${formData.get("name")}\nIdea: ${formData.get("idea")}\nSize / notes: ${formData.get("notes") || "Not specified"}\n\nPlease let me know the quote and next steps.`
  );
});

// Footer WhatsApp link.
document.getElementById("footerWhatsApp").addEventListener("click", event => {
  event.preventDefault();
  sendWhatsApp("Hello ROXXY 3D PRINTS! I'd like to know more about your products.");
});

// Footer year, initial catalogue and cart render.
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
