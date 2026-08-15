/**
 * Open Food Facts API module (used by the Product Scanner page)
 * Docs: https://world.openfoodfacts.org/data
 * Free, no API key required.
 */

const SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl";
const PRODUCT_URL = "https://world.openfoodfacts.org/api/v2/product";

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OpenFoodFacts request failed (${response.status}): ${url}`);
  }
  return response.json();
}

/** Search products by free-text name. */
export async function searchProducts(query, pageSize = 24) {
  if (!query || !query.trim()) return [];
  const url = `${SEARCH_URL}?search_terms=${encodeURIComponent(
    query.trim()
  )}&search_simple=1&action=process&json=1&page_size=${pageSize}`;
  const data = await getJSON(url);
  return (data.products || []).filter((p) => p.product_name);
}

/** Search products by category tag, e.g. "snacks", "beverages". */
export async function searchByCategory(category, pageSize = 24) {
  const url = `${SEARCH_URL}?tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(
    category
  )}&action=process&json=1&page_size=${pageSize}`;
  const data = await getJSON(url);
  return (data.products || []).filter((p) => p.product_name);
}

/** Look up a single product by barcode. Returns null if not found. */
export async function getProductByBarcode(barcode) {
  if (!barcode || !barcode.trim()) return null;
  const data = await getJSON(`${PRODUCT_URL}/${barcode.trim()}.json`);
  if (data.status !== 1 || !data.product) return null;
  return data.product;
}

/** Normalize a raw Open Food Facts product into what the UI needs. */
export function normalizeProduct(product) {
  const nutriments = product.nutriments || {};
  return {
    barcode: product.code || product._id || "",
    name: product.product_name || "Unknown product",
    brand: product.brands || "Unknown brand",
    image:
      product.image_front_small_url ||
      product.image_front_url ||
      product.image_url ||
      "",
    quantity: product.quantity || "",
    nutriScore: (product.nutriscore_grade || product.nutrition_grades || "").toLowerCase(),
    novaGroup: product.nova_group || null,
    calories: Math.round(nutriments["energy-kcal_100g"] ?? nutriments["energy-kcal"] ?? 0),
    protein: round1(nutriments.proteins_100g),
    carbs: round1(nutriments.carbohydrates_100g),
    fat: round1(nutriments.fat_100g),
    sugar: round1(nutriments.sugars_100g),
  };
}

function round1(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : 0;
}
