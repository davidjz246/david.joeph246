/**
 * Central application state.
 * Keeps everything the UI needs in one place and persists the food log
 * (and favorites) to localStorage so they survive a page refresh.
 */

const FOODLOG_KEY = "nutriplan_foodlog";
const FAVORITES_KEY = "nutriplan_favorites";

const DAILY_GOALS = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fat: 65,
};

const state = {
  page: "meals", // "meals" | "products" | "foodlog"

  // Meals page
  categories: [],
  allRecipes: [], // currently displayed set of recipes (search/filter result)
  activeCategory: "All Recipes",
  searchQuery: "",
  viewMode: "grid", // "grid" | "list"
  selectedMeal: null,

  // Products page
  products: [],
  productGrade: "", // "", a, b, c, d, e
  favorites: loadJSON(FAVORITES_KEY, []),

  // Food log page
  foodLog: loadJSON(FOODLOG_KEY, []), // [{id, date, name, calories, protein, carbs, fat, source}]
  goals: DAILY_GOALS,
};

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) - fail silently
  }
}

export function getState() {
  return state;
}

export function setPage(page) {
  state.page = page;
}

export function setCategories(categories) {
  state.categories = categories;
}

export function setRecipes(recipes) {
  state.allRecipes = recipes;
}

export function setActiveCategory(category) {
  state.activeCategory = category;
}

export function setSearchQuery(query) {
  state.searchQuery = query;
}

export function setViewMode(mode) {
  state.viewMode = mode;
}

export function setSelectedMeal(meal) {
  state.selectedMeal = meal;
}

export function setProducts(products) {
  state.products = products;
}

export function setProductGrade(grade) {
  state.productGrade = grade;
}

/* ---------------- Food Log ---------------- */

export function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function addFoodLogEntry(entry) {
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: todayKey(),
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    ...entry,
  };
  state.foodLog.push(item);
  saveJSON(FOODLOG_KEY, state.foodLog);
  return item;
}

export function removeFoodLogEntry(id) {
  state.foodLog = state.foodLog.filter((item) => item.id !== id);
  saveJSON(FOODLOG_KEY, state.foodLog);
}

export function clearFoodLog() {
  state.foodLog = [];
  saveJSON(FOODLOG_KEY, state.foodLog);
}

export function getTodayEntries() {
  const today = todayKey();
  return state.foodLog.filter((item) => item.date === today);
}

export function getTodayTotals() {
  return getTodayEntries().reduce(
    (totals, item) => ({
      calories: totals.calories + (item.calories || 0),
      protein: totals.protein + (item.protein || 0),
      carbs: totals.carbs + (item.carbs || 0),
      fat: totals.fat + (item.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/** Totals per day for the last 7 days (oldest -> newest), for the weekly chart. */
export function getWeeklyTotals() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days.map((date) => {
    const dayEntries = state.foodLog.filter((item) => item.date === date);
    const calories = dayEntries.reduce((sum, item) => sum + (item.calories || 0), 0);
    return { date, calories };
  });
}

/* ---------------- Favorites ---------------- */

export function toggleFavorite(mealId) {
  const idx = state.favorites.indexOf(mealId);
  if (idx === -1) {
    state.favorites.push(mealId);
  } else {
    state.favorites.splice(idx, 1);
  }
  saveJSON(FAVORITES_KEY, state.favorites);
  return state.favorites.includes(mealId);
}

export function isFavorite(mealId) {
  return state.favorites.includes(mealId);
}
