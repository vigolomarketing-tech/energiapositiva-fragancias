/* ==========================================================================
   ENERGÍA POSITIVA — App
   Catálogo filtrable, carrito en memoria, checkout con WhatsApp.
   ========================================================================== */

(function () {
  "use strict";

  const WHATSAPP_NUMBER = "5491165582626";

  const currency = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });

  /* ---------- Iconos por categoría (line-art, gold sobre fondo degradé) ---------- */
  const ICONS = {
    bottle:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6"/><path d="M10 2v3.2c0 .5-.2 1-.6 1.3L8 7.9A3 3 0 0 0 7 10.1V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.9c0-.8-.4-1.6-1-2.1l-1.4-1.4A2 2 0 0 1 14 5.2V2"/><path d="M7.5 13h9"/></svg>',
    flower:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.3"/><path d="M12 2c1.8 0 3 1.6 3 3.4S13.8 9 12 9s-3-1.8-3-3.6S10.2 2 12 2Z"/><path d="M12 15c1.8 0 3 1.6 3 3.4S13.8 22 12 22s-3-1.8-3-3.6S10.2 15 12 15Z"/><path d="M22 12c0 1.8-1.6 3-3.4 3S15 13.8 15 12s1.8-3 3.6-3S22 10.2 22 12Z"/><path d="M9 12c0 1.8-1.6 3-3.4 3S2 13.8 2 12s1.8-3 3.6-3S9 10.2 9 12Z"/></svg>',
    droplet:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s7 8.1 7 12.5A7 7 0 0 1 5 14.5C5 10.1 12 2 12 2Z"/></svg>',
    house:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9"/><path d="M15 20v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/></svg>',
    reed:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M7 14h10l-1.2 7H8.2L7 14Z"/><path d="M9 14V9a3 3 0 0 1 6 0v5"/><path d="M10 2 9 9M12 1.5 11.5 9M14 2l1 7"/></svg>',
    car:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-3.5L6 8h12l2 4.5V16"/><path d="M4 16h16v2.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V17h-9v1.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V16Z"/><circle cx="7.5" cy="16" r="1.1"/><circle cx="16.5" cy="16" r="1.1"/></svg>',
  };

  // Fondo (gradiente) + icono + color de icono por categoría / variante
  function getPhotoStyle(product) {
    if (product.category === "arabes") {
      if (product.variant === "negro") {
        return {
          bg: "radial-gradient(circle at 50% 30%, #2a2622 0%, #16130f 65%, #0c0a08 100%)",
          color: "#d9b874",
          icon: ICONS.bottle,
        };
      }
      return {
        bg: "radial-gradient(circle at 50% 30%, #fbf6ea 0%, #ecdfc2 65%, #ddc794 100%)",
        color: "#1c1a17",
        icon: ICONS.bottle,
      };
    }
    const map = {
      "for-him": { bg: "radial-gradient(circle at 50% 30%, #3c4048 0%, #23262c 65%, #17191d 100%)", color: "#cbb37c", icon: ICONS.bottle },
      "for-her": { bg: "radial-gradient(circle at 50% 30%, #fbeee7 0%, #f3d9d0 65%, #e8bfb3 100%)", color: "#8a4a3d", icon: ICONS.flower },
      "body-splash": { bg: "radial-gradient(circle at 50% 30%, #eaf6f2 0%, #cfe9e0 65%, #a9d6c8 100%)", color: "#2f6e5c", icon: ICONS.droplet },
      "home-spray": { bg: "radial-gradient(circle at 50% 30%, #fbf3e6 0%, #f0dfc0 65%, #e2c491 100%)", color: "#8f6d34", icon: ICONS.house },
      "difusor-varillas": { bg: "radial-gradient(circle at 50% 30%, #efe8dc 0%, #dccfb8 65%, #c3ad8c 100%)", color: "#5c4a30", icon: ICONS.reed },
      "difusor-auto": { bg: "radial-gradient(circle at 50% 30%, #262421 0%, #17150f 65%, #0d0c0a 100%)", color: "#d9b874", icon: ICONS.car },
    };
    return map[product.category] || map["for-him"];
  }

  function categoryLabel(key) {
    const cat = CATEGORIES.find((c) => c.key === key);
    return cat ? cat.label : key;
  }

  /* ---------- Estado ---------- */
  const state = {
    activeCategory: "todos",
    cart: [], // { id, qty }
  };

  /* ---------- Render: filtros ---------- */
  const filtersEl = document.getElementById("filters");

  function renderFilters() {
    filtersEl.innerHTML = CATEGORIES.map(
      (cat) =>
        `<button class="filter-chip${cat.key === state.activeCategory ? " active" : ""}" data-cat="${cat.key}">${cat.label}</button>`
    ).join("");
  }

  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-chip");
    if (!btn) return;
    state.activeCategory = btn.dataset.cat;
    renderFilters();
    renderProducts();
  });

  /* ---------- Render: catálogo ---------- */
  const gridEl = document.getElementById("productGrid");

  function renderProducts() {
    const list =
      state.activeCategory === "todos"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === state.activeCategory);

    if (!list.length) {
      gridEl.innerHTML = `<p class="no-results">No hay productos en esta categoría todavía.</p>`;
      return;
    }

    gridEl.innerHTML = list
      .map((p) => {
        const style = getPhotoStyle(p);
        return `
        <article class="product-card">
          <div class="product-photo" style="background:${style.bg}; color:${style.color}">
            ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ""}
            ${style.icon}
          </div>
          <div class="product-body">
            <span class="product-cat">${categoryLabel(p.category)}</span>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-family">${p.family}</p>
            <span class="product-volume">${p.volume}</span>
            <div class="product-footer">
              <span class="product-price">${currency.format(p.price)}</span>
              <button class="add-btn" data-id="${p.id}" aria-label="Agregar ${p.name} al carrito">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    addToCart(Number(btn.dataset.id));
  });

  /* ---------- Carrito ---------- */
  function addToCart(id) {
    const item = state.cart.find((i) => i.id === id);
    if (item) {
      item.qty += 1;
    } else {
      state.cart.push({ id, qty: 1 });
    }
    renderCart();
    const product = PRODUCTS.find((p) => p.id === id);
    showToast(`${product.name} agregado al carrito`);
  }

  function changeQty(id, delta) {
    const item = state.cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter((i) => i.id !== id);
    }
    renderCart();
  }

  function removeItem(id) {
    state.cart = state.cart.filter((i) => i.id !== id);
    renderCart();
  }

  function cartTotal() {
    return state.cart.reduce((sum, i) => {
      const product = PRODUCTS.find((p) => p.id === i.id);
      return sum + product.price * i.qty;
    }, 0);
  }

  function cartCount() {
    return state.cart.reduce((sum, i) => sum + i.qty, 0);
  }

  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartCountEl = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  function renderCart() {
    const count = cartCount();
    cartCountEl.textContent = count;
    cartCountEl.hidden = count === 0;
    checkoutBtn.disabled = count === 0;

    if (!state.cart.length) {
      cartItemsEl.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 7H6"/></svg>
          <p>Tu carrito está vacío.<br>Sumá alguna fragancia del catálogo ✨</p>
        </div>`;
    } else {
      cartItemsEl.innerHTML = state.cart
        .map((i) => {
          const p = PRODUCTS.find((prod) => prod.id === i.id);
          const style = getPhotoStyle(p);
          return `
          <div class="cart-item">
            <div class="cart-item-photo" style="background:${style.bg}; color:${style.color}">${style.icon}</div>
            <div class="cart-item-info">
              <span class="cart-item-name">${p.name}</span>
              <span class="cart-item-variant">${p.volume}${p.variant ? " · " + p.variant : ""}</span>
              <div class="cart-item-row">
                <div class="qty-control">
                  <button data-action="dec" data-id="${p.id}" aria-label="Restar">−</button>
                  <span>${i.qty}</span>
                  <button data-action="inc" data-id="${p.id}" aria-label="Sumar">+</button>
                </div>
                <span class="cart-item-price">${currency.format(p.price * i.qty)}</span>
              </div>
              <button class="remove-btn" data-action="remove" data-id="${p.id}">Quitar</button>
            </div>
          </div>`;
        })
        .join("");
    }

    cartTotalEl.textContent = currency.format(cartTotal());
  }

  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === "inc") changeQty(id, 1);
    if (btn.dataset.action === "dec") changeQty(id, -1);
    if (btn.dataset.action === "remove") removeItem(id);
  });

  /* ---------- Drawer del carrito ---------- */
  const cartOverlay = document.getElementById("cartOverlay");
  const cartDrawer = document.getElementById("cartDrawer");

  function openCart() {
    cartOverlay.classList.add("open");
    cartDrawer.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartOverlay.classList.remove("open");
    cartDrawer.classList.remove("open");
    if (!document.getElementById("checkoutOverlay").classList.contains("open")) {
      document.body.style.overflow = "";
    }
  }

  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  /* ---------- Checkout ---------- */
  const checkoutOverlay = document.getElementById("checkoutOverlay");
  const checkoutForm = document.getElementById("checkoutForm");
  const orderSummaryEl = document.getElementById("orderSummary");

  function renderOrderSummary() {
    const rows = state.cart
      .map((i) => {
        const p = PRODUCTS.find((prod) => prod.id === i.id);
        return `<div class="summary-row"><span>${i.qty}x ${p.name}</span><span>${currency.format(p.price * i.qty)}</span></div>`;
      })
      .join("");
    orderSummaryEl.innerHTML = rows + `<div class="summary-row total"><span>Total</span><span>${currency.format(cartTotal())}</span></div>`;
  }

  function openCheckout() {
    if (!state.cart.length) return;
    renderOrderSummary();
    closeCart();
    checkoutOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCheckout() {
    checkoutOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  checkoutBtn.addEventListener("click", openCheckout);
  document.getElementById("checkoutCloseBtn").addEventListener("click", closeCheckout);
  checkoutOverlay.addEventListener("click", (e) => {
    if (e.target === checkoutOverlay) closeCheckout();
  });

  function buildWhatsappMessage(data) {
    const lines = [];
    lines.push("🌸 *Nuevo pedido — Energía Positiva*");
    lines.push("");
    lines.push(`*Cliente:* ${data.name}`);
    lines.push(`*Teléfono:* ${data.phone}`);
    lines.push(`*Zona de entrega:* ${data.zone}`);
    lines.push(`*Método:* ${data.method}`);
    lines.push("");
    lines.push("*Detalle del pedido:*");
    state.cart.forEach((i) => {
      const p = PRODUCTS.find((prod) => prod.id === i.id);
      lines.push(`• ${i.qty}x ${p.name} (${p.volume}) — ${currency.format(p.price)} c/u = ${currency.format(p.price * i.qty)}`);
    });
    lines.push("");
    lines.push(`*Total: ${currency.format(cartTotal())}*`);
    lines.push("");
    lines.push("¡Gracias por elegirnos! ✨");
    return lines.join("\n");
  }

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!state.cart.length) return;

    const formData = new FormData(checkoutForm);
    const data = {
      name: formData.get("name").trim(),
      phone: formData.get("phone").trim(),
      zone: formData.get("zone").trim(),
      method: formData.get("method"),
    };

    const message = buildWhatsappMessage(data);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");

    closeCheckout();
    state.cart = [];
    renderCart();
    showToast("¡Pedido enviado por WhatsApp!");
  });

  /* ---------- Toast ---------- */
  const toastEl = document.getElementById("toast");
  const toastMsgEl = document.getElementById("toastMsg");
  let toastTimer = null;

  function showToast(msg) {
    toastMsgEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const targets = document.querySelectorAll(".reveal, .reveal-stagger");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
  }

  /* ---------- Init ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  renderFilters();
  renderProducts();
  renderCart();
  initReveal();

  // Re-observar la grilla de productos después de renderizarla dinámicamente
  const gridObserver = new MutationObserver(() => initReveal());
  gridObserver.observe(gridEl, { childList: true });
})();
