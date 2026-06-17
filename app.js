// E-commerce Product Catalog Data
const PRODUCTS = [
  {
    id: "soap-lavender-clay",
    name: "Aura Cleansing Lavender & Clay Soap",
    price: 399.00,
    category: "soap",
    image: "assets/soap.png",
    rating: 4.9,
    tag: "Best Seller",
    desc: "A calming, artisanal soap bar handcrafted with French lavender oils and organic white kaolin clay. Restores moisture while removing impurities, leaving skin soft and relaxed.",
    ingredients: "Saponified Coconut Oil, Olive Oil, Organic Shea Butter, French Kaolin Clay, Lavender Essential Oil, Rosemary Leaf Extract, Lavender Buds.",
    usage: "Lather soap in wet hands and massage over face or body. Rinse thoroughly with lukewarm water. Keep on a draining soap dish to extend its life."
  },
  {
    id: "facewash-teatree-neem",
    name: "Tea Tree & Neem Purifying Facewash",
    price: 499.00,
    category: "facewash",
    image: "assets/facewash.png",
    rating: 4.8,
    tag: "New",
    desc: "A gentle gel cleanser enriched with organic tea tree hydrosol and cold-pressed neem seed oil. Targets blemishes and regulates excess oil without stripping the skin's natural lipid barrier.",
    ingredients: "Water (Aqua), Organic Aloe Vera Juice, Tea Tree Hydrosol, Coco Glucoside, Neem Seed Extract, Vegetable Glycerin, Salicylic Acid (0.5%), Xanthan Gum, Citric Acid.",
    usage: "Apply a small amount to damp face. Massage gently in circular motions, focusing on zones prone to oiliness. Rinse thoroughly and pat dry. Use morning and night."
  },
  {
    id: "rosewater-himalayan",
    name: "Pure Himalayan Rose Water Mist",
    price: 449.00,
    category: "rosewater",
    image: "assets/rosewater.png",
    rating: 5.0,
    tag: "Organic",
    desc: "Steam-distilled from fresh pink damask roses hand-plucked in the Himalayan valleys. A soothing, hydrating toner that balances skin pH and tightens pores instantly.",
    ingredients: "100% Pure, Steam-Distilled Rose (Rosa Damascena) Flower Water. Single ingredient, alcohol-free, preservative-free.",
    usage: "Spritz directly onto clean face and neck before applying serums or oils. Can be used throughout the day to hydrate, refresh skin, or set makeup."
  },
  {
    id: "handwash-citrus-aloe",
    name: "Citrus & Aloe Refreshing Hand Wash",
    price: 299.00,
    category: "handwash",
    image: "assets/handwash.png",
    rating: 4.7,
    tag: "Vegan",
    desc: "A conditioning liquid hand wash packed with soothing aloe vera gel and bright citrus peel oils. Deeply cleanses hands while leaving them hydrated and lightly scented.",
    ingredients: "Decyl Glucoside, Water (Aqua), Aloe Vera Leaf Juice, Sweet Orange Peel Oil, Lemon Peel Oil, Vitamin E, Panthenol (Pro-Vitamin B5), Potassium Sorbate.",
    usage: "Dispense one pump into wet palms. Lather vigorously for at least 20 seconds, covering fingers, backs of hands, and wrists. Rinse well with clean water."
  },
  {
    id: "serum-golden-elixir",
    name: "Golden Elixir Radiance Serum",
    price: 899.00,
    category: "serum",
    image: "assets/serum.png",
    rating: 4.9,
    tag: "Premium",
    desc: "A high-performance face oil formulated with cold-pressed rosehip seed oil, sea buckthorn, and organic squalane. Rejuvenates skin elasticity and delivers a radiant glow.",
    ingredients: "Organic Rosehip Seed Oil, Sea Buckthorn Fruit Oil, Squalane (Olive-Derived), Avocado Oil, Chamomile Extract, Vitamin E, Jojoba Oil.",
    usage: "Warm 3-4 drops between clean palms and press gently onto clean, damp face and neck. Use as the final step in your evening skincare ritual."
  }
];

