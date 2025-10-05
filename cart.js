// cart.js — shared cart utilities and header badge updater

export const CART_KEY = "ecs_cart_v1";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

export function addToCart(product, qty = 1) {
  const id = typeof product === 'string' ? product : product.id;
  if (!id) return;

  const cart = getCart();
  if (!cart[id]) {
    if (typeof product === 'string') {
      cart[id] = { id, name: '', price: 0, qty: 0, image: '' };
    } else {
      cart[id] = { id: product.id, name: product.name, price: product.price, image: product.images?.[0] || '', qty: 0 };
    }
  }
  cart[id].qty += qty;
  setCart(cart);
}

export function removeFromCart(id) {
  const cart = getCart();
  delete cart[id];
  setCart(cart);
}

export function setQty(id, qty) {
  const cart = getCart();
  if (!cart[id]) return;
  cart[id].qty = Math.max(1, qty);
  setCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
}

export function cartItemsArray() {
  return Object.values(getCart());
}

export function cartCount() {
  return cartItemsArray().reduce((s, it) => s + it.qty, 0);
}

export function cartSubtotal() {
  return cartItemsArray().reduce((s, it) => s + it.price * it.qty, 0);
}

export function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = String(cartCount());
}
