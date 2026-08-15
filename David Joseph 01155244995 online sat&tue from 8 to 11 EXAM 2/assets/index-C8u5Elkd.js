(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();const S="https://www.themealdb.com/api/json/v1/1";async function U(s){try{return(await(await fetch(`${S}/search.php?s=${encodeURIComponent(s)}`)).json()).meals||[]}catch(e){return console.error("Error searching meals by name:",e),[]}}async function V(s){try{return(await(await fetch(`${S}/search.php?f=${s}`)).json()).meals||[]}catch(e){return console.error("Error searching meals by letter:",e),[]}}async function z(s){try{return(await(await fetch(`${S}/filter.php?i=${encodeURIComponent(s)}`)).json()).meals||[]}catch(e){return console.error("Error filtering meals by ingredient:",e),[]}}async function W(s){try{return(await(await fetch(`${S}/filter.php?c=${encodeURIComponent(s)}`)).json()).meals||[]}catch(e){return console.error("Error filtering meals by category:",e),[]}}async function Y(s){try{return(await(await fetch(`${S}/filter.php?a=${encodeURIComponent(s)}`)).json()).meals||[]}catch(e){return console.error("Error filtering meals by area:",e),[]}}async function J(){try{return(await(await fetch(`${S}/categories.php`)).json()).categories||[]}catch(s){return console.error("Error fetching categories:",s),[]}}async function K(){try{return(await(await fetch(`${S}/list.php?c=list`)).json()).meals||[]}catch(s){return console.error("Error fetching category list:",s),[]}}async function Q(){try{return(await(await fetch(`${S}/list.php?a=list`)).json()).meals||[]}catch(s){return console.error("Error fetching area list:",s),[]}}async function X(){try{return(await(await fetch(`${S}/list.php?i=list`)).json()).meals||[]}catch(s){return console.error("Error fetching ingredient list:",s),[]}}async function Z(s){try{const t=await(await fetch(`${S}/lookup.php?i=${s}`)).json();return t.meals?t.meals[0]:null}catch(e){return console.error("Error fetching meal by ID:",e),null}}async function j(){try{const e=await(await fetch(`${S}/random.php`)).json();return e.meals?e.meals[0]:null}catch(s){return console.error("Error fetching random meal:",s),null}}async function ee(s=5){try{const e=Array(s).fill().map(()=>j());return(await Promise.all(e)).filter(a=>a!==null)}catch(e){return console.error("Error fetching multiple random meals:",e),[]}}function te(s){const e=[];for(let t=1;t<=20;t++){const a=s[`strIngredient${t}`],r=s[`strMeasure${t}`];a&&a.trim()&&e.push({ingredient:a.trim(),measure:r?r.trim():""})}return e}function ae(s,e="small"){const t=e==="medium"?"-medium":"-small";return`https://www.themealdb.com/images/ingredients/${encodeURIComponent(s)}${t}.png`}function se(s){return s?s.split(/(?:\r\n|\r|\n)+/).map(t=>t.trim()).filter(t=>t.length>0).map(t=>t.replace(/^\d+[\.\)]\s*/,"")).filter(t=>(t.toLowerCase(),/^step\s*\d+\.?$/i.test(t)||/^\d+\.?$/.test(t)?!1:t.length>5)):[]}const x={searchMealsByName:U,searchMealsByFirstLetter:V,filterMealsByIngredient:z,filterMealsByCategory:W,filterMealsByArea:Y,getAllCategories:J,getCategoryList:K,getAreaList:Q,getIngredientList:X,getMealById:Z,getRandomMeal:j,getMultipleRandomMeals:ee,extractIngredients:te,getIngredientThumbnail:ae,parseInstructions:se},q="https://nutriplan-api.vercel.app/api",D="xRGnhxcXrKuX8hJpeeQE5Rac9b7dyQDpaMs5fWFL",T=new Map;function re(){T.clear()}async function G(s,e){var a,r;const t=`recipe_${s}_${e.join("|")}`;if(T.has(t))return T.get(t);try{const o=await fetch(`${q}/nutrition/analyze`,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":D},body:JSON.stringify({recipeName:s,ingredients:e})});if(!o.ok){const d=await o.json().catch(()=>({}));throw console.error("❌ Nutrition API error:",d),new Error(((a=d.error)==null?void 0:a.message)||`API error: ${o.status}`)}const i=await o.json();if(!i.success)throw console.error("❌ API returned failure:",i),new Error(((r=i.error)==null?void 0:r.message)||i.error||"Analysis failed");const l=i.data,n={uri:`nutriplan://nutrition/${Date.now()}`,yield:l.servings,calories:l.totals.calories,totalWeight:l.totalWeight,dietLabels:[],healthLabels:[],cautions:[],totals:l.totals,perServing:l.perServing,totalNutrients:{ENERC_KCAL:{label:"Energy",quantity:l.totals.calories,unit:"kcal"},FAT:{label:"Fat",quantity:l.totals.fat,unit:"g"},FASAT:{label:"Saturated Fat",quantity:l.totals.saturatedFat,unit:"g"},CHOCDF:{label:"Carbohydrates",quantity:l.totals.carbs,unit:"g"},FIBTG:{label:"Fiber",quantity:l.totals.fiber,unit:"g"},SUGAR:{label:"Sugars",quantity:l.totals.sugar,unit:"g"},PROCNT:{label:"Protein",quantity:l.totals.protein,unit:"g"},CHOLE:{label:"Cholesterol",quantity:l.totals.cholesterol,unit:"mg"},NA:{label:"Sodium",quantity:l.totals.sodium,unit:"mg"}},totalDaily:oe(l.totals),ingredients:l.ingredients.map(d=>{var u,m,p,f,b,v;return{text:d.original,food:((u=d.matched)==null?void 0:u.description)||((m=d.parsed)==null?void 0:m.foodName),grams:d.grams,calories:((p=d.nutrition)==null?void 0:p.calories)||0,protein:((f=d.nutrition)==null?void 0:f.protein)||0,fat:((b=d.nutrition)==null?void 0:b.fat)||0,carbs:((v=d.nutrition)==null?void 0:v.carbs)||0}})};return T.set(t,n),n}catch(o){return console.error("❌ Error analyzing recipe:",o),ie(s,e)}}function oe(s){const e={calories:2e3,fat:65,saturatedFat:20,carbs:300,fiber:25,protein:50,cholesterol:300,sodium:2400};return{ENERC_KCAL:{label:"Energy",quantity:Math.round(s.calories/e.calories*100),unit:"%"},FAT:{label:"Fat",quantity:Math.round(s.fat/e.fat*100),unit:"%"},FASAT:{label:"Saturated Fat",quantity:Math.round(s.saturatedFat/e.saturatedFat*100),unit:"%"},CHOCDF:{label:"Carbohydrates",quantity:Math.round(s.carbs/e.carbs*100),unit:"%"},FIBTG:{label:"Fiber",quantity:Math.round(s.fiber/e.fiber*100),unit:"%"},PROCNT:{label:"Protein",quantity:Math.round(s.protein/e.protein*100),unit:"%"},CHOLE:{label:"Cholesterol",quantity:Math.round(s.cholesterol/e.cholesterol*100),unit:"%"},NA:{label:"Sodium",quantity:Math.round(s.sodium/e.sodium*100),unit:"%"}}}function ie(s,e){console.warn("⚠️ Using fallback nutrition data");const t=e.length*100;return{uri:`fallback://nutrition/${Date.now()}`,yield:4,calories:t,totalWeight:e.length*100,dietLabels:[],healthLabels:[],cautions:[],totalNutrients:{ENERC_KCAL:{label:"Energy",quantity:t,unit:"kcal"},FAT:{label:"Fat",quantity:0,unit:"g"},FASAT:{label:"Saturated Fat",quantity:0,unit:"g"},CHOCDF:{label:"Carbohydrates",quantity:0,unit:"g"},FIBTG:{label:"Fiber",quantity:0,unit:"g"},SUGAR:{label:"Sugars",quantity:0,unit:"g"},PROCNT:{label:"Protein",quantity:0,unit:"g"},CHOLE:{label:"Cholesterol",quantity:0,unit:"mg"},NA:{label:"Sodium",quantity:0,unit:"mg"}},totalDaily:{},ingredients:e.map(a=>({text:a,food:"Unknown",grams:100,calories:100,protein:0,fat:0,carbs:0,notFound:!0}))}}function le(s){var i,l,n,d,u,m,p,f,b,v,y,$,w;if(!s)return null;const e=s.yield||4,t=s.perServing,a=s.totals;if(t&&a)return{servings:e,caloriesPerServing:t.calories,totalCalories:a.calories,macros:{protein:{amount:t.protein,dailyValue:Math.round(t.protein/50*100)},carbs:{amount:t.carbs,dailyValue:Math.round(t.carbs/300*100)},fat:{amount:t.fat,dailyValue:Math.round(t.fat/65*100)},fiber:{amount:t.fiber,dailyValue:Math.round(t.fiber/25*100)},sugar:{amount:t.sugar,dailyValue:0},saturatedFat:{amount:t.saturatedFat,dailyValue:Math.round(t.saturatedFat/20*100)}},other:{cholesterol:t.cholesterol,sodium:t.sodium},dietLabels:s.dietLabels||[],healthLabels:s.healthLabels||[]};const r=s.totalNutrients||{},o=s.totalDaily||{};return{servings:e,caloriesPerServing:Math.round((s.calories||0)/e),totalCalories:Math.round(s.calories||0),macros:{protein:{amount:Math.round((((i=r.PROCNT)==null?void 0:i.quantity)||0)/e),dailyValue:Math.round((((l=o.PROCNT)==null?void 0:l.quantity)||0)/e)},carbs:{amount:Math.round((((n=r.CHOCDF)==null?void 0:n.quantity)||0)/e),dailyValue:Math.round((((d=o.CHOCDF)==null?void 0:d.quantity)||0)/e)},fat:{amount:Math.round((((u=r.FAT)==null?void 0:u.quantity)||0)/e),dailyValue:Math.round((((m=o.FAT)==null?void 0:m.quantity)||0)/e)},fiber:{amount:Math.round((((p=r.FIBTG)==null?void 0:p.quantity)||0)/e),dailyValue:Math.round((((f=o.FIBTG)==null?void 0:f.quantity)||0)/e)},sugar:{amount:Math.round((((b=r.SUGAR)==null?void 0:b.quantity)||0)/e),dailyValue:0},saturatedFat:{amount:Math.round((((v=r.FASAT)==null?void 0:v.quantity)||0)/e),dailyValue:Math.round((((y=o.FASAT)==null?void 0:y.quantity)||0)/e)}},other:{cholesterol:Math.round(((($=r.CHOLE)==null?void 0:$.quantity)||0)/e),sodium:Math.round((((w=r.NA)==null?void 0:w.quantity)||0)/e)},dietLabels:s.dietLabels||[],healthLabels:s.healthLabels||[]}}function ne(s=[]){const e={calories:0,protein:0,carbs:0,fat:0,fiber:0};for(const t of s)t.nutrition&&(e.calories+=t.nutrition.calories||0,e.protein+=t.nutrition.protein||0,e.carbs+=t.nutrition.carbs||0,e.fat+=t.nutrition.fat||0,e.fiber+=t.nutrition.fiber||0);return e}async function de(s){const e=await G("Single Item",[s]);if(e.ingredients&&e.ingredients.length>0){const t=e.ingredients[0];return{uri:`nutriplan://item/${Date.now()}`,description:t.food,calories:t.calories,totalWeight:t.grams,dietLabels:[],healthLabels:[],totalNutrients:{ENERC_KCAL:{label:"Energy",quantity:t.calories,unit:"kcal"},FAT:{label:"Fat",quantity:t.fat,unit:"g"},CHOCDF:{label:"Carbohydrates",quantity:t.carbs,unit:"g"},PROCNT:{label:"Protein",quantity:t.protein,unit:"g"}},totalDaily:{},ingredients:[{text:s,parsed:[{quantity:1,food:t.food,weight:t.grams}]}]}}return null}async function ce(s,e=5){try{const t=await fetch(`${q}/nutrition/search?q=${encodeURIComponent(s)}&page=1`,{headers:{"x-api-key":D}});if(!t.ok)throw new Error(`Search API error: ${t.status}`);return(await t.json()).results||[]}catch(t){return console.error("Error searching foods:",t),[]}}const A={analyzeRecipe:G,formatNutritionForDisplay:le,calculateDayTotal:ne,getNutritionForItem:de,searchFoods:ce,clearNutritionCache:re},N="https://world.openfoodfacts.org";async function ge(s={}){try{const e=new URLSearchParams({page:s.page||1,page_size:s.pageSize||24,json:1,...s.searchTerms&&{search_terms:s.searchTerms},...s.categories&&{categories_tags_en:s.categories},...s.nutritionGrade&&{nutrition_grades_tags:s.nutritionGrade}}),t=await fetch(`${N}/cgi/search.pl?${e}`);if(!t.ok)throw new Error(`HTTP error! status: ${t.status}`);const a=await t.json();return{count:a.count||0,page:a.page||1,pageSize:a.page_size||24,products:(a.products||[]).map(F)}}catch(e){return console.error("Error searching products:",e),xe(s)}}async function ue(s){try{const e=await fetch(`${N}/api/v0/product/${s}.json`);if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);const t=await e.json();return t.status===0?null:F(t.product)}catch(e){return console.error("Error fetching product by barcode:",e),null}}async function me(s,e=1,t=24){try{const a=await fetch(`${N}/category/${encodeURIComponent(s)}.json?page=${e}&page_size=${t}`);if(!a.ok)throw new Error(`HTTP error! status: ${a.status}`);const r=await a.json();return{count:r.count||0,page:r.page||1,products:(r.products||[]).map(F)}}catch(a){return console.error("Error fetching products by category:",a),{count:0,page:1,products:[]}}}async function pe(){return[{id:"breakfast_cereals",name:"Breakfast Cereals",icon:"fa-wheat-awn"},{id:"beverages",name:"Beverages",icon:"fa-bottle-water"},{id:"snacks",name:"Snacks",icon:"fa-cookie"},{id:"dairy",name:"Dairy Products",icon:"fa-cheese"},{id:"fruits",name:"Fruits",icon:"fa-apple-whole"},{id:"vegetables",name:"Vegetables",icon:"fa-carrot"},{id:"breads",name:"Breads",icon:"fa-bread-slice"},{id:"meats",name:"Meats",icon:"fa-drumstick-bite"},{id:"frozen_foods",name:"Frozen Foods",icon:"fa-snowflake"},{id:"sauces",name:"Sauces & Condiments",icon:"fa-jar"}]}function F(s){var e,t,a,r,o,i,l,n,d,u;return{barcode:s.code||s._id,name:s.product_name||s.product_name_en||"Unknown Product",brand:s.brands||"",categories:s.categories||"",image:s.image_front_url||s.image_url||null,thumbnailImage:s.image_front_small_url||s.image_small_url||null,nutritionGrade:s.nutrition_grades||s.nutrition_grade_fr||null,novaGroup:s.nova_group||null,ecoscore:s.ecoscore_grade||null,ingredients:s.ingredients_text||s.ingredients_text_en||"",allergens:s.allergens||"",quantity:s.quantity||"",servingSize:s.serving_size||"",nutrition:{calories:((e=s.nutriments)==null?void 0:e["energy-kcal_100g"])||((t=s.nutriments)==null?void 0:t.energy_100g)||0,fat:((a=s.nutriments)==null?void 0:a.fat_100g)||0,saturatedFat:((r=s.nutriments)==null?void 0:r["saturated-fat_100g"])||0,carbs:((o=s.nutriments)==null?void 0:o.carbohydrates_100g)||0,sugar:((i=s.nutriments)==null?void 0:i.sugars_100g)||0,fiber:((l=s.nutriments)==null?void 0:l.fiber_100g)||0,protein:((n=s.nutriments)==null?void 0:n.proteins_100g)||0,salt:((d=s.nutriments)==null?void 0:d.salt_100g)||0,sodium:((u=s.nutriments)==null?void 0:u.sodium_100g)||0},labels:s.labels||"",origins:s.origins||"",stores:s.stores||""}}function fe(s){return{a:{label:"Excellent",color:"#038141",description:"Very good nutritional quality"},b:{label:"Good",color:"#85bb2f",description:"Good nutritional quality"},c:{label:"Average",color:"#fecb02",description:"Average nutritional quality"},d:{label:"Poor",color:"#ee8100",description:"Poor nutritional quality"},e:{label:"Bad",color:"#e63e11",description:"Bad nutritional quality"}}[s==null?void 0:s.toLowerCase()]||{label:"Unknown",color:"#999",description:"No score available"}}function be(s){return{1:{label:"Unprocessed",color:"#038141",description:"Unprocessed or minimally processed foods"},2:{label:"Processed Ingredients",color:"#85bb2f",description:"Processed culinary ingredients"},3:{label:"Processed",color:"#ee8100",description:"Processed foods"},4:{label:"Ultra-processed",color:"#e63e11",description:"Ultra-processed food and drink products"}}[s]||{label:"Unknown",color:"#999",description:"No classification available"}}function ye(s,e=100){const t=e/100,a=s.nutrition;return{calories:Math.round(a.calories*t),fat:Math.round(a.fat*t*10)/10,saturatedFat:Math.round(a.saturatedFat*t*10)/10,carbs:Math.round(a.carbs*t*10)/10,sugar:Math.round(a.sugar*t*10)/10,fiber:Math.round(a.fiber*t*10)/10,protein:Math.round(a.protein*t*10)/10,salt:Math.round(a.salt*t*100)/100,sodium:Math.round(a.sodium*t)}}function xe(s={}){let t=[{code:"7613034626844",product_name:"Cheerios Original",brands:"Nestlé",categories:"Breakfast cereals",image_front_url:"https://images.openfoodfacts.org/images/products/761/303/462/6844/front_en.jpg",nutrition_grades:"a",nova_group:4,nutriments:{"energy-kcal_100g":372,fat_100g:4.2,"saturated-fat_100g":.8,carbohydrates_100g:74,sugars_100g:4.8,fiber_100g:8.6,proteins_100g:8.4,salt_100g:1.1}},{code:"5000159484695",product_name:"Nutella",brands:"Ferrero",categories:"Spreads, Chocolate spreads",image_front_url:"https://images.openfoodfacts.org/images/products/500/015/948/4695/front_en.jpg",nutrition_grades:"e",nova_group:4,nutriments:{"energy-kcal_100g":539,fat_100g:30.9,"saturated-fat_100g":10.6,carbohydrates_100g:57.5,sugars_100g:56.3,fiber_100g:0,proteins_100g:6.3,salt_100g:.107}},{code:"3017620422003",product_name:"Nutella",brands:"Ferrero",categories:"Chocolate spreads",nutrition_grades:"e",nova_group:4,nutriments:{"energy-kcal_100g":539,fat_100g:31,carbohydrates_100g:57,sugars_100g:56,proteins_100g:6}},{code:"8410076472458",product_name:"Greek Yogurt",brands:"Danone",categories:"Dairy, Yogurts",nutrition_grades:"a",nova_group:1,nutriments:{"energy-kcal_100g":97,fat_100g:5,"saturated-fat_100g":3.3,carbohydrates_100g:3.6,sugars_100g:3.6,proteins_100g:9,salt_100g:.1}},{code:"5449000000996",product_name:"Coca-Cola Original",brands:"Coca-Cola",categories:"Beverages, Sodas",nutrition_grades:"e",nova_group:4,nutriments:{"energy-kcal_100g":42,fat_100g:0,carbohydrates_100g:10.6,sugars_100g:10.6,proteins_100g:0,salt_100g:0}}];if(s.searchTerms){const a=s.searchTerms.toLowerCase();t=t.filter(r=>r.product_name.toLowerCase().includes(a)||r.brands.toLowerCase().includes(a))}return s.nutritionGrade&&(t=t.filter(a=>a.nutrition_grades===s.nutritionGrade.toLowerCase())),{count:t.length,page:s.page||1,pageSize:s.pageSize||24,products:t.map(F)}}const k={searchProducts:ge,getProductByBarcode:ue,getProductsByCategory:me,getPopularCategories:pe,getNutriScoreInfo:fe,getNovaGroupInfo:be,calculateNutritionPerServing:ye},M={SAVED_RECIPES:"nutriplan_saved_recipes",DAILY_LOG:"nutriplan_daily_log",USER_SETTINGS:"nutriplan_user_settings",SHOPPING_LIST:"nutriplan_shopping_list"},he={calorieGoal:2e3,proteinGoal:50,carbsGoal:250,fatGoal:65,fiberGoal:25,waterGoal:2e3,waterGlassSize:250,weight:70,height:170,age:30,gender:"male",activityLevel:"moderate",dietaryRestrictions:[],allergies:[],notifications:!0,darkMode:!1,weekStart:"monday",measurementUnit:"metric"},c={currentPage:"meals",searchQuery:"",selectedCategory:null,selectedArea:null,selectedMeal:null,categories:[],areas:[],meals:[],featuredMeals:[],isLoading:!1,error:null};function ve(){const s=localStorage.getItem(M.USER_SETTINGS);c.userSettings=s?JSON.parse(s):{...he};const e=localStorage.getItem(M.SAVED_RECIPES);c.savedRecipes=e?JSON.parse(e):[];const t=localStorage.getItem(M.DAILY_LOG);c.dailyLog=t?JSON.parse(t):{};const a=localStorage.getItem(M.SHOPPING_LIST);return c.shoppingList=a?JSON.parse(a):[],c.streaks=we(c.dailyLog),c}function we(s){const e=new Date;let t=0,a=0;for(let r=0;r<365;r++){const o=new Date(e);o.setDate(o.getDate()-r);const i=o.toISOString().split("T")[0],l=s[i];if(l&&l.totalCalories>0)r===t&&t++,a=Math.max(a,t);else if(r>0)break}return{nutrition:t,maxNutrition:a}}function Se(){return c}function L(s,e=!1){Object.assign(c,s),e&&(s.savedRecipes!==void 0&&localStorage.setItem(M.SAVED_RECIPES,JSON.stringify(c.savedRecipes)),s.dailyLog!==void 0&&localStorage.setItem(M.DAILY_LOG,JSON.stringify(c.dailyLog)),s.userSettings!==void 0&&localStorage.setItem(M.USER_SETTINGS,JSON.stringify(c.userSettings)),s.shoppingList!==void 0&&localStorage.setItem(M.SHOPPING_LIST,JSON.stringify(c.shoppingList))),window.dispatchEvent(new CustomEvent("stateChange",{detail:s}))}function $e(s){c.savedRecipes.some(t=>t.idMeal===s.idMeal)||(c.savedRecipes.push({...s,savedAt:new Date().toISOString()}),L({savedRecipes:c.savedRecipes},!0))}function Le(s){c.savedRecipes=c.savedRecipes.filter(e=>e.idMeal!==s),L({savedRecipes:c.savedRecipes},!0)}function Ce(s){return c.savedRecipes.some(e=>e.idMeal===s)}function Me(s,e){c.dailyLog[s]||(c.dailyLog[s]={meals:[],totalCalories:0,totalProtein:0,totalCarbs:0,totalFat:0,water:0}),c.dailyLog[s].meals.push(e),c.dailyLog[s].totalCalories+=e.calories||0,c.dailyLog[s].totalProtein+=e.protein||0,c.dailyLog[s].totalCarbs+=e.carbs||0,c.dailyLog[s].totalFat+=e.fat||0,L({dailyLog:c.dailyLog},!0)}function R(s,e){c.dailyLog[s]||(c.dailyLog[s]={meals:[],totalCalories:0,totalProtein:0,totalCarbs:0,totalFat:0,water:0,waterLog:[]}),c.dailyLog[s].water+=e,c.dailyLog[s].waterLog=c.dailyLog[s].waterLog||[],c.dailyLog[s].waterLog.push({amount:e,time:new Date().toISOString()}),L({dailyLog:c.dailyLog},!0)}function O(){const s=B(),e=c.dailyLog[s]||{water:0,waterLog:[]},t=c.userSettings.waterGoal,a=c.userSettings.waterGlassSize;return{current:e.water||0,goal:t,glassSize:a,glasses:Math.floor((e.water||0)/a),targetGlasses:Math.ceil(t/a),percentage:Math.min(100,Math.round((e.water||0)/t*100)),log:e.waterLog||[]}}function ke(){const s=B(),e=c.userSettings.waterGlassSize;return R(s,e),O()}function Ee(s){const e=c.dailyLog[s]||{totalCalories:0,totalProtein:0,totalCarbs:0,totalFat:0,water:0},t=c.userSettings;return{calories:Math.min(100,Math.round(e.totalCalories/t.calorieGoal*100)),protein:Math.min(100,Math.round(e.totalProtein/t.proteinGoal*100)),carbs:Math.min(100,Math.round(e.totalCarbs/t.carbsGoal*100)),fat:Math.min(100,Math.round(e.totalFat/t.fatGoal*100)),water:Math.min(100,Math.round(e.water/t.waterGoal*100)),overall:0}}function Ie(s){s.forEach(e=>{c.shoppingList.some(a=>a.ingredient.toLowerCase()===e.ingredient.toLowerCase())||c.shoppingList.push({...e,id:Date.now()+Math.random(),checked:!1,addedAt:new Date().toISOString()})}),L({shoppingList:c.shoppingList},!0)}function Pe(s){const e=c.shoppingList.find(t=>t.id===s);e&&(e.checked=!e.checked,L({shoppingList:c.shoppingList},!0))}function Te(s){c.shoppingList=c.shoppingList.filter(e=>e.id!==s),L({shoppingList:c.shoppingList},!0)}function Fe(){c.shoppingList=c.shoppingList.filter(s=>!s.checked),L({shoppingList:c.shoppingList},!0)}function Ne(s){c.userSettings={...c.userSettings,...s},L({userSettings:c.userSettings},!0)}function B(){return new Date().toISOString().split("T")[0]}function Be(){const s=new Date,e=[];for(let t=6;t>=0;t--){const a=new Date(s);a.setDate(a.getDate()-t),e.push(a.toISOString().split("T")[0])}return e.map(t=>({date:t,dayName:new Date(t).toLocaleDateString("en-US",{weekday:"short"}),nutrition:c.dailyLog[t]||{totalCalories:0}}))}function _e(){const{weight:s,height:e}=c.userSettings;if(!s||!e)return null;const t=e/100,a=s/(t*t);let r="Normal";return a<18.5?r="Underweight":a>=25&&a<30?r="Overweight":a>=30&&(r="Obese"),{value:a.toFixed(1),category:r}}function Ae(){var r,o;const s=((r=c.savedRecipes)==null?void 0:r.length)||0,e=Object.values(c.mealPlan||{}).reduce((i,l)=>i+Object.keys(l).length,0),t=((o=c.shoppingList)==null?void 0:o.length)||0,a=Object.keys(c.workoutLog||{}).length;return{savedRecipes:s,plannedMeals:e,shoppingItems:t,workoutsLogged:a}}const g={initializeState:ve,getState:Se,updateState:L,saveRecipe:$e,unsaveRecipe:Le,isRecipeSaved:Ce,logDailyNutrition:Me,logWaterIntake:R,getTodayWaterIntake:O,logWaterGlass:ke,getDailyProgress:Ee,addToShoppingList:Ie,toggleShoppingItem:Pe,removeFromShoppingList:Te,clearCompletedShoppingItems:Fe,updateUserSettings:Ne,getTodayString:B,getWeeklySummary:Be,getBMI:_e,getTotalStats:Ae};function je(s){return`
        <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${s.idMeal}">
            <div class="relative h-48 overflow-hidden">
                <img 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    src="${s.strMealThumb}" 
                    alt="${s.strMeal}"
                    loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                    ${s.strCategory?`
                        <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                            <i class="fa-solid fa-tag text-emerald-600 mr-1"></i>${s.strCategory}
                        </span>
                    `:""}
                    ${s.strArea?`
                        <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                            <i class="fa-solid fa-globe text-blue-600 mr-1"></i>${s.strArea}
                        </span>
                    `:""}
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    ${s.strMeal}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                    ${s.strInstructions?s.strInstructions.substring(0,100)+"...":"Delicious recipe to try!"}
                </p>
                <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-900">
                        <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                        ${s.strCategory||"Various"}
                    </span>
                    <span class="font-semibold text-gray-500">
                        <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                        ${s.strArea||"International"}
                    </span>
                </div>
            </div>
        </div>
    `}function qe(s){const e={Beef:{bg:"from-red-50 to-rose-50",border:"border-red-200 hover:border-red-400",iconFrom:"from-red-400",iconTo:"to-rose-500",text:"text-red-600"},Chicken:{bg:"from-amber-50 to-orange-50",border:"border-amber-200 hover:border-amber-400",iconFrom:"from-amber-400",iconTo:"to-orange-500",text:"text-amber-600"},Dessert:{bg:"from-pink-50 to-rose-50",border:"border-pink-200 hover:border-pink-400",iconFrom:"from-pink-400",iconTo:"to-rose-500",text:"text-pink-600"},Lamb:{bg:"from-orange-50 to-amber-50",border:"border-orange-200 hover:border-orange-400",iconFrom:"from-orange-400",iconTo:"to-amber-500",text:"text-orange-600"},Miscellaneous:{bg:"from-slate-50 to-gray-50",border:"border-slate-200 hover:border-slate-400",iconFrom:"from-slate-400",iconTo:"to-gray-500",text:"text-slate-600"},Pasta:{bg:"from-yellow-50 to-amber-50",border:"border-yellow-200 hover:border-yellow-400",iconFrom:"from-yellow-400",iconTo:"to-amber-500",text:"text-yellow-600"},Pork:{bg:"from-rose-50 to-red-50",border:"border-rose-200 hover:border-rose-400",iconFrom:"from-rose-400",iconTo:"to-red-500",text:"text-rose-600"},Seafood:{bg:"from-cyan-50 to-blue-50",border:"border-cyan-200 hover:border-cyan-400",iconFrom:"from-cyan-400",iconTo:"to-blue-500",text:"text-cyan-600"},Side:{bg:"from-green-50 to-emerald-50",border:"border-green-200 hover:border-green-400",iconFrom:"from-green-400",iconTo:"to-emerald-500",text:"text-green-600"},Starter:{bg:"from-teal-50 to-cyan-50",border:"border-teal-200 hover:border-teal-400",iconFrom:"from-teal-400",iconTo:"to-cyan-500",text:"text-teal-600"},Vegan:{bg:"from-emerald-50 to-green-50",border:"border-emerald-200 hover:border-emerald-400",iconFrom:"from-emerald-400",iconTo:"to-green-500",text:"text-emerald-600"},Vegetarian:{bg:"from-lime-50 to-green-50",border:"border-lime-200 hover:border-lime-400",iconFrom:"from-lime-400",iconTo:"to-green-500",text:"text-lime-600"},Breakfast:{bg:"from-amber-50 to-orange-50",border:"border-amber-200 hover:border-amber-400",iconFrom:"from-amber-400",iconTo:"to-orange-500",text:"text-amber-600"},Goat:{bg:"from-stone-50 to-amber-50",border:"border-stone-200 hover:border-stone-400",iconFrom:"from-stone-400",iconTo:"to-amber-500",text:"text-stone-600"}},t=e[s.strCategory]||e.Miscellaneous,r={Beef:"fa-drumstick-bite",Chicken:"fa-drumstick-bite",Dessert:"fa-cake-candles",Lamb:"fa-drumstick-bite",Pasta:"fa-bowl-food",Pork:"fa-bacon",Seafood:"fa-fish",Side:"fa-plate-wheat",Starter:"fa-utensils",Vegan:"fa-leaf",Vegetarian:"fa-seedling",Breakfast:"fa-mug-hot",Miscellaneous:"fa-bowl-rice",Goat:"fa-drumstick-bite"}[s.strCategory]||"fa-utensils";return`
        <div class="category-card bg-gradient-to-br ${t.bg} rounded-xl p-3 border ${t.border} hover:shadow-md cursor-pointer transition-all group" data-category="${s.strCategory}">
            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 bg-gradient-to-br ${t.iconFrom} ${t.iconTo} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                    <i class="fa-solid ${r} text-white text-sm"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-gray-900">${s.strCategory}</h3>
                </div>
            </div>
        </div>
    `}function De(s,e,t,a){var i,l,n,d,u,m,p,f,b,v,y,$,w,E,I,P,_;const r=(e==null?void 0:e.dietLabels)||[],o=((i=e==null?void 0:e.healthLabels)==null?void 0:i.slice(0,5))||[];return`
        <div class="grid grid-cols-2 gap-8 p-8">
            <!-- Left Column -->
            <div>
                <div class="mb-6">
                    <div class="flex items-center gap-2 mb-3 flex-wrap">
                        ${r.map(C=>`
                            <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">${C.toUpperCase()}</span>
                        `).join("")}
                        ${o.map(C=>`
                            <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">${C.toUpperCase()}</span>
                        `).join("")}
                    </div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">${s.strMeal}</h2>
                    <p class="text-gray-600 mb-4">
                        ${s.strInstructions?s.strInstructions.substring(0,200)+"...":"A delicious recipe to try!"}
                    </p>
                    <div class="flex items-center gap-6 mb-6">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <i class="fa-solid fa-globe text-emerald-600"></i>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">${s.strArea||"International"}</p>
                                <p class="text-xs text-gray-500">Cuisine</p>
                            </div>
                        </div>
                        <span class="text-sm font-medium text-gray-500">
                            <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                            ${s.strArea||"International"} Cuisine
                        </span>
                    </div>
                </div>
                
                <div class="h-80 rounded-xl overflow-hidden mb-6">
                    <img class="w-full h-full object-cover" src="${s.strMealThumb}" alt="${s.strMeal}"/>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-emerald-50 rounded-xl p-4 text-center">
                        <i class="fa-solid fa-tag text-emerald-600 text-2xl mb-2"></i>
                        <p class="text-xs text-gray-500 mb-1">Category</p>
                        <p class="text-lg font-bold text-gray-900">${s.strCategory||"-"}</p>
                    </div>
                    <div class="bg-blue-50 rounded-xl p-4 text-center">
                        <i class="fa-solid fa-globe text-blue-600 text-2xl mb-2"></i>
                        <p class="text-xs text-gray-500 mb-1">Cuisine</p>
                        <p class="text-lg font-bold text-gray-900">${s.strArea||"-"}</p>
                    </div>
                    <div class="bg-purple-50 rounded-xl p-4 text-center">
                        <i class="fa-solid fa-list text-purple-600 text-2xl mb-2"></i>
                        <p class="text-xs text-gray-500 mb-1">Ingredients</p>
                        <p class="text-lg font-bold text-gray-900">${t.length}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-emerald-600"></i>
                        Ingredients
                    </h3>
                    <div class="space-y-3 max-h-64 overflow-y-auto">
                        ${t.map(C=>`
                            <div class="flex items-center gap-3">
                                <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded"/>
                                <span class="text-gray-700">${C.measure} ${C.ingredient}</span>
                            </div>
                        `).join("")}
                    </div>
                    <button class="add-to-shopping-btn mt-4 w-full py-2.5 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition-all flex items-center justify-center gap-2" data-meal-id="${s.idMeal}" style="display: none;">
                        <i class="fa-solid fa-cart-plus"></i>
                        Add All to Shopping List
                    </button>
                </div>
            </div>
            
            <!-- Right Column -->
            <div>
                <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border-2 border-emerald-200">
                    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                        Nutrition Facts
                    </h3>
                    <div class="text-center mb-4 pb-4 border-b-2 border-emerald-200">
                        <p class="text-sm text-gray-600 mb-1">Calories per serving</p>
                        <p class="text-5xl font-bold text-gray-900">${(e==null?void 0:e.caloriesPerServing)||"~350"}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-xs text-gray-500 mb-1">Protein</p>
                            <p class="text-2xl font-bold text-emerald-600">${((n=(l=e==null?void 0:e.macros)==null?void 0:l.protein)==null?void 0:n.amount)||"~25"}g</p>
                            <p class="text-xs text-gray-500 mt-1">${((u=(d=e==null?void 0:e.macros)==null?void 0:d.protein)==null?void 0:u.dailyValue)||"~50"}% DV</p>
                        </div>
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-xs text-gray-500 mb-1">Carbs</p>
                            <p class="text-2xl font-bold text-blue-600">${((p=(m=e==null?void 0:e.macros)==null?void 0:m.carbs)==null?void 0:p.amount)||"~30"}g</p>
                            <p class="text-xs text-gray-500 mt-1">${((b=(f=e==null?void 0:e.macros)==null?void 0:f.carbs)==null?void 0:b.dailyValue)||"~10"}% DV</p>
                        </div>
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-xs text-gray-500 mb-1">Fat</p>
                            <p class="text-2xl font-bold text-purple-600">${((y=(v=e==null?void 0:e.macros)==null?void 0:v.fat)==null?void 0:y.amount)||"~15"}g</p>
                            <p class="text-xs text-gray-500 mt-1">${((w=($=e==null?void 0:e.macros)==null?void 0:$.fat)==null?void 0:w.dailyValue)||"~23"}% DV</p>
                        </div>
                        <div class="bg-white rounded-lg p-4 text-center">
                            <p class="text-xs text-gray-500 mb-1">Fiber</p>
                            <p class="text-2xl font-bold text-orange-600">${((I=(E=e==null?void 0:e.macros)==null?void 0:E.fiber)==null?void 0:I.amount)||"~5"}g</p>
                            <p class="text-xs text-gray-500 mt-1">${((_=(P=e==null?void 0:e.macros)==null?void 0:P.fiber)==null?void 0:_.dailyValue)||"~20"}% DV</p>
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                        Instructions
                    </h3>
                    <div class="space-y-4 max-h-80 overflow-y-auto">
                        ${a.map((C,H)=>`
                            <div class="flex gap-4">
                                <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                                    ${H+1}
                                </div>
                                <div class="flex-1">
                                    <p class="text-sm text-gray-600">${C}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
                
                ${s.strYoutube?`
                    <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-200">
                        <h3 class="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <i class="fa-brands fa-youtube text-red-500"></i>
                            Video Tutorial
                        </h3>
                        <a href="${s.strYoutube}" target="_blank" rel="noopener noreferrer" 
                           class="w-full py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                            <i class="fa-solid fa-play"></i>
                            Watch on YouTube
                        </a>
                    </div>
                `:""}
            </div>
        </div>
        
        <div class="px-8 pb-8">
            <div class="flex items-center gap-4">
                <button class="save-detail-btn flex-1 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2" data-meal-id="${s.idMeal}">
                    <i class="fa-solid fa-heart"></i>
                    Save Recipe
                </button>
                <button class="close-detail-btn flex-1 py-3.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    <i class="fa-solid fa-xmark"></i>
                    Close
                </button>
            </div>
        </div>
    `}function Ge(){return`
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `}function Re(s,e="fa-search"){return`
        <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fa-solid ${e} text-gray-400 text-2xl"></i>
            </div>
            <p class="text-gray-500 text-lg">${s}</p>
        </div>
    `}function Oe(s,e=null){return`
        <button class="area-filter-btn px-4 py-2 ${e?"bg-gray-100 text-gray-700":"bg-emerald-600 text-white"} rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 hover:text-white transition-all" data-area="">
            All Cuisines
        </button>
        ${s.map(t=>`
            <button class="area-filter-btn px-4 py-2 ${e===t.strArea?"bg-emerald-600 text-white":"bg-gray-100 text-gray-700"} rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all" data-area="${t.strArea}">
                ${t.strArea}
            </button>
        `).join("")}
    `}const h={createMealCard:je,createCategoryCard:qe,createMealDetailContent:De,createLoadingSpinner:Ge,createEmptyState:Re,createAreaFilters:Oe,createDashboardWidget:He,createWaterTracker:Ue,createQuickActionCard:Ve,createSettingsSection:ze,createStreakCard:We,createSkeletonCard:Ye,createProductCard:Je,createProductDetailContent:Ke,createProductCategoryButton:Qe};function He(s,e,t,a,r="emerald",o=null){const i=o?`
        <span class="text-xs ${o>0?"text-green-500":"text-red-500"} flex items-center gap-1">
            <i class="fa-solid ${o>0?"fa-arrow-up":"fa-arrow-down"}"></i>
            ${Math.abs(o)}%
        </span>
    `:"";return`
        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100">
            <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-${r}-100 rounded-xl flex items-center justify-center">
                    <i class="fa-solid ${a} text-${r}-600 text-xl"></i>
                </div>
                ${i}
            </div>
            <h3 class="text-3xl font-bold text-gray-900 mb-1">${e}</h3>
            <p class="text-sm text-gray-500">${s}</p>
            ${t?`<p class="text-xs text-${r}-600 font-medium mt-2">${t}</p>`:""}
        </div>
    `}function Ue(s){const{current:e,goal:t,glasses:a,targetGlasses:r,percentage:o}=s,i=Array(r).fill(0).map((l,n)=>`
        <div class="water-glass w-8 h-10 rounded-lg border-2 ${n<a?"bg-blue-500 border-blue-500":"border-gray-300 bg-gray-50"} 
            cursor-pointer hover:scale-110 transition-all flex items-end justify-center overflow-hidden"
            data-glass="${n+1}">
            ${n<a?'<i class="fa-solid fa-droplet text-white text-xs mb-1"></i>':""}
        </div>
    `).join("");return`
        <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <i class="fa-solid fa-droplet text-white"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900">Water Intake</h3>
                        <p class="text-xs text-gray-500">${e}ml / ${t}ml</p>
                    </div>
                </div>
                <span class="text-2xl font-bold text-blue-600">${o}%</span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div class="bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full transition-all duration-500" style="width: ${o}%"></div>
            </div>
            
            <div class="flex items-center gap-2 flex-wrap mb-4">
                ${i}
            </div>
            
            <button id="add-water-btn" class="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <i class="fa-solid fa-plus"></i>
                Add Glass (${s.glassSize}ml)
            </button>
        </div>
    `}function Ve(s,e,t,a,r){return`
        <button class="quick-action-btn bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left border border-gray-100 hover:border-${a}-300 group" data-action="${r}">
            <div class="w-10 h-10 bg-${a}-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <i class="fa-solid ${t} text-${a}-600"></i>
            </div>
            <h4 class="font-semibold text-gray-900 text-sm">${s}</h4>
            <p class="text-xs text-gray-500 mt-1">${e}</p>
        </button>
    `}function ze(s,e,t){return`
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 class="text-lg font-bold text-gray-900 mb-1">${s}</h3>
            <p class="text-sm text-gray-500 mb-4">${e}</p>
            ${t}
        </div>
    `}function We(s,e,t,a,r){return`
        <div class="bg-gradient-to-br from-${r}-50 to-${r}-100 rounded-xl p-4 border border-${r}-200">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-${r}-500 rounded-xl flex items-center justify-center">
                    <i class="fa-solid ${a} text-white text-xl"></i>
                </div>
                <div>
                    <p class="text-xs text-${r}-700 font-medium">${s} Streak</p>
                    <p class="text-2xl font-bold text-gray-900">${e} <span class="text-sm font-normal text-gray-500">days</span></p>
                    <p class="text-xs text-gray-500">Best: ${t} days</p>
                </div>
            </div>
        </div>
    `}function Ye(s="recipe"){return s==="recipe"?`
            <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div class="h-48 bg-gray-200"></div>
                <div class="p-4">
                    <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded mb-3 w-full"></div>
                    <div class="flex justify-between">
                        <div class="h-3 bg-gray-200 rounded w-16"></div>
                        <div class="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                </div>
            </div>
        `:s==="exercise"?`
            <div class="bg-white rounded-xl p-5 shadow-sm animate-pulse">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-gray-200 rounded-xl"></div>
                    <div class="flex-1">
                        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        `:s==="product"?`
            <div class="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div class="h-40 bg-gray-200"></div>
                <div class="p-4">
                    <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div class="h-3 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        `:""}function Je(s){var o,i,l,n,d,u,m,p,f,b;const e={a:"bg-green-500",b:"bg-lime-500",c:"bg-yellow-500",d:"bg-orange-500",e:"bg-red-500"},t={1:"bg-green-500",2:"bg-lime-500",3:"bg-orange-500",4:"bg-red-500"},a=e[(o=s.nutritionGrade)==null?void 0:o.toLowerCase()]||"bg-gray-400",r=t[s.novaGroup]||"bg-gray-400";return`
        <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-barcode="${s.barcode}">
            <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                ${s.image?`
                    <img 
                        class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                        src="${s.image}" 
                        alt="${s.name}"
                        loading="lazy"
                        onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center\\'><i class=\\'fa-solid fa-box text-gray-400 text-2xl\\'></i></div>'"
                    />
                `:`
                    <div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
                        <i class="fa-solid fa-box text-gray-400 text-2xl"></i>
                    </div>
                `}
                
                <!-- Nutri-Score Badge -->
                ${s.nutritionGrade?`
                    <div class="absolute top-2 left-2 ${a} text-white text-xs font-bold px-2 py-1 rounded uppercase">
                        Nutri-Score ${s.nutritionGrade.toUpperCase()}
                    </div>
                `:""}
                
                <!-- NOVA Badge -->
                ${s.novaGroup?`
                    <div class="absolute top-2 right-2 ${r} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" title="NOVA ${s.novaGroup}">
                        ${s.novaGroup}
                    </div>
                `:""}
            </div>
            
            <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">${s.brand||"Unknown Brand"}</p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    ${s.name}
                </h3>
                
                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    ${s.quantity?`<span><i class="fa-solid fa-weight-scale mr-1"></i>${s.quantity}</span>`:""}
                    ${(i=s.nutrition)!=null&&i.calories?`<span><i class="fa-solid fa-fire mr-1"></i>${Math.round(s.nutrition.calories)} kcal/100g</span>`:""}
                </div>
                
                <!-- Mini Nutrition -->
                <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700">${((n=(l=s.nutrition)==null?void 0:l.protein)==null?void 0:n.toFixed(1))||0}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${((u=(d=s.nutrition)==null?void 0:d.carbs)==null?void 0:u.toFixed(1))||0}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${((p=(m=s.nutrition)==null?void 0:m.fat)==null?void 0:p.toFixed(1))||0}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${((b=(f=s.nutrition)==null?void 0:f.sugar)==null?void 0:b.toFixed(1))||0}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                </div>
            </div>
        </div>
    `}function Ke(s,e,t){var a,r,o,i,l,n,d,u,m,p,f,b,v,y,$,w,E,I,P;return`
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    ${s.image?`
                        <img src="${s.image}" alt="${s.name}" class="w-full h-full object-contain"/>
                    `:`
                        <i class="fa-solid fa-box text-gray-400 text-4xl"></i>
                    `}
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${s.brand||"Unknown Brand"}</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${s.name}</h2>
                    <p class="text-sm text-gray-500 mb-3">${s.quantity||""}</p>
                    
                    <div class="flex items-center gap-3">
                        ${s.nutritionGrade?`
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${e.color}20">
                                <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${e.color}">
                                    ${s.nutritionGrade.toUpperCase()}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${e.color}">Nutri-Score</p>
                                    <p class="text-[10px] text-gray-600">${e.label}</p>
                                </div>
                            </div>
                        `:""}
                        
                        ${s.novaGroup?`
                            <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${t.color}20">
                                <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${t.color}">
                                    ${s.novaGroup}
                                </span>
                                <div>
                                    <p class="text-xs font-bold" style="color: ${t.color}">NOVA</p>
                                    <p class="text-[10px] text-gray-600">${t.label}</p>
                                </div>
                            </div>
                        `:""}
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-times text-2xl"></i>
                </button>
            </div>
            
            <!-- Nutrition Facts -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>
                
                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900">${Math.round(((a=s.nutrition)==null?void 0:a.calories)||0)}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>
                
                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${Math.min((((r=s.nutrition)==null?void 0:r.protein)||0)/50*100,100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${((i=(o=s.nutrition)==null?void 0:o.protein)==null?void 0:i.toFixed(1))||0}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min((((l=s.nutrition)==null?void 0:l.carbs)||0)/100*100,100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${((d=(n=s.nutrition)==null?void 0:n.carbs)==null?void 0:d.toFixed(1))||0}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min((((u=s.nutrition)==null?void 0:u.fat)||0)/65*100,100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${((p=(m=s.nutrition)==null?void 0:m.fat)==null?void 0:p.toFixed(1))||0}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min((((f=s.nutrition)==null?void 0:f.sugar)||0)/50*100,100)}%"></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${((v=(b=s.nutrition)==null?void 0:b.sugar)==null?void 0:v.toFixed(1))||0}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${(($=(y=s.nutrition)==null?void 0:y.saturatedFat)==null?void 0:$.toFixed(1))||0}g</p>
                        <p class="text-xs text-gray-500">Saturated Fat</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${((E=(w=s.nutrition)==null?void 0:w.fiber)==null?void 0:E.toFixed(1))||0}g</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${((P=(I=s.nutrition)==null?void 0:I.salt)==null?void 0:P.toFixed(2))||0}g</p>
                        <p class="text-xs text-gray-500">Salt</p>
                    </div>
                </div>
            </div>
            
            <!-- Additional Info -->
            ${s.ingredients?`
                <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i class="fa-solid fa-list text-gray-600"></i>
                        Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">${s.ingredients}</p>
                </div>
            `:""}
            
            ${s.allergens?`
                <div class="bg-red-50 rounded-xl p-5 mb-6 border border-red-200">
                    <h3 class="font-bold text-red-700 mb-2 flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        Allergens
                    </h3>
                    <p class="text-sm text-red-600">${s.allergens}</p>
                </div>
            `:""}
            
            <!-- Actions -->
            <div class="flex gap-3">
                <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="${s.barcode}">
                    <i class="fa-solid fa-plus mr-2"></i>Log This Food
                </button>
                <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
        </div>
    `}function Qe(s){return`
        <button class="product-category-btn flex-shrink-0 px-5 py-3 bg-gradient-to-r ${{breakfast_cereals:"from-amber-500 to-orange-500",beverages:"from-blue-500 to-cyan-500",snacks:"from-purple-500 to-pink-500",dairy:"from-sky-400 to-blue-500",fruits:"from-red-500 to-rose-500",vegetables:"from-green-500 to-emerald-500",breads:"from-amber-600 to-yellow-500",meats:"from-red-600 to-rose-600",frozen_foods:"from-cyan-500 to-blue-600",sauces:"from-orange-500 to-red-500"}[s.id]||"from-gray-500 to-gray-600"} text-white rounded-xl font-semibold hover:shadow-lg transition-all" data-category="${s.id}">
            <i class="fa-solid ${s.icon} mr-2"></i>${s.name}
        </button>
    `}class Xe{constructor(){this.state=g.initializeState(),this.currentPage="meals",this.debounceTimer=null,this.routes={"":"home",home:"meals",meals:"meals",settings:"settings",products:"products"},this.init()}async init(){this.setupEventListeners(),this.setupRouting(),(window.location.pathname==="/"||window.location.pathname==="")&&window.history.replaceState({page:"meals"},"","/home"),await this.loadInitialData();const e=this.getPageFromURL();e.type==="meal-detail"&&e.slug?await this.loadMealFromSlug(e.slug):(this.renderPage(e.type),this.updateActiveNavLink(e.type)),this.hideLoadingOverlay()}setupRouting(){window.addEventListener("popstate",()=>{const e=this.getPageFromURL();e.type==="meal-detail"?this.loadMealFromSlug(e.slug):(this.renderPage(e.type),this.updateActiveNavLink(e.type))})}getPageFromURL(){const e=window.location.pathname.replace(/^\//,"").replace(/\/$/,"");return e.startsWith("meal/")?{type:"meal-detail",slug:e.replace("meal/","")}:{type:this.routes[e]||"meals",slug:null}}async loadMealFromSlug(e){try{const t=e.replace(/-/g," "),a=await x.searchMeals(t);if(a&&a.length>0){const r=a.find(o=>this.slugify(o.strMeal)===e)||a[0];g.updateState({selectedMealId:r.idMeal}),this.renderPage("meal-detail"),this.updateActiveNavLink("meals")}else this.navigateTo("meals")}catch(t){console.error("Error loading meal from URL:",t),this.navigateTo("meals")}}slugify(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}navigateTo(e){let t;e==="meals"?t="/home":t=`/${Object.keys(this.routes).find(r=>this.routes[r]===e&&r!==""&&r!=="home")||e}`,window.location.pathname!==t&&window.history.pushState({page:e},"",t),this.renderPage(e),this.updateActiveNavLink(e)}navigateToMeal(e){const a=`/meal/${this.slugify(e.strMeal)}`;g.updateState({selectedMealId:e.idMeal}),window.history.pushState({page:"meal-detail",mealId:e.idMeal},"",a),this.renderPage("meal-detail"),this.updateActiveNavLink("meals")}updateActiveNavLink(e){document.querySelectorAll("#sidebar nav a").forEach(t=>{var o,i,l,n,d,u;const a=((i=(o=t.querySelector("span"))==null?void 0:o.textContent)==null?void 0:i.toLowerCase())||"";let r="meals";a.includes("meals")||a.includes("recipes")?r="meals":a.includes("settings")?r="settings":a.includes("products")||a.includes("barcode")||a.includes("scan")?r="products":(a.includes("food log")||a.includes("log"))&&(r="foodlog"),r===e?(t.classList.add("bg-emerald-50","text-emerald-700"),t.classList.remove("text-gray-600","hover:bg-gray-50"),(l=t.querySelector("span"))==null||l.classList.add("font-semibold"),(n=t.querySelector("span"))==null||n.classList.remove("font-medium")):(t.classList.remove("bg-emerald-50","text-emerald-700"),t.classList.add("text-gray-600","hover:bg-gray-50"),(d=t.querySelector("span"))==null||d.classList.remove("font-semibold"),(u=t.querySelector("span"))==null||u.classList.add("font-medium"))})}hideLoadingOverlay(){const e=document.getElementById("app-loading-overlay");e&&(e.style.opacity="0",e.style.transition="opacity 0.5s ease-out",setTimeout(()=>{e.remove()},500))}setupEventListeners(){document.querySelectorAll("#sidebar nav a").forEach(t=>{t.addEventListener("click",a=>this.handleNavigation(a))});const e=document.querySelector('#search-filters-section input[type="text"]');e&&(e.addEventListener("input",t=>this.handleSearch(t)),e.addEventListener("keypress",t=>{t.key==="Enter"&&this.performSearch(t.target.value)})),this.setupViewToggle(),document.addEventListener("click",t=>this.handleGlobalClick(t)),window.addEventListener("stateChange",t=>this.handleStateChange(t))}setupViewToggle(){const e=document.getElementById("grid-view-btn"),t=document.getElementById("list-view-btn");e&&t&&(e.addEventListener("click",()=>this.setViewMode("grid")),t.addEventListener("click",()=>this.setViewMode("list")))}setViewMode(e){var o,i,l,n;const t=document.getElementById("grid-view-btn"),a=document.getElementById("list-view-btn"),r=document.querySelector("#all-recipes-section .grid");r&&(e==="grid"?(t==null||t.classList.add("bg-white","shadow-sm"),(o=t==null?void 0:t.querySelector("i"))==null||o.classList.replace("text-gray-500","text-gray-700"),a==null||a.classList.remove("bg-white","shadow-sm"),(i=a==null?void 0:a.querySelector("i"))==null||i.classList.replace("text-gray-700","text-gray-500"),r.className="grid grid-cols-4 gap-5",r.querySelectorAll(".recipe-card").forEach(d=>{var m,p,f,b;d.classList.remove("flex","flex-row","h-40"),(m=d.querySelector(".relative"))==null||m.classList.remove("w-48","h-full"),(p=d.querySelector(".relative"))==null||p.classList.add("h-48"),(f=d.querySelector("img"))==null||f.classList.remove("h-full"),(b=d.querySelector("img"))==null||b.classList.add("h-full");const u=d.querySelector(".relative > .absolute.bottom-3");u&&u.classList.remove("hidden")})):(a==null||a.classList.add("bg-white","shadow-sm"),(l=a==null?void 0:a.querySelector("i"))==null||l.classList.replace("text-gray-500","text-gray-700"),t==null||t.classList.remove("bg-white","shadow-sm"),(n=t==null?void 0:t.querySelector("i"))==null||n.classList.replace("text-gray-700","text-gray-500"),r.className="grid grid-cols-2 gap-4",r.querySelectorAll(".recipe-card").forEach(d=>{var m,p;d.classList.add("flex","flex-row","h-40"),(m=d.querySelector(".relative"))==null||m.classList.add("w-48","h-full"),(p=d.querySelector(".relative"))==null||p.classList.remove("h-48");const u=d.querySelector(".relative > .absolute.bottom-3");u&&u.classList.add("hidden")})),g.updateState({viewMode:e}))}handleNavigation(e){var o,i;e.preventDefault();const a=((i=(o=e.currentTarget.querySelector("span"))==null?void 0:o.textContent)==null?void 0:i.toLowerCase())||"";let r="meals";a.includes("meals")||a.includes("recipes")?r="meals":a.includes("settings")?r="settings":a.includes("products")||a.includes("barcode")||a.includes("scan")?r="products":(a.includes("food log")||a.includes("log"))&&(r="foodlog"),this.navigateTo(r)}handleGlobalClick(e){if(e.target.closest(".recipe-card")){const a=e.target.closest(".recipe-card").dataset.mealId;this.showMealDetail(a)}if(e.target.closest(".category-card")){const a=e.target.closest(".category-card").dataset.category;this.filterByCategory(a)}if(e.target.closest(".area-filter-btn")){const a=e.target.closest(".area-filter-btn").dataset.area;this.filterByArea(a)}if(e.target.closest(".exercise-card")&&!e.target.closest(".add-exercise-btn")){const a=e.target.closest(".exercise-card").dataset.exerciseId;this.showExerciseDetail(a)}if(e.target.closest(".add-exercise-btn")){e.stopPropagation();const a=e.target.closest(".exercise-card").dataset.exerciseId;this.addExerciseToWorkout(a)}if(e.target.closest(".close-detail-btn")&&this.closeMealDetail(),e.target.closest(".add-to-plan-btn")){const a=e.target.closest(".add-to-plan-btn").dataset.mealId;this.showMealPlanModal(a)}}handleSearch(e){const t=e.target.value.trim();clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(()=>{t.length>=2?this.performSearch(t):t.length===0&&this.loadAllRecipes()},300)}async performSearch(e){g.updateState({isLoading:!0,searchQuery:e});const t=document.querySelector("#all-recipes-section .grid");t&&(t.innerHTML=h.createLoadingSpinner());try{const a=await x.searchMealsByName(e);g.updateState({meals:a,isLoading:!1}),this.renderRecipeGrid(a);const r=document.querySelector("#all-recipes-section p.text-gray-600");r&&(r.textContent=`Showing ${a.length} recipes for "${e}"`)}catch(a){console.error("Search error:",a),g.updateState({isLoading:!1,error:a.message})}}async loadInitialData(){try{const e=await x.getAllCategories();g.updateState({categories:e});const t=await x.getAreaList();g.updateState({areas:t});const a=await x.searchMealsByName("chicken");g.updateState({meals:a})}catch(e){console.error("Error loading initial data:",e)}}async loadAllRecipes(){const e=await x.searchMealsByName("");if(e.length===0){const t=await x.searchMealsByName("chicken");g.updateState({meals:t}),this.renderRecipeGrid(t)}else g.updateState({meals:e}),this.renderRecipeGrid(e)}renderPage(e){this.currentPage=e;const t=document.getElementById("main-content");switch(this.updateHeader(e),["shopping-section","settings-section","products-section","meal-detail-section","foodlog-section"].forEach(a=>{const r=document.getElementById(a);r&&(r.style.display="none")}),t.querySelectorAll("section"),e){case"meals":this.showMealsPage();break;case"settings":this.showSettingsPage();break;case"products":this.showProductsPage();break;case"foodlog":this.showFoodLogPage();break;case"meal-detail":this.showMealDetailPage();break}}updateHeader(e){const t=document.querySelector("#header h1"),a=document.querySelector("#header p"),r={meals:{title:"Meals & Recipes",subtitle:"Discover delicious and nutritious recipes tailored for you"},settings:{title:"Settings",subtitle:"Customize your goals and preferences"},products:{title:"Product Scanner",subtitle:"Search packaged foods by name or barcode"},foodlog:{title:"Food Log",subtitle:"Track your daily nutrition and food intake"},"meal-detail":{title:"Recipe Details",subtitle:"View full recipe information and nutrition facts"}};t&&r[e]&&(t.textContent=r[e].title),a&&r[e]&&(a.textContent=r[e].subtitle)}showMealsPage(){this.toggleSections(["search-filters-section","meal-categories-section","all-recipes-section"],!0),this.toggleSections(["recipe-detail-modal","nutritional-insights-section","meal-planning-section","community-section"],!1),this.renderCategories(),this.renderRecipeGrid(g.getState().meals),this.renderAreaFilters()}toggleSections(e,t){e.forEach(a=>{const r=document.getElementById(a);r&&(r.style.display=t?"":"none")})}renderCategories(){const e=document.getElementById("meal-categories-section");if(!e)return;const t=e.querySelector(".grid");if(!t)return;t.className="grid grid-cols-6 gap-3";const a=g.getState().categories||[];t.innerHTML=a.slice(0,12).map(r=>h.createCategoryCard(r)).join("")}renderRecipeGrid(e){const t=document.querySelector("#all-recipes-section .grid");if(!t)return;if(!e||e.length===0){t.innerHTML=h.createEmptyState("No recipes found. Try a different search term.");return}t.innerHTML=e.map(r=>h.createMealCard(r)).join("");const a=document.querySelector("#all-recipes-section p.text-gray-600");a&&(a.textContent=`Showing ${e.length} recipes`)}renderAreaFilters(){const e=document.querySelector("#search-filters-section .flex.items-center.gap-3");if(!e)return;const t=g.getState().areas||[],a=g.getState().selectedArea;e.innerHTML=h.createAreaFilters(t.slice(0,10),a)}async filterByCategory(e){g.updateState({selectedCategory:e,isLoading:!0});const t=document.querySelector("#all-recipes-section .grid");t&&(t.innerHTML=h.createLoadingSpinner());try{const a=await x.filterMealsByCategory(e),r=await Promise.all(a.slice(0,20).map(i=>x.getMealById(i.idMeal)));g.updateState({meals:r.filter(i=>i),isLoading:!1}),this.renderRecipeGrid(r.filter(i=>i));const o=document.querySelector("#all-recipes-section p.text-gray-600");o&&(o.textContent=`Showing ${r.length} ${e} recipes`)}catch(a){console.error("Filter error:",a),g.updateState({isLoading:!1})}}async filterByArea(e){g.updateState({selectedArea:e,isLoading:!0}),document.querySelectorAll(".area-filter-btn").forEach(a=>{a.dataset.area===e?(a.classList.add("bg-emerald-600","text-white"),a.classList.remove("bg-gray-100","text-gray-700")):(a.classList.remove("bg-emerald-600","text-white"),a.classList.add("bg-gray-100","text-gray-700"))});const t=document.querySelector("#all-recipes-section .grid");t&&(t.innerHTML=h.createLoadingSpinner());try{let a;e?(a=await x.filterMealsByArea(e),a=(await Promise.all(a.slice(0,20).map(i=>x.getMealById(i.idMeal)))).filter(i=>i)):a=await x.searchMealsByName("chicken"),g.updateState({meals:a,isLoading:!1}),this.renderRecipeGrid(a);const r=document.querySelector("#all-recipes-section p.text-gray-600");r&&(r.textContent=e?`Showing ${a.length} ${e} recipes`:`Showing ${a.length} recipes`)}catch(a){console.error("Filter error:",a),g.updateState({isLoading:!1})}}async showMealDetail(e){g.updateState({selectedMealId:e,isLoading:!0});try{const t=await x.getMealById(e);if(t){const r=`/meal/${this.slugify(t.strMeal)}`;window.location.pathname!==r&&window.history.pushState({page:"meal-detail",mealId:e},"",r)}}catch(t){console.error("Error fetching meal for URL:",t)}this.renderPage("meal-detail"),window.scrollTo({top:0,behavior:"smooth"})}async showMealDetailPage(){var a,r;this.toggleSections(["search-filters-section","featured-recipes-section","meal-categories-section","all-recipes-section","recipe-detail-modal","nutritional-insights-section","meal-planning-section","community-section"],!1);let e=document.getElementById("meal-detail-section");if(!e){e=document.createElement("section"),e.id="meal-detail-section",e.className="px-8 py-6 bg-gray-50 min-h-screen";const o=document.getElementById("main-content"),i=document.getElementById("footer");o.insertBefore(e,i)}e.style.display="";const t=g.getState().selectedMealId;if(!t){e.innerHTML=`
                <div class="max-w-6xl mx-auto">
                    <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Back to Recipes</span>
                    </button>
                    ${h.createEmptyState("No recipe selected. Please select a recipe to view details.","fa-utensils")}
                </div>
            `,(a=document.getElementById("back-to-meals-btn"))==null||a.addEventListener("click",()=>{this.navigateTo("meals")});return}try{const o=await x.getMealById(t);if(!o)throw new Error("Meal not found");const i=x.extractIngredients(o),l=x.parseInstructions(o.strInstructions);g.updateState({selectedMeal:o,isLoading:!1}),e.innerHTML=this.createMealDetailPageContent(o,null,i,l),this.setupMealDetailPageListeners(o,i),this.loadNutritionData(o,i)}catch(o){console.error("Error loading meal detail:",o),g.updateState({isLoading:!1}),e.innerHTML=`
                <div class="max-w-6xl mx-auto">
                    <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Back to Recipes</span>
                    </button>
                    ${h.createEmptyState("Failed to load recipe details. Please try again.","fa-exclamation-circle")}
                </div>
            `,(r=document.getElementById("back-to-meals-btn"))==null||r.addEventListener("click",()=>{this.navigateTo("meals")})}}async loadNutritionData(e,t){var r;const a=document.getElementById("nutrition-facts-container");if(a)try{const o=t.map(p=>`${p.measure} ${p.ingredient}`),i=await A.analyzeRecipe(e.strMeal,o),l=A.formatNutritionForDisplay(i),n=g.getState().mealNutritionCache||{};n[e.idMeal]=l,g.updateState({mealNutritionCache:n}),a.innerHTML=this.createNutritionContent(l);const d=document.getElementById("hero-calories"),u=document.getElementById("hero-servings");d&&(d.textContent=`${l.caloriesPerServing} cal/serving`),u&&(u.textContent=`${l.servings} servings`);const m=document.getElementById("log-meal-btn");m&&(m.disabled=!1,m.className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all cursor-pointer",m.title="",m.innerHTML=`
                    <i class="fa-solid fa-clipboard-list"></i>
                    <span>Log This Meal</span>
                `)}catch(o){console.error("Error loading nutrition data:",o),a.innerHTML=`
                <div class="text-center py-8">
                    <i class="fa-solid fa-exclamation-circle text-3xl text-red-400 mb-3"></i>
                    <p class="text-gray-600">Unable to load nutrition data</p>
                    <button id="retry-nutrition-btn" class="mt-3 text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                        <i class="fa-solid fa-refresh mr-1"></i> Try Again
                    </button>
                </div>
            `;const i=document.getElementById("hero-calories");i&&(i.textContent="N/A");const l=document.getElementById("log-meal-btn");l&&(l.className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-500 rounded-xl font-semibold cursor-not-allowed transition-all",l.title='Nutrition data failed to load. Click "Try Again" in the nutrition section.',l.innerHTML=`
                    <i class="fa-solid fa-exclamation-triangle"></i>
                    <span>Unavailable</span>
                `),(r=document.getElementById("retry-nutrition-btn"))==null||r.addEventListener("click",()=>{a.innerHTML=this.createNutritionLoadingState();const n=document.getElementById("hero-calories");n&&(n.textContent="Calculating...");const d=document.getElementById("log-meal-btn");d&&(d.disabled=!0,d.className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed transition-all",d.title="Waiting for nutrition data...",d.innerHTML=`
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Calculating...</span>
                    `),this.loadNutritionData(e,t)})}}createNutritionLoadingState(){return`
            <div class="text-center py-8">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                    <i class="fa-solid fa-calculator text-emerald-600 text-xl animate-pulse"></i>
                </div>
                <p class="text-gray-700 font-medium mb-1">Calculating Nutrition</p>
                <p class="text-sm text-gray-500">Analyzing ingredients...</p>
                <div class="mt-4 flex justify-center">
                    <div class="flex space-x-1">
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            </div>
        `}createNutritionContent(e){return`
            <p class="text-sm text-gray-500 mb-4">Per serving</p>
            
            <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
                <p class="text-sm text-gray-600">Calories per serving</p>
                <p class="text-4xl font-bold text-emerald-600">${e.caloriesPerServing}</p>
                <p class="text-xs text-gray-500 mt-1">Total: ${e.totalCalories} cal</p>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span class="text-gray-700">Protein</span>
                    </div>
                    <span class="font-bold text-gray-900">${e.macros.protein.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: ${Math.min(e.macros.protein.dailyValue,100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span class="text-gray-700">Carbs</span>
                    </div>
                    <span class="font-bold text-gray-900">${e.macros.carbs.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: ${Math.min(e.macros.carbs.dailyValue,100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span class="text-gray-700">Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${e.macros.fat.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-purple-500 h-2 rounded-full" style="width: ${Math.min(e.macros.fat.dailyValue,100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span class="text-gray-700">Fiber</span>
                    </div>
                    <span class="font-bold text-gray-900">${e.macros.fiber.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-orange-500 h-2 rounded-full" style="width: ${Math.min(e.macros.fiber.dailyValue,100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span class="text-gray-700">Sugar</span>
                    </div>
                    <span class="font-bold text-gray-900">${e.macros.sugar.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: ${Math.min(Math.round(e.macros.sugar.amount/50*100),100)}%"></div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <span class="text-gray-700">Saturated Fat</span>
                    </div>
                    <span class="font-bold text-gray-900">${e.macros.saturatedFat.amount}g</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" style="width: ${Math.min(e.macros.saturatedFat.dailyValue,100)}%"></div>
                </div>
            </div>
            

            
            <div class="mt-6 pt-6 border-t border-gray-100">
                <h3 class="text-sm font-semibold text-gray-900 mb-3">Other</h3>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Cholesterol</span>
                        <span class="font-medium">${e.other.cholesterol}mg</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Sodium</span>
                        <span class="font-medium">${e.other.sodium}mg</span>
                    </div>
                </div>
            </div>
        `}createMealDetailPageContent(e,t,a,r){return`
            <div class="max-w-6xl mx-auto">
                <!-- Back Button -->
                <button id="back-to-meals-btn" class="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium mb-6 transition-colors">
                    <i class="fa-solid fa-arrow-left"></i>
                    <span>Back to Recipes</span>
                </button>
                
                <!-- Hero Section -->
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div class="relative h-80 md:h-96">
                        <img src="${e.strMealThumb}" alt="${e.strMeal}" class="w-full h-full object-cover"/>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        <div class="absolute bottom-0 left-0 right-0 p-8">
                            <div class="flex items-center gap-3 mb-3">
                                ${e.strCategory?`<span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${e.strCategory}</span>`:""}
                                ${e.strArea?`<span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${e.strArea}</span>`:""}
                                ${e.strTags?e.strTags.split(",").slice(0,2).map(o=>`<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${o.trim()}</span>`).join(""):""}
                            </div>
                            <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">${e.strMeal}</h1>
                            <div class="flex items-center gap-6 text-white/90">
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-clock"></i>
                                    <span>30 min</span>
                                </span>
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-utensils"></i>
                                    <span id="hero-servings">${(t==null?void 0:t.servings)||4} servings</span>
                                </span>
                                <span class="flex items-center gap-2">
                                    <i class="fa-solid fa-fire"></i>
                                    <span id="hero-calories">${t?t.caloriesPerServing+" cal/serving":"Calculating..."}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3 mb-8">
                    <button id="log-meal-btn" class="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold cursor-not-allowed transition-all" data-meal-id="${e.idMeal}" disabled title="Waiting for nutrition data...">
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        <span>Calculating...</span>
                    </button>

                </div>
                
                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column - Ingredients & Instructions -->
                    <div class="lg:col-span-2 space-y-8">
                        <!-- Ingredients -->
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-list-check text-emerald-600"></i>
                                Ingredients
                                <span class="text-sm font-normal text-gray-500 ml-auto">${a.length} items</span>
                            </h2>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                ${a.map(o=>`
                                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
                                        <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"/>
                                        <span class="text-gray-700">
                                            <span class="font-medium text-gray-900">${o.measure}</span> ${o.ingredient}
                                        </span>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                        
                        <!-- Instructions -->
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
                                Instructions
                            </h2>
                            <div class="space-y-4">
                                ${r.map((o,i)=>`
                                    <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                                            ${i+1}
                                        </div>
                                        <p class="text-gray-700 leading-relaxed pt-2">${o}</p>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                        
                        ${e.strYoutube?`
                        <!-- Video Section -->
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-video text-red-500"></i>
                                Video Tutorial
                            </h2>
                            <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                                <iframe 
                                    src="https://www.youtube.com/embed/${e.strYoutube.split("v=")[1]}" 
                                    class="absolute inset-0 w-full h-full"
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen>
                                </iframe>
                            </div>
                        </div>
                        `:""}
                    </div>
                    
                    <!-- Right Column - Nutrition -->
                    <div class="space-y-6">
                        <!-- Nutrition Facts -->
                        <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                                Nutrition Facts
                            </h2>
                            <div id="nutrition-facts-container">
                                ${t?this.createNutritionContent(t):this.createNutritionLoadingState()}
                            </div>
                        </div>
                        
                        <!-- Source/Credit -->
                        ${e.strSource?`
                        <div class="bg-white rounded-2xl shadow-lg p-6">
                            <h3 class="text-sm font-semibold text-gray-900 mb-2">Recipe Source</h3>
                            <a href="${e.strSource}" target="_blank" class="text-emerald-600 hover:text-emerald-700 text-sm flex items-center gap-2">
                                <i class="fa-solid fa-external-link"></i>
                                View Original Recipe
                            </a>
                        </div>
                        `:""}
                    </div>
                </div>
            </div>
        `}setupMealDetailPageListeners(e,t){var a,r,o;(a=document.getElementById("back-to-meals-btn"))==null||a.addEventListener("click",()=>{this.navigateTo("meals")}),(r=document.getElementById("add-to-plan-detail-btn"))==null||r.addEventListener("click",()=>{g.updateState({selectedMeal:e}),this.showMealPlanModal(e.idMeal)}),(o=document.getElementById("log-meal-btn"))==null||o.addEventListener("click",()=>{this.showLogMealModal(e)})}closeMealDetail(){this.navigateTo("meals"),g.updateState({selectedMeal:null,selectedMealId:null})}showNotification(e,t="info"){const a={success:"bg-emerald-500",error:"bg-red-500",info:"bg-blue-500",warning:"bg-amber-500"},r=document.createElement("div");r.className=`fixed bottom-4 right-4 ${a[t]} text-white px-6 py-3 rounded-lg shadow-lg z-50 toast-notification`,r.textContent=e,document.body.appendChild(r),setTimeout(()=>r.remove(),3e3)}handleStateChange(e){}showSettingsPage(){this.toggleSections(["search-filters-section","featured-recipes-section","meal-categories-section","all-recipes-section","nutritional-insights-section"],!1),this.renderSettingsSection()}renderSettingsSection(){let e=document.getElementById("settings-section");if(!e){e=document.createElement("section"),e.id="settings-section",e.className="px-8 py-8 bg-gray-50 min-h-screen";const a=document.getElementById("main-content"),r=document.getElementById("footer");a.insertBefore(e,r)}e.style.display="";const t=g.getState().userSettings;e.innerHTML=`
            <div class="max-w-3xl mx-auto">
                <div class="space-y-6">
                    <!-- Profile Settings -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Profile</h3>
                        <p class="text-sm text-gray-500 mb-4">Your personal information</p>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <input type="number" id="setting-age" value="${t.age||30}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select id="setting-gender" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                                    <option value="male" ${t.gender==="male"?"selected":""}>Male</option>
                                    <option value="female" ${t.gender==="female"?"selected":""}>Female</option>
                                    <option value="other" ${t.gender==="other"?"selected":""}>Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <input type="number" id="setting-weight" value="${t.weight}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <input type="number" id="setting-height" value="${t.height}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                        </div>
                    </div>

                    <!-- Nutrition Goals -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Nutrition Goals</h3>
                        <p class="text-sm text-gray-500 mb-4">Set your daily nutrition targets</p>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Daily Calories</label>
                                <input type="number" id="setting-calories" value="${t.calorieGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                                <input type="number" id="setting-protein" value="${t.proteinGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                                <input type="number" id="setting-carbs" value="${t.carbsGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                                <input type="number" id="setting-fat" value="${t.fatGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                        </div>
                    </div>

                    <!-- Water Goals -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Hydration</h3>
                        <p class="text-sm text-gray-500 mb-4">Set your water intake goals</p>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Daily Water Goal (ml)</label>
                                <input type="number" id="setting-water" value="${t.waterGoal}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Glass Size (ml)</label>
                                <input type="number" id="setting-glass" value="${t.waterGlassSize}" 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"/>
                            </div>
                        </div>
                    </div>

                    <!-- Activity Level -->
                    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Activity Level</h3>
                        <p class="text-sm text-gray-500 mb-4">How active are you on a typical day?</p>
                        
                        <div class="grid grid-cols-5 gap-3" id="activity-level-selector">
                            ${["sedentary","light","moderate","active","very_active"].map(a=>`
                                <button class="activity-level-btn px-4 py-3 rounded-xl text-center transition-all ${t.activityLevel===a?"bg-emerald-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}" data-level="${a}">
                                    <i class="fa-solid ${this.getActivityIcon(a)} text-lg mb-1"></i>
                                    <p class="text-xs font-medium capitalize">${a.replace("_"," ")}</p>
                                </button>
                            `).join("")}
                        </div>
                    </div>

                    <!-- Save Button -->
                    <button id="save-settings-btn" class="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        <i class="fa-solid fa-check"></i>
                        Save Settings
                    </button>

                    <!-- Reset Data -->
                    <div class="bg-red-50 rounded-2xl p-6 border border-red-200">
                        <h3 class="text-lg font-bold text-red-700 mb-1">Danger Zone</h3>
                        <p class="text-sm text-red-600 mb-4">These actions cannot be undone</p>
                        <button id="reset-data-btn" class="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all">
                            Reset All Data
                        </button>
                    </div>
                </div>
            </div>
        `,this.setupSettingsListeners()}getActivityIcon(e){return{sedentary:"fa-couch",light:"fa-person-walking",moderate:"fa-person-running",active:"fa-person-biking",very_active:"fa-person-swimming"}[e]||"fa-person"}setupSettingsListeners(){var e,t;document.querySelectorAll(".activity-level-btn").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".activity-level-btn").forEach(r=>{r.classList.remove("bg-emerald-600","text-white"),r.classList.add("bg-gray-100","text-gray-700")}),a.classList.add("bg-emerald-600","text-white"),a.classList.remove("bg-gray-100","text-gray-700")})}),(e=document.getElementById("save-settings-btn"))==null||e.addEventListener("click",()=>{var r,o,i,l,n,d,u,m,p,f,b;const a={age:parseInt((r=document.getElementById("setting-age"))==null?void 0:r.value)||30,gender:((o=document.getElementById("setting-gender"))==null?void 0:o.value)||"male",weight:parseInt((i=document.getElementById("setting-weight"))==null?void 0:i.value)||70,height:parseInt((l=document.getElementById("setting-height"))==null?void 0:l.value)||170,calorieGoal:parseInt((n=document.getElementById("setting-calories"))==null?void 0:n.value)||2e3,proteinGoal:parseInt((d=document.getElementById("setting-protein"))==null?void 0:d.value)||50,carbsGoal:parseInt((u=document.getElementById("setting-carbs"))==null?void 0:u.value)||250,fatGoal:parseInt((m=document.getElementById("setting-fat"))==null?void 0:m.value)||65,waterGoal:parseInt((p=document.getElementById("setting-water"))==null?void 0:p.value)||2e3,waterGlassSize:parseInt((f=document.getElementById("setting-glass"))==null?void 0:f.value)||250,activityLevel:((b=document.querySelector(".activity-level-btn.bg-emerald-600"))==null?void 0:b.dataset.level)||"moderate"};g.updateUserSettings(a),this.showNotification("Settings saved successfully!","success")}),(t=document.getElementById("reset-data-btn"))==null||t.addEventListener("click",()=>{confirm("Are you sure you want to reset all data? This cannot be undone.")&&(localStorage.clear(),window.location.reload())})}showProductsPage(){this.toggleSections(["search-filters-section","featured-recipes-section","meal-categories-section","all-recipes-section","meal-planning-section","nutritional-insights-section"],!1),this.renderProductsSection()}async renderProductsSection(){let e=document.getElementById("products-section");if(!e){e=document.createElement("section"),e.id="products-section",e.className="px-8 py-8 bg-gray-50 min-h-screen";const a=document.getElementById("main-content"),r=document.getElementById("footer");a.insertBefore(e,r)}e.style.display="";const t=await k.getPopularCategories();e.innerHTML=`
            <div class="max-w-7xl mx-auto">
                <!-- Search Header -->
                <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-6 text-white">
                    <h2 class="text-2xl font-bold mb-2">
                        <i class="fa-solid fa-barcode mr-2"></i>
                        Product Search & Barcode Scanner
                    </h2>
                    <p class="opacity-90 mb-4">Search for packaged food products to view nutrition information</p>
                    
                    <div class="flex gap-3">
                        <div class="flex-1 relative">
                            <input type="text" id="product-search-input" 
                                placeholder="Search by product name (e.g., Cheerios, Nutella, Coca-Cola...)" 
                                class="w-full px-5 py-3.5 pr-12 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"/>
                            <i class="fa-solid fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <button id="search-product-btn" class="px-6 py-3.5 bg-white text-emerald-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                            Search
                        </button>
                    </div>
                    
                    <div class="flex items-center gap-4 mt-4">
                        <div class="flex-1 h-px bg-white/30"></div>
                        <span class="text-sm opacity-80">or</span>
                        <div class="flex-1 h-px bg-white/30"></div>
                    </div>
                    
                    <div class="mt-4 flex gap-3">
                        <div class="flex-1 relative">
                            <input type="text" id="barcode-input" 
                                placeholder="Enter barcode number (e.g., 7613034626844)" 
                                class="w-full px-5 py-3.5 pr-12 bg-white/90 backdrop-blur-sm text-gray-900 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"/>
                            <i class="fa-solid fa-barcode absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <button id="lookup-barcode-btn" class="px-6 py-3.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all">
                            <i class="fa-solid fa-search mr-2"></i>Lookup
                        </button>
                    </div>
                </div>
                
                <!-- Nutrition Grade Filter -->
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-sm font-medium text-gray-700">Filter by Nutri-Score:</span>
                    <div class="flex gap-2">
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200" data-grade="">All</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-green-100 text-green-700 hover:bg-green-200" data-grade="a">A</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-lime-100 text-lime-700 hover:bg-lime-200" data-grade="b">B</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-yellow-100 text-yellow-700 hover:bg-yellow-200" data-grade="c">C</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-orange-100 text-orange-700 hover:bg-orange-200" data-grade="d">D</button>
                        <button class="nutri-score-filter px-4 py-2 rounded-lg text-sm font-bold transition-all bg-red-100 text-red-700 hover:bg-red-200" data-grade="e">E</button>
                    </div>
                </div>
                
                <!-- Category Buttons -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Browse by Category</h3>
                    <div class="flex gap-3 overflow-x-auto pb-2">
                        ${t.map(a=>h.createProductCategoryButton(a)).join("")}
                    </div>
                </div>

                <!-- Results Info -->
                <div class="flex items-center justify-between mb-4">
                    <p id="products-count" class="text-sm text-gray-600">Search for products to see results</p>
                </div>

                <!-- Products Grid -->
                <div class="grid grid-cols-4 gap-5" id="products-grid">
                    <!-- Products will be loaded here -->
                </div>
                
                <!-- Loading State -->
                <div id="products-loading" class="hidden py-12">
                    ${h.createLoadingSpinner()}
                </div>
                
                <!-- Empty State -->
                <div id="products-empty" class="py-12">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fa-solid fa-box-open text-gray-400 text-3xl"></i>
                        </div>
                        <p class="text-gray-500 text-lg mb-2">No products to display</p>
                        <p class="text-gray-400 text-sm">Search for a product or browse by category</p>
                    </div>
                </div>
            </div>
        `,this.setupProductsListeners(),this.setupTodayLogListeners()}setupProductsListeners(){var e,t,a,r,o;(e=document.getElementById("search-product-btn"))==null||e.addEventListener("click",()=>{var l;const i=(l=document.getElementById("product-search-input"))==null?void 0:l.value.trim();i&&this.searchProducts(i)}),(t=document.getElementById("product-search-input"))==null||t.addEventListener("keypress",i=>{if(i.key==="Enter"){const l=i.target.value.trim();l&&this.searchProducts(l)}}),(a=document.getElementById("lookup-barcode-btn"))==null||a.addEventListener("click",()=>{var l;const i=(l=document.getElementById("barcode-input"))==null?void 0:l.value.trim();i&&this.lookupBarcode(i)}),(r=document.getElementById("barcode-input"))==null||r.addEventListener("keypress",i=>{if(i.key==="Enter"){const l=i.target.value.trim();l&&this.lookupBarcode(l)}}),document.querySelectorAll(".nutri-score-filter").forEach(i=>{i.addEventListener("click",()=>{var d;document.querySelectorAll(".nutri-score-filter").forEach(u=>{u.classList.remove("ring-2","ring-gray-900")}),i.classList.add("ring-2","ring-gray-900");const l=i.dataset.grade,n=((d=document.getElementById("product-search-input"))==null?void 0:d.value.trim())||"";n&&this.searchProducts(n,l)})}),document.querySelectorAll(".product-category-btn").forEach(i=>{i.addEventListener("click",()=>{const l=i.dataset.category;this.searchProductsByCategory(l)})}),(o=document.getElementById("products-grid"))==null||o.addEventListener("click",i=>{const l=i.target.closest(".product-card");if(l){const n=l.dataset.barcode;this.showProductDetail(n)}})}async searchProducts(e,t=""){const a=document.getElementById("products-grid"),r=document.getElementById("products-loading"),o=document.getElementById("products-empty"),i=document.getElementById("products-count");if(a){r.classList.remove("hidden"),o.classList.add("hidden"),a.innerHTML="";try{const l={searchTerms:e,pageSize:24};t&&(l.nutritionGrade=t);const n=await k.searchProducts(l);r.classList.add("hidden"),n.products.length>0?(a.innerHTML=n.products.map(d=>h.createProductCard(d)).join(""),i.textContent=`Found ${n.count} products for "${e}"`):(o.classList.remove("hidden"),i.textContent=`No products found for "${e}"`),g.updateState({searchedProducts:n.products})}catch(l){console.error("Product search error:",l),r.classList.add("hidden"),o.classList.remove("hidden"),i.textContent="Error searching products",this.showNotification("Failed to search products. Please try again.","error")}}}async searchProductsByCategory(e){const t=document.getElementById("products-grid"),a=document.getElementById("products-loading"),r=document.getElementById("products-empty"),o=document.getElementById("products-count");if(t){a.classList.remove("hidden"),r.classList.add("hidden"),t.innerHTML="";try{const i=await k.getProductsByCategory(e);a.classList.add("hidden"),i.products.length>0?(t.innerHTML=i.products.map(l=>h.createProductCard(l)).join(""),o.textContent=`Found ${i.count} products in ${e.replace(/_/g," ")}`):(r.classList.remove("hidden"),o.textContent=`No products found in ${e.replace(/_/g," ")}`),g.updateState({searchedProducts:i.products})}catch(i){console.error("Category search error:",i),a.classList.add("hidden"),r.classList.remove("hidden"),this.showNotification("Failed to load category products.","error")}}}async lookupBarcode(e){const t=document.getElementById("products-loading"),a=document.getElementById("products-grid"),r=document.getElementById("products-empty"),o=document.getElementById("products-count");t.classList.remove("hidden"),a.innerHTML="",r.classList.add("hidden");try{const i=await k.getProductByBarcode(e);t.classList.add("hidden"),i?(a.innerHTML=h.createProductCard(i),o.textContent=`Found product: ${i.name}`,g.updateState({searchedProducts:[i]}),this.showProductDetail(e)):(r.classList.remove("hidden"),o.textContent=`No product found with barcode: ${e}`,this.showNotification("Product not found in database","error"))}catch(i){console.error("Barcode lookup error:",i),t.classList.add("hidden"),r.classList.remove("hidden"),this.showNotification("Failed to lookup barcode.","error")}}async showProductDetail(e){var i,l;let t=(i=g.getState().searchedProducts)==null?void 0:i.find(n=>n.barcode===e);if(t||(t=await k.getProductByBarcode(e)),!t){this.showNotification("Product not found","error");return}const a=k.getNutriScoreInfo(t.nutritionGrade),r=k.getNovaGroupInfo(t.novaGroup),o=document.createElement("div");o.className="fixed inset-0 bg-black/50 flex items-center justify-center z-50",o.id="product-detail-modal",o.innerHTML=`
            <div class="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                ${h.createProductDetailContent(t,a,r)}
            </div>
        `,document.body.appendChild(o),o.querySelectorAll(".close-product-modal").forEach(n=>{n.addEventListener("click",()=>o.remove())}),o.addEventListener("click",n=>{n.target===o&&o.remove()}),(l=o.querySelector(".add-product-to-log"))==null||l.addEventListener("click",()=>{this.logFoodToDaily(t),o.remove()})}logFoodToDaily(e){var r,o,i,l;const t=g.getTodayString(),a=g.getState().dailyLog||{};a[t]||(a[t]={totalCalories:0,totalProtein:0,totalCarbs:0,totalFat:0,meals:[]}),a[t].totalCalories+=Math.round(((r=e.nutrition)==null?void 0:r.calories)||0),a[t].totalProtein+=Math.round(((o=e.nutrition)==null?void 0:o.protein)||0),a[t].totalCarbs+=Math.round(((i=e.nutrition)==null?void 0:i.carbs)||0),a[t].totalFat+=Math.round(((l=e.nutrition)==null?void 0:l.fat)||0),a[t].meals.push({type:"product",name:e.name,brand:e.brand,barcode:e.barcode,serving:"100g",nutrition:e.nutrition,loggedAt:new Date().toISOString()}),g.updateState({dailyLog:a},!0),this.showNotification(`${e.name} logged to your daily intake! 📝`,"success"),this.updateFoodLogPage()}showLogMealModal(e){var o,i,l,n,d,u,m,p,f,b,v;const t=(o=g.getState().mealNutritionCache)==null?void 0:o[e.idMeal],a=document.createElement("div");a.className="fixed inset-0 bg-black/50 flex items-center justify-center z-50",a.id="log-meal-modal",a.innerHTML=`
            <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                <div class="flex items-center gap-4 mb-6">
                    <img src="${e.strMealThumb}" alt="${e.strMeal}" class="w-16 h-16 rounded-xl object-cover"/>
                    <div>
                        <h3 class="text-xl font-bold text-gray-900">Log This Meal</h3>
                        <p class="text-gray-500 text-sm">${e.strMeal}</p>
                    </div>
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Number of Servings</label>
                    <div class="flex items-center gap-3">
                        <button id="decrease-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="fa-solid fa-minus text-gray-600"></i>
                        </button>
                        <input type="number" id="meal-servings" value="1" min="0.5" max="10" step="0.5" 
                            class="w-20 text-center text-xl font-bold border-2 border-gray-200 rounded-lg py-2"/>
                        <button id="increase-servings" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                            <i class="fa-solid fa-plus text-gray-600"></i>
                        </button>
                    </div>
                </div>
                
                ${t?`
                <div class="bg-emerald-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-600 mb-2">Estimated nutrition per serving:</p>
                    <div class="grid grid-cols-4 gap-2 text-center">
                        <div>
                            <p class="text-lg font-bold text-emerald-600" id="modal-calories">${t.caloriesPerServing}</p>
                            <p class="text-xs text-gray-500">Calories</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-blue-600" id="modal-protein">${((l=(i=t.macros)==null?void 0:i.protein)==null?void 0:l.amount)||0}g</p>
                            <p class="text-xs text-gray-500">Protein</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-amber-600" id="modal-carbs">${((d=(n=t.macros)==null?void 0:n.carbs)==null?void 0:d.amount)||0}g</p>
                            <p class="text-xs text-gray-500">Carbs</p>
                        </div>
                        <div>
                            <p class="text-lg font-bold text-purple-600" id="modal-fat">${((m=(u=t.macros)==null?void 0:u.fat)==null?void 0:m.amount)||0}g</p>
                            <p class="text-xs text-gray-500">Fat</p>
                        </div>
                    </div>
                </div>
                `:`
                <div class="bg-gray-50 rounded-xl p-4 mb-6">
                    <p class="text-sm text-gray-500 text-center">Nutrition information not available for this meal</p>
                </div>
                `}
                
                <div class="flex gap-3">
                    <button id="cancel-log-meal" class="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                        Cancel
                    </button>
                    <button id="confirm-log-meal" class="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all">
                        <i class="fa-solid fa-clipboard-list mr-2"></i>
                        Log Meal
                    </button>
                </div>
            </div>
        `,document.body.appendChild(a);const r=a.querySelector("#meal-servings");(p=a.querySelector("#decrease-servings"))==null||p.addEventListener("click",()=>{const y=parseFloat(r.value);y>.5&&(r.value=(y-.5).toFixed(1))}),(f=a.querySelector("#increase-servings"))==null||f.addEventListener("click",()=>{const y=parseFloat(r.value);y<10&&(r.value=(y+.5).toFixed(1))}),(b=a.querySelector("#cancel-log-meal"))==null||b.addEventListener("click",()=>{a.remove()}),(v=a.querySelector("#confirm-log-meal"))==null||v.addEventListener("click",()=>{var w;const y=parseFloat(r.value)||1,$=((w=g.getState().mealNutritionCache)==null?void 0:w[e.idMeal])||t;this.logMealToDaily(e,y,$),a.remove()}),a.addEventListener("click",y=>{y.target===a&&a.remove()})}logMealToDaily(e,t,a){var l,n,d,u,m,p;const r=g.getTodayString(),o=g.getState().dailyLog||{};o[r]||(o[r]={totalCalories:0,totalProtein:0,totalCarbs:0,totalFat:0,meals:[]});const i={calories:a?Math.round(a.caloriesPerServing*t):0,protein:a?Math.round((((n=(l=a.macros)==null?void 0:l.protein)==null?void 0:n.amount)||0)*t):0,carbs:a?Math.round((((u=(d=a.macros)==null?void 0:d.carbs)==null?void 0:u.amount)||0)*t):0,fat:a?Math.round((((p=(m=a.macros)==null?void 0:m.fat)==null?void 0:p.amount)||0)*t):0};o[r].totalCalories+=i.calories,o[r].totalProtein+=i.protein,o[r].totalCarbs+=i.carbs,o[r].totalFat+=i.fat,o[r].meals.push({type:"meal",name:e.strMeal,mealId:e.idMeal,category:e.strCategory,thumbnail:e.strMealThumb,servings:t,nutrition:i,loggedAt:new Date().toISOString()}),g.updateState({dailyLog:o},!0),Swal.fire({title:"Meal Logged!",html:`<p class="text-gray-600">${e.strMeal} (${t} serving${t!==1?"s":""}) has been added to your daily log.</p>
                   ${i.calories>0?`<p class="text-emerald-600 font-semibold mt-2">+${i.calories} calories</p>`:""}`,icon:"success",confirmButtonColor:"#10b981",timer:2e3,showConfirmButton:!1}),this.updateFoodLogPage()}showFoodLogPage(){this.toggleSections(["search-filters-section","featured-recipes-section","meal-categories-section","all-recipes-section","meal-planning-section","nutritional-insights-section"],!1),this.renderFoodLogSection()}renderFoodLogSection(){var o,i;let e=document.getElementById("foodlog-section");if(!e){e=document.createElement("section"),e.id="foodlog-section",e.className="px-8 py-8 bg-gray-50 min-h-screen";const l=document.getElementById("main-content"),n=document.getElementById("footer");l.insertBefore(e,n)}e.style.display="";const t=this.getTodayLogSummary(),a=this.getWeeklyLogData(),r=g.getState().userGoals||{dailyCalories:2e3,dailyProtein:50,dailyCarbs:250,dailyFat:65};e.innerHTML=`
            <div class="max-w-7xl mx-auto">
                <!-- Page Header -->
                <div class="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 text-white">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold mb-2">
                                <i class="fa-solid fa-clipboard-list mr-2"></i>
                                Daily Food Log
                            </h2>
                            <p class="opacity-90">Track and monitor your daily nutrition intake</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm opacity-80">Today</p>
                            <p class="text-xl font-bold">${new Date().toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"})}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Today's Summary with Progress -->
                <div id="foodlog-today-section" class="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">
                        <i class="fa-solid fa-fire text-orange-500 mr-2"></i>
                        Today's Nutrition
                    </h3>
                    
                    <!-- Progress Bars -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        ${this.renderNutritionProgress("Calories",t.totalCalories,r.dailyCalories,"kcal","emerald")}
                        ${this.renderNutritionProgress("Protein",t.totalProtein,r.dailyProtein,"g","blue")}
                        ${this.renderNutritionProgress("Carbs",t.totalCarbs,r.dailyCarbs,"g","amber")}
                        ${this.renderNutritionProgress("Fat",t.totalFat,r.dailyFat,"g","purple")}
                    </div>
                    
                    <!-- Logged Items -->
                    <div class="border-t border-gray-200 pt-4">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="text-sm font-semibold text-gray-700">Logged Items (${((o=t.meals)==null?void 0:o.length)||0})</h4>
                            ${((i=t.meals)==null?void 0:i.length)>0?`
                                <button id="clear-foodlog" class="text-red-500 hover:text-red-600 text-sm font-medium">
                                    <i class="fa-solid fa-trash mr-1"></i>Clear All
                                </button>
                            `:""}
                        </div>
                        
                        ${this.renderLoggedItemsList(t.meals||[])}
                    </div>
                </div>
                
                <!-- Weekly Overview -->
                <div class="bg-white rounded-2xl p-6 mb-6 border-2 border-gray-200">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">
                        <i class="fa-solid fa-calendar-week text-indigo-500 mr-2"></i>
                        Weekly Overview
                    </h3>
                    
                    <div class="grid grid-cols-7 gap-2">
                        ${a.map(l=>`
                            <div class="text-center ${l.isToday?"bg-indigo-100 rounded-xl":""}">
                                <p class="text-xs text-gray-500 mb-1">${l.dayName}</p>
                                <p class="text-sm font-medium text-gray-900">${l.date}</p>
                                <div class="mt-2 ${l.calories>0?"text-emerald-600":"text-gray-300"}">
                                    <p class="text-lg font-bold">${l.calories}</p>
                                    <p class="text-xs">kcal</p>
                                </div>
                                ${l.itemCount>0?`<p class="text-xs text-gray-400 mt-1">${l.itemCount} items</p>`:""}
                            </div>
                        `).join("")}
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-chart-line text-emerald-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Weekly Average</p>
                                <p class="text-xl font-bold text-gray-900">${a.reduce((l,n)=>l+n.calories,0)>0?Math.round(a.reduce((l,n)=>l+n.calories,0)/7):0} kcal</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-utensils text-blue-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Total Items This Week</p>
                                <p class="text-xl font-bold text-gray-900">${a.reduce((l,n)=>l+n.itemCount,0)} items</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-white rounded-xl p-4 border-2 border-gray-200">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <i class="fa-solid fa-bullseye text-purple-600 text-xl"></i>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Days On Goal</p>
                                <p class="text-xl font-bold text-gray-900">${a.filter(l=>l.calories>0&&l.calories>=r.dailyCalories*.8&&l.calories<=r.dailyCalories*1.2).length} / 7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,this.setupFoodLogListeners()}renderNutritionProgress(e,t,a,r,o){const i=Math.min(Math.round(t/a*100),100),l=t>a;return`
            <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700">${e}</span>
                    <span class="text-xs ${l?"text-red-500":`text-${o}-600`}">${i}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div class="h-2.5 rounded-full ${l?"bg-red-500":`bg-${o}-500`}" style="width: ${i}%"></div>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="font-bold ${l?"text-red-600":`text-${o}-600`}">${t} ${r}</span>
                    <span class="text-gray-400">/ ${a} ${r}</span>
                </div>
            </div>
        `}renderLoggedItemsList(e){return e.length===0?`
                <div class="text-center py-12">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa-solid fa-utensils text-gray-300 text-3xl"></i>
                    </div>
                    <p class="text-gray-500 font-medium mb-2">No food logged today</p>
                    <p class="text-gray-400 text-sm mb-4">Start tracking your nutrition by logging meals or scanning products</p>
                    <div class="flex justify-center gap-3">
                        <a href="#meals" class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                            <i class="fa-solid fa-plus"></i>
                            Browse Recipes
                        </a>
                        <a href="/products" class="nav-link inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                            <i class="fa-solid fa-barcode"></i>
                            Scan Product
                        </a>
                    </div>
                </div>
            `:`
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${e.map((t,a)=>{var r,o,i,l;return`
                    <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                        <div class="flex items-center gap-4">
                            ${t.type==="meal"&&t.thumbnail?`<img src="${t.thumbnail}" alt="${t.name}" class="w-14 h-14 rounded-xl object-cover"/>`:`<div class="w-14 h-14 ${t.type==="product"?"bg-blue-100":"bg-emerald-100"} rounded-xl flex items-center justify-center">
                                    <i class="fa-solid fa-${t.type==="product"?"box":"utensils"} ${t.type==="product"?"text-blue-600":"text-emerald-600"} text-xl"></i>
                                </div>`}
                            <div>
                                <p class="font-semibold text-gray-900">${t.name}</p>
                                <p class="text-sm text-gray-500">
                                    ${t.type==="meal"?`${t.servings} serving${t.servings!==1?"s":""}`:t.brand||t.serving||"Product"}
                                    <span class="mx-1">•</span>
                                    <span class="${t.type==="product"?"text-blue-600":"text-emerald-600"}">${t.type==="product"?"Product":"Recipe"}</span>
                                </p>
                                <p class="text-xs text-gray-400 mt-1">${new Date(t.loggedAt).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"})}</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="text-right">
                                <p class="text-lg font-bold text-emerald-600">${((r=t.nutrition)==null?void 0:r.calories)||0}</p>
                                <p class="text-xs text-gray-500">kcal</p>
                            </div>
                            <div class="hidden md:flex gap-2 text-xs text-gray-500">
                                <span class="px-2 py-1 bg-blue-50 rounded">${((o=t.nutrition)==null?void 0:o.protein)||0}g P</span>
                                <span class="px-2 py-1 bg-amber-50 rounded">${((i=t.nutrition)==null?void 0:i.carbs)||0}g C</span>
                                <span class="px-2 py-1 bg-purple-50 rounded">${((l=t.nutrition)==null?void 0:l.fat)||0}g F</span>
                            </div>
                            <button class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${a}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `}).join("")}
            </div>
        `}getWeeklyLogData(){var r;const e=g.getState().dailyLog||{},t=new Date,a=[];for(let o=6;o>=0;o--){const i=new Date(t);i.setDate(t.getDate()-o);const l=i.toISOString().split("T")[0],n=e[l]||{totalCalories:0,meals:[]};a.push({dayName:i.toLocaleDateString("en-US",{weekday:"short"}),date:i.getDate(),calories:n.totalCalories||0,itemCount:((r=n.meals)==null?void 0:r.length)||0,isToday:o===0})}return a}setupFoodLogListeners(){var e;(e=document.getElementById("clear-foodlog"))==null||e.addEventListener("click",()=>{Swal.fire({title:"Clear Today's Log?",text:"This will remove all logged food items for today.",icon:"warning",showCancelButton:!0,confirmButtonColor:"#ef4444",cancelButtonColor:"#6b7280",confirmButtonText:"Yes, clear it!",cancelButtonText:"Cancel"}).then(t=>{t.isConfirmed&&(this.clearTodayLog(),this.renderFoodLogSection(),Swal.fire({title:"Cleared!",text:"Your food log has been cleared.",icon:"success",timer:1500,showConfirmButton:!1}))})}),document.querySelectorAll(".remove-foodlog-item").forEach(t=>{t.addEventListener("click",()=>{const a=parseInt(t.dataset.index);this.removeLoggedItem(a),this.renderFoodLogSection()})})}updateFoodLogPage(){const e=document.getElementById("foodlog-section");e&&e.style.display!=="none"&&this.renderFoodLogSection()}getTodayLogSummary(){const e=g.getTodayString();return(g.getState().dailyLog||{})[e]||{totalCalories:0,totalProtein:0,totalCarbs:0,totalFat:0,meals:[]}}renderTodayLogContent(e){const t=e.meals||[];return t.length===0?`
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i class="fa-solid fa-utensils text-gray-400 text-2xl"></i>
                    </div>
                    <p class="text-gray-500">No food logged today</p>
                    <p class="text-gray-400 text-sm">Search and log products to track your intake</p>
                </div>
            `:`
            <!-- Nutrition Summary -->
            <div class="grid grid-cols-4 gap-4 mb-4">
                <div class="bg-emerald-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-500 mb-1">Calories</p>
                    <p class="text-2xl font-bold text-emerald-600">${e.totalCalories}</p>
                    <p class="text-xs text-gray-400">kcal</p>
                </div>
                <div class="bg-blue-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-500 mb-1">Protein</p>
                    <p class="text-2xl font-bold text-blue-600">${e.totalProtein}g</p>
                </div>
                <div class="bg-amber-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-500 mb-1">Carbs</p>
                    <p class="text-2xl font-bold text-amber-600">${e.totalCarbs}g</p>
                </div>
                <div class="bg-purple-50 rounded-xl p-4 text-center">
                    <p class="text-xs text-gray-500 mb-1">Fat</p>
                    <p class="text-2xl font-bold text-purple-600">${e.totalFat}g</p>
                </div>
            </div>
            
            <!-- Logged Items -->
            <div class="border-t border-gray-200 pt-4">
                <h4 class="text-sm font-semibold text-gray-700 mb-3">Logged Items (${t.length})</h4>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                    ${t.map((a,r)=>{var o;return`
                        <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div class="flex items-center gap-3">
                                ${a.type==="meal"&&a.thumbnail?`<img src="${a.thumbnail}" alt="${a.name}" class="w-10 h-10 rounded-lg object-cover"/>`:`<div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                        <i class="fa-solid fa-${a.type==="product"?"box":"utensils"} text-emerald-600"></i>
                                    </div>`}
                                <div>
                                    <p class="font-medium text-gray-900 text-sm">${a.name}</p>
                                    <p class="text-xs text-gray-500">
                                        ${a.type==="meal"?`${a.servings} serving${a.servings!==1?"s":""}`:a.brand||a.serving||""}
                                        • ${((o=a.nutrition)==null?void 0:o.calories)||0} kcal
                                    </p>
                                </div>
                            </div>
                            <button class="remove-logged-item text-gray-400 hover:text-red-500 transition-all p-2" data-index="${r}">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    `}).join("")}
                </div>
                <button id="clear-todays-log" class="mt-3 w-full py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-all">
                    <i class="fa-solid fa-trash mr-2"></i>Clear Today's Log
                </button>
            </div>
        `}removeLoggedItem(e){var o,i,l,n;const t=g.getTodayString(),a=g.getState().dailyLog||{};if(!a[t]||!a[t].meals[e])return;const r=a[t].meals[e];a[t].totalCalories-=Math.round(((o=r.nutrition)==null?void 0:o.calories)||0),a[t].totalProtein-=Math.round(((i=r.nutrition)==null?void 0:i.protein)||0),a[t].totalCarbs-=Math.round(((l=r.nutrition)==null?void 0:l.carbs)||0),a[t].totalFat-=Math.round(((n=r.nutrition)==null?void 0:n.fat)||0),a[t].totalCalories=Math.max(0,a[t].totalCalories),a[t].totalProtein=Math.max(0,a[t].totalProtein),a[t].totalCarbs=Math.max(0,a[t].totalCarbs),a[t].totalFat=Math.max(0,a[t].totalFat),a[t].meals.splice(e,1),g.updateState({dailyLog:a},!0),this.showNotification("Item removed from log","info"),this.updateFoodLogPage()}clearTodayLog(){const e=g.getTodayString(),t=g.getState().dailyLog||{};t[e]={totalCalories:0,totalProtein:0,totalCarbs:0,totalFat:0,meals:[]},g.updateState({dailyLog:t},!0),this.showNotification("Today's log cleared","info"),this.updateFoodLogPage()}}document.addEventListener("DOMContentLoaded",()=>{window.nutriPlanApp=new Xe});window.addEventListener("load",function(){setTimeout(()=>{try{if(typeof Plotly<"u"){const s=document.getElementById("macro-chart"),e=document.getElementById("calorie-chart");s&&!s.data&&Ze()}}catch(s){console.error("Chart rendering error:",s)}},1e3)});function Ze(){try{var s=[{values:[42,18,28,6],labels:["Protein","Carbs","Fat","Fiber"],type:"pie",marker:{colors:["#10b981","#3b82f6","#8b5cf6","#f59e0b"]},textinfo:"label+percent",textposition:"inside",hovertemplate:"<b>%{label}</b><br>%{value}g<br>%{percent}<extra></extra>"}],e={title:{text:"",font:{size:0}},showlegend:!0,legend:{orientation:"h",y:-.1},margin:{t:20,r:20,b:60,l:20},plot_bgcolor:"#ffffff",paper_bgcolor:"#ffffff"},t={responsive:!0,displayModeBar:!1,displaylogo:!1};Plotly.newPlot("macro-chart",s,e,t);var a=[{x:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],y:[1850,1920,1780,2100,1950,2200,2050],type:"scatter",mode:"lines+markers",name:"Actual",line:{color:"#10b981",width:3},marker:{size:8,color:"#10b981"},hovertemplate:"<b>%{x}</b><br>%{y} calories<extra></extra>"},{x:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],y:[2e3,2e3,2e3,2e3,2e3,2e3,2e3],type:"scatter",mode:"lines",name:"Target",line:{color:"#ef4444",width:2,dash:"dash"},hovertemplate:"<b>Target</b><br>%{y} calories<extra></extra>"}],r={title:{text:"",font:{size:0}},xaxis:{title:"Day of Week"},yaxis:{title:"Calories"},margin:{t:20,r:20,b:60,l:60},plot_bgcolor:"#f9fafb",paper_bgcolor:"#ffffff",showlegend:!0,legend:{orientation:"h",y:-.2}},o={responsive:!0,displayModeBar:!1,displaylogo:!1};Plotly.newPlot("calorie-chart",a,r,o)}catch(i){console.error("Initial chart rendering error:",i)}}
