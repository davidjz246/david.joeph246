/**
 * UI component renderers.
 * Every function here returns/injects HTML that matches the Tailwind
 * classes already used in index.html, so new content blends in with the
 * existing design.
 */

import { extractIngredients, extractInstructions } from "../api/mealdb.js";
import { isFavorite } from "../state/appState.js";

/* ---------------- Loading / Empty / Error states ---------------- */

export const LOADING_SPINNER_HTML = `
  <div class="flex items-center justify-center py-12 col-span-full">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>`;

export function emptyStateHTML(title = "No results found", subtitle = "Try searching for something else") {
  return `
    <div class="flex flex-col items-center justify-center py-12 text-center col-span-full">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
      </div>
      <p class="text-gray-500 text-lg">${title}</p>
      <p class="text-gray-400 text-sm mt-2">${subtitle}</p>
    </div>`;
}

export function errorStateHTML(message = "Something went wrong. Please try again.") {
  return `
    <div class="flex flex-col items-center justify-center py-12 text-center col-span-full">
      <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-triangle-exclamation text-red-400 text-2xl"></i>
      </div>
      <p class="text-gray-500 text-lg">${message}</p>
    </div>`;
}

export function showLoading(container) {
  container.innerHTML = LOADING_SPINNER_HTML;
}

export function hideAppLoadingOverlay() {
  const overlay = document.getElementById("app-loading-overlay");
  if (!overlay) return;
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.style.display = "none";
  }, 400);
}

/* ---------------- Categories ---------------- */

const CATEGORY_ICONS = {
  Beef: "fa-drumstick-bite",
  Chicken: "fa-drumstick-bite",
  Dessert: "fa-ice-cream",
  Lamb: "fa-drumstick-bite",
  Miscellaneous: "fa-utensils",
  Pasta: "fa-bowl-food",
  Pork: "fa-bacon",
  Seafood: "fa-fish",
  Side: "fa-carrot",
  Starter: "fa-plate-wheat",
  Vegan: "fa-leaf",
  Vegetarian: "fa-seedling",
  Breakfast: "fa-egg",
  Goat: "fa-drumstick-bite",
};

function iconForCategory(name) {
  return CATEGORY_ICONS[name] || "fa-utensils";
}

export function renderCategories(container, categories, onSelect) {
  if (!categories.length) {
    container.innerHTML = emptyStateHTML("No categories available", "");
    return;
  }

  container.innerHTML = categories
    .map(
      (cat) => `
      <div
        class="category-card bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
        data-category="${cat.strCategory}"
      >
        <div class="flex items-center gap-2.5">
          <div class="text-white w-9 h-9 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <i class="fa-solid ${iconForCategory(cat.strCategory)}"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">${cat.strCategory}</h3>
          </div>
        </div>
      </div>`
    )
    .join("");

  container.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => onSelect(card.dataset.category));
  });
}

export function highlightActiveCategoryPill(pillsContainer, activeLabel) {
  pillsContainer.querySelectorAll("button[data-filter]").forEach((btn) => {
    const isActive = btn.dataset.filter === activeLabel;
    btn.classList.toggle("bg-emerald-600", isActive);
    btn.classList.toggle("text-white", isActive);
    btn.classList.toggle("bg-gray-100", !isActive);
    btn.classList.toggle("text-gray-700", !isActive);
  });
}

/* ---------------- Recipes grid ---------------- */