// Active State Variables
let currentFilter = "all";
let currentSearchQuery = "";
let currentSort = "default";
let activeModalProduct = null;
let modalQty = 1;

// DOM Cache
const catalogGrid = document.getElementById("catalog-grid");
const categoryFiltersContainer = document.getElementById("category-filters-container");
const sortSelector = document.getElementById("sort-selector");
const searchInput = document.getElementById("search-input");
const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartDrawerOverlay = document.getElementById("cart-drawer-overlay");
const cartItemsWrapper = document.getElementById("cart-items-wrapper");
const cartCountBadge = document.getElementById("cart-count-badge");
const cartSubtotalVal = document.getElementById("cart-subtotal-val");
const cartCheckoutBtn = document.getElementById("cart-checkout-btn");

// Modal DOM Cache
const productDetailModal = document.getElementById("product-detail-modal");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalProductImg = document.getElementById("modal-product-img");
const modalProductCategory = document.getElementById("modal-product-category");
const modalProductTitle = document.getElementById("modal-product-title");
const modalProductPrice = document.getElementById("modal-product-price");
const modalDescText = document.getElementById("modal-desc-text");
const modalIngredientsText = document.getElementById("modal-ingredients-text");
const modalUsageText = document.getElementById("modal-usage-text");
const modalQtyVal = document.getElementById("modal-qty-val");
const modalQtyMinus = document.getElementById("modal-qty-minus");
const modalQtyPlus = document.getElementById("modal-qty-plus");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart-btn");
const modalTabBtns = document.querySelectorAll(".modal-tab-btn");
const modalTabContents = document.querySelectorAll(".modal-tab-content");

// Mobile Menu DOM Cache
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navMenu = document.getElementById("nav-menu");
const header = document.getElementById("main-header");

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  setupEventListeners();
  handleRouting(); // Determine page on load
});

