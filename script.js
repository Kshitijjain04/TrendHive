// script.js — homepage/gallery

// Placeholder image helper using Picsum
const img = (name) => `./images/${name}`;

// Sample products using local images in images/ folder
const PRODUCTS = [
  { id: "p-001", name: "Aurora Headphones", price: 99.0, category: "Electronics", tags: ["audio", "wireless"], images: [img("Aurora Headphones.jpeg"), img("Aurora Headphones.jpeg")], description: "Lightweight wireless headphones with deep bass and 30-hour battery life." },
  { id: "p-002", name: "Summit Backpack", price: 59.0, category: "Accessories", tags: ["outdoor", "travel"], images: [img("Summit Backpack.jpeg"), img("Summit Backpack.jpeg")], description: "Durable 25L backpack with water-resistant fabric and multiple compartments." },
  { id: "p-003", name: "Breeze T-Shirt", price: 19.0, category: "Apparel", tags: ["cotton", "unisex"], images: [img("Breeze T-Shirt.jpeg"), img("Breeze T-Shirt.jpeg")], description: "Soft-touch cotton tee designed for everyday comfort and breathability." },
  { id: "p-004", name: "Zen Mug", price: 14.0, category: "Home", tags: ["ceramic", "kitchen"], images: [img("Zen Mug.jpeg"), img("Zen Mug.jpeg")], description: "Matte ceramic mug with ergonomic handle and heat-retaining build." },
  { id: "p-005", name: "Nimbus Sneakers", price: 79.0, category: "Footwear", tags: ["running", "lightweight"], images: [img("Nimbus Sneakers.jpeg"), img("Nimbus Sneakers.jpeg")], description: "Breathable running sneakers engineered for cushioning and support." },
  { id: "p-006", name: "Orbit Watch", price: 129.0, category: "Accessories", tags: ["smart", "bluetooth"], images: [img("Orbit Watch.jpeg"), img("Orbit Watch.jpeg")], description: "Minimal smartwatch with notifications, fitness tracking, and 7-day battery." },
  { id: "p-007", name: "Cascade Bottle", price: 24.0, category: "Home", tags: ["steel", "insulated"], images: [img("Cascade Bottle.jpeg"), img("Cascade Bottle.jpeg")], description: "Vacuum-insulated stainless bottle keeps drinks cold for 24 hours." },
  { id: "p-008", name: "Pixel Camera", price: 399.0, category: "Electronics", tags: ["dslr", "photography"], images: [img("Pixel Camera.jpeg"), img("Pixel Camera.jpeg")], description: "Compact camera with 24MP sensor and fast autofocus for crisp shots." },
  { id: "p-009", name: "Trail Cap", price: 15.0, category: "Apparel", tags: ["hat", "outdoor"], images: [img("Trail Cap.jpeg"), img("Trail Cap.jpeg")], description: "Breathable running cap with UV protection and quick-dry fabric." },
  { id: "p-010", name: "Feather Jacket", price: 149.0, category: "Apparel", tags: ["winter", "down"], images: [img("Feather Jacket.jpeg"), img("Feather Jacket.jpeg")], description: "Ultralight insulated jacket designed for warmth without bulk." }
];

// Import cart helpers
import { addToCart, updateCartCount } from './cart.js';

// State
let activeFilter = "All";
let searchQuery = "";
let swiperInstance = null;
let previousActiveElement = null;
let modalProductId = null;

// Elements
const filtersList = document.getElementById("filters");
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const navToggle = document.querySelector(".nav-toggle");
const yearEl = document.getElementById("year");

// Modal elements
const modal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDesc = document.getElementById("modalDesc");
const modalMeta = document.getElementById("modalMeta");
const modalSwiperWrapper = document.getElementById("modalSwiperWrapper");
const modalAddBtn = document.getElementById("modalAddToCart");

// Filters
const FILTERS = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

// Render filter buttons
function renderFilters() {
  filtersList.innerHTML = "";
  FILTERS.forEach(f => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn";
    btn.textContent = f;
    btn.setAttribute("aria-pressed", String(f === activeFilter));
    btn.addEventListener("click", () => {
      activeFilter = f;
      updateFilterPressedStates();
      renderGrid();
    });
    li.appendChild(btn);
    filtersList.appendChild(li);
  });
}
function updateFilterPressedStates() {
  filtersList.querySelectorAll("button").forEach(b =>
    b.setAttribute("aria-pressed", String(b.textContent === activeFilter))
  );
}

// Filtered results
function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    const matchCategory = activeFilter === "All" || p.category === activeFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    return matchCategory && matchSearch;
  });
}

// Card template
function cardHTML(product) {
  const { id, name, price, category, tags, images } = product;
  const image = images[0];
  return `
    <article class="card" role="listitem" aria-label="${name}">
      <div class="card-media">
        <img src="${image}" alt="${name}" loading="lazy" decoding="async" />
      </div>
      <div class="card-body">
        <h3 class="card-title">${name}</h3>
        <div class="card-meta">
          <span>$${price.toFixed(2)}</span>
          <span>${category}</span>
        </div>
        <div class="tags">
          ${tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div class="card-actions">
          <button class="btn primary" data-view="${id}">Quick View</button>
          <button class="btn" data-add="${id}">Add to Cart</button>
        </div>
      </div>
    </article>
  `;
}

// Render grid
function renderGrid() {
  const items = getFilteredProducts();
  grid.innerHTML = items.map(cardHTML).join("");
}

// Modal open/close
function openModal(product) {
  modalProductId = product.id;
  modalTitle.textContent = product.name;
  modalPrice.textContent = `$${product.price.toFixed(2)}`;
  modalDesc.textContent = product.description;
  modalMeta.innerHTML = `<li>Category: ${product.category}</li><li>Tags: ${product.tags.join(", ")}</li>`;
  modalSwiperWrapper.innerHTML = product.images.map(src => `<div class="swiper-slide"><img src="${src}" alt="${product.name}" /></div>`).join("");
  if (window.Swiper) {
    if (swiperInstance) swiperInstance.destroy(true, true);
    swiperInstance = new Swiper(".product-swiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
    });
  }
  modal.hidden = false;
  previousActiveElement = document.activeElement;
  modal.querySelector(".modal-close").focus();
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = "";
  if (swiperInstance) { swiperInstance.destroy(true, true); swiperInstance = null; }
  if (previousActiveElement && document.body.contains(previousActiveElement)) previousActiveElement.focus();
  modalProductId = null;
}

// Events
document.addEventListener("click", e => {
  const viewBtn = e.target.closest("[data-view]");
  if (viewBtn) {
    const id = viewBtn.getAttribute("data-view");
    const product = PRODUCTS.find(p => p.id === id);
    if (product) openModal(product);
  }
  const addBtn = e.target.closest("[data-add]");
  if (addBtn) {
    const id = addBtn.getAttribute("data-add");
    const product = PRODUCTS.find(p => p.id === id);
    if (product) addToCart(product, 1);
  }
  if (e.target.matches("[data-close-modal]") || e.target.closest("[data-close-modal]")) {
    closeModal();
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
searchInput.addEventListener("input", e => { searchQuery = e.target.value; renderGrid(); });
navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
});
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("modalAddToCart").addEventListener("click", () => {
  if (!modalProductId) return;
  const product = PRODUCTS.find(p => p.id === modalProductId);
  if (product) addToCart(product, 1);
});

// Init
renderFilters();
renderGrid();
updateCartCount();