export function renderRecipeCard(meal, viewMode = "grid") {
  const favorite = isFavorite(meal.idMeal);
  if (viewMode === "list") {
    return `
      <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex" data-meal-id="${meal.idMeal}">
        <div class="relative w-40 shrink-0 overflow-hidden">
          <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" />
        </div>
        <div class="p-4 flex flex-col justify-center">
          <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.strMeal}</h3>
          <p class="text-xs text-gray-600 mb-2 line-clamp-2">${meal.strCategory ? `${meal.strCategory} recipe` : "Delicious recipe to try!"}</p>
          <div class="flex items-center gap-4 text-xs">
            <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${meal.strCategory || ""}</span>
            <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${meal.strArea || ""}</span>
          </div>
        </div>
      </div>`;
  }

  return `
    <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${meal.idMeal}">
      <div class="relative h-48 overflow-hidden">
        <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" />
        <div class="absolute bottom-3 left-3 flex gap-2">
          ${meal.strCategory ? `<span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">${meal.strCategory}</span>` : ""}
          ${meal.strArea ? `<span class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white">${meal.strArea}</span>` : ""}
        </div>
        ${favorite ? `<div class="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center"><i class="fa-solid fa-heart text-red-500"></i></div>` : ""}
      </div>
      <div class="p-4">
        <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">${meal.strMeal}</h3>
        <p class="text-xs text-gray-600 mb-3 line-clamp-2">Delicious recipe to try!</p>
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-gray-900"><i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>${meal.strCategory || "—"}</span>
          <span class="font-semibold text-gray-500"><i class="fa-solid fa-globe text-blue-500 mr-1"></i>${meal.strArea || "—"}</span>
        </div>
      </div>
    </div>`;
}

export function renderRecipesGrid(container, meals, viewMode, onCardClick) {
  if (!meals.length) {
    container.innerHTML = emptyStateHTML();
    return;
  }

  if (viewMode === "list") {
    container.classList.add("flex", "flex-col", "gap-4");
    container.classList.remove("grid", "grid-cols-4");
  } else {
    container.classList.remove("flex", "flex-col", "gap-4");
    container.classList.add("grid", "grid-cols-4");
  }

  container.innerHTML = meals
    .map((meal) => renderRecipeCard(meal, viewMode))
    .join("");

  container.querySelectorAll(".recipe-card").forEach((card) => {
    card.addEventListener("click", () => onCardClick(card.dataset.mealId));
  });
}

export function updateRecipesCount(el, count, label = "recipes") {
  el.textContent = `Showing ${count} ${label}`;
}

/* ---------------- Meal Details ---------------- */

export function renderMealDetails(meal) {
  const ingredients = extractIngredients(meal);
  const instructions = extractInstructions(meal);
  const favorite = isFavorite(meal.idMeal);

  const heroImg = document.querySelector(
    "#meal-details .relative.h-80 img, #meal-details .relative.h-96 img"
  );
  if (heroImg) {
    heroImg.src = meal.strMealThumb;
    heroImg.alt = meal.strMeal;
  }

  const tagsWrap = document.querySelector("#meal-details .absolute.bottom-0 .flex.items-center.gap-3.mb-3");
  if (tagsWrap) {
    tagsWrap.innerHTML = [meal.strCategory, meal.strArea, meal.strTags?.split(",")[0]]
      .filter(Boolean)
      .map(
        (tag, i) =>
          `<span class="px-3 py-1 ${["bg-emerald-500", "bg-blue-500", "bg-purple-500"][i % 3]} text-white text-sm font-semibold rounded-full">${tag}</span>`
      )
      .join("");
  }

  const titleEl = document.querySelector("#meal-details h1");
  if (titleEl) titleEl.textContent = meal.strMeal;

  const servingsEl = document.getElementById("hero-servings");
  if (servingsEl) servingsEl.textContent = "4 servings";
  const caloriesEl = document.getElementById("hero-calories");
  if (caloriesEl) caloriesEl.textContent = "Est. calories vary";

  const logBtn = document.getElementById("log-meal-btn");
  if (logBtn) logBtn.dataset.mealId = meal.idMeal;

  // Ingredients
  const ingredientsHeading = document.querySelector("#meal-details h2 span.ml-auto");
  if (ingredientsHeading) ingredientsHeading.textContent = `${ingredients.length} items`;

  const ingredientsGrid = document.querySelector(
    "#meal-details .bg-white.rounded-2xl.shadow-lg.p-6 .grid.grid-cols-1.md\\:grid-cols-2.gap-3"
  );
  if (ingredientsGrid) {
    ingredientsGrid.innerHTML = ingredients
      .map(
        (item) => `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
          <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
          <span class="text-gray-700">
            ${item.measure ? `<span class="font-medium text-gray-900">${item.measure}</span>` : ""} ${item.name}
          </span>
        </div>`
      )
      .join("");
  }

  // Instructions
  const instructionsContainer = [...document.querySelectorAll("#meal-details .bg-white.rounded-2xl.shadow-lg.p-6")]
    .find((el) => el.querySelector("h2")?.textContent.includes("Instructions"));
  if (instructionsContainer) {
    const stepsWrap = instructionsContainer.querySelector(".space-y-4");
    stepsWrap.innerHTML = instructions
      .map(
        (step, i) => `
        <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
          <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">${i + 1}</div>
          <p class="text-gray-700 leading-relaxed pt-2">${step}</p>
        </div>`
      )
      .join("");
  }

  // Video
  const videoSection = [...document.querySelectorAll("#meal-details .bg-white.rounded-2xl.shadow-lg.p-6")]
    .find((el) => el.querySelector("h2")?.textContent.includes("Video Tutorial"));
  if (videoSection) {
    const iframe = videoSection.querySelector("iframe");
    if (meal.strYoutube) {
      const videoId = extractYouTubeId(meal.strYoutube);
      iframe.src = videoId ? `https://www.youtube.com/embed/${videoId}` : "";
      videoSection.style.display = "";
    } else {
      videoSection.style.display = "none";
    }
  }

  // Nutrition is not provided by TheMealDB - show a friendly placeholder note.
  const nutritionContainer = document.getElementById("nutrition-facts-container");
  if (nutritionContainer) {
    nutritionContainer.innerHTML = `
      <p class="text-sm text-gray-500 mb-4">TheMealDB does not provide nutrition data for this recipe.</p>
      <div class="text-center py-6 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
        <i class="fa-solid fa-chart-pie text-3xl text-emerald-400 mb-2"></i>
        <p class="text-sm text-gray-500">Log this meal to estimate it in your Food Log</p>
      </div>`;
  }
}

