/**
 * TheMealDB API module
 * Docs: https://www.themealdb.com/api.php
 * Free tier, no API key required (test key "1").
 */

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

/**
 * Small helper that fetches JSON and throws a readable error on failure.
 */
async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`MealDB request failed (${response.status}): ${url}`);
  }
  return response.json();
}

/** Get every meal category, e.g. Beef, Chicken, Vegan... */
export async function getCategories() {
  const data = await getJSON(`${BASE_URL}/categories.php`);
  return data.categories || [];
}

/** Search meals by name. Empty query returns [] (API returns null for empty search). */
export async function searchMeals(query) {
  if (!query || !query.trim()) return [];
  const data = await getJSON(
    `${BASE_URL}/search.php?s=${encodeURIComponent(query.trim())}`
  );
  return data.meals || [];
}

/** Get one meal's full details (ingredients, instructions, video...) by id. */
export async function getMealById(id) {
  const data = await getJSON(`${BASE_URL}/lookup.php?i=${id}`);
  return data.meals ? data.meals[0] : null;
}

/** Filter meals by category. Returns lightweight meal objects (id, name, thumb only). */
export async function filterByCategory(category) {
  const data = await getJSON(
    `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
  );
  return data.meals || [];
}

/** Filter meals by area/cuisine, e.g. "Italian". */
export async function filterByArea(area) {
  const data = await getJSON(
    `${BASE_URL}/filter.php?a=${encodeURIComponent(area)}`
  );
  return data.meals || [];
}

/** Get one random meal (used to seed the initial "All Recipes" grid). */
export async function getRandomMeal() {
  const data = await getJSON(`${BASE_URL}/random.php`);
  return data.meals ? data.meals[0] : null;
}

/**
 * Convenience helper: fetch N random meals (deduped) to populate a grid
 * without needing a dedicated "get all" endpoint (MealDB doesn't have one).
 */
export async function getRandomMeals(count = 12) {
  const seen = new Map();
  let attempts = 0;
  while (seen.size < count && attempts < count * 3) {
    attempts++;
    const meal = await getRandomMeal();
    if (meal && !seen.has(meal.idMeal)) seen.set(meal.idMeal, meal);
  }
  return Array.from(seen.values());
}

/**
 * TheMealDB stores up to 20 ingredient/measure pairs as separate fields
 * (strIngredient1..20 / strMeasure1..20). This flattens them into a clean array.
 */
export function extractIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: (measure || "").trim(),
      });
    }
  }
  return ingredients;
}

/**
 * Instructions come back as one big blob of text, sometimes with numbered
 * lines, sometimes separated by blank lines. Split it into clean steps.
 */
export function extractInstructions(meal) {
  if (!meal.strInstructions) return [];
  return meal.strInstructions
    .split(/\r?\n|(?<=\.)\s{2,}/) // split on newlines, or ". " with extra spaces
    .map((step) => step.replace(/^\s*(step\s*)?\d+[.):-]?\s*/i, "").trim())
    .filter((step) => step.length > 0);
}
