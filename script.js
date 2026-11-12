// ROXXY 3D PRINTS — two-product storefront
const WHATSAPP_NUMBER = "919398882855";
const products = {
  spider01: { id:"spider01", name:"ROXXY Spider Emblem", price:49, code:"RX-A03" },
  oni01: { id:"oni01", name:"ROXXY Oni Face Mask", price:599, code:"RX-M01" }
};
const money = amount => "₹" + Number(amount).toLocaleString("en-IN");
const cartDrawer=document.getElementById("cartDrawer"), overlay=document.getElementById("overlay"), cartItems=document.getElementById("cartItems");
let cart={};
try {
  const saved=JSON.parse(localStorage.getItem("roxxyCart")||"[]");
  if(Array.isArray(saved)) saved.forEach(item=>{ if(products[item.id] && Number(item.qty)>0) cart[item.id]=Math.floor(Number(item.qty)); });
} catch(e) { cart={}; }
function saveCart(){ localStorage.setItem("roxxyCart",JSON.stringify(Object.entries(cart).map(([id,qty])=>({id,qty})))); renderCart(); }
function addToCart(id){ if(!products[id]) return; cart[id]=(cart[id]||0)+1; saveCart(); showToast(products[id].name+" added to your cart"); }
function renderCart(){
  const count=Object.values(cart).reduce((a,b)=>a+b,0);
  const total=Object.entries(cart).reduce((sum,[id,qty])=>sum+products[id].price*qty,0);
  document.getElementById("cartCount").textContent=count; document.getElementById("cartTotal").textContent=money(total);
  const entries=Object.entries(cart).filter(([id,qty])=>products[id]&&qty>0);
  if(!entries.length){cartItems.innerHTML='<p class="empty-cart">Your cart is empty. Explore the ROXXY collection to get started.</p>';return;}
  cartItems.innerHTML=entries.map(([id,qty])=>{const p=products[id];return `<div class="cart-row"><div><h4>${p.name}</h4><small>${money(p.price)} each · ${p.code}</small><div class="qty-controls"><button type="button" data-minus="${id}" aria-label="Decrease quantity">−</button><b>${qty}</b><button type="button" data-plus="${id}" aria-label="Increase quantity">+</button><button class="remove" type="button" data-remove="${id}">REMOVE</button></div></div><b>${money(p.price*qty)}</b></div>`;}).join("");
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");cartDrawer.setAttribute("aria-hidden","false");}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");cartDrawer.setAttribute("aria-hidden","true");}
function showToast(message){const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");window.setTimeout(()=>toast.classList.remove("show"),1800);}
function sendWhatsApp(message){if(!/^91\d{10}$/.test(WHATSAPP_NUMBER)){showToast("Please check the WhatsApp number in script.js");return;}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");}
document.querySelectorAll("[data-add]").forEach(button=>button.addEventListener("click",()=>addToCart(button.dataset.add)));
document.getElementById("openCart").addEventListener("click",openCart);document.getElementById("closeCart").addEventListener("click",closeCart);overlay.addEventListener("click",closeCart);
cartItems.addEventListener("click",event=>{const el=event.target;const id=el.dataset.plus||el.dataset.minus||el.dataset.remove;if(!id)return;if(el.dataset.plus)cart[id]=(cart[id]||0)+1;if(el.dataset.minus)cart[id]=Math.max(0,(cart[id]||0)-1);if(el.dataset.remove)cart[id]=0;if(!cart[id])delete cart[id];saveCart();});
document.getElementById("checkout").addEventListener("click",()=>{const entries=Object.entries(cart).filter(([id,qty])=>products[id]&&qty>0);if(!entries.length){showToast("Your cart is empty");return;}const lines=entries.map(([id,qty])=>`• ${products[id].name} x ${qty} — ${money(products[id].price*qty)}`).join("\n");const total=entries.reduce((sum,[id,qty])=>sum+products[id].price*qty,0);sendWhatsApp(`Hello ROXXY 3D PRINTS! I'd like to enquire about this order:\n\n${lines}\n\nEstimated subtotal: ${money(total)}\n\nPlease confirm availability, sizing if applicable, delivery charges and final order details.`);});
document.getElementById("directWhatsApp").addEventListener("click",event=>{event.preventDefault();sendWhatsApp("Hello ROXXY 3D PRINTS! I'd like to enquire about your products and custom 3D printing.");});
document.getElementById("year").textContent=new Date().getFullYear();renderCart();
