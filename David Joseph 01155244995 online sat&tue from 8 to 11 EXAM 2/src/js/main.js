

import * as MealDB from "./api/mealdb.js";
import * as OFF from "./api/openfoodfacts.js";
import * as State from "./state/appState.js";
import * as UI from "./ui/components.js";

/* ---------------- DOM references ---------------- */

const el = {
  // Layout / nav
  sidebar: document.getElementById("sidebar"),
  sidebarOverlay: document.getElementById("sidebar-overlay"),
  sidebarCloseBtn: document.getElementById("sidebar-close-btn"),
  headerMenuBtn: document.getElementById("header-menu-btn"),
  headerTitle: document.querySelector("#header h1"),
  headerSubtitle: document.querySelector("#header p"),
  navLinks: document.querySelectorAll(".nav-link"),

  // Meals page
  searchFiltersSection: document.getElementById("search-filters-section"),
  categoriesSection: document.getElementById("meal-categories-section"),
  recipesSection: document.getElementById("all-recipes-section"),
  mealDetailsSection: document.getElementById("meal-details"),
  searchInput: document.getElementById("search-input"),
  categoriesGrid: document.getElementById("categories-grid"),
  recipesGrid: document.getElementById("recipes-grid"),
  recipesCount: document.getElementById("recipes-count"),
  gridViewBtn: document.getElementById("grid-view-btn"),
  listViewBtn: document.getElementById("list-view-btn"),
  backToMealsBtn: document.getElementById("back-to-meals-btn"),
  logMealBtn: document.getElementById("log-meal-btn"),
  quickFilterPills: document.querySelectorAll(
    "#search-filters-section .flex.items-center.gap-3.overflow-x-auto button"
  ),
  viewAllCategoriesBtn: document.querySelector(
    "#meal-categories-section button"
  ),

  // Products page
  productsSection: document.getElementById("products-section"),
  productSearchInput: document.getElementById("product-search-input"),
  barcodeInput: document.getElementById("barcode-input"),
  searchProductBtn: document.getElementById("search-product-btn"),
  lookupBarcodeBtn: document.getElementById("lookup-barcode-btn"),
  productsGrid: document.getElementById("products-grid"),
  productsCount: document.getElementById("products-count"),
  nutriScoreFilters: document.querySelectorAll(".nutri-score-filter"),
  productCategoryBtns: document.querySelectorAll(".product-category-btn"),

  // Food log page
  foodlogSection: document.getElementById("foodlog-section"),
  foodlogDate: document.getElementById("foodlog-date"),
  loggedItemsList: document.getElementById("logged-items-list"),
  clearFoodlogBtn: document.getElementById("clear-foodlog"),
  weeklyChart: document.getElementById("weekly-chart"),
  quickLogBtns: document.querySelectorAll(".quick-log-btn"),
};

/* Area-name fixups for the static filter pills in the markup */
const AREA_ALIASES = { Egyptain: "Egyptian" };

let searchDebounceTimer = null;



async function init() {
  bindNavigation();
  bindMealsPageEvents();
  bindProductsPageEvents();
  bindFoodLogPageEvents();

  el.mealDetailsSection.style.display = "none";
  el.productsSection.style.display = "none";
  el.foodlogSection.style.display = "none";


  const overlay = document.getElementById("app-loading-overlay");
  if (overlay) {
    overlay.style.display = "flex";
    overlay.style.opacity = "1";
  }

  UI.showLoading(el.categoriesGrid);
  UI.showLoading(el.recipesGrid);

  try {
    const [categories, meals] = await Promise.all([
      MealDB.getCategories(),
      MealDB.getRandomMeals(12),
    ]);

    State.setCategories(categories);
    State.setRecipes(meals);

    UI.renderCategories(el.categoriesGrid, categories, handleCategorySelect);
    renderRecipesFromState();
  } catch (err) {
    console.error("Failed to load initial data:", err);
    el.categoriesGrid.innerHTML = UI.errorStateHTML("Couldn't load categories. Please refresh.");
    el.recipesGrid.innerHTML = UI.errorStateHTML("Couldn't load recipes. Please refresh.");
  } finally {
    UI.hideAppLoadingOverlay();
  }

  refreshFoodLogUI();
}

/* ==========================================================
   NAVIGATION
   ========================================================== */

