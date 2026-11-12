// ROXXY 3D PRINTS — single-product storefront
// WhatsApp number: country code + number, digits only.
const WHATSAPP_NUMBER = "919398882855";

const product = {
  id: "spider01",
  name: "ROXXY Spider Emblem",
  category: "Accessories",
  price: 49,
  desc: "White 3D-printed spider emblem with a bold, curved-leg design.",
  code: "RX-A03"
};

const money = amount => "₹" + Number(amount).toLocaleString("en-IN");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");

let quantity = 0;

// Keep only the spider in the cart and discard old catalogue products.
try {
  const saved = JSON.parse(localStorage.getItem("roxxyCart") || "[]");
  const spider = Array.isArray(saved)
    ? saved.find(item => item.id === product.id)
    : null;
  quantity = spider && Number(spider.qty) > 0
    ? Math.floor(Number(spider.qty))
    : 0;
} catch (error) {
  quantity = 0;
}

function saveCart() {
  const cart = quantity > 0 ? [{ id: product.id, qty: quantity }] : [];
  localStorage.setItem("roxxyCart", JSON.stringify(cart));
  renderCart();
}

function addToCart() {
  quantity += 1;
  saveCart();
  showToast("Spider emblem added to your cart");
}

function renderCart() {
  document.getElementById("cartCount").textContent = quantity;
  document.getElementById("cartTotal").textContent = money(product.price * quantity);

  if (quantity === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add the ROXXY Spider Emblem to get started.</p>';
    return;
  }

  cartItems.innerHTML = `
    <div class="cart-row">
      <div>
        <h4>${product.name}</h4>
        <small>${money(product.price)} each</small>
        <div class="qty-controls">
          <button type="button" id="minusQty" aria-label="Decrease quantity">−</button>
          <b>${quantity}</b>
          <button type="button" id="plusQty" aria-label="Increase quantity">+</button>
          <button class="remove" type="button" id="removeItem">REMOVE</button>
        </div>
      </div>
      <b>${money(product.price * quantity)}</b>
    </div>`;
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

document.getElementById("addProduct").addEventListener("click", addToCart);
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

cartItems.addEventListener("click", event => {
  if (event.target.id === "plusQty") quantity += 1;
  if (event.target.id === "minusQty") quantity = Math.max(0, quantity - 1);
  if (event.target.id === "removeItem") quantity = 0;
  saveCart();
});

document.getElementById("checkout").addEventListener("click", () => {
  if (quantity < 1) {
    showToast("Your cart is empty");
    return;
  }

  const subtotal = product.price * quantity;
  const message =
    `Hello ROXXY 3D PRINTS! I'd like to enquire about this order:\n\n` +
    `• ${product.name} x ${quantity} — ${money(subtotal)}\n\n` +
    `Estimated subtotal: ${money(subtotal)}\n\n` +
    `Please confirm availability, delivery charges and final order details.`;

  sendWhatsApp(message);
});

document.getElementById("directWhatsApp").addEventListener("click", event => {
  event.preventDefault();
  sendWhatsApp("Hello ROXXY 3D PRINTS! I'd like to enquire about the ROXXY Spider Emblem priced at ₹49.");
});

document.getElementById("year").textContent = new Date().getFullYear();
renderCart();
