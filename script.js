// ROXXY 3D PRINTS — edit the WhatsApp number below before publishing.
const WHATSAPP_NUMBER = "919398882855"; // Example format: 919876543210 (country code + number, no + or spaces)

const products = [
  {id:"r01",name:"ROXXY R-01 Mini Car",category:"Miniatures",price:399,desc:"A bold miniature car concept, printed to order.",symbol:"🏎️",glow:"#3a5624",code:"RX-M01"},
  {id:"bike",name:"Mini Bike Model",category:"Miniatures",price:349,desc:"A compact display model for bike lovers.",symbol:"🏍️",glow:"#263c51",code:"RX-M02"},
  {id:"key",name:"Custom Name Keychain",category:"Gifts",price:99,desc:"Personalised name or initials. Price from.",symbol:"🔑",glow:"#514027",code:"RX-G01"},
  {id:"phone",name:"Desktop Phone Stand",category:"Accessories",price:199,desc:"A clean stand for your desk setup.",symbol:"📱",glow:"#263d49",code:"RX-A01"},
  {id:"head",name:"Headphone Stand",category:"Gaming",price:349,desc:"Give your gaming headset a proper home.",symbol:"🎧",glow:"#3b2d52",code:"RX-GM01"},
  {id:"controller",name:"Controller Display Stand",category:"Gaming",price:249,desc:"A desk display stand for your controller.",symbol:"🎮",glow:"#24423f",code:"RX-GM02"},
  {id:"planter",name:"Geometric Mini Planter",category:"Accessories",price:199,desc:"A modern little planter for your space.",symbol:"🪴",glow:"#4a3c2c",code:"RX-A02"},
 {id:"plate",name:"Custom Name Plate",category:"Gifts",price:249,desc:"A personalised desk or room name plate.",symbol:"✦",glow:"#4b3c22",code:"RX-G02"},
{id:"spider01",name:"ROXXY Spider Emblem",category:"Accessories",price:149,desc:"White 3D printed spider emblem.",symbol:"🕷️",glow:"#3b2452",code:"RX-A03"}
];
let cart = JSON.parse(localStorage.getItem("roxxyCart") || "[]");
const grid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const money = n => "₹" + n.toLocaleString("en-IN");

function renderProducts(filter="All"){
  grid.innerHTML = products.filter(p=>filter==="All"||p.category===filter).map(p=>`
    <article class="product-card">
      <div class="product-art" style="--glow:${p.glow}">
        <span class="product-code">${p.code}</span><span class="product-symbol">${p.symbol}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category.toUpperCase()}</div>
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">+ ADD TO CART</button></div>
      </div>
    </article>`).join("");
}
function saveCart(){localStorage.setItem("roxxyCart",JSON.stringify(cart));renderCart()}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();showToast("Added to your cart")}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>{
    const p=products.find(y=>y.id===x.id);return `<div class="cart-row"><div><h4>${p.name}</h4><small>${money(p.price)} each</small><div class="qty-controls"><button data-minus="${p.id}">−</button><b>${x.qty}</b><button data-plus="${p.id}">+</button><button class="remove" data-remove="${p.id}">REMOVE</button></div></div><b>${money(p.price*x.qty)}</b></div>`
  }).join(""):'<p class="empty-cart">Your cart is empty. Find something you like.</p>';
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");cartDrawer.setAttribute("aria-hidden","false")}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");cartDrawer.setAttribute("aria-hidden","true")}
function showToast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function whatsappReady(){return /^91\d{10}$/.test(WHATSAPP_NUMBER)}
function sendWhatsApp(message){
  if(!whatsappReady()){showToast("Add your WhatsApp number in script.js first");return}
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(b.dataset.add)});
document.getElementById("filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts(b.dataset.filter)});
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("cartItems").addEventListener("click",e=>{
  const id=e.target.dataset.plus||e.target.dataset.minus||e.target.dataset.remove;if(!id)return;
  const item=cart.find(x=>x.id===id);if(e.target.dataset.plus)item.qty++;else if(e.target.dataset.minus)item.qty--;else item.qty=0;
  cart=cart.filter(x=>x.qty>0);saveCart();
});
document.getElementById("checkout").addEventListener("click",()=>{
  if(!cart.length){showToast("Your cart is empty");return}
  const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `• ${p.name} x ${x.qty} — ${money(p.price*x.qty)}`});
  const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  sendWhatsApp(`Hello ROXXY 3D PRINTS! I'd like to enquire about this order:\n\n${lines.join("\n")}\n\nEstimated subtotal: ${money(total)}\n\nPlease confirm availability, customisation, shipping and final price.`);
});
document.getElementById("customForm").addEventListener("submit",e=>{
  e.preventDefault();const f=new FormData(e.target);
  sendWhatsApp(`Hello ROXXY 3D PRINTS! I have a custom print request.\nName: ${f.get("name")}\nIdea: ${f.get("idea")}\nSize / notes: ${f.get("notes")||"Not specified"}\n\nPlease let me know the quote and next steps.`);
});
document.getElementById("footerWhatsApp").addEventListener("click",e=>{e.preventDefault();sendWhatsApp("Hello ROXXY 3D PRINTS! I'd like to know more about your products.")});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