function bindNavigation() {
  el.headerMenuBtn?.addEventListener("click", () => {
    el.sidebar.classList.add("open");
    el.sidebarOverlay.classList.add("active");
  });
  el.sidebarCloseBtn?.addEventListener("click", closeSidebar);
  el.sidebarOverlay?.addEventListener("click", closeSidebar);

  el.navLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pages = ["meals", "products", "foodlog"];
      goToPage(pages[index] || "meals");
      closeSidebar();
    });
  });
}

function closeSidebar() {
  el.sidebar.classList.remove("open");
  el.sidebarOverlay.classList.remove("active");
}

function goToPage(page) {
  State.setPage(page);

  el.navLinks.forEach((link, index) => {
    const pages = ["meals", "products", "foodlog"];
    const active = pages[index] === page;
    link.classList.toggle("bg-emerald-50", active);
    link.classList.toggle("text-emerald-700", active);
    link.classList.toggle("text-gray-600", !active);
    const span = link.querySelector("span");
    span.classList.toggle("font-semibold", active);
    span.classList.toggle("font-medium", !active);
  });

  const headers = {
    meals: ["Meals & Recipes", "Discover delicious and nutritious recipes tailored for you"],
    products: ["Product Scanner", "Search packaged foods and scan barcodes for nutrition info"],
    foodlog: ["Food Log", "Track your daily nutrition intake"],
  };
  const [title, subtitle] = headers[page];
  el.headerTitle.textContent = title;
  el.headerSubtitle.textContent = subtitle;

  el.mealDetailsSection.style.display = "none";
  el.searchFiltersSection.style.display = page === "meals" ? "" : "none";
  el.categoriesSection.style.display = page === "meals" ? "" : "none";
  el.recipesSection.style.display = page === "meals" ? "" : "none";
  el.productsSection.style.display = page === "products" ? "" : "none";
  el.foodlogSection.style.display = page === "foodlog" ? "" : "none";

  if (page === "foodlog") refreshFoodLogUI();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================
   MEALS PAGE
   ========================================================== */

function bindMealsPageEvents() {
  el.searchInput.addEventListener("input", (e) => {
    clearTimeout(searchDebounceTimer);
    const query = e.target.value;
    searchDebounceTimer = setTimeout(() => handleSearch(query), 350);
  });

  el.quickFilterPills.forEach((btn) => {
    btn.addEventListener("click", () => handleAreaOrAllFilter(btn));
  });

  el.gridViewBtn.addEventListener("click", () => setViewMode("grid"));
  el.listViewBtn.addEventListener("click", () => setViewMode("list"));

  el.backToMealsBtn.addEventListener("click", () => {
    el.mealDetailsSection.style.display = "none";
    el.searchFiltersSection.style.display = "";
    el.categoriesSection.style.display = "";
    el.recipesSection.style.display = "";
  });

  el.logMealBtn.addEventListener("click", handleLogMealClick);

  el.viewAllCategoriesBtn?.addEventListener("click", () => {
    el.recipesSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

async function handleSearch(query) {
  State.setSearchQuery(query);
  const trimmed = query.trim();

  UI.showLoading(el.recipesGrid);
  try {
    const meals = trimmed ? await MealDB.searchMeals(trimmed) : await MealDB.getRandomMeals(12);
    State.setRecipes(meals);
    renderRecipesFromState();
  } catch (err) {
    console.error("Search failed:", err);
    el.recipesGrid.innerHTML = UI.errorStateHTML("Search failed. Please try again.");
  }
}

async function handleAreaOrAllFilter(btn) {
  const label = btn.textContent.trim();

  el.quickFilterPills.forEach((b) => {
    b.classList.remove("bg-emerald-600", "text-white");
    b.classList.add("bg-gray-100", "text-gray-700");
  });
  btn.classList.add("bg-emerald-600", "text-white");
  btn.classList.remove("bg-gray-100", "text-gray-700");

  UI.showLoading(el.recipesGrid);
  try {
    if (label === "All Recipes") {
      const meals = await MealDB.getRandomMeals(12);
      State.setRecipes(meals);
    } else {
      const area = AREA_ALIASES[label] || label;
      const meals = await MealDB.filterByArea(area);
      State.setRecipes(meals);
    }
    renderRecipesFromState();
  } catch (err) {
    console.error("Filter failed:", err);
    el.recipesGrid.innerHTML = UI.errorStateHTML("Couldn't load these recipes. Please try again.");
  }
}

async function handleCategorySelect(category) {
  State.setActiveCategory(category);
  el.searchInput.value = "";

  UI.showLoading(el.recipesGrid);
  try {
    const meals = await MealDB.filterByCategory(category);
    State.setRecipes(meals);
    renderRecipesFromState();
    el.recipesSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    console.error("Category filter failed:", err);
    el.recipesGrid.innerHTML = UI.errorStateHTML("Couldn't load this category. Please try again.");
  }
}

function renderRecipesFromState() {
  const { allRecipes, viewMode } = State.getState();
  UI.renderRecipesGrid(el.recipesGrid, allRecipes, viewMode, showMealDetails);
  UI.updateRecipesCount(el.recipesCount, allRecipes.length);
}

function setViewMode(mode) {
  State.setViewMode(mode);
  el.gridViewBtn.classList.toggle("bg-white", mode === "grid");
  el.gridViewBtn.classList.toggle("shadow-sm", mode === "grid");
  el.listViewBtn.classList.toggle("bg-white", mode === "list");
  el.listViewBtn.classList.toggle("shadow-sm", mode === "list");
  renderRecipesFromState();
}

async function showMealDetails(mealId) {
  el.searchFiltersSection.style.display = "none";
  el.categoriesSection.style.display = "none";
  el.recipesSection.style.display = "none";
  el.mealDetailsSection.style.display = "";
  el.mealDetailsSection.scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const meal = await MealDB.getMealById(mealId);
    if (!meal) throw new Error("Meal not found");
    State.setSelectedMeal(meal);
    UI.renderMealDetails(meal);
  } catch (err) {
    console.error("Failed to load meal details:", err);
    Swal.fire({
      icon: "error",
      title: "Couldn't load this recipe",
      text: "Please try again in a moment.",
    });
  }
}

async function handleLogMealClick() {
  const meal = State.getState().selectedMeal;
  if (!meal) return;

  const { value: formValues } = await Swal.fire({
    title: `Log "${meal.strMeal}"`,
    html: `
      <div class="text-left text-sm space-y-2">
        <label class="block">Calories<input id="swal-cal" type="number" min="0" value="450" class="swal2-input" style="margin:4px 0"></label>
        <div style="display:flex; gap:8px">
          <label class="block" style="flex:1">Protein (g)<input id="swal-protein" type="number" min="0" value="0" class="swal2-input" style="margin:4px 0"></label>
          <label class="block" style="flex:1">Carbs (g)<input id="swal-carbs" type="number" min="0" value="0" class="swal2-input" style="margin:4px 0"></label>
          <label class="block" style="flex:1">Fat (g)<input id="swal-fat" type="number" min="0" value="0" class="swal2-input" style="margin:4px 0"></label>
        </div>
      </div>`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Add to Food Log",
    confirmButtonColor: "#059669",
    preConfirm: () => ({
      calories: Number(document.getElementById("swal-cal").value) || 0,
      protein: Number(document.getElementById("swal-protein").value) || 0,
      carbs: Number(document.getElementById("swal-carbs").value) || 0,
      fat: Number(document.getElementById("swal-fat").value) || 0,
    }),
  });

  if (!formValues) return;

  State.addFoodLogEntry({
    name: meal.strMeal,
    source: "meal",
    ...formValues,
  });

  refreshFoodLogUI();
  showToast("Meal added to your Food Log");
}

/* ==========================================================
   PRODUCTS PAGE
   ========================================================== */

let activeProductGrade = "";

function bindProductsPageEvents() {
  el.searchProductBtn.addEventListener("click", () =>
    runProductSearch(el.productSearchInput.value)
  );
  el.productSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runProductSearch(el.productSearchInput.value);
  });

  el.lookupBarcodeBtn.addEventListener("click", () =>
    runBarcodeLookup(el.barcodeInput.value)
  );
  el.barcodeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runBarcodeLookup(el.barcodeInput.value);
  });

  el.nutriScoreFilters.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeProductGrade = btn.dataset.grade || "";
      el.nutriScoreFilters.forEach((b) =>
        b.classList.remove("ring-2", "ring-offset-2", "ring-gray-900")
      );
      btn.classList.add("ring-2", "ring-offset-2", "ring-gray-900");
      applyProductGradeFilter();
    });
  });

  el.productCategoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.textContent.trim().toLowerCase();
      runCategorySearch(category);
    });
  });
}

