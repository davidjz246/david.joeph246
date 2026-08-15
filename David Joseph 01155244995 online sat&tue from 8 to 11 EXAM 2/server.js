import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const FALLBACK_PRODUCTS = [
  {
    code: '7613034626844',
    product_name: 'Nutella Hazelnut Spread',
    brands: 'Ferrero',
    quantity: '400g',
    nutrition_grades: 'e',
    nova_group: 4,
    image_front_url: 'https://images.openfoodfacts.org/images/products/301/762/042/2003/front_en.598.400.jpg',
    nutriments: {
      'energy-kcal_100g': 539,
      proteins_100g: 6.3,
      carbohydrates_100g: 57.5,
      fat_100g: 30.9,
      sugars_100g: 56.3
    }
  },
  {
    code: '3017620422003',
    product_name: 'Rolled Whole Oats',
    brands: 'Quaker',
    quantity: '500g',
    nutrition_grades: 'a',
    nova_group: 1,
    image_front_url: 'https://images.openfoodfacts.org/images/products/316/893/001/0265/front_en.115.400.jpg',
    nutriments: {
      'energy-kcal_100g': 375,
      proteins_100g: 11.0,
      carbohydrates_100g: 60.0,
      fat_100g: 8.0,
      sugars_100g: 1.1
    }
  },
  {
    code: '5449000000996',
    product_name: 'Coca-Cola Original Taste',
    brands: 'Coca-Cola',
    quantity: '330ml',
    nutrition_grades: 'e',
    nova_group: 4,
    image_front_url: 'https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.716.400.jpg',
    nutriments: {
      'energy-kcal_100g': 42,
      proteins_100g: 0,
      carbohydrates_100g: 10.6,
      fat_100g: 0,
      sugars_100g: 10.6
    }
  },
  {
    code: '3168930159742',
    product_name: 'Greek Yogurt 0% Fat',
    brands: 'Fage Total',
    quantity: '170g',
    nutrition_grades: 'a',
    nova_group: 1,
    image_front_url: 'https://images.openfoodfacts.org/images/products/520/105/100/0811/front_en.38.400.jpg',
    nutriments: {
      'energy-kcal_100g': 57,
      proteins_100g: 10.3,
      carbohydrates_100g: 3.0,
      fat_100g: 0.0,
      sugars_100g: 3.0
    }
  },
  {
    code: '8000500310427',
    product_name: 'Kinder Bueno Milk Chocolate Bar',
    brands: 'Kinder',
    quantity: '43g',
    nutrition_grades: 'e',
    nova_group: 4,
    image_front_url: 'https://images.openfoodfacts.org/images/products/800/050/031/0427/front_en.99.400.jpg',
    nutriments: {
      'energy-kcal_100g': 572,
      proteins_100g: 8.6,
      carbohydrates_100g: 49.5,
      fat_100g: 37.3,
      sugars_100g: 41.2
    }
  },
  {
    code: '7300400481577',
    product_name: 'Oat Drink Barista Edition',
    brands: 'Oatly',
    quantity: '1 L',
    nutrition_grades: 'b',
    nova_group: 3,
    image_front_url: 'https://images.openfoodfacts.org/images/products/730/040/048/1577/front_en.114.400.jpg',
    nutriments: {
      'energy-kcal_100g': 59,
      proteins_100g: 1.0,
      carbohydrates_100g: 6.6,
      fat_100g: 3.0,
      sugars_100g: 4.0
    }
  },
  {
    code: '7613035999718',
    product_name: 'Cheerios Multigrain Cereal',
    brands: 'Nestle',
    quantity: '375g',
    nutrition_grades: 'a',
    nova_group: 3,
    image_front_url: 'https://images.openfoodfacts.org/images/products/761/303/599/9718/front_en.115.400.jpg',
    nutriments: {
      'energy-kcal_100g': 378,
      proteins_100g: 8.9,
      carbohydrates_100g: 74.0,
      fat_100g: 4.3,
      sugars_100g: 17.5
    }
  },
  {
    code: '3033490004523',
    product_name: 'Activia Strawberry Probiotic Yogurt',
    brands: 'Danone',
    quantity: '4x125g',
    nutrition_grades: 'b',
    nova_group: 4,
    image_front_url: 'https://images.openfoodfacts.org/images/products/303/349/000/4523/front_fr.209.400.jpg',
    nutriments: {
      'energy-kcal_100g': 89,
      proteins_100g: 3.7,
      carbohydrates_100g: 12.5,
      fat_100g: 2.8,
      sugars_100g: 12.0
    }
  }
];

// Proxy for OpenFoodFacts
app.get('/api/foodfacts/search', async (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  const pageSize = req.query.page_size || 24;

  try {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${pageSize}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NutriPlanApp - Web - Version 1.0 (contact: support@nutriplan.local)',
        'Accept': 'application/json'
      }
    });
    
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('json')) {
      const data = await response.json();
      if (data.products && data.products.length > 0) {
        return res.json(data);
      }
    }
  } catch (err) {
    console.error('OpenFoodFacts fetch error, falling back:', err.message);
  }

  // Filter fallback products by query or return all if empty
  const matching = query
    ? FALLBACK_PRODUCTS.filter(p =>
        p.product_name.toLowerCase().includes(query) ||
        p.brands.toLowerCase().includes(query)
      )
    : FALLBACK_PRODUCTS;

  res.json({ products: matching.length > 0 ? matching : FALLBACK_PRODUCTS, count: matching.length });
});

app.get('/api/foodfacts/barcode/:barcode', async (req, res) => {
  const barcode = req.params.barcode;

  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NutriPlanApp - Web - Version 1.0 (contact: support@nutriplan.local)',
        'Accept': 'application/json'
      }
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('json')) {
      const data = await response.json();
      if (data.status === 1 && data.product) {
        return res.json(data);
      }
    }
  } catch (err) {
    console.error('Barcode lookup error, checking fallback:', err.message);
  }

  const match = FALLBACK_PRODUCTS.find(p => p.code === barcode);
  if (match) {
    return res.json({ status: 1, product: match });
  }

  res.status(404).json({ status: 0, status_verbose: 'product not found' });
});

// Serve static files
app.use(express.static(__dirname));

// Fallback for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NutriPlan running on http://0.0.0.0:${PORT}`);
});