// --- SCROLL ACTION FOR HEADER ---
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// --- RENDER PRODUCTS GRID ---
function renderProducts() {
  // 1. Filter products
  let filtered = PRODUCTS.filter(prod => {
    const matchesCategory = (currentFilter === "all" || prod.category === currentFilter);
    const matchesSearch = prod.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                          prod.desc.toLowerCase().includes(currentSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 2. Sort products
  if (currentSort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Clear Grid
  catalogGrid.innerHTML = "";

  // Render empty state if no products found
  if (filtered.length === 0) {
    catalogGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);">
        <p style="font-size: 1.2rem; margin-bottom: 8px;">No botanicals found matching your selection.</p>
        <p style="font-size: 0.9rem;">Try checking spelling or adjusting filters.</p>
      </div>
    `;
    return;
  }

  // Build HTML Cards
  filtered.forEach((prod, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    // Add sequential delays for staggered loading animation
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <div class="product-img-container">
        ${prod.tag ? `<span class="product-tag">${prod.tag}</span>` : ''}
        <img src="${prod.image}" alt="${prod.name}">
        <div class="product-overlay-actions">
          <button class="btn-action-circle" onclick="openProductModal('${prod.id}')" aria-label="Quick View">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <button class="btn-action-circle" onclick="handleAddToCartClick('${prod.id}')" aria-label="Add to Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>
        </div>
      </div>
      <div class="product-details">
        <span class="product-category">${prod.category}</span>
        <h3 class="product-name">${prod.name}</h3>
        <div class="product-price-row">
          <span class="product-price">₹${prod.price.toFixed(2)}</span>
          <button class="product-card-btn" onclick="openProductModal('${prod.id}')">
            View Details
          </button>
        </div>
      </div>
    `;
    catalogGrid.appendChild(card);
  });
}

// --- E-COMMERCE CART SYSTEM ---

// Retrieve Cart items from localStorage
function getCart() {
  const cartData = localStorage.getItem("ananta_cart");
  return cartData ? JSON.parse(cartData) : [];
}

// Save Cart items back to localStorage and redraw UI
function saveCart(cart) {
  localStorage.setItem("ananta_cart", JSON.stringify(cart));
  updateCartUI();
}

// Add item to cart
function addToCart(productId, quantity = 1) {
  let cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  
  if (!product) return;

  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  openCartDrawer();
}

// Update quantity directly (input box or controls)
function updateCartQty(productId, newQty) {
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex > -1) {
    if (newQty <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = newQty;
    }
    saveCart(cart);
  }
}

// Remove item completely
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

// Global click handler to hook onto inline events
window.handleAddToCartClick = (productId) => {
  addToCart(productId, 1);
};

// Toggle Drawer Open state
function openCartDrawer() {
  cartDrawerOverlay.classList.add("open");
  document.body.style.overflow = "hidden"; // Disable background scrolling
}

function closeCartDrawer() {
  cartDrawerOverlay.classList.remove("open");
  document.body.style.overflow = ""; // Restore background scrolling
}

// Update Cart Badge and Drawer List Items
function updateCartUI() {
  const cart = getCart();
  
  // Update badge counter
  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountBadge.textContent = totalItemsCount;
  
  // Calculate Subtotal
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  cartSubtotalVal.textContent = `₹${subtotal.toFixed(2)}`;

  // Populate Drawer List
  cartItemsWrapper.innerHTML = "";
  
  if (cart.length === 0) {
    cartItemsWrapper.innerHTML = `
      <div class="cart-empty-msg">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        <p>Your sanctuary cart is empty</p>
        <a href="#shop-section" class="btn btn-secondary" onclick="closeCartDrawer()" style="padding: 10px 20px; font-size: 0.85rem;">Continue Shopping</a>
      </div>
    `;
    return;
  }

  cart.forEach(item => {
    const cartItemEl = document.createElement("div");
    cartItemEl.className = "cart-item";
    cartItemEl.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.name}</h4>
        <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)} <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">(₹${item.price.toFixed(2)} each)</span></div>
        <div class="cart-item-controls">
          <div class="qty-selector">
            <button class="qty-btn" onclick="updateCartQty('${item.id}', ${item.quantity - 1})">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQty('${item.id}', ${item.quantity + 1})">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Remove
          </button>
        </div>
      </div>
    `;
    cartItemsWrapper.appendChild(cartItemEl);
  });
}

// --- QUICK VIEW MODAL DETAILS SYSTEM ---

window.openProductModal = (productId) => {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  activeModalProduct = product;
  modalQty = 1;

  // Set Modal data fields
  modalProductImg.src = product.image;
  modalProductImg.alt = product.name;
  modalProductCategory.textContent = product.category;
  modalProductTitle.textContent = product.name;
  modalProductPrice.textContent = `₹${product.price.toFixed(2)}`;
  modalDescText.textContent = product.desc;
  modalIngredientsText.textContent = product.ingredients;
  modalUsageText.textContent = product.usage;
  
  // Set quantity display
  modalQtyVal.textContent = modalQty;

  // Set first tab as active
  switchModalTab("desc");

  // Show Modal Overlay
  productDetailModal.classList.add("open");
  document.body.style.overflow = "hidden";
};

function closeProductModal() {
  productDetailModal.classList.remove("open");
  activeModalProduct = null;
  document.body.style.overflow = "";
}

function switchModalTab(tabId) {
  // Update buttons
  modalTabBtns.forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update text panels
  modalTabContents.forEach(content => {
    if (content.id === `tab-${tabId}`) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });
}

// --- CORE EVENT HANDLERS ---
function setupEventListeners() {
  
  // Sort selection handler
  sortSelector.addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderProducts();
  });

  // Filter tag click handler
  categoryFiltersContainer.addEventListener("click", (e) => {
    const clickedBtn = e.target.closest(".cat-btn");
    if (!clickedBtn) return;

    // Toggle active classes
    categoryFiltersContainer.querySelectorAll(".cat-btn").forEach(btn => btn.classList.remove("active"));
    clickedBtn.classList.add("active");

    currentFilter = clickedBtn.dataset.category;
    renderProducts();
  });

  // Search input typing handler
  searchInput.addEventListener("input", (e) => {
    currentSearchQuery = e.target.value;
    renderProducts();
  });

  // Cart toggles
  cartToggleBtn.addEventListener("click", openCartDrawer);
  cartCloseBtn.addEventListener("click", closeCartDrawer);
  
  // Close cart drawer when overlay clicked
  cartDrawerOverlay.addEventListener("click", (e) => {
    if (e.target === cartDrawerOverlay) {
      closeCartDrawer();
    }
  });

  // Close modal when close button or overlay clicked
  modalCloseBtn.addEventListener("click", closeProductModal);
  productDetailModal.addEventListener("click", (e) => {
    if (e.target === productDetailModal) {
      closeProductModal();
    }
  });

  // Modal Tab Switching
  modalTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchModalTab(btn.dataset.tab);
    });
  });

  // Modal quantity adjustments
  modalQtyMinus.addEventListener("click", () => {
    if (modalQty > 1) {
      modalQty--;
      modalQtyVal.textContent = modalQty;
    }
  });

  modalQtyPlus.addEventListener("click", () => {
    modalQty++;
    modalQtyVal.textContent = modalQty;
  });

  // Add to cart from within modal
  modalAddToCartBtn.addEventListener("click", () => {
    if (activeModalProduct) {
      addToCart(activeModalProduct.id, modalQty);
      closeProductModal();
    }
  });

  // Mobile navigation hamburger toggle
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  // Close mobile navigation drawer on link click
  navMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mobileMenuBtn.classList.remove("open");
      navMenu.classList.remove("open");
    }
  });

  // Checkout button notification trigger
  cartCheckoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return;

    alert("🌿 Thank you for choosing Ananta Botanics! Order successfully placed (Simulated checkout demonstration).");
    saveCart([]); // clear cart
    closeCartDrawer();
  });

  // Newsletter Mock subscription handling
  const newsletterForm = document.getElementById("newsletter-subscription-form");
  const newsletterSuccess = document.getElementById("newsletter-success-msg");

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterForm.style.display = "none";
    newsletterSuccess.style.display = "block";
  });

  // Handle click on routing links (e.g. footer categories)
  document.addEventListener("click", (e) => {
    const routeLink = e.target.closest(".nav-route");
    if (routeLink) {
      const category = routeLink.getAttribute("data-category");
      if (category) {
        window.pendingCategory = category;
      }
    }
  });

  // Watch for hash changes
  window.addEventListener("hashchange", handleRouting);
}

// --- SPA ROUTING ENGINE ---
function handleRouting() {
  const hash = window.location.hash || '#home';
  let page = 'home';
  if (hash === '#shop') page = 'shop';
  else if (hash === '#products') page = 'products';
  else if (hash === '#story') page = 'story';
  
  const category = window.pendingCategory || null;
  window.pendingCategory = null; // Clear it
  
  navigateToPage(page, category);
}

function navigateToPage(pageId, categoryId = null) {
  // Update URL hash if it's different (without creating duplicate history states if clicked)
  const hash = `#${pageId}`;
  if (window.location.hash !== hash && !(window.location.hash === "" && hash === "#home")) {
    window.location.hash = hash;
    return;
  }

  // Set page attribute on body to trigger CSS layout switching
  document.body.setAttribute('data-page', pageId);

  // Update active state in navigation header links
  document.querySelectorAll('#nav-menu a').forEach(link => {
    if (link.getAttribute('data-target') === pageId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // If navigating to shop or products catalog
  if (pageId === 'shop' || pageId === 'products') {
    if (categoryId) {
      currentFilter = categoryId;
      categoryFiltersContainer.querySelectorAll(".cat-btn").forEach(btn => {
        if (btn.dataset.category === categoryId) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    } else if (!categoryId && currentFilter === "all") {
      // Keep "all" active
      categoryFiltersContainer.querySelectorAll(".cat-btn").forEach(btn => {
        if (btn.dataset.category === "all") {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
    renderProducts();
  }

  // Smooth scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