async function runProductSearch(query) {
  if (!query || !query.trim()) return;
  UI.showLoading(el.productsGrid);
  try {
    const rawProducts = await OFF.searchProducts(query);
    const products = rawProducts.map(OFF.normalizeProduct);
    State.setProducts(products);
    applyProductGradeFilter();
  } catch (err) {
    console.error("Product search failed:", err);
    el.productsGrid.innerHTML = UI.errorStateHTML("Product search failed. Please try again.");
  }
}

async function runCategorySearch(category) {
  UI.showLoading(el.productsGrid);
  try {
    const rawProducts = await OFF.searchByCategory(category);
    const products = rawProducts.map(OFF.normalizeProduct);
    State.setProducts(products);
    applyProductGradeFilter();
  } catch (err) {
    console.error("Category search failed:", err);
    el.productsGrid.innerHTML = UI.errorStateHTML("Couldn't load this category. Please try again.");
  }
}

async function runBarcodeLookup(barcode) {
  if (!barcode || !barcode.trim()) return;
  UI.showLoading(el.productsGrid);
  try {
    const rawProduct = await OFF.getProductByBarcode(barcode);
    if (!rawProduct) {
      State.setProducts([]);
      UI.renderProductsGrid(el.productsGrid, [], () => { });
      UI.updateProductsCount(el.productsCount, 0);
      showToast("No product found for that barcode", "warning");
      return;
    }
    const product = OFF.normalizeProduct(rawProduct);
    State.setProducts([product]);
    applyProductGradeFilter();
  } catch (err) {
    console.error("Barcode lookup failed:", err);
    el.productsGrid.innerHTML = UI.errorStateHTML("Couldn't look up that barcode. Please try again.");
  }
}