function extractYouTubeId(url) {
  const match = url.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}

/* ---------------- Products ---------------- */

const GRADE_COLORS = {
  a: "bg-green-500",
  b: "bg-lime-500",
  c: "bg-yellow-500",
  d: "bg-orange-500",
  e: "bg-red-500",
};

export function renderProductCard(product) {
  const gradeColor = GRADE_COLORS[product.nutriScore] || "bg-gray-400";
  return `
    <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${product.barcode}">
      <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        ${
          product.image
            ? `<img class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" src="${product.image}" alt="${product.name}" loading="lazy" />`
            : `<i class="fa-solid fa-box-open text-gray-300 text-4xl"></i>`
        }
        ${
          product.nutriScore
            ? `<div class="absolute top-2 left-2 ${gradeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase">Nutri-Score ${product.nutriScore}</div>`
            : ""
        }
        ${
          product.novaGroup
            ? `<div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${product.novaGroup}">${product.novaGroup}</div>`
            : ""
        }
      </div>
      <div class="p-4">
        <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${product.brand}</p>
        <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">${product.name}</h3>
        <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span><i class="fa-solid fa-weight-scale mr-1"></i>${product.quantity || "N/A"}</span>
          <span><i class="fa-solid fa-fire mr-1"></i>${product.calories} kcal/100g</span>
        </div>
        <div class="grid grid-cols-4 gap-1 text-center">
          <div class="bg-emerald-50 rounded p-1.5">
            <p class="text-xs font-bold text-emerald-700">${product.protein}g</p>
            <p class="text-[10px] text-gray-500">Protein</p>
          </div>
          <div class="bg-blue-50 rounded p-1.5">
            <p class="text-xs font-bold text-blue-700">${product.carbs}g</p>
            <p class="text-[10px] text-gray-500">Carbs</p>
          </div>
          <div class="bg-purple-50 rounded p-1.5">
            <p class="text-xs font-bold text-purple-700">${product.fat}g</p>
            <p class="text-[10px] text-gray-500">Fat</p>
          </div>
          <div class="bg-orange-50 rounded p-1.5">
            <p class="text-xs font-bold text-orange-700">${product.sugar}g</p>
            <p class="text-[10px] text-gray-500">Sugar</p>
          </div>
        </div>
      </div>
    </div>`;
}

export function renderProductsGrid(container, products, onCardClick) {
  if (!products.length) {
    container.innerHTML = emptyStateHTML("No products found", "Try a different search term or barcode");
    return;
  }
  container.innerHTML = products.map(renderProductCard).join("");
  container.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => onCardClick(card.dataset.barcode));
  });
}

export function updateProductsCount(el, count) {
  el.textContent = count ? `Showing ${count} products` : "Search for products to see results";
}

/* ---------------- Food Log ---------------- */

export function renderLoggedItem(item) {
  return `
    <div class="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl" data-log-id="${item.id}">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <i class="fa-solid ${item.source === "product" ? "fa-barcode" : "fa-utensils"} text-emerald-600"></i>
        </div>
        <div class="min-w-0">
          <p class="font-medium text-gray-900 truncate">${item.name}</p>
          <p class="text-xs text-gray-500">${item.calories} kcal · P ${item.protein}g · C ${item.carbs}g · F ${item.fat}g</p>
        </div>
      </div>
      <button class="remove-log-item text-gray-400 hover:text-red-500 shrink-0" data-log-id="${item.id}" aria-label="Remove">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`;
}

export function renderLoggedItemsList(container, items, onRemove) {
  if (!items.length) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">Add meals from the Meals page or scan products</p>
      </div>`;
    return;
  }
  container.innerHTML = items.map(renderLoggedItem).join("");
  container.querySelectorAll(".remove-log-item").forEach((btn) => {
    btn.addEventListener("click", () => onRemove(btn.dataset.logId));
  });
}

export function updateNutritionProgress(totals, goals) {
  const bars = [
    { key: "calories", unit: "kcal" },
    { key: "protein", unit: "g" },
    { key: "carbs", unit: "g" },
    { key: "fat", unit: "g" },
  ];
  const cards = document.querySelectorAll("#foodlog-today-section .grid > div");
  bars.forEach((bar, i) => {
    const card = cards[i];
    if (!card) return;
    const value = totals[bar.key] || 0;
    const goal = goals[bar.key];
    const pct = Math.min(100, Math.round((value / goal) * 100));
    card.querySelector("span.text-gray-500").textContent = `${value} / ${goal} ${bar.unit}`;
    const fill = card.querySelector(".rounded-full > div");
    if (fill) fill.style.width = `${pct}%`;
  });
}