function applyProductGradeFilter() {
  const { products } = State.getState();
  const filtered = activeProductGrade
    ? products.filter((p) => p.nutriScore === activeProductGrade)
    : products;
  UI.renderProductsGrid(el.productsGrid, filtered, showProductDetails);
  UI.updateProductsCount(el.productsCount, filtered.length);
}

async function showProductDetails(barcode) {
  const product = State.getState().products.find((p) => p.barcode === barcode);
  if (!product) return;

  const { value: grams } = await Swal.fire({
    title: product.name,
    imageUrl: product.image || undefined,
    imageHeight: 140,
    html: `
      <p class="text-sm text-gray-500 mb-2">${product.brand}</p>
      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:6px; text-align:center; margin-bottom:12px">
        <div><b>${product.calories}</b><br><small>kcal/100g</small></div>
        <div><b>${product.protein}g</b><br><small>Protein</small></div>
        <div><b>${product.carbs}g</b><br><small>Carbs</small></div>
        <div><b>${product.fat}g</b><br><small>Fat</small></div>
      </div>
      <label class="block text-left text-sm">Amount eaten (g)
        <input id="swal-grams" type="number" min="1" value="100" class="swal2-input" style="margin:4px 0">
      </label>`,
    showCancelButton: true,
    confirmButtonText: "Add to Food Log",
    confirmButtonColor: "#059669",
    preConfirm: () => Number(document.getElementById("swal-grams").value) || 100,
  });

  if (!grams) return;

  const scale = grams / 100;
  State.addFoodLogEntry({
    name: `${product.name} (${grams}g)`,
    source: "product",
    calories: Math.round(product.calories * scale),
    protein: round1(product.protein * scale),
    carbs: round1(product.carbs * scale),
    fat: round1(product.fat * scale),
  });

  refreshFoodLogUI();
  showToast("Product added to your Food Log");
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

/* ==========================================================
   FOOD LOG PAGE
   ========================================================== */

function bindFoodLogPageEvents() {
  el.clearFoodlogBtn.addEventListener("click", async () => {
    const result = await Swal.fire({
      title: "Clear all logged items?",
      text: "This will remove everything logged today and in your history.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Clear All",
      confirmButtonColor: "#dc2626",
    });
    if (result.isConfirmed) {
      State.clearFoodLog();
      refreshFoodLogUI();
      showToast("Food log cleared");
    }
  });

  el.quickLogBtns.forEach((btn) => {
    const label = btn.querySelector("p")?.textContent.trim();
    btn.addEventListener("click", () => {
      if (label === "Log a Meal") goToPage("meals");
      else if (label === "Scan Product") goToPage("products");
      else if (label === "Custom Entry") openCustomEntryDialog();
    });
  });
}

async function openCustomEntryDialog() {
  const { value: formValues } = await Swal.fire({
    title: "Add Custom Food",
    html: `
      <div class="text-left text-sm space-y-2">
        <label class="block">Name<input id="swal-name" type="text" class="swal2-input" style="margin:4px 0" placeholder="e.g. Homemade smoothie"></label>
        <label class="block">Calories<input id="swal-cal" type="number" min="0" value="0" class="swal2-input" style="margin:4px 0"></label>
        <div style="display:flex; gap:8px">
          <label class="block" style="flex:1">Protein (g)<input id="swal-protein" type="number" min="0" value="0" class="swal2-input" style="margin:4px 0"></label>
          <label class="block" style="flex:1">Carbs (g)<input id="swal-carbs" type="number" min="0" value="0" class="swal2-input" style="margin:4px 0"></label>
          <label class="block" style="flex:1">Fat (g)<input id="swal-fat" type="number" min="0" value="0" class="swal2-input" style="margin:4px 0"></label>
        </div>
      </div>`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Add Entry",
    confirmButtonColor: "#059669",
    preConfirm: () => {
      const name = document.getElementById("swal-name").value.trim();
      if (!name) {
        Swal.showValidationMessage("Please enter a food name");
        return false;
      }
      return {
        name,
        calories: Number(document.getElementById("swal-cal").value) || 0,
        protein: Number(document.getElementById("swal-protein").value) || 0,
        carbs: Number(document.getElementById("swal-carbs").value) || 0,
        fat: Number(document.getElementById("swal-fat").value) || 0,
      };
    },
  });

  if (!formValues) return;

  State.addFoodLogEntry({ ...formValues, source: "custom" });
  refreshFoodLogUI();
  showToast("Custom entry added to your Food Log");
}

function refreshFoodLogUI() {
  const todayEntries = State.getTodayEntries();
  const totals = State.getTodayTotals();
  const { goals } = State.getState();

  if (el.foodlogDate) {
    el.foodlogDate.textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }

  UI.updateNutritionProgress(totals, goals);

  const countHeading = document.querySelector("#foodlog-today-section h4");
  if (countHeading) countHeading.textContent = `Logged Items (${todayEntries.length})`;
  el.clearFoodlogBtn.style.display = todayEntries.length ? "" : "none";

  UI.renderLoggedItemsList(el.loggedItemsList, todayEntries, (id) => {
    State.removeFoodLogEntry(id);
    refreshFoodLogUI();
  });

  renderWeeklyChart();
}

function renderWeeklyChart() {
  if (typeof Plotly === "undefined" || !el.weeklyChart) return;

  const weekly = State.getWeeklyTotals();
  const labels = weekly.map((d) => {
    // Parse "YYYY-MM-DD" as a local date (avoids the UTC-shift that
    // `new Date("YYYY-MM-DD")` causes for timezones behind UTC).
    const [y, m, day] = d.date.split("-").map(Number);
    return new Date(y, m - 1, day).toLocaleDateString("en-US", { weekday: "short" });
  });
  const values = weekly.map((d) => d.calories);

  const data = [
    {
      x: labels,
      y: values,
      type: "bar",
      marker: { color: "#059669" },
      hovertemplate: "%{y} kcal<extra></extra>",
    },
  ];

  const layout = {
    margin: { t: 10, r: 10, b: 30, l: 40 },
    height: 256,
    yaxis: { title: "Calories" },
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
  };

  Plotly.newPlot(el.weeklyChart, data, layout, {
    displayModeBar: false,
    responsive: true,
  });
}

/* ==========================================================
   Shared helpers
   ========================================================== */

function showToast(message, icon = "success") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
}

/* ==========================================================
   Boot
   ========================================================== */

document.addEventListener("DOMContentLoaded", init);
