import type {
  AiChangeSetView,
  AnalyticsSummary,
  ManagerRestaurantView,
  MenuCategoryView,
  MenuItemView,
  MenuVersionView,
  RestaurantMenuView,
  RestaurantThemeView,
} from "@/types/menu";
import { getDemoDishImageUrl } from "@/lib/demo-dish-images";

export const DEMO_RESTAURANT_ID = "demo-restaurant";
export const DEMO_MENU_ID = "demo-menu";
export const DEMO_DRAFT_VERSION_ID = "demo-menu-v2";
export const DEMO_PUBLISHED_VERSION_ID = "demo-menu-v1";
export const DEMO_USER_ID = "demo-user";

type SeedAllergen = [
  code: string,
  name: string,
  status: MenuItemView["allergens"][number]["status"],
  note?: string,
  verificationStatus?: MenuItemView["allergens"][number]["verificationStatus"],
];

type SeedTag = [
  code: string,
  name: string,
  safetySensitive?: boolean,
  verificationStatus?: MenuItemView["dietaryTags"][number]["verificationStatus"],
];

type SeedPairing = [pairedItemName: string, reason: string, priority?: number];

type SeedItem = {
  name: string;
  slug: string;
  description: string;
  ingredients: string[];
  origin: string;
  tasteProfile: string;
  preparation: string;
  spiceLevel?: number;
  explanation: string;
  priceCents: number;
  isPromoted?: boolean;
  isAvailable?: boolean;
  allergens: SeedAllergen[];
  tags: SeedTag[];
  pairings?: SeedPairing[];
  ctaPrompts?: string[];
};

type SeedCategory = {
  name: string;
  items: SeedItem[];
};

type SeedRestaurant = {
  id: string;
  menuId: string;
  versionId: string;
  name: string;
  slug: string;
  cuisine: string;
  city: string;
  description: string;
  defaultLocale: string;
  heroImageUrl: string;
  legalNotice: string;
  theme: RestaurantThemeView;
  categories: SeedCategory[];
};

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=82`;

export function dishImagePath(restaurantSlug: string, itemSlug: string) {
  return `/demo-dishes/${restaurantSlug}/${itemSlug}.webp`;
}

const bavarianTheme: RestaurantThemeView = {
  accent: "#2f6f4e",
  accentDark: "#173d2c",
  accentSoft: "#e5f3ea",
  secondary: "#d99a27",
  secondarySoft: "#fff2d2",
  ink: "#18231c",
  paper: "#fbf8ef",
  muted: "#667267",
};

const asianTheme: RestaurantThemeView = {
  accent: "#d8322a",
  accentDark: "#741915",
  accentSoft: "#ffe8df",
  secondary: "#0f8f88",
  secondarySoft: "#def7f3",
  ink: "#241313",
  paper: "#fff7f0",
  muted: "#77615c",
};

const vietnameseTheme: RestaurantThemeView = {
  accent: "#16815f",
  accentDark: "#0c4f3e",
  accentSoft: "#ddf6ec",
  secondary: "#e3512f",
  secondarySoft: "#ffe5d9",
  ink: "#12352c",
  paper: "#f8fff8",
  muted: "#60736b",
};

const indianTheme: RestaurantThemeView = {
  accent: "#c5531b",
  accentDark: "#74300f",
  accentSoft: "#ffe6d3",
  secondary: "#7047a8",
  secondarySoft: "#eee6ff",
  ink: "#2b1910",
  paper: "#fff8ed",
  muted: "#766357",
};

const itemLocales = ["en", "es", "de", "it", "fr", "ru", "ja", "ko", "zh-CN"] as const;
type DemoLocale = (typeof itemLocales)[number];

const ingredientPhrases: Partial<Record<string, Partial<Record<DemoLocale, string>>>> = {
  "pork knuckle": { es: "codillo de cerdo", de: "Schweinshaxe", it: "stinco di maiale", fr: "jarret de porc", ru: "свиная рулька", ja: "豚すね肉", ko: "돼지 족발", "zh-CN": "猪肘" },
  "potato dumpling": { es: "albóndiga de patata", de: "Kartoffelknödel", it: "canederlo di patate", fr: "quenelle de pomme de terre", ru: "картофельный кнедлик", ja: "じゃがいも団子", ko: "감자 덤플링", "zh-CN": "土豆团子" },
  "red cabbage": { es: "col lombarda", de: "Rotkohl", it: "cavolo rosso", fr: "chou rouge", ru: "красная капуста", ja: "赤キャベツ", ko: "적양배추", "zh-CN": "红甘蓝" },
  "dark beer gravy": { es: "salsa de cerveza negra", de: "Dunkelbiersauce", it: "salsa alla birra scura", fr: "sauce à la bière brune", ru: "соус на темном пиве", ja: "黒ビールソース", ko: "흑맥주 그레이비", "zh-CN": "黑啤肉汁" },
  "egg noodles": { es: "fideos de huevo", de: "Eiernudeln", it: "pasta all'uovo", fr: "nouilles aux œufs", ru: "яичная лапша", ja: "卵麺", ko: "달걀면", "zh-CN": "鸡蛋面" },
  "mountain cheese": { es: "queso de montaña", de: "Bergkäse", it: "formaggio di montagna", fr: "fromage de montagne", ru: "горный сыр", ja: "山のチーズ", ko: "산악 치즈", "zh-CN": "山地奶酪" },
  "rice noodles": { es: "fideos de arroz", de: "Reisnudeln", it: "noodles di riso", fr: "nouilles de riz", ru: "рисовая лапша", ja: "米麺", ko: "쌀국수", "zh-CN": "米粉" },
  "fish sauce": { es: "salsa de pescado", de: "Fischsauce", it: "salsa di pesce", fr: "sauce de poisson", ru: "рыбный соус", ja: "魚醤", ko: "피시 소스", "zh-CN": "鱼露" },
  "coconut milk": { es: "leche de coco", de: "Kokosmilch", it: "latte di cocco", fr: "lait de coco", ru: "кокосовое молоко", ja: "ココナッツミルク", ko: "코코넛 밀크", "zh-CN": "椰奶" },
  "basmati rice": { es: "arroz basmati", de: "Basmatireis", it: "riso basmati", fr: "riz basmati", ru: "рис басмати", ja: "バスマティライス", ko: "바스마티 쌀", "zh-CN": "巴斯马蒂米" },
  "wheat flour": { es: "harina de trigo", de: "Weizenmehl", it: "farina di grano", fr: "farine de blé", ru: "пшеничная мука", ja: "小麦粉", ko: "밀가루", "zh-CN": "小麦粉" },
  "black tea": { es: "té negro", de: "Schwarztee", it: "tè nero", fr: "thé noir", ru: "черный чай", ja: "紅茶", ko: "홍차", "zh-CN": "红茶" },
};

Object.assign(ingredientPhrases, {
  "apricot schnapps": { es: "licor de albaricoque", de: "Marillenschnaps", it: "schnaps all'albicocca", fr: "eau-de-vie d'abricot", ru: "абрикосовый шнапс", ja: "アプリコットシュナップス", ko: "살구 슈냅스", "zh-CN": "杏子烈酒" },
  "banana blossom": { es: "flor de plátano", de: "Bananenblüte", it: "fiore di banana", fr: "fleur de bananier", ru: "цветок банана", ja: "バナナの花", ko: "바나나 꽃", "zh-CN": "香蕉花" },
  "barley malt": { es: "malta de cebada", de: "Gerstenmalz", it: "malto d'orzo", fr: "malt d'orge", ru: "ячменный солод", ja: "大麦麦芽", ko: "보리 맥아", "zh-CN": "大麦麦芽" },
  "bean sprouts": { es: "brotes de soja", de: "Sojasprossen", it: "germogli di soia", fr: "pousses de soja", ru: "ростки сои", ja: "もやし", ko: "숙주나물", "zh-CN": "豆芽" },
  "beef broth": { es: "caldo de ternera", de: "Rinderbrühe", it: "brodo di manzo", fr: "bouillon de bœuf", ru: "говяжий бульон", ja: "牛だし", ko: "소고기 육수", "zh-CN": "牛肉汤" },
  "bell pepper": { es: "pimiento", de: "Paprika", it: "peperone", fr: "poivron", ru: "сладкий перец", ja: "パプリカ", ko: "파프리카", "zh-CN": "甜椒" },
  "black beans": { es: "frijoles negros", de: "schwarze Bohnen", it: "fagioli neri", fr: "haricots noirs", ru: "черная фасоль", ja: "黒豆", ko: "검은콩", "zh-CN": "黑豆" },
  "black cod": { es: "bacalao negro", de: "Schwarzer Kabeljau", it: "merluzzo nero", fr: "morue noire", ru: "черная треска", ja: "銀だら", ko: "은대구", "zh-CN": "黑鳕鱼" },
  "black salt": { es: "sal negra", de: "Schwarzsalz", it: "sale nero", fr: "sel noir", ru: "черная соль", ja: "ブラックソルト", ko: "블랙 솔트", "zh-CN": "黑盐" },
  "black sesame": { es: "sésamo negro", de: "schwarzer Sesam", it: "sesamo nero", fr: "sésame noir", ru: "черный кунжут", ja: "黒ごま", ko: "검은깨", "zh-CN": "黑芝麻" },
  "black vinegar": { es: "vinagre negro", de: "Schwarzer Essig", it: "aceto nero", fr: "vinaigre noir", ru: "черный уксус", ja: "黒酢", ko: "흑식초", "zh-CN": "黑醋" },
  "bread crouton": { es: "picatoste", de: "Brotcrouton", it: "crostino di pane", fr: "croûton", ru: "сухарик", ja: "クルトン", ko: "크루통", "zh-CN": "面包丁" },
  "bread dumpling": { es: "albóndiga de pan", de: "Semmelknödel", it: "canederlo di pane", fr: "quenelle de pain", ru: "хлебный кнедлик", ja: "パン団子", ko: "빵 덤플링", "zh-CN": "面包团子" },
  "broken rice": { es: "arroz partido", de: "Bruchreis", it: "riso spezzato", fr: "riz brisé", ru: "дробленый рис", ja: "砕き米", ko: "깨진 쌀", "zh-CN": "碎米" },
  "chicken broth": { es: "caldo de pollo", de: "Hühnerbrühe", it: "brodo di pollo", fr: "bouillon de poulet", ru: "куриный бульон", ja: "鶏だし", ko: "닭 육수", "zh-CN": "鸡汤" },
  "chicken thigh": { es: "muslo de pollo", de: "Hähnchenschenkel", it: "coscia di pollo", fr: "cuisse de poulet", ru: "куриное бедро", ja: "鶏もも肉", ko: "닭다리살", "zh-CN": "鸡腿肉" },
  "chili oil": { es: "aceite de chile", de: "Chiliöl", it: "olio al peperoncino", fr: "huile pimentée", ru: "масло чили", ja: "ラー油", ko: "고추기름", "zh-CN": "辣椒油" },
  "coconut caramel": { es: "caramelo de coco", de: "Kokoskaramell", it: "caramello al cocco", fr: "caramel de coco", ru: "кокосовая карамель", ja: "ココナッツキャラメル", ko: "코코넛 캐러멜", "zh-CN": "椰子焦糖" },
  "coconut chutney": { es: "chutney de coco", de: "Kokos-Chutney", it: "chutney al cocco", fr: "chutney de coco", ru: "кокосовый чатни", ja: "ココナッツチャツネ", ko: "코코넛 처트니", "zh-CN": "椰子酸辣酱" },
  "coconut water": { es: "agua de coco", de: "Kokoswasser", it: "acqua di cocco", fr: "eau de coco", ru: "кокосовая вода", ja: "ココナッツウォーター", ko: "코코넛 워터", "zh-CN": "椰子水" },
  "condensed milk": { es: "leche condensada", de: "Kondensmilch", it: "latte condensato", fr: "lait concentré", ru: "сгущенное молоко", ja: "練乳", ko: "연유", "zh-CN": "炼乳" },
  "curry leaves": { es: "hojas de curry", de: "Curryblätter", it: "foglie di curry", fr: "feuilles de curry", ru: "листья карри", ja: "カレーリーフ", ko: "커리 잎", "zh-CN": "咖喱叶" },
  "dark beer gravy": { es: "salsa de cerveza negra", de: "Dunkelbiersauce", it: "salsa alla birra scura", fr: "sauce à la bière brune", ru: "соус на темном пиве", ja: "黒ビールソース", ko: "흑맥주 소스", "zh-CN": "黑啤肉汁" },
  "five spice": { es: "cinco especias", de: "Fünf-Gewürze-Mischung", it: "cinque spezie", fr: "cinq-épices", ru: "смесь пяти специй", ja: "五香粉", ko: "오향분", "zh-CN": "五香粉" },
  "forest mushrooms": { es: "setas del bosque", de: "Waldpilze", it: "funghi di bosco", fr: "champignons forestiers", ru: "лесные грибы", ja: "森のきのこ", ko: "야생 버섯", "zh-CN": "森林蘑菇" },
  "fried onion": { es: "cebolla frita", de: "Röstzwiebel", it: "cipolla fritta", fr: "oignon frit", ru: "жареный лук", ja: "フライドオニオン", ko: "튀긴 양파", "zh-CN": "炸洋葱" },
  "glutinous rice": { es: "arroz glutinoso", de: "Klebreis", it: "riso glutinoso", fr: "riz gluant", ru: "клейкий рис", ja: "もち米", ko: "찹쌀", "zh-CN": "糯米" },
  "gram flour": { es: "harina de garbanzo", de: "Kichererbsenmehl", it: "farina di ceci", fr: "farine de pois chiche", ru: "нутовая мука", ja: "ひよこ豆粉", ko: "병아리콩가루", "zh-CN": "鹰嘴豆粉" },
  "green curry paste": { es: "pasta de curry verde", de: "grüne Currypaste", it: "pasta di curry verde", fr: "pâte de curry vert", ru: "зеленая паста карри", ja: "グリーンカレーペースト", ko: "그린 커리 페이스트", "zh-CN": "绿咖喱酱" },
  "green papaya": { es: "papaya verde", de: "grüne Papaya", it: "papaya verde", fr: "papaye verte", ru: "зеленая папайя", ja: "青パパイヤ", ko: "그린 파파야", "zh-CN": "青木瓜" },
  "helles lager": { es: "cerveza helles", de: "Helles", it: "lager chiara", fr: "lager blonde", ru: "светлый лагер", ja: "ヘレスラガー", ko: "헬레스 라거", "zh-CN": "浅色拉格啤酒" },
  "herbal soda": { es: "refresco de hierbas", de: "Kräutersoda", it: "soda alle erbe", fr: "soda aux herbes", ru: "травяная газировка", ja: "ハーブソーダ", ko: "허브 소다", "zh-CN": "草本苏打" },
  "Kashmiri chili": { es: "chile de Cachemira", de: "Kaschmir-Chili", it: "peperoncino del Kashmir", fr: "piment du Cachemire", ru: "кашмирский чили", ja: "カシミール唐辛子", ko: "카슈미르 고추", "zh-CN": "克什米尔辣椒" },
  "laksa paste": { es: "pasta laksa", de: "Laksa-Paste", it: "pasta laksa", fr: "pâte laksa", ru: "паста лакса", ja: "ラクサペースト", ko: "락사 페이스트", "zh-CN": "叻沙酱" },
  "lemon butter": { es: "mantequilla de limón", de: "Zitronenbutter", it: "burro al limone", fr: "beurre citronné", ru: "лимонное масло", ja: "レモンバター", ko: "레몬 버터", "zh-CN": "柠檬黄油" },
  "lemon soda": { es: "refresco de limón", de: "Zitronensoda", it: "soda al limone", fr: "soda citron", ru: "лимонная газировка", ja: "レモンソーダ", ko: "레몬 소다", "zh-CN": "柠檬苏打" },
  "lime leaf": { es: "hoja de lima", de: "Limettenblatt", it: "foglia di lime", fr: "feuille de citron vert", ru: "лист лайма", ja: "ライムリーフ", ko: "라임 잎", "zh-CN": "青柠叶" },
  "liver dumpling": { es: "albóndiga de hígado", de: "Leberknödel", it: "canederlo di fegato", fr: "quenelle de foie", ru: "печеночный кнедлик", ja: "レバー団子", ko: "간 덤플링", "zh-CN": "肝丸子" },
  "lotus root": { es: "raíz de loto", de: "Lotuswurzel", it: "radice di loto", fr: "racine de lotus", ru: "корень лотоса", ja: "レンコン", ko: "연근", "zh-CN": "莲藕" },
  "milk solids": { es: "sólidos lácteos", de: "Milchbestandteile", it: "solidi del latte", fr: "solides du lait", ru: "молочные сухие вещества", ja: "乳固形分", ko: "유고형분", "zh-CN": "乳固体" },
  "mint chutney": { es: "chutney de menta", de: "Minz-Chutney", it: "chutney alla menta", fr: "chutney à la menthe", ru: "мятный чатни", ja: "ミントチャツネ", ko: "민트 처트니", "zh-CN": "薄荷酸辣酱" },
  "mountain cheese": { es: "queso de montaña", de: "Bergkäse", it: "formaggio di montagna", fr: "fromage de montagne", ru: "горный сыр", ja: "山のチーズ", ko: "산악 치즈", "zh-CN": "山地奶酪" },
  "mung beans": { es: "judías mungo", de: "Mungbohnen", it: "fagioli mung", fr: "haricots mungo", ru: "маш", ja: "緑豆", ko: "녹두", "zh-CN": "绿豆" },
  "mushroom broth": { es: "caldo de setas", de: "Pilzbrühe", it: "brodo di funghi", fr: "bouillon de champignons", ru: "грибной бульон", ja: "きのこだし", ko: "버섯 육수", "zh-CN": "蘑菇汤" },
  "mustard seed": { es: "semilla de mostaza", de: "Senfkorn", it: "seme di senape", fr: "graine de moutarde", ru: "зерна горчицы", ja: "マスタードシード", ko: "겨자씨", "zh-CN": "芥菜籽" },
  "oolong tea": { es: "té oolong", de: "Oolong-Tee", it: "tè oolong", fr: "thé oolong", ru: "чай улун", ja: "烏龍茶", ko: "우롱차", "zh-CN": "乌龙茶" },
  "pancake batter": { es: "masa de crepe", de: "Pfannkuchenteig", it: "pastella per pancake", fr: "pâte à crêpe", ru: "тесто для блинов", ja: "パンケーキ生地", ko: "팬케이크 반죽", "zh-CN": "煎饼面糊" },
  "parsley potatoes": { es: "patatas con perejil", de: "Petersilienkartoffeln", it: "patate al prezzemolo", fr: "pommes de terre au persil", ru: "картофель с петрушкой", ja: "パセリポテト", ko: "파슬리 감자", "zh-CN": "欧芹土豆" },
  "peanut dip": { es: "dip de cacahuete", de: "Erdnussdip", it: "dip di arachidi", fr: "sauce arachide", ru: "арахисовый дип", ja: "ピーナッツディップ", ko: "땅콩 딥", "zh-CN": "花生蘸酱" },
  "peanut sauce": { es: "salsa de cacahuete", de: "Erdnusssauce", it: "salsa di arachidi", fr: "sauce arachide", ru: "арахисовый соус", ja: "ピーナッツソース", ko: "땅콩 소스", "zh-CN": "花生酱汁" },
  "pickled carrot": { es: "zanahoria encurtida", de: "eingelegte Karotte", it: "carota sottaceto", fr: "carotte marinée", ru: "маринованная морковь", ja: "人参の漬物", ko: "절인 당근", "zh-CN": "腌胡萝卜" },
  "plum compote": { es: "compota de ciruela", de: "Zwetschgenröster", it: "composta di prugne", fr: "compote de prune", ru: "сливовый компот", ja: "プラムコンポート", ko: "자두 콤포트", "zh-CN": "李子果酱" },
  "pork chashu": { es: "chashu de cerdo", de: "Schweine-Chashu", it: "chashu di maiale", fr: "chashu de porc", ru: "свиной чашу", ja: "豚チャーシュー", ko: "돼지 차슈", "zh-CN": "猪肉叉烧" },
  "pork chop": { es: "chuleta de cerdo", de: "Schweinekotelett", it: "braciola di maiale", fr: "côte de porc", ru: "свиная отбивная", ja: "ポークチョップ", ko: "돼지갈비", "zh-CN": "猪排" },
  "pork patties": { es: "hamburguesas de cerdo", de: "Schweinefrikadellen", it: "polpette di maiale", fr: "galettes de porc", ru: "свиные котлеты", ja: "豚肉パティ", ko: "돼지고기 패티", "zh-CN": "猪肉饼" },
  "pork sausages": { es: "salchichas de cerdo", de: "Schweinswürstl", it: "salsicce di maiale", fr: "saucisses de porc", ru: "свиные колбаски", ja: "豚ソーセージ", ko: "돼지고기 소시지", "zh-CN": "猪肉香肠" },
  "potato starch": { es: "almidón de patata", de: "Kartoffelstärke", it: "fecola di patate", fr: "fécule de pomme de terre", ru: "картофельный крахмал", ja: "片栗粉", ko: "감자 전분", "zh-CN": "土豆淀粉" },
  "prawn mousse": { es: "mousse de gamba", de: "Garnelenmousse", it: "mousse di gambero", fr: "mousse de crevette", ru: "креветочный мусс", ja: "海老ムース", ko: "새우 무스", "zh-CN": "虾慕斯" },
  "pumpkin seed oil": { es: "aceite de semilla de calabaza", de: "Kürbiskernöl", it: "olio di semi di zucca", fr: "huile de pépins de courge", ru: "масло тыквенных семечек", ja: "パンプキンシードオイル", ko: "호박씨유", "zh-CN": "南瓜籽油" },
  "rare beef": { es: "ternera poco hecha", de: "rosa Rindfleisch", it: "manzo al sangue", fr: "bœuf saignant", ru: "говядина слабой прожарки", ja: "レアビーフ", ko: "레어 소고기", "zh-CN": "半熟牛肉" },
  "red beans": { es: "judías rojas", de: "rote Bohnen", it: "fagioli rossi", fr: "haricots rouges", ru: "красная фасоль", ja: "小豆", ko: "팥", "zh-CN": "红豆" },
  "rice batter": { es: "masa de arroz", de: "Reisteig", it: "pastella di riso", fr: "pâte de riz", ru: "рисовое тесто", ja: "米粉生地", ko: "쌀 반죽", "zh-CN": "米浆" },
  "rice flakes": { es: "copos de arroz", de: "Reisflocken", it: "fiocchi di riso", fr: "flocons de riz", ru: "рисовые хлопья", ja: "ライスフレーク", ko: "쌀 플레이크", "zh-CN": "米片" },
  "rice paper": { es: "papel de arroz", de: "Reispapier", it: "carta di riso", fr: "galette de riz", ru: "рисовая бумага", ja: "ライスペーパー", ko: "라이스페이퍼", "zh-CN": "米纸" },
  "rice vinegar": { es: "vinagre de arroz", de: "Reisessig", it: "aceto di riso", fr: "vinaigre de riz", ru: "рисовый уксус", ja: "米酢", ko: "쌀식초", "zh-CN": "米醋" },
  "robusta coffee": { es: "café robusta", de: "Robusta-Kaffee", it: "caffè robusta", fr: "café robusta", ru: "кофе робуста", ja: "ロブスタコーヒー", ko: "로부스타 커피", "zh-CN": "罗布斯塔咖啡" },
  "root vegetables": { es: "hortalizas de raíz", de: "Wurzelgemüse", it: "ortaggi a radice", fr: "légumes racines", ru: "корнеплоды", ja: "根菜", ko: "뿌리채소", "zh-CN": "根茎蔬菜" },
  "rose syrup": { es: "sirope de rosa", de: "Rosensirup", it: "sciroppo di rosa", fr: "sirop de rose", ru: "розовый сироп", ja: "ローズシロップ", ko: "장미 시럽", "zh-CN": "玫瑰糖浆" },
  "rye bread": { es: "pan de centeno", de: "Roggenbrot", it: "pane di segale", fr: "pain de seigle", ru: "ржаной хлеб", ja: "ライ麦パン", ko: "호밀빵", "zh-CN": "黑麦面包" },
  "Sichuan pepper": { es: "pimienta de Sichuan", de: "Szechuanpfeffer", it: "pepe di Sichuan", fr: "poivre de Sichuan", ru: "сычуаньский перец", ja: "四川花椒", ko: "쓰촨 후추", "zh-CN": "花椒" },
  "smoked ham": { es: "jamón ahumado", de: "Rauchschinken", it: "prosciutto affumicato", fr: "jambon fumé", ru: "копченая ветчина", ja: "スモークハム", ko: "훈제 햄", "zh-CN": "烟熏火腿" },
  "soy sauce": { es: "salsa de soja", de: "Sojasauce", it: "salsa di soia", fr: "sauce soja", ru: "соевый соус", ja: "醤油", ko: "간장", "zh-CN": "酱油" },
  "soy tare": { es: "tare de soja", de: "Soja-Tare", it: "tare di soia", fr: "tare au soja", ru: "соевый таре", ja: "醤油だれ", ko: "간장 타레", "zh-CN": "酱油调味汁" },
  "sparkling water": { es: "agua con gas", de: "Sprudelwasser", it: "acqua frizzante", fr: "eau pétillante", ru: "газированная вода", ja: "炭酸水", ko: "탄산수", "zh-CN": "气泡水" },
  "star anise": { es: "anís estrellado", de: "Sternanis", it: "anice stellato", fr: "anis étoilé", ru: "бадьян", ja: "八角", ko: "팔각", "zh-CN": "八角" },
  "sticky rice": { es: "arroz pegajoso", de: "Klebreis", it: "riso glutinoso", fr: "riz gluant", ru: "клейкий рис", ja: "もち米", ko: "찹쌀밥", "zh-CN": "糯米饭" },
  "strudel pastry": { es: "masa de strudel", de: "Strudelteig", it: "pasta strudel", fr: "pâte à strudel", ru: "тесто для штруделя", ja: "シュトゥルーデル生地", ko: "슈트루델 반죽", "zh-CN": "苹果卷酥皮" },
  "sweet chili": { es: "chile dulce", de: "Sweet-Chili", it: "chili dolce", fr: "piment doux", ru: "сладкий чили", ja: "スイートチリ", ko: "스위트 칠리", "zh-CN": "甜辣椒酱" },
  "Thai basil": { es: "albahaca tailandesa", de: "Thai-Basilikum", it: "basilico thai", fr: "basilic thaï", ru: "тайский базилик", ja: "タイバジル", ko: "타이 바질", "zh-CN": "泰国罗勒" },
  "toasted rice": { es: "arroz tostado", de: "gerösteter Reis", it: "riso tostato", fr: "riz grillé", ru: "обжаренный рис", ja: "炒り米", ko: "볶은 쌀", "zh-CN": "炒米" },
  "tofu puffs": { es: "tofu frito esponjoso", de: "Tofu-Puffs", it: "tofu soffiato", fr: "tofu frit soufflé", ru: "тофу-пуфы", ja: "厚揚げ", ko: "두부튀김", "zh-CN": "油豆腐" },
  "vanilla sauce": { es: "salsa de vainilla", de: "Vanillesauce", it: "salsa alla vaniglia", fr: "crème anglaise", ru: "ванильный соус", ja: "バニラソース", ko: "바닐라 소스", "zh-CN": "香草酱" },
  "wheat batter": { es: "masa de trigo", de: "Weizenteig", it: "pastella di grano", fr: "pâte de blé", ru: "пшеничное тесто", ja: "小麦の衣", ko: "밀 반죽", "zh-CN": "小麦面糊" },
  "wheat malt": { es: "malta de trigo", de: "Weizenmalz", it: "malto di frumento", fr: "malt de blé", ru: "пшеничный солод", ja: "小麦麦芽", ko: "밀 맥아", "zh-CN": "小麦麦芽" },
  "wheat noodles": { es: "fideos de trigo", de: "Weizennudeln", it: "noodles di frumento", fr: "nouilles de blé", ru: "пшеничная лапша", ja: "小麦麺", ko: "밀면", "zh-CN": "小麦面" },
  "white asparagus": { es: "espárrago blanco", de: "weißer Spargel", it: "asparago bianco", fr: "asperge blanche", ru: "белая спаржа", ja: "ホワイトアスパラガス", ko: "화이트 아스파라거스", "zh-CN": "白芦笋" },
  "white fish": { es: "pescado blanco", de: "weißer Fisch", it: "pesce bianco", fr: "poisson blanc", ru: "белая рыба", ja: "白身魚", ko: "흰살생선", "zh-CN": "白鱼" },
  "whole wheat flour": { es: "harina integral", de: "Vollkornmehl", it: "farina integrale", fr: "farine complète", ru: "цельнозерновая мука", ja: "全粒粉", ko: "통밀가루", "zh-CN": "全麦面粉" },
} satisfies Partial<Record<string, Partial<Record<DemoLocale, string>>>>);

const ingredientWords: Record<string, Partial<Record<DemoLocale, string>>> = {
  pork: { es: "cerdo", de: "Schwein", it: "maiale", fr: "porc", ru: "свинина", ja: "豚肉", ko: "돼지고기", "zh-CN": "猪肉" },
  beef: { es: "ternera", de: "Rind", it: "manzo", fr: "bœuf", ru: "говядина", ja: "牛肉", ko: "소고기", "zh-CN": "牛肉" },
  chicken: { es: "pollo", de: "Hähnchen", it: "pollo", fr: "poulet", ru: "курица", ja: "鶏肉", ko: "닭고기", "zh-CN": "鸡肉" },
  fish: { es: "pescado", de: "Fisch", it: "pesce", fr: "poisson", ru: "рыба", ja: "魚", ko: "생선", "zh-CN": "鱼" },
  prawn: { es: "gamba", de: "Garnele", it: "gambero", fr: "crevette", ru: "креветка", ja: "海老", ko: "새우", "zh-CN": "虾" },
  prawns: { es: "gambas", de: "Garnelen", it: "gamberi", fr: "crevettes", ru: "креветки", ja: "海老", ko: "새우", "zh-CN": "虾" },
  rice: { es: "arroz", de: "Reis", it: "riso", fr: "riz", ru: "рис", ja: "米", ko: "쌀", "zh-CN": "米" },
  noodles: { es: "fideos", de: "Nudeln", it: "noodles", fr: "nouilles", ru: "лапша", ja: "麺", ko: "면", "zh-CN": "面" },
  milk: { es: "leche", de: "Milch", it: "latte", fr: "lait", ru: "молоко", ja: "乳", ko: "우유", "zh-CN": "牛奶" },
  cheese: { es: "queso", de: "Käse", it: "formaggio", fr: "fromage", ru: "сыр", ja: "チーズ", ko: "치즈", "zh-CN": "奶酪" },
  butter: { es: "mantequilla", de: "Butter", it: "burro", fr: "beurre", ru: "масло", ja: "バター", ko: "버터", "zh-CN": "黄油" },
  egg: { es: "huevo", de: "Ei", it: "uovo", fr: "œuf", ru: "яйцо", ja: "卵", ko: "달걀", "zh-CN": "鸡蛋" },
  tofu: { es: "tofu", de: "Tofu", it: "tofu", fr: "tofu", ru: "тофу", ja: "豆腐", ko: "두부", "zh-CN": "豆腐" },
  toast: { es: "pan tostado", de: "Toast", it: "toast", fr: "pain toasté", ru: "тост", ja: "トースト", ko: "토스트", "zh-CN": "吐司" },
  mushroom: { es: "seta", de: "Pilz", it: "fungo", fr: "champignon", ru: "гриб", ja: "きのこ", ko: "버섯", "zh-CN": "蘑菇" },
  mushrooms: { es: "setas", de: "Pilze", it: "funghi", fr: "champignons", ru: "грибы", ja: "きのこ", ko: "버섯", "zh-CN": "蘑菇" },
  tomato: { es: "tomate", de: "Tomate", it: "pomodoro", fr: "tomate", ru: "помидор", ja: "トマト", ko: "토마토", "zh-CN": "番茄" },
  onion: { es: "cebolla", de: "Zwiebel", it: "cipolla", fr: "oignon", ru: "лук", ja: "玉ねぎ", ko: "양파", "zh-CN": "洋葱" },
  onions: { es: "cebollas", de: "Zwiebeln", it: "cipolle", fr: "oignons", ru: "лук", ja: "玉ねぎ", ko: "양파", "zh-CN": "洋葱" },
  garlic: { es: "ajo", de: "Knoblauch", it: "aglio", fr: "ail", ru: "чеснок", ja: "にんにく", ko: "마늘", "zh-CN": "大蒜" },
  ginger: { es: "jengibre", de: "Ingwer", it: "zenzero", fr: "gingembre", ru: "имбирь", ja: "生姜", ko: "생강", "zh-CN": "姜" },
  chili: { es: "chile", de: "Chili", it: "peperoncino", fr: "piment", ru: "чили", ja: "唐辛子", ko: "고추", "zh-CN": "辣椒" },
  coconut: { es: "coco", de: "Kokos", it: "cocco", fr: "coco", ru: "кокос", ja: "ココナッツ", ko: "코코넛", "zh-CN": "椰子" },
  lemon: { es: "limón", de: "Zitrone", it: "limone", fr: "citron", ru: "лимон", ja: "レモン", ko: "레몬", "zh-CN": "柠檬" },
  lime: { es: "lima", de: "Limette", it: "lime", fr: "citron vert", ru: "лайм", ja: "ライム", ko: "라임", "zh-CN": "青柠" },
  mango: { es: "mango", de: "Mango", it: "mango", fr: "mangue", ru: "манго", ja: "マンゴー", ko: "망고", "zh-CN": "芒果" },
  apple: { es: "manzana", de: "Apfel", it: "mela", fr: "pomme", ru: "яблоко", ja: "りんご", ko: "사과", "zh-CN": "苹果" },
  apples: { es: "manzanas", de: "Äpfel", it: "mele", fr: "pommes", ru: "яблоки", ja: "りんご", ko: "사과", "zh-CN": "苹果" },
  sugar: { es: "azúcar", de: "Zucker", it: "zucchero", fr: "sucre", ru: "сахар", ja: "砂糖", ko: "설탕", "zh-CN": "糖" },
  cinnamon: { es: "canela", de: "Zimt", it: "cannella", fr: "cannelle", ru: "корица", ja: "シナモン", ko: "계피", "zh-CN": "肉桂" },
  cardamom: { es: "cardamomo", de: "Kardamom", it: "cardamomo", fr: "cardamome", ru: "кардамон", ja: "カルダモン", ko: "카다몬", "zh-CN": "豆蔻" },
  sesame: { es: "sésamo", de: "Sesam", it: "sesamo", fr: "sésame", ru: "кунжут", ja: "ごま", ko: "참깨", "zh-CN": "芝麻" },
  peanut: { es: "cacahuete", de: "Erdnuss", it: "arachide", fr: "arachide", ru: "арахис", ja: "ピーナッツ", ko: "땅콩", "zh-CN": "花生" },
  peanuts: { es: "cacahuetes", de: "Erdnüsse", it: "arachidi", fr: "arachides", ru: "арахис", ja: "ピーナッツ", ko: "땅콩", "zh-CN": "花生" },
  herbs: { es: "hierbas", de: "Kräuter", it: "erbe", fr: "herbes", ru: "травы", ja: "ハーブ", ko: "허브", "zh-CN": "香草" },
  basil: { es: "albahaca", de: "Basilikum", it: "basilico", fr: "basilic", ru: "базилик", ja: "バジル", ko: "바질", "zh-CN": "罗勒" },
  cilantro: { es: "cilantro", de: "Koriandergrün", it: "coriandolo", fr: "coriandre", ru: "кинза", ja: "パクチー", ko: "고수", "zh-CN": "香菜" },
  mint: { es: "menta", de: "Minze", it: "menta", fr: "menthe", ru: "мята", ja: "ミント", ko: "민트", "zh-CN": "薄荷" },
  flour: { es: "harina", de: "Mehl", it: "farina", fr: "farine", ru: "мука", ja: "粉", ko: "가루", "zh-CN": "面粉" },
  water: { es: "agua", de: "Wasser", it: "acqua", fr: "eau", ru: "вода", ja: "水", ko: "물", "zh-CN": "水" },
  yeast: { es: "levadura", de: "Hefe", it: "lievito", fr: "levure", ru: "дрожжи", ja: "酵母", ko: "효모", "zh-CN": "酵母" },
  chives: { es: "cebollino", de: "Schnittlauch", it: "erba cipollina", fr: "ciboulette", ru: "шнитт-лук", ja: "チャイブ", ko: "차이브", "zh-CN": "细香葱" },
  camembert: { es: "camembert", de: "Camembert", it: "camembert", fr: "camembert", ru: "камамбер", ja: "カマンベール", ko: "카망베르", "zh-CN": "卡芒贝尔" },
  paprika: { es: "pimentón", de: "Paprika", it: "paprika", fr: "paprika", ru: "паприка", ja: "パプリカ", ko: "파프리카", "zh-CN": "红椒粉" },
  pretzel: { es: "pretzel", de: "Brezn", it: "pretzel", fr: "bretzel", ru: "брецель", ja: "プレッツェル", ko: "프레첼", "zh-CN": "椒盐卷饼" },
  radishes: { es: "rábanos", de: "Radieschen", it: "ravanelli", fr: "radis", ru: "редис", ja: "ラディッシュ", ko: "래디시", "zh-CN": "小萝卜" },
  sauerkraut: { es: "chucrut", de: "Sauerkraut", it: "crauti", fr: "choucroute", ru: "квашеная капуста", ja: "ザワークラウト", ko: "사워크라우트", "zh-CN": "酸菜" },
  mustard: { es: "mostaza", de: "Senf", it: "senape", fr: "moutarde", ru: "горчица", ja: "マスタード", ko: "겨자", "zh-CN": "芥末" },
  trout: { es: "trucha", de: "Forelle", it: "trota", fr: "truite", ru: "форель", ja: "マス", ko: "송어", "zh-CN": "鳟鱼" },
  potatoes: { es: "patatas", de: "Kartoffeln", it: "patate", fr: "pommes de terre", ru: "картофель", ja: "じゃがいも", ko: "감자", "zh-CN": "土豆" },
  potato: { es: "patata", de: "Kartoffel", it: "patata", fr: "pomme de terre", ru: "картофель", ja: "じゃがいも", ko: "감자", "zh-CN": "土豆" },
  cream: { es: "nata", de: "Sahne", it: "panna", fr: "crème", ru: "сливки", ja: "クリーム", ko: "크림", "zh-CN": "奶油" },
  parsley: { es: "perejil", de: "Petersilie", it: "prezzemolo", fr: "persil", ru: "петрушка", ja: "パセリ", ko: "파슬리", "zh-CN": "欧芹" },
  beetroot: { es: "remolacha", de: "Rote Bete", it: "barbabietola", fr: "betterave", ru: "свекла", ja: "ビーツ", ko: "비트", "zh-CN": "甜菜根" },
  horseradish: { es: "rábano picante", de: "Meerrettich", it: "rafano", fr: "raifort", ru: "хрен", ja: "ホースラディッシュ", ko: "서양고추냉이", "zh-CN": "辣根" },
  walnuts: { es: "nueces", de: "Walnüsse", it: "noci", fr: "noix", ru: "грецкие орехи", ja: "くるみ", ko: "호두", "zh-CN": "核桃" },
  cucumber: { es: "pepino", de: "Gurke", it: "cetriolo", fr: "concombre", ru: "огурец", ja: "きゅうり", ko: "오이", "zh-CN": "黄瓜" },
  scallion: { es: "cebolleta", de: "Frühlingszwiebel", it: "cipollotto", fr: "oignon vert", ru: "зеленый лук", ja: "ねぎ", ko: "쪽파", "zh-CN": "葱" },
  kimchi: { es: "kimchi", de: "Kimchi", it: "kimchi", fr: "kimchi", ru: "кимчи", ja: "キムチ", ko: "김치", "zh-CN": "泡菜" },
  tamarind: { es: "tamarindo", de: "Tamarinde", it: "tamarindo", fr: "tamarin", ru: "тамаринд", ja: "タマリンド", ko: "타마린드", "zh-CN": "罗望子" },
  lemongrass: { es: "hierba limón", de: "Zitronengras", it: "citronella", fr: "citronnelle", ru: "лемонграсс", ja: "レモングラス", ko: "레몬그라스", "zh-CN": "香茅" },
  paneer: { es: "paneer", de: "Paneer", it: "paneer", fr: "paneer", ru: "панир", ja: "パニール", ko: "파니르", "zh-CN": "印度奶酪" },
  lentils: { es: "lentejas", de: "Linsen", it: "lenticchie", fr: "lentilles", ru: "чечевица", ja: "レンズ豆", ko: "렌틸콩", "zh-CN": "扁豆" },
  ajwain: { es: "ajwain", de: "Ajwain", it: "ajwain", fr: "ajwain", ru: "ажгон", ja: "アジョワン", ko: "아즈와인", "zh-CN": "阿魏籽" },
  almonds: { es: "almendras", de: "Mandeln", it: "mandorle", fr: "amandes", ru: "миндаль", ja: "アーモンド", ko: "아몬드", "zh-CN": "杏仁" },
  baguette: { es: "baguette", de: "Baguette", it: "baguette", fr: "baguette", ru: "багет", ja: "バゲット", ko: "바게트", "zh-CN": "法棍" },
  biscuit: { es: "galleta", de: "Biskuit", it: "biscotto", fr: "biscuit", ru: "бисквит", ja: "ビスケット", ko: "비스킷", "zh-CN": "饼干" },
  caramel: { es: "caramelo", de: "Karamell", it: "caramello", fr: "caramel", ru: "карамель", ja: "キャラメル", ko: "캐러멜", "zh-CN": "焦糖" },
  carrot: { es: "zanahoria", de: "Karotte", it: "carota", fr: "carotte", ru: "морковь", ja: "人参", ko: "당근", "zh-CN": "胡萝卜" },
  chickpeas: { es: "garbanzos", de: "Kichererbsen", it: "ceci", fr: "pois chiches", ru: "нут", ja: "ひよこ豆", ko: "병아리콩", "zh-CN": "鹰嘴豆" },
  clove: { es: "clavo", de: "Gewürznelke", it: "chiodo di garofano", fr: "clou de girofle", ru: "гвоздика", ja: "クローブ", ko: "정향", "zh-CN": "丁香" },
  coriander: { es: "cilantro", de: "Koriander", it: "coriandolo", fr: "coriandre", ru: "кориандр", ja: "コリアンダー", ko: "고수", "zh-CN": "香菜籽" },
  cumin: { es: "comino", de: "Kreuzkümmel", it: "cumino", fr: "cumin", ru: "кумин", ja: "クミン", ko: "커민", "zh-CN": "孜然" },
  daikon: { es: "daikon", de: "Daikon", it: "daikon", fr: "daïkon", ru: "дайкон", ja: "大根", ko: "무", "zh-CN": "白萝卜" },
  doubanjiang: { es: "doubanjiang", de: "Doubanjiang", it: "doubanjiang", fr: "doubanjiang", ru: "доубаньцзян", ja: "豆板醤", ko: "두반장", "zh-CN": "豆瓣酱" },
  eggplant: { es: "berenjena", de: "Aubergine", it: "melanzana", fr: "aubergine", ru: "баклажан", ja: "ナス", ko: "가지", "zh-CN": "茄子" },
  espresso: { es: "espresso", de: "Espresso", it: "espresso", fr: "espresso", ru: "эспрессо", ja: "エスプレッソ", ko: "에스프레소", "zh-CN": "浓缩咖啡" },
  fennel: { es: "hinojo", de: "Fenchel", it: "finocchio", fr: "fenouil", ru: "фенхель", ja: "フェンネル", ko: "펜넬", "zh-CN": "茴香" },
  fenugreek: { es: "fenogreco", de: "Bockshornklee", it: "fieno greco", fr: "fenugrec", ru: "пажитник", ja: "フェヌグリーク", ko: "호로파", "zh-CN": "葫芦巴" },
  gravy: { es: "salsa", de: "Bratensauce", it: "salsa gravy", fr: "jus de viande", ru: "подлива", ja: "グレービー", ko: "그레이비", "zh-CN": "肉汁" },
  gochugaru: { es: "gochugaru", de: "Gochugaru", it: "gochugaru", fr: "gochugaru", ru: "кочукару", ja: "コチュガル", ko: "고춧가루", "zh-CN": "韩式辣椒粉" },
  gochujang: { es: "gochujang", de: "Gochujang", it: "gochujang", fr: "gochujang", ru: "кочуджан", ja: "コチュジャン", ko: "고추장", "zh-CN": "韩式辣酱" },
  hoisin: { es: "hoisin", de: "Hoisin", it: "hoisin", fr: "hoisin", ru: "хойсин", ja: "海鮮醤", ko: "해선장", "zh-CN": "海鲜酱" },
  hops: { es: "lúpulo", de: "Hopfen", it: "luppolo", fr: "houblon", ru: "хмель", ja: "ホップ", ko: "홉", "zh-CN": "啤酒花" },
  ice: { es: "hielo", de: "Eis", it: "ghiaccio", fr: "glace", ru: "лед", ja: "氷", ko: "얼음", "zh-CN": "冰" },
  lamb: { es: "cordero", de: "Lamm", it: "agnello", fr: "agneau", ru: "баранина", ja: "ラム", ko: "양고기", "zh-CN": "羊肉" },
  matcha: { es: "matcha", de: "Matcha", it: "matcha", fr: "matcha", ru: "матча", ja: "抹茶", ko: "말차", "zh-CN": "抹茶" },
  mayo: { es: "mayonesa", de: "Mayo", it: "maionese", fr: "mayo", ru: "майонез", ja: "マヨネーズ", ko: "마요네즈", "zh-CN": "蛋黄酱" },
  marjoram: { es: "mejorana", de: "Majoran", it: "maggiorana", fr: "marjolaine", ru: "майоран", ja: "マジョラム", ko: "마조람", "zh-CN": "马郁兰" },
  mirin: { es: "mirin", de: "Mirin", it: "mirin", fr: "mirin", ru: "мирин", ja: "みりん", ko: "미림", "zh-CN": "味醂" },
  miso: { es: "miso", de: "Miso", it: "miso", fr: "miso", ru: "мисо", ja: "味噌", ko: "미소", "zh-CN": "味噌" },
  papdi: { es: "papdi", de: "Papdi", it: "papdi", fr: "papdi", ru: "папди", ja: "パプディ", ko: "파프디", "zh-CN": "印度脆饼" },
  pandan: { es: "pandán", de: "Pandan", it: "pandan", fr: "pandan", ru: "пандан", ja: "パンダン", ko: "판단", "zh-CN": "香兰" },
  pepper: { es: "pimienta", de: "Pfeffer", it: "pepe", fr: "poivre", ru: "перец", ja: "胡椒", ko: "후추", "zh-CN": "胡椒" },
  pickles: { es: "encurtidos", de: "Pickles", it: "sottaceti", fr: "pickles", ru: "пиклз", ja: "ピクルス", ko: "피클", "zh-CN": "腌菜" },
  pistachio: { es: "pistacho", de: "Pistazie", it: "pistacchio", fr: "pistache", ru: "фисташка", ja: "ピスタチオ", ko: "피스타치오", "zh-CN": "开心果" },
  pâté: { es: "paté", de: "Pastete", it: "paté", fr: "pâté", ru: "паштет", ja: "パテ", ko: "파테", "zh-CN": "肉酱" },
  raita: { es: "raita", de: "Raita", it: "raita", fr: "raita", ru: "райта", ja: "ライタ", ko: "라이타", "zh-CN": "酸奶蘸酱" },
  raisins: { es: "pasas", de: "Rosinen", it: "uvetta", fr: "raisins secs", ru: "изюм", ja: "レーズン", ko: "건포도", "zh-CN": "葡萄干" },
  rose: { es: "rosa", de: "Rose", it: "rosa", fr: "rose", ru: "роза", ja: "ローズ", ko: "장미", "zh-CN": "玫瑰" },
  saffron: { es: "azafrán", de: "Safran", it: "zafferano", fr: "safran", ru: "шафран", ja: "サフラン", ko: "사프란", "zh-CN": "藏红花" },
  salt: { es: "sal", de: "Salz", it: "sale", fr: "sel", ru: "соль", ja: "塩", ko: "소금", "zh-CN": "盐" },
  sambar: { es: "sambar", de: "Sambar", it: "sambar", fr: "sambar", ru: "самбар", ja: "サンバル", ko: "삼바르", "zh-CN": "桑巴尔汤" },
  sev: { es: "sev", de: "Sev", it: "sev", fr: "sev", ru: "сев", ja: "セブ", ko: "세브", "zh-CN": "印度脆面" },
  shallot: { es: "chalota", de: "Schalotte", it: "scalogno", fr: "échalote", ru: "шалот", ja: "エシャロット", ko: "샬롯", "zh-CN": "红葱头" },
  soda: { es: "soda", de: "Soda", it: "soda", fr: "soda", ru: "газировка", ja: "ソーダ", ko: "소다", "zh-CN": "苏打水" },
  soy: { es: "soja", de: "Soja", it: "soia", fr: "soja", ru: "соя", ja: "醤油", ko: "간장", "zh-CN": "酱油" },
  spices: { es: "especias", de: "Gewürze", it: "spezie", fr: "épices", ru: "специи", ja: "スパイス", ko: "향신료", "zh-CN": "香料" },
  spinach: { es: "espinaca", de: "Spinat", it: "spinaci", fr: "épinards", ru: "шпинат", ja: "ほうれん草", ko: "시금치", "zh-CN": "菠菜" },
  turmeric: { es: "cúrcuma", de: "Kurkuma", it: "curcuma", fr: "curcuma", ru: "куркума", ja: "ターメリック", ko: "강황", "zh-CN": "姜黄" },
  whisky: { es: "whisky", de: "Whisky", it: "whisky", fr: "whisky", ru: "виски", ja: "ウイスキー", ko: "위스키", "zh-CN": "威士忌" },
  yogurt: { es: "yogur", de: "Joghurt", it: "yogurt", fr: "yaourt", ru: "йогурт", ja: "ヨーグルト", ko: "요거트", "zh-CN": "酸奶" },
  yuzu: { es: "yuzu", de: "Yuzu", it: "yuzu", fr: "yuzu", ru: "юдзу", ja: "柚子", ko: "유자", "zh-CN": "柚子" },
};

function localizeIngredient(ingredient: string, locale: DemoLocale) {
  if (locale === "en") return ingredient;
  const exact = ingredientPhrases[ingredient]?.[locale];
  if (exact) return exact;
  const words = ingredient.split(" ");
  const translated = words.map((word) => ingredientWords[word]?.[locale] ?? word);
  return translated.join(locale === "ja" || locale === "ko" || locale === "zh-CN" ? "" : " ");
}

function localizedList(items: string[], locale: DemoLocale) {
  const joiner =
    locale === "ja" ? "、" : locale === "ko" ? ", " : locale === "zh-CN" ? "、" : ", ";
  return items.map((ingredient) => localizeIngredient(ingredient, locale)).join(joiner);
}

const textReplacements: Record<Exclude<DemoLocale, "en">, Record<string, string>> = {
  es: {
    "crispy roasted": "asado crujiente",
    "pan-fried": "a la sartén",
    "slow-roasted": "asado lentamente",
    "with": "con",
    "and": "y",
    "served with": "servido con",
    "grilled": "a la parrilla",
    "fried": "frito",
    "steamed": "al vapor",
    "simmered": "cocido a fuego lento",
    "baked": "horneado",
    "fresh": "fresco",
    "sweet": "dulce",
    "sour": "ácido",
    "spicy": "picante",
    "smoky": "ahumado",
    "creamy": "cremoso",
    "buttery": "mantecoso",
    "crisp": "crujiente",
    "tender": "tierno",
    "rich": "intenso",
    "light": "ligero",
    "savory": "sabroso",
    "aromatic": "aromático",
    "comforting": "reconfortante",
    "restaurant breads": "panes de restaurante",
    "street stalls": "puestos callejeros",
    "beer gardens": "jardines cerveceros",
  },
  de: {
    "crispy roasted": "knusprig gebratene",
    "pan-fried": "in der Pfanne gebratene",
    "slow-roasted": "langsam gebraten",
    "with": "mit",
    "and": "und",
    "served with": "serviert mit",
    "grilled": "gegrillt",
    "fried": "gebraten",
    "steamed": "gedämpft",
    "simmered": "sanft gekocht",
    "baked": "gebacken",
    "fresh": "frisch",
    "sweet": "süß",
    "sour": "säuerlich",
    "spicy": "scharf",
    "smoky": "rauchig",
    "creamy": "cremig",
    "buttery": "buttrig",
    "crisp": "knusprig",
    "tender": "zart",
    "rich": "kräftig",
    "light": "leicht",
    "savory": "herzhaft",
    "aromatic": "aromatisch",
    "comforting": "wohltuend",
    "restaurant breads": "Restaurantbrote",
    "street stalls": "Straßenstände",
    "beer gardens": "Biergärten",
  },
  it: {
    "crispy roasted": "arrosto croccante",
    "pan-fried": "saltato in padella",
    "slow-roasted": "arrostito lentamente",
    "with": "con",
    "and": "e",
    "served with": "servito con",
    "grilled": "grigliato",
    "fried": "fritto",
    "steamed": "al vapore",
    "simmered": "cotto lentamente",
    "baked": "al forno",
    "fresh": "fresco",
    "sweet": "dolce",
    "sour": "acidulo",
    "spicy": "piccante",
    "smoky": "affumicato",
    "creamy": "cremoso",
    "buttery": "burroso",
    "crisp": "croccante",
    "tender": "tenero",
    "rich": "ricco",
    "light": "leggero",
    "savory": "sapido",
    "aromatic": "aromatico",
    "comforting": "confortante",
    "restaurant breads": "pani da ristorante",
    "street stalls": "bancarelle di strada",
    "beer gardens": "biergarten",
  },
  fr: {
    "crispy roasted": "rôti croustillant",
    "pan-fried": "poêlé",
    "slow-roasted": "rôti lentement",
    "with": "avec",
    "and": "et",
    "served with": "servi avec",
    "grilled": "grillé",
    "fried": "frit",
    "steamed": "cuit à la vapeur",
    "simmered": "mijoté",
    "baked": "cuit au four",
    "fresh": "frais",
    "sweet": "doux",
    "sour": "acidulé",
    "spicy": "épicé",
    "smoky": "fumé",
    "creamy": "crémeux",
    "buttery": "beurré",
    "crisp": "croustillant",
    "tender": "tendre",
    "rich": "riche",
    "light": "léger",
    "savory": "savoureux",
    "aromatic": "aromatique",
    "comforting": "réconfortant",
    "restaurant breads": "pains de restaurant",
    "street stalls": "stands de rue",
    "beer gardens": "biergartens",
  },
  ru: {
    "crispy roasted": "хрустящая запеченная",
    "pan-fried": "обжаренный на сковороде",
    "slow-roasted": "медленно запеченный",
    "with": "с",
    "and": "и",
    "served with": "подается с",
    "grilled": "на гриле",
    "fried": "жареный",
    "steamed": "на пару",
    "simmered": "томленый",
    "baked": "запеченный",
    "fresh": "свежий",
    "sweet": "сладкий",
    "sour": "кислый",
    "spicy": "острый",
    "smoky": "дымный",
    "creamy": "сливочный",
    "buttery": "маслянистый",
    "crisp": "хрустящий",
    "tender": "нежный",
    "rich": "насыщенный",
    "light": "легкий",
    "savory": "пикантный",
    "aromatic": "ароматный",
    "comforting": "уютный",
    "restaurant breads": "ресторанные лепешки",
    "street stalls": "уличные лавки",
    "beer gardens": "пивные сады",
  },
  ja: {
    "crispy roasted": "香ばしくローストした",
    "pan-fried": "フライパンで焼いた",
    "slow-roasted": "じっくり焼いた",
    "with": "、",
    "and": "と",
    "served with": "添え",
    "grilled": "グリルした",
    "fried": "揚げた",
    "steamed": "蒸した",
    "simmered": "煮込んだ",
    "baked": "焼いた",
    "fresh": "爽やか",
    "sweet": "甘い",
    "sour": "酸味",
    "spicy": "辛い",
    "smoky": "燻製の香り",
    "creamy": "クリーミー",
    "buttery": "バターの風味",
    "crisp": "カリッとした",
    "tender": "やわらかい",
    "rich": "濃厚",
    "light": "軽い",
    "savory": "旨味のある",
    "aromatic": "香り高い",
    "comforting": "ほっとする",
    "restaurant breads": "レストランのパン",
    "street stalls": "屋台",
    "beer gardens": "ビアガーデン",
  },
  ko: {
    "crispy roasted": "바삭하게 구운",
    "pan-fried": "팬에 구운",
    "slow-roasted": "천천히 구운",
    "with": "와/과",
    "and": "그리고",
    "served with": "함께 제공",
    "grilled": "구운",
    "fried": "튀긴",
    "steamed": "찐",
    "simmered": "은근히 끓인",
    "baked": "구운",
    "fresh": "신선한",
    "sweet": "달콤한",
    "sour": "새콤한",
    "spicy": "매운",
    "smoky": "스모키한",
    "creamy": "크리미한",
    "buttery": "버터 풍미",
    "crisp": "바삭한",
    "tender": "부드러운",
    "rich": "진한",
    "light": "가벼운",
    "savory": "감칠맛 나는",
    "aromatic": "향긋한",
    "comforting": "편안한",
    "restaurant breads": "레스토랑 빵",
    "street stalls": "길거리 노점",
    "beer gardens": "비어가든",
  },
  "zh-CN": {
    "crispy roasted": "酥脆烤制的",
    "pan-fried": "煎制的",
    "slow-roasted": "慢烤的",
    "with": "配",
    "and": "和",
    "served with": "搭配",
    "grilled": "烤制",
    "fried": "油炸",
    "steamed": "蒸制",
    "simmered": "慢炖",
    "baked": "烘烤",
    "fresh": "清新",
    "sweet": "甜",
    "sour": "酸",
    "spicy": "辣",
    "smoky": "烟熏感",
    "creamy": "奶香顺滑",
    "buttery": "黄油香",
    "crisp": "酥脆",
    "tender": "嫩",
    "rich": "浓郁",
    "light": "清淡",
    "savory": "咸鲜",
    "aromatic": "香气浓",
    "comforting": "温暖舒服",
    "restaurant breads": "餐厅烤饼",
    "street stalls": "街头摊位",
    "beer gardens": "啤酒花园",
  },
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTextReplacements(locale: Exclude<DemoLocale, "en">) {
  const replacements: Record<string, string> = { ...textReplacements[locale] };

  for (const [source, localized] of Object.entries(ingredientPhrases)) {
    const value = localized?.[locale];
    if (value) replacements[source] = value;
  }

  for (const [source, localized] of Object.entries(ingredientWords)) {
    const value = localized[locale];
    if (value) replacements[source] = value;
  }

  return replacements;
}

export function translateText(text: string, locale: DemoLocale) {
  if (locale === "en") return text;

  let translated = text;
  const replacements = buildTextReplacements(locale);

  for (const [source, target] of Object.entries(replacements).sort(
    ([a], [b]) => b.length - a.length,
  )) {
    translated = translated.replace(new RegExp(escapeRegExp(source), "gi"), target);
  }

  return translated;
}

const localeTemplates: Record<DemoLocale, {
  description: (name: string, ingredients: string) => string;
  origin: string;
  taste: string;
  preparation: string;
  explanation: (name: string) => string;
  prompts: (name: string) => string[];
}> = {
  en: {
    description: () => "",
    origin: "",
    taste: "",
    preparation: "",
    explanation: () => "",
    prompts: (name) => [
      `What does ${name} taste like?`,
      `Is ${name} a good first order?`,
      `What pairs with ${name}?`,
    ],
  },
  es: {
    description: (_name, ingredients) => `Preparado con ${ingredients}.`,
    origin: "Un plato ligado a la tradición culinaria de esta cocina.",
    taste: "Sabroso, equilibrado y expresivo, con una textura fácil de entender.",
    preparation: "Se prepara con técnica cuidadosa para concentrar aroma, textura y sabor.",
    explanation: (name) => `${name} es una buena forma de entender el estilo de esta cocina antes de elegir otros platos.`,
    prompts: (name) => [`¿Qué sabor tiene ${name}?`, `¿${name} es buena primera elección?`, `¿Qué combina con ${name}?`],
  },
  de: {
    description: (_name, ingredients) => `Mit ${ingredients}.`,
    origin: "Ein Gericht aus der kulinarischen Tradition dieser Küche.",
    taste: "Würzig, ausgewogen und ausdrucksstark, mit gut verständlicher Textur.",
    preparation: "Sorgfältig zubereitet, damit Aroma, Textur und Geschmack klar hervortreten.",
    explanation: (name) => `${name} hilft, den Stil dieser Küche zu verstehen, bevor man weitere Gerichte auswählt.`,
    prompts: (name) => [`Wie schmeckt ${name}?`, `Ist ${name} eine gute erste Bestellung?`, `Was passt zu ${name}?`],
  },
  it: {
    description: (_name, ingredients) => `Preparato con ${ingredients}.`,
    origin: "Un piatto legato alla tradizione culinaria di questa cucina.",
    taste: "Sapido, equilibrato ed espressivo, con una consistenza facile da capire.",
    preparation: "Preparato con cura per mettere in risalto aroma, consistenza e sapore.",
    explanation: (name) => `${name} è un buon modo per capire lo stile di questa cucina prima di scegliere altro.`,
    prompts: (name) => [`Che sapore ha ${name}?`, `${name} è una buona prima scelta?`, `Cosa si abbina a ${name}?`],
  },
  fr: {
    description: (_name, ingredients) => `Préparé avec ${ingredients}.`,
    origin: "Un plat lié à la tradition culinaire de cette cuisine.",
    taste: "Savoureux, équilibré et expressif, avec une texture facile à comprendre.",
    preparation: "Préparé avec soin pour faire ressortir les arômes, la texture et le goût.",
    explanation: (name) => `${name} est une bonne façon de comprendre le style de cette cuisine avant de choisir d'autres plats.`,
    prompts: (name) => [`Quel goût a ${name} ?`, `${name} est-il un bon premier choix ?`, `Quel accord avec ${name} ?`],
  },
  ru: {
    description: (_name, ingredients) => `Приготовлено с: ${ingredients}.`,
    origin: "Блюдо связано с кулинарной традицией этой кухни.",
    taste: "Насыщенный, сбалансированный и выразительный вкус с понятной текстурой.",
    preparation: "Готовится тщательно, чтобы раскрыть аромат, текстуру и вкус.",
    explanation: (name) => `${name} помогает понять стиль этой кухни перед выбором других блюд.`,
    prompts: (name) => [`Какой вкус у ${name}?`, `${name} подойдет для первого заказа?`, `Что сочетается с ${name}?`],
  },
  ja: {
    description: (name, ingredients) => `${name}は${ingredients}を使った料理です。`,
    origin: "この料理は、このキッチンの食文化と結びついた一皿です。",
    taste: "味わいは豊かでバランスがよく、食感も分かりやすいです。",
    preparation: "香り、食感、味が伝わるよう丁寧に仕上げます。",
    explanation: (name) => `${name}は、この料理ジャンルの特徴を知る最初の一皿として選びやすい料理です。`,
    prompts: (name) => [`${name}はどんな味ですか？`, `${name}は初めての注文に向いていますか？`, `${name}には何が合いますか？`],
  },
  ko: {
    description: (name, ingredients) => `${name}는 ${ingredients}을(를) 사용한 메뉴입니다.`,
    origin: "이 메뉴는 이 요리의 전통과 연결된 한 접시입니다.",
    taste: "맛은 풍부하고 균형 있으며, 식감도 이해하기 쉽습니다.",
    preparation: "향, 식감, 맛이 잘 드러나도록 정성스럽게 준비합니다.",
    explanation: (name) => `${name}는 이 요리 스타일을 처음 이해하기 좋은 메뉴입니다.`,
    prompts: (name) => [`${name}는 어떤 맛인가요?`, `${name}는 첫 주문으로 좋나요?`, `${name}와 무엇이 잘 어울리나요?`],
  },
  "zh-CN": {
    description: (name, ingredients) => `${name}使用${ingredients}制作。`,
    origin: "这道菜与本菜系的饮食传统有关。",
    taste: "味道丰富、平衡且有层次，口感也容易理解。",
    preparation: "经过细致处理，让香气、口感和味道更清晰。",
    explanation: (name) => `${name}适合作为了解这种菜系风格的第一道菜。`,
    prompts: (name) => [`${name}是什么味道？`, `${name}适合第一次点吗？`, `${name}适合搭配什么？`],
  },
};

function localizedItemCopy(locale: DemoLocale, item: SeedItem) {
  const ingredients = item.ingredients.map((ingredient) => localizeIngredient(ingredient, locale));

  if (locale === "en") {
    return {
      name: item.name,
      description: item.description,
      ingredients,
      origin: item.origin,
      tasteProfile: item.tasteProfile,
      preparation: item.preparation,
      explanation: item.explanation,
      ctaPrompts:
        item.ctaPrompts ?? localeTemplates.en.prompts(item.name),
    };
  }

  const template = localeTemplates[locale];
  const ingredientText = localizedList(item.ingredients, locale);

  return {
    name: item.name,
    description: template.description(item.name, ingredientText),
    ingredients,
    origin: template.origin,
    tasteProfile: template.taste,
    preparation: template.preparation,
    explanation: template.explanation(item.name),
    ctaPrompts: template.prompts(item.name),
  };
}

const categoryTranslations: Record<string, Record<DemoLocale, string>> = {
  "Beer, Spritz & Pairing Plates": {
    en: "Beer, Spritz & Pairing Plates",
    es: "Cervezas, spritz y platos para compartir",
    de: "Bier, Spritz und Brotzeitplatten",
    it: "Birre, spritz e piatti da abbinare",
    fr: "Bières, spritz et assiettes d'accord",
    ru: "Пиво, шприцы и тарелки к напиткам",
    ja: "ビール、スプリッツ、相性プレート",
    ko: "맥주, 스프리츠와 페어링 플레이트",
    "zh-CN": "啤酒、气泡饮和搭配拼盘",
  },
  "Skewers, Sweets & Drinks": {
    en: "Skewers, Sweets & Drinks",
    es: "Brochetas, dulces y bebidas",
    de: "Spieße, Süßes und Drinks",
    it: "Spiedini, dolci e bevande",
    fr: "Brochettes, douceurs et boissons",
    ru: "Шашлычки, десерты и напитки",
    ja: "串、スイーツ、ドリンク",
    ko: "꼬치, 디저트와 음료",
    "zh-CN": "串烤、甜品和饮品",
  },
  "Coffee, Sweets & Side Bowls": {
    en: "Coffee, Sweets & Side Bowls",
    es: "Café, dulces y acompañamientos",
    de: "Kaffee, Süßes und Beilagenschalen",
    it: "Caffè, dolci e contorni",
    fr: "Café, desserts et bols d'accompagnement",
    ru: "Кофе, сладкое и гарниры",
    ja: "コーヒー、甘味、サイドボウル",
    ko: "커피, 디저트와 사이드 볼",
    "zh-CN": "咖啡、甜品和小配菜",
  },
  "Bread, Lassi & Sweet Finish": {
    en: "Bread, Lassi & Sweet Finish",
    es: "Panes, lassi y final dulce",
    de: "Brot, Lassi und süßer Abschluss",
    it: "Pane, lassi e finale dolce",
    fr: "Pains, lassi et finale sucrée",
    ru: "Хлеб, ласси и сладкое завершение",
    ja: "パン、ラッシー、甘い締め",
    ko: "빵, 라씨와 달콤한 마무리",
    "zh-CN": "烤饼、拉西和甜点",
  },
  "Beer Hall Classics": {
    en: "Beer Hall Classics",
    es: "Clásicos de cervecería",
    de: "Wirtshausklassiker",
    it: "Classici da birreria bavarese",
    fr: "Classiques de brasserie bavaroise",
    ru: "Классика пивного зала",
    ja: "ビアホールの定番",
    ko: "비어홀 클래식",
    "zh-CN": "啤酒馆经典",
  },
  "Fresh, Fish & Garden": {
    en: "Fresh, Fish & Garden",
    es: "Fresco, pescado y huerta",
    de: "Frisch, Fisch und Garten",
    it: "Fresco, pesce e orto",
    fr: "Frais, poisson et jardin",
    ru: "Свежие блюда, рыба и сад",
    ja: "フレッシュ、魚、ガーデン",
    ko: "신선한 생선과 가든 메뉴",
    "zh-CN": "清新、鱼类和田园菜",
  },
  "Soups, Sides & Sweet Finish": {
    en: "Soups, Sides & Sweet Finish",
    es: "Sopas, guarniciones y postres",
    de: "Suppen, Beilagen und süßer Abschluss",
    it: "Zuppe, contorni e dolci",
    fr: "Soupes, accompagnements et desserts",
    ru: "Супы, гарниры и десерты",
    ja: "スープ、サイド、甘い締め",
    ko: "수프, 사이드와 디저트",
    "zh-CN": "汤、小菜和甜点",
  },
  "Small Plates & Street Snacks": {
    en: "Small Plates & Street Snacks",
    es: "Platillos y snacks callejeros",
    de: "Kleine Teller und Streetfood-Snacks",
    it: "Piccoli piatti e street snack",
    fr: "Petites assiettes et snacks de rue",
    ru: "Малые блюда и уличные закуски",
    ja: "小皿と屋台スナック",
    ko: "작은 접시와 길거리 간식",
    "zh-CN": "小盘菜和街头小吃",
  },
  "Noodles, Rice & Bowls": {
    en: "Noodles, Rice & Bowls",
    es: "Fideos, arroz y bowls",
    de: "Nudeln, Reis und Bowls",
    it: "Noodles, riso e bowl",
    fr: "Nouilles, riz et bols",
    ru: "Лапша, рис и боулы",
    ja: "麺、ご飯、ボウル",
    ko: "면, 밥과 볼",
    "zh-CN": "面、米饭和碗餐",
  },
  "Grill, Curry & Wok": {
    en: "Grill, Curry & Wok",
    es: "Parrilla, curry y wok",
    de: "Grill, Curry und Wok",
    it: "Griglia, curry e wok",
    fr: "Grill, curry et wok",
    ru: "Гриль, карри и вок",
    ja: "グリル、カレー、 wok",
    ko: "그릴, 커리와 웍",
    "zh-CN": "烧烤、咖喱和炒锅",
  },
  "Fresh Rolls & Herbs": {
    en: "Fresh Rolls & Herbs",
    es: "Rollitos frescos y hierbas",
    de: "Frische Rollen und Kräuter",
    it: "Involtini freschi ed erbe",
    fr: "Rouleaux frais et herbes",
    ru: "Свежие роллы и травы",
    ja: "生春巻きとハーブ",
    ko: "신선한 롤과 허브",
    "zh-CN": "鲜卷和香草",
  },
  "Phở, Bún & Broths": {
    en: "Phở, Bún & Broths",
    es: "Phở, bún y caldos",
    de: "Phở, Bún und Brühen",
    it: "Phở, bún e brodi",
    fr: "Phở, bún et bouillons",
    ru: "Фо, бун и бульоны",
    ja: "フォー、ブン、スープ",
    ko: "퍼, 분과 육수",
    "zh-CN": "河粉、米粉和汤",
  },
  "Grill, Rice & Bánh Mì": {
    en: "Grill, Rice & Bánh Mì",
    es: "Parrilla, arroz y bánh mì",
    de: "Grill, Reis und Bánh Mì",
    it: "Griglia, riso e bánh mì",
    fr: "Grill, riz et bánh mì",
    ru: "Гриль, рис и бань ми",
    ja: "グリル、ご飯、バインミー",
    ko: "그릴, 밥과 반미",
    "zh-CN": "烧烤、米饭和越南法棍",
  },
  "Chaat, Tandoor & Starters": {
    en: "Chaat, Tandoor & Starters",
    es: "Chaat, tandoor y entrantes",
    de: "Chaat, Tandoor und Vorspeisen",
    it: "Chaat, tandoor e antipasti",
    fr: "Chaat, tandoor et entrées",
    ru: "Чаат, тандур и закуски",
    ja: "チャート、タンドール、前菜",
    ko: "차트, 탄두르와 스타터",
    "zh-CN": "印度小吃、坦杜尔和前菜",
  },
  "Curries & Regional Mains": {
    en: "Curries & Regional Mains",
    es: "Currys y platos regionales",
    de: "Currys und regionale Hauptgerichte",
    it: "Curry e piatti regionali",
    fr: "Currys et plats régionaux",
    ru: "Карри и региональные основные блюда",
    ja: "カレーと地域のメイン料理",
    ko: "커리와 지역 대표 요리",
    "zh-CN": "咖喱和地方主菜",
  },
  "Rice, Bread & Sweets": {
    en: "Rice, Bread & Sweets",
    es: "Arroz, panes y dulces",
    de: "Reis, Brot und Süßes",
    it: "Riso, pane e dolci",
    fr: "Riz, pains et douceurs",
    ru: "Рис, хлеб и сладости",
    ja: "ご飯、パン、スイーツ",
    ko: "밥, 빵과 디저트",
    "zh-CN": "米饭、烤饼和甜品",
  },
};

function localizedCategoryCopy(locale: DemoLocale, name: string) {
  return categoryTranslations[name]?.[locale] ?? name;
}

const restaurantTranslations: Record<
  string,
  Record<DemoLocale, { cuisine: string; description: string; legalNotice: string }>
> = {
  "demo-bavarian-wirtshaus": {
    en: {
      cuisine: "Bavarian beer hall",
      description:
        "A classic Munich table with rich roasts, dumplings, Alpine cheese, fish, garden plates, beer pairings, and clear explanations for international guests.",
      legalNotice:
        "Please ask staff about severe allergies. Recipes, gravies, and fryer use may change by batch.",
    },
    es: {
      cuisine: "Cervecería bávara",
      description:
        "Una mesa clásica de Múnich con asados, knödel, quesos alpinos, pescado, platos de huerta, maridajes de cerveza y explicaciones claras para visitantes internacionales.",
      legalNotice:
        "Para alergias severas, consulta al personal. Las recetas, salsas y freidoras pueden cambiar según el lote.",
    },
    de: {
      cuisine: "Bayerisches Wirtshaus",
      description:
        "Ein klassischer Münchner Tisch mit Braten, Knödeln, Alpenkäse, Fisch, Gartengerichten, Bierempfehlungen und klaren Erklärungen für internationale Gäste.",
      legalNotice:
        "Bei schweren Allergien bitte das Personal fragen. Rezepte, Saucen und Fritteusen können je nach Charge wechseln.",
    },
    it: {
      cuisine: "Birreria bavarese",
      description:
        "Una tavola classica di Monaco con arrosti, canederli, formaggi alpini, pesce, piatti dell'orto, abbinamenti con birra e spiegazioni chiare per ospiti internazionali.",
      legalNotice:
        "Per allergie gravi, chiedi allo staff. Ricette, salse e uso della friggitrice possono cambiare a seconda della preparazione.",
    },
    fr: {
      cuisine: "Brasserie bavaroise",
      description:
        "Une table munichoise classique avec rôtis, quenelles, fromages alpins, poissons, assiettes végétales, accords bière et explications claires pour les visiteurs internationaux.",
      legalNotice:
        "En cas d'allergie sévère, demandez au personnel. Les recettes, sauces et friteuses peuvent changer selon les préparations.",
    },
    ru: {
      cuisine: "Баварский пивной зал",
      description:
        "Классический мюнхенский стол с жарким, кнедликами, альпийским сыром, рыбой, овощными блюдами, пивными сочетаниями и понятными объяснениями для гостей.",
      legalNotice:
        "При тяжелой аллергии уточните у персонала. Рецепты, соусы и использование фритюра могут меняться от партии к партии.",
    },
    ja: {
      cuisine: "バイエルンのビアホール",
      description:
        "ロースト、クネーデル、アルプスのチーズ、魚、野菜料理、ビールの相性、海外ゲスト向けの分かりやすい説明をそろえたミュンヘンらしい食卓です。",
      legalNotice:
        "重いアレルギーがある場合はスタッフに確認してください。レシピ、ソース、揚げ油の使用は仕込みごとに変わることがあります。",
    },
    ko: {
      cuisine: "바이에른 비어홀",
      description:
        "풍부한 로스트, 덤플링, 알프스 치즈, 생선, 가든 플레이트, 맥주 페어링과 해외 손님을 위한 쉬운 설명이 있는 뮌헨식 식탁입니다.",
      legalNotice:
        "심한 알레르기가 있다면 직원에게 확인하세요. 레시피, 소스, 튀김기 사용은 준비 상황에 따라 달라질 수 있습니다.",
    },
    "zh-CN": {
      cuisine: "巴伐利亚啤酒馆",
      description:
        "经典慕尼黑餐桌：烤肉、土豆团子、阿尔卑斯奶酪、鱼类、田园菜、啤酒搭配，以及为国际客人准备的清晰说明。",
      legalNotice:
        "如有严重过敏，请咨询店员。配方、酱汁和油炸设备使用可能会随批次变化。",
    },
  },
  "demo-asian-night-market": {
    en: {
      cuisine: "Pan-Asian street food",
      description:
        "A colorful night-market menu crossing Thailand, Japan, Korea, China, and Singapore with clear spice, sauce, and allergen guidance.",
      legalNotice:
        "Soy, sesame, peanuts, shellfish, and gluten are common in this kitchen. Please ask staff before ordering with severe allergies.",
    },
    es: {
      cuisine: "Street food panasiática",
      description:
        "Un menú de mercado nocturno que cruza Tailandia, Japón, Corea, China y Singapur con orientación clara sobre picante, salsas y alérgenos.",
      legalNotice:
        "Soja, sésamo, cacahuetes, marisco y gluten son comunes en esta cocina. Consulta al personal si tienes alergias severas.",
    },
    de: {
      cuisine: "Panasiatisches Streetfood",
      description:
        "Ein farbiges Night-Market-Menü aus Thailand, Japan, Korea, China und Singapur mit klaren Hinweisen zu Schärfe, Saucen und Allergenen.",
      legalNotice:
        "Soja, Sesam, Erdnüsse, Schalentiere und Gluten sind in dieser Küche häufig. Bei schweren Allergien bitte vor der Bestellung fragen.",
    },
    it: {
      cuisine: "Street food panasiatico",
      description:
        "Un menu da mercato notturno che attraversa Thailandia, Giappone, Corea, Cina e Singapore con indicazioni chiare su spezie, salse e allergeni.",
      legalNotice:
        "Soia, sesamo, arachidi, crostacei e glutine sono comuni in questa cucina. Per allergie gravi chiedi allo staff prima di ordinare.",
    },
    fr: {
      cuisine: "Street food panasiatique",
      description:
        "Un menu coloré de marché nocturne entre Thaïlande, Japon, Corée, Chine et Singapour, avec repères clairs sur épices, sauces et allergènes.",
      legalNotice:
        "Soja, sésame, arachides, crustacés et gluten sont fréquents dans cette cuisine. En cas d'allergie sévère, demandez avant de commander.",
    },
    ru: {
      cuisine: "Паназиатская уличная еда",
      description:
        "Яркое меню ночного рынка с блюдами Таиланда, Японии, Кореи, Китая и Сингапура, с понятными пометками об остроте, соусах и аллергенах.",
      legalNotice:
        "Соевый соус, кунжут, арахис, морепродукты и глютен часто используются на этой кухне. При тяжелой аллергии спросите персонал перед заказом.",
    },
    ja: {
      cuisine: "パンアジアン屋台料理",
      description:
        "タイ、日本、韓国、中国、シンガポールを横断するカラフルなナイトマーケット風メニュー。辛さ、ソース、アレルゲンを分かりやすく示します。",
      legalNotice:
        "大豆、ごま、ピーナッツ、甲殻類、グルテンをよく使用します。重いアレルギーがある場合は注文前にスタッフへ確認してください。",
    },
    ko: {
      cuisine: "팬아시아 길거리 음식",
      description:
        "태국, 일본, 한국, 중국, 싱가포르를 넘나드는 컬러풀한 야시장 메뉴로, 맵기와 소스, 알레르겐 안내가 명확합니다.",
      legalNotice:
        "이 주방은 대두, 참깨, 땅콩, 갑각류, 글루텐을 자주 사용합니다. 심한 알레르기가 있다면 주문 전 직원에게 확인하세요.",
    },
    "zh-CN": {
      cuisine: "泛亚洲街头美食",
      description:
        "融合泰国、日本、韩国、中国和新加坡风味的缤纷夜市菜单，并清楚标注辣度、酱料和过敏原信息。",
      legalNotice:
        "本厨房常用大豆、芝麻、花生、甲壳类和麸质。如有严重过敏，请在点单前咨询店员。",
    },
  },
  "demo-vietnamese-house": {
    en: {
      cuisine: "Vietnamese house kitchen",
      description:
        "A fresh Vietnamese table with herbs, broths, grilled meats, rice noodles, bánh mì, iced coffee, and guidance for fish sauce and gluten questions.",
      legalNotice:
        "Fish sauce, peanuts, sesame, gluten, and shared prep surfaces may appear. Ask staff for severe allergy guidance.",
    },
    es: {
      cuisine: "Casa vietnamita",
      description:
        "Una mesa vietnamita fresca con hierbas, caldos, carnes a la parrilla, fideos de arroz, bánh mì, café helado y guía sobre salsa de pescado y gluten.",
      legalNotice:
        "Puede haber salsa de pescado, cacahuetes, sésamo, gluten y superficies compartidas. Consulta al personal en caso de alergias severas.",
    },
    de: {
      cuisine: "Vietnamesische Hausküche",
      description:
        "Ein frischer vietnamesischer Tisch mit Kräutern, Brühen, Grillfleisch, Reisnudeln, Bánh Mì, Eiskaffee und Hinweisen zu Fischsauce und Gluten.",
      legalNotice:
        "Fischsauce, Erdnüsse, Sesam, Gluten und gemeinsame Arbeitsflächen können vorkommen. Bei schweren Allergien bitte das Personal fragen.",
    },
    it: {
      cuisine: "Cucina vietnamita di casa",
      description:
        "Una tavola vietnamita fresca con erbe, brodi, carni grigliate, noodles di riso, bánh mì, caffè freddo e indicazioni su salsa di pesce e glutine.",
      legalNotice:
        "Possono essere presenti salsa di pesce, arachidi, sesamo, glutine e superfici condivise. Per allergie gravi chiedi allo staff.",
    },
    fr: {
      cuisine: "Cuisine vietnamienne maison",
      description:
        "Une table vietnamienne fraîche avec herbes, bouillons, grillades, nouilles de riz, bánh mì, café glacé et repères sur sauce de poisson et gluten.",
      legalNotice:
        "Sauce de poisson, arachides, sésame, gluten et surfaces partagées peuvent être présents. En cas d'allergie sévère, demandez au personnel.",
    },
    ru: {
      cuisine: "Вьетнамская домашняя кухня",
      description:
        "Свежий вьетнамский стол с травами, бульонами, мясом на гриле, рисовой лапшой, бань ми, холодным кофе и подсказками по рыбному соусу и глютену.",
      legalNotice:
        "Возможны рыбный соус, арахис, кунжут, глютен и общие рабочие поверхности. При тяжелой аллергии уточните у персонала.",
    },
    ja: {
      cuisine: "ベトナム家庭料理",
      description:
        "ハーブ、スープ、グリル肉、米麺、バインミー、アイスコーヒーを楽しめる爽やかなベトナムの食卓。魚醤やグルテンの質問にも分かりやすく対応します。",
      legalNotice:
        "魚醤、ピーナッツ、ごま、グルテン、共用調理面を使用する場合があります。重いアレルギーがある場合はスタッフに確認してください。",
    },
    ko: {
      cuisine: "베트남 가정식",
      description:
        "허브, 육수, 그릴 고기, 쌀국수, 반미, 아이스커피와 피시 소스 및 글루텐 안내가 있는 신선한 베트남식 식탁입니다.",
      legalNotice:
        "피시 소스, 땅콩, 참깨, 글루텐 및 공용 조리대가 사용될 수 있습니다. 심한 알레르기가 있다면 직원에게 확인하세요.",
    },
    "zh-CN": {
      cuisine: "越南家常厨房",
      description:
        "清新的越南餐桌：香草、汤底、烤肉、米粉、越南法棍、冰咖啡，并提供鱼露和麸质相关说明。",
      legalNotice:
        "可能使用鱼露、花生、芝麻、麸质和共用备餐台。如有严重过敏，请咨询店员。",
    },
  },
  "demo-indian-spice-room": {
    en: {
      cuisine: "Indian spice room",
      description:
        "A layered Indian menu with chaat, tandoor, regional curries, breads, rice, lassi, and clear spice guidance for guests who are still learning the cuisine.",
      legalNotice:
        "Dairy, tree nuts, gluten, mustard, and shared tandoor surfaces are common. Ask staff before ordering with severe allergies.",
    },
    es: {
      cuisine: "Sala de especias india",
      description:
        "Un menú indio con chaat, tandoor, currys regionales, panes, arroz, lassi y guía clara de picante para quienes aún descubren la cocina.",
      legalNotice:
        "Lácteos, frutos secos, gluten, mostaza y superficies compartidas de tandoor son comunes. Consulta al personal si tienes alergias severas.",
    },
    de: {
      cuisine: "Indische Gewürzküche",
      description:
        "Ein vielschichtiges indisches Menü mit Chaat, Tandoor, regionalen Currys, Brot, Reis, Lassi und klaren Schärfehinweisen für Gäste, die die Küche kennenlernen.",
      legalNotice:
        "Milchprodukte, Baumnüsse, Gluten, Senf und gemeinsame Tandoor-Flächen sind häufig. Bei schweren Allergien vor der Bestellung fragen.",
    },
    it: {
      cuisine: "Stanza delle spezie indiana",
      description:
        "Un menu indiano stratificato con chaat, tandoor, curry regionali, pani, riso, lassi e indicazioni chiare sul piccante per chi sta scoprendo la cucina.",
      legalNotice:
        "Latticini, frutta a guscio, glutine, senape e superfici tandoor condivise sono comuni. Per allergie gravi chiedi prima di ordinare.",
    },
    fr: {
      cuisine: "Cuisine indienne aux épices",
      description:
        "Un menu indien riche avec chaat, tandoor, currys régionaux, pains, riz, lassi et repères d'épices clairs pour les invités qui découvrent cette cuisine.",
      legalNotice:
        "Produits laitiers, fruits à coque, gluten, moutarde et surfaces de tandoor partagées sont fréquents. En cas d'allergie sévère, demandez avant de commander.",
    },
    ru: {
      cuisine: "Индийская комната специй",
      description:
        "Многослойное индийское меню с чаатом, тандуром, региональными карри, хлебом, рисом, ласси и понятными подсказками по остроте для новых гостей.",
      legalNotice:
        "Молочные продукты, орехи, глютен, горчица и общие поверхности тандура часто используются. При тяжелой аллергии спросите перед заказом.",
    },
    ja: {
      cuisine: "インドのスパイス料理",
      description:
        "チャート、タンドール、地域のカレー、パン、米、ラッシーをそろえ、インド料理に慣れていないゲストにも辛さが分かりやすいメニューです。",
      legalNotice:
        "乳製品、木の実、グルテン、マスタード、共用タンドール面をよく使用します。重いアレルギーがある場合は注文前に確認してください。",
    },
    ko: {
      cuisine: "인도 스파이스 룸",
      description:
        "차트, 탄두르, 지역 커리, 빵, 밥, 라씨와 명확한 맵기 안내가 있는 인도 메뉴로, 인도 요리를 알아가는 손님도 쉽게 고를 수 있습니다.",
      legalNotice:
        "유제품, 견과류, 글루텐, 겨자, 공용 탄두르 표면이 흔히 사용됩니다. 심한 알레르기가 있다면 주문 전 직원에게 확인하세요.",
    },
    "zh-CN": {
      cuisine: "印度香料厨房",
      description:
        "层次丰富的印度菜单：街头小吃、坦杜尔、地方咖喱、烤饼、米饭、拉西，并为刚接触印度菜的客人提供清楚辣度说明。",
      legalNotice:
        "本厨房常用乳制品、坚果、麸质、芥末和共用坦杜尔设备。如有严重过敏，请在点单前咨询店员。",
    },
  },
};

function localizedRestaurantCopy(seed: SeedRestaurant, locale: DemoLocale) {
  return (
    restaurantTranslations[seed.slug]?.[locale] ?? {
      cuisine: seed.cuisine,
      description: seed.description,
      legalNotice: seed.legalNotice,
    }
  );
}

function makeItem(
  prefix: string,
  restaurantSlug: string,
  item: SeedItem,
  sortOrder: number,
): MenuItemView {
  return {
    id: `${prefix}-${item.slug}`,
    name: item.name,
    slug: item.slug,
    description: item.description,
    ingredients: item.ingredients,
    origin: item.origin,
    tasteProfile: item.tasteProfile,
    preparation: item.preparation,
    spiceLevel: item.spiceLevel ?? 0,
    explanation: item.explanation,
    ctaPrompts:
      item.ctaPrompts ??
      [
        `What does ${item.name} taste like?`,
        `Is ${item.name} a good first order?`,
        `What pairs with ${item.name}?`,
      ],
    priceCents: item.priceCents,
    isAvailable: item.isAvailable ?? true,
    isPromoted: item.isPromoted ?? false,
    sortOrder,
    imageUrl: getDemoDishImageUrl(restaurantSlug, item.slug) ?? dishImagePath(restaurantSlug, item.slug),
    translations: itemLocales.map((locale) => ({
      id: `${prefix}-${item.slug}-${locale}`,
      locale,
      ...localizedItemCopy(locale, item),
    })),
    allergens: item.allergens.map(([code, name, status, note, verificationStatus]) => ({
      code,
      name,
      status,
      note: note ?? null,
      verificationStatus: verificationStatus ?? "VERIFIED",
    })),
    dietaryTags: item.tags.map(([code, name, safetySensitive, verificationStatus]) => ({
      code,
      name,
      safetySensitive: safetySensitive ?? false,
      verificationStatus: verificationStatus ?? "VERIFIED",
    })),
    pairings:
      item.pairings?.map(([pairedItemName, reason, priority], index) => ({
        id: `${prefix}-${item.slug}-pair-${index + 1}`,
        pairedItemName,
        reason,
        priority: priority ?? index + 1,
      })) ?? [],
  };
}

function makeCategories(
  prefix: string,
  restaurantSlug: string,
  categories: SeedCategory[],
): MenuCategoryView[] {
  return categories.map((category, categoryIndex) => ({
    id: `${prefix}-cat-${categoryIndex + 1}`,
    name: category.name,
    translations: itemLocales.map((locale) => ({
      locale,
      name: localizedCategoryCopy(locale, category.name),
    })),
    sortOrder: categoryIndex + 1,
    items: category.items.map((item, itemIndex) =>
      makeItem(prefix, restaurantSlug, item, itemIndex + 1),
    ),
  }));
}

function supplementalCategories(slug: string): SeedCategory[] {
  const sharedUnderTwenty: SeedTag[] = [["under-20", "Under €20"]];

  if (slug === "demo-bavarian-wirtshaus") {
    return [
      {
        name: "Beer, Spritz & Pairing Plates",
        items: [
          {
            name: "Munich Helles",
            slug: "munich-helles",
            description: "Golden lager with soft malt, gentle hops, and a clean finish.",
            ingredients: ["barley malt", "hops", "water", "yeast"],
            origin: "Munich lager breweries",
            tasteProfile: "Clean, malty, softly bitter, refreshing.",
            preparation: "Cold-fermented and served bright from the tap.",
            explanation: "The default Munich beer style; easy with roasts, sausage, and cheese.",
            priceCents: 520,
            allergens: [["gluten", "Gluten", "CONTAINS", "Barley malt."]],
            tags: [["best-with-beer", "Best with beer"], ...sharedUnderTwenty],
            pairings: [["Schweinshaxe", "Malt balances roast pork."]],
          },
          {
            name: "Weissbier",
            slug: "weissbier",
            description: "Cloudy wheat beer with banana, clove, and soft foam.",
            ingredients: ["wheat malt", "barley malt", "yeast", "hops"],
            origin: "Bavarian wheat beer tradition",
            tasteProfile: "Fruity, bready, gently spicy, creamy foam.",
            preparation: "Top-fermented and poured slowly to keep yeast character.",
            explanation: "A classic with pretzels, cheese spread, and lighter garden dishes.",
            priceCents: 590,
            allergens: [["gluten", "Gluten", "CONTAINS", "Wheat and barley malt."]],
            tags: [["best-with-beer", "Best with beer"], ...sharedUnderTwenty],
            pairings: [["Obatzda", "Creamy cheese spread loves wheat beer."]],
          },
          {
            name: "Almdudler Spritz",
            slug: "almdudler-spritz",
            description: "Herbal alpine soda spritz with lemon, mint, and sparkling water.",
            ingredients: ["herbal soda", "lemon", "mint", "sparkling water"],
            origin: "Austrian and Alpine soft-drink culture",
            tasteProfile: "Herbal, citrusy, sweet, sparkling.",
            preparation: "Built over ice and topped with fresh citrus.",
            explanation: "A non-alcoholic pairing for guests who want beer-garden freshness.",
            priceCents: 620,
            allergens: [],
            tags: [["light", "Light"], ["no-pork", "No pork", true], ...sharedUnderTwenty],
            pairings: [["Spargelsalat", "Herbal sweetness suits asparagus."]],
          },
          {
            name: "Brotzeit Board",
            slug: "brotzeit-board",
            description: "Pretzel, radishes, pickles, mountain cheese, smoked ham, and mustard.",
            ingredients: ["pretzel", "radishes", "pickles", "mountain cheese", "smoked ham", "mustard"],
            origin: "Bavarian cold supper tradition",
            tasteProfile: "Salty, crunchy, tangy, smoky, snackable.",
            preparation: "A cold board assembled for sharing with beer.",
            explanation: "Brotzeit means bread-time: a casual board built around beer and conversation.",
            priceCents: 1840,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["milk", "Milk", "CONTAINS"],
              ["mustard", "Mustard", "CONTAINS"],
            ],
            tags: [["traditional", "Traditional"], ["pork", "Contains pork", true], ...sharedUnderTwenty],
            pairings: [["Munich Helles", "Classic beer-table pairing."]],
          },
          {
            name: "Radler",
            slug: "radler",
            description: "Helles mixed with sparkling lemon soda for a lighter beer drink.",
            ingredients: ["helles lager", "lemon soda"],
            origin: "Bavarian cycling taverns",
            tasteProfile: "Citrusy, light, sweet, gently bitter.",
            preparation: "Mixed cold to order.",
            explanation: "A lower-alcohol beer option for guests who want something refreshing.",
            priceCents: 520,
            allergens: [["gluten", "Gluten", "CONTAINS", "Beer contains barley malt."]],
            tags: [["light", "Light"], ["best-with-beer", "Best with beer"], ...sharedUnderTwenty],
            pairings: [["Forelle Müllerin", "Lemon notes match trout."]],
          },
          {
            name: "Espresso & Schnapserl",
            slug: "espresso-schnapserl",
            description: "Small espresso with apricot schnapps served as a classic finish.",
            ingredients: ["espresso", "apricot schnapps"],
            origin: "Alpine after-dinner ritual",
            tasteProfile: "Bitter coffee, warm fruit spirit, short and bright.",
            preparation: "Served as two small pours after dessert.",
            explanation: "A compact way to end a heavy Bavarian meal.",
            priceCents: 760,
            allergens: [],
            tags: [["traditional", "Traditional"], ...sharedUnderTwenty],
            pairings: [["Kaiserschmarrn", "Fruit spirit cuts butter and sugar."]],
          },
        ],
      },
    ];
  }

  if (slug === "demo-asian-night-market") {
    return [
      {
        name: "Skewers, Sweets & Drinks",
        items: [
          {
            name: "Satay Chicken Skewers",
            slug: "satay-chicken-skewers",
            description: "Grilled chicken skewers with turmeric, peanut sauce, cucumber, and shallot.",
            ingredients: ["chicken", "turmeric", "peanut sauce", "cucumber", "shallot"],
            origin: "Indonesian and Malaysian street grills",
            tasteProfile: "Smoky, nutty, mildly sweet, aromatic turmeric.",
            preparation: "Skewers are marinated and grilled over high heat.",
            spiceLevel: 1,
            explanation: "A safe first order if you like grilled chicken and peanut sauce.",
            priceCents: 1280,
            allergens: [["peanuts", "Peanuts", "CONTAINS"], ["soy", "Soy", "MAY_CONTAIN", "Marinade varies.", "NEEDS_REVIEW"]],
            tags: [["no-pork", "No pork", true], ["street-food", "Street food"], ...sharedUnderTwenty],
            pairings: [["Lime soda", "Refreshes the peanut sauce."]],
          },
          {
            name: "Thai Mango Sticky Rice",
            slug: "thai-mango-sticky-rice",
            description: "Sweet coconut sticky rice with ripe mango, sesame, and salted coconut cream.",
            ingredients: ["sticky rice", "mango", "coconut", "sesame", "sugar"],
            origin: "Thailand",
            tasteProfile: "Sweet mango, creamy coconut, sticky rice, tiny salty edge.",
            preparation: "Rice is steamed and folded with coconut cream.",
            spiceLevel: 0,
            explanation: "A beloved Thai dessert; simple, fruity, and naturally rich.",
            priceCents: 890,
            allergens: [["sesame", "Sesame", "CONTAINS"]],
            tags: [["vegan", "Vegan", true], ...sharedUnderTwenty],
            pairings: [["Jasmine tea", "Keeps the dessert light."]],
          },
          {
            name: "Matcha Cheesecake",
            slug: "matcha-cheesecake",
            description: "Green tea cheesecake with black sesame crumble and yuzu cream.",
            ingredients: ["cream cheese", "matcha", "sesame", "yuzu", "biscuit"],
            origin: "Japanese cafe desserts",
            tasteProfile: "Creamy, earthy tea, nutty sesame, citrus brightness.",
            preparation: "Baked cheesecake finished with yuzu cream.",
            spiceLevel: 0,
            explanation: "Matcha adds a pleasantly bitter tea note that keeps the cake from feeling too sweet.",
            priceCents: 920,
            allergens: [["milk", "Milk", "CONTAINS"], ["gluten", "Gluten", "CONTAINS"], ["sesame", "Sesame", "CONTAINS"]],
            tags: [["vegetarian", "Vegetarian", true], ...sharedUnderTwenty],
            pairings: [["Hot hojicha", "Roasted tea suits the sesame crumble."]],
          },
          {
            name: "Yuzu Lemonade",
            slug: "yuzu-lemonade",
            description: "Sparkling yuzu lemonade with lime leaf and a salted rim.",
            ingredients: ["yuzu", "lemon", "lime leaf", "sparkling water", "salt"],
            origin: "Modern Japanese citrus drinks",
            tasteProfile: "Bright, tart, floral citrus, lightly salty.",
            preparation: "Shaken with citrus syrup and served over ice.",
            spiceLevel: 0,
            explanation: "Yuzu tastes like lemon, mandarin, and grapefruit all at once.",
            priceCents: 620,
            allergens: [],
            tags: [["vegan", "Vegan", true], ["light", "Light"], ...sharedUnderTwenty],
            pairings: [["Kimchi pancake", "Citrus cuts the fermented heat."]],
          },
          {
            name: "Oolong Highball",
            slug: "oolong-highball",
            description: "Cold oolong tea highball with whisky, lemon peel, and soda.",
            ingredients: ["oolong tea", "whisky", "soda", "lemon"],
            origin: "Japanese izakaya drinks",
            tasteProfile: "Roasted tea, dry whisky, citrus, very crisp.",
            preparation: "Built tall over ice with chilled tea and soda.",
            spiceLevel: 0,
            explanation: "A dry cocktail for guests who do not want sweetness.",
            priceCents: 990,
            allergens: [],
            tags: [["light", "Light"], ...sharedUnderTwenty],
            pairings: [["Char siu eggplant", "Roasted tea matches the glaze."]],
          },
          {
            name: "Sesame Mochi Trio",
            slug: "sesame-mochi-trio",
            description: "Soft mochi with black sesame, peanut, and coconut fillings.",
            ingredients: ["glutinous rice", "black sesame", "peanut", "coconut", "sugar"],
            origin: "East and Southeast Asian sweets",
            tasteProfile: "Chewy, nutty, sweet, soft coconut finish.",
            preparation: "Rice dough is filled and dusted for a tender chewy bite.",
            spiceLevel: 0,
            explanation: "Mochi is about texture: soft, chewy rice dough around a sweet center.",
            priceCents: 780,
            allergens: [["sesame", "Sesame", "CONTAINS"], ["peanuts", "Peanuts", "CONTAINS"]],
            tags: [["vegan", "Vegan", true], ...sharedUnderTwenty],
            pairings: [["Green tea", "Classic gentle finish."]],
          },
        ],
      },
    ];
  }

  if (slug === "demo-vietnamese-house") {
    return [
      {
        name: "Coffee, Sweets & Side Bowls",
        items: [
          {
            name: "Cà Phê Sữa Đá",
            slug: "ca-phe-sua-da",
            description: "Vietnamese iced coffee with robusta espresso and condensed milk.",
            ingredients: ["robusta coffee", "condensed milk", "ice"],
            origin: "Vietnamese coffee houses",
            tasteProfile: "Strong, chocolatey, sweet, creamy, chilled.",
            preparation: "Coffee drips slowly over condensed milk and is poured over ice.",
            explanation: "A bold coffee drink that can feel almost dessert-like.",
            priceCents: 590,
            allergens: [["milk", "Milk", "CONTAINS"]],
            tags: [["vegetarian", "Vegetarian", true], ...sharedUnderTwenty],
            pairings: [["Bánh mì đặc biệt", "Coffee and pâté is a classic street pairing."]],
          },
          {
            name: "Chè Ba Màu",
            slug: "che-ba-mau",
            description: "Three-color dessert with beans, pandan jelly, coconut milk, and ice.",
            ingredients: ["mung beans", "red beans", "pandan jelly", "coconut milk", "ice"],
            origin: "Southern Vietnamese dessert stalls",
            tasteProfile: "Sweet, creamy coconut, chewy jelly, soft beans.",
            preparation: "Layered cold and mixed before eating.",
            explanation: "Chè is a spoon dessert, somewhere between pudding, shaved ice, and sweet soup.",
            priceCents: 790,
            allergens: [],
            tags: [["vegan", "Vegan", true], ...sharedUnderTwenty],
            pairings: [["Green papaya salad", "Sweet finish after sour crunch."]],
          },
          {
            name: "Pandan Coconut Flan",
            slug: "pandan-coconut-flan",
            description: "Silky flan with pandan, coconut caramel, and toasted rice.",
            ingredients: ["egg", "coconut", "pandan", "caramel", "toasted rice"],
            origin: "Vietnamese-French dessert influence",
            tasteProfile: "Silky custard, grassy pandan, coconut, caramel.",
            preparation: "Custard is steamed gently and chilled.",
            explanation: "Pandan gives a vanilla-like green aroma common in Southeast Asian sweets.",
            priceCents: 820,
            allergens: [["egg", "Egg", "CONTAINS"]],
            tags: [["vegetarian", "Vegetarian", true], ...sharedUnderTwenty],
            pairings: [["Jasmine tea", "Cleans up the coconut caramel."]],
          },
          {
            name: "Pickled Lotus Root Side",
            slug: "pickled-lotus-root-side",
            description: "Crunchy lotus root and carrot pickles with herbs and sesame.",
            ingredients: ["lotus root", "carrot", "rice vinegar", "sesame", "herbs"],
            origin: "Vietnamese fresh side dishes",
            tasteProfile: "Crunchy, sweet-sour, nutty, refreshing.",
            preparation: "Thin lotus slices are quick-pickled and dressed cold.",
            explanation: "A bright side to reset your palate between grilled and saucy dishes.",
            priceCents: 620,
            allergens: [["sesame", "Sesame", "CONTAINS"]],
            tags: [["vegan", "Vegan", true], ["light", "Light"], ...sharedUnderTwenty],
            pairings: [["Bún chả Hà Nội", "Fresh crunch with smoky pork."]],
          },
          {
            name: "Coconut Lime Soda",
            slug: "coconut-lime-soda",
            description: "Sparkling coconut water with lime, mint, and a pinch of salt.",
            ingredients: ["coconut water", "lime", "mint", "sparkling water", "salt"],
            origin: "Modern Vietnamese cafe drinks",
            tasteProfile: "Fresh, mineral, citrus, lightly sweet.",
            preparation: "Built over ice with fresh lime.",
            explanation: "A cooling non-alcoholic match for chili, herbs, and fish sauce.",
            priceCents: 620,
            allergens: [],
            tags: [["vegan", "Vegan", true], ["light", "Light"], ...sharedUnderTwenty],
            pairings: [["Bún bò Huế", "Cools lemongrass chili."]],
          },
          {
            name: "Extra Herb Basket",
            slug: "extra-herb-basket",
            description: "Mint, Thai basil, cilantro, bean sprouts, lime, and sliced chili.",
            ingredients: ["mint", "Thai basil", "cilantro", "bean sprouts", "lime", "chili"],
            origin: "Vietnamese table service",
            tasteProfile: "Fresh, aromatic, citrusy, crunchy, optional heat.",
            preparation: "Washed and served cold as a build-your-own garnish set.",
            explanation: "Use this to customize phở and noodle bowls bite by bite.",
            priceCents: 390,
            allergens: [],
            tags: [["vegan", "Vegan", true], ["light", "Light"], ...sharedUnderTwenty],
            pairings: [["Phở bò tái", "Adds freshness and texture."]],
          },
        ],
      },
    ];
  }

  return [
    {
      name: "Bread, Lassi & Sweet Finish",
      items: [
        {
          name: "Peshwari Naan",
          slug: "peshwari-naan",
          description: "Tandoor naan filled with coconut, raisins, almonds, and cardamom.",
          ingredients: ["wheat flour", "coconut", "raisins", "almonds", "cardamom"],
          origin: "North Indian restaurant breads",
          tasteProfile: "Soft bread, sweet filling, nutty, fragrant cardamom.",
          preparation: "Stuffed dough is baked in the tandoor and brushed with ghee.",
          explanation: "A sweet bread that pairs best with spicy curries, not usually as dessert.",
          priceCents: 590,
          allergens: [["gluten", "Gluten", "CONTAINS"], ["tree-nuts", "Tree nuts", "CONTAINS"], ["milk", "Milk", "CONTAINS"]],
          tags: [["vegetarian", "Vegetarian", true], ...sharedUnderTwenty],
          pairings: [["Lamb Rogan Josh", "Sweet bread balances chili."]],
        },
        {
          name: "Tandoori Roti",
          slug: "tandoori-roti",
          description: "Whole wheat flatbread baked against the tandoor wall.",
          ingredients: ["whole wheat flour", "water", "salt"],
          origin: "North Indian everyday breads",
          tasteProfile: "Earthy, smoky, chewy, less rich than naan.",
          preparation: "Rolled flat and slapped onto the tandoor wall.",
          explanation: "Choose roti if you want bread that is lighter and less buttery than naan.",
          priceCents: 390,
          allergens: [["gluten", "Gluten", "CONTAINS"]],
          tags: [["vegan", "Vegan", true], ...sharedUnderTwenty],
          pairings: [["Baingan bharta", "Earthy bread with smoky eggplant."]],
        },
        {
          name: "Mango Lassi",
          slug: "mango-lassi",
          description: "Yogurt drink blended with mango, cardamom, and a little salt.",
          ingredients: ["yogurt", "mango", "cardamom", "salt"],
          origin: "North Indian cooling drinks",
          tasteProfile: "Creamy, fruity, sweet, cooling.",
          preparation: "Blended cold until smooth and thick.",
          explanation: "The classic drink to cool chili and tandoor spices.",
          priceCents: 590,
          allergens: [["milk", "Milk", "CONTAINS"]],
          tags: [["vegetarian", "Vegetarian", true], ...sharedUnderTwenty],
          pairings: [["Paneer tikka", "Cools smoky spice."]],
        },
        {
          name: "Salted Nimbu Soda",
          slug: "salted-nimbu-soda",
          description: "Sparkling lime soda with black salt, cumin, and mint.",
          ingredients: ["lime", "black salt", "cumin", "mint", "sparkling water"],
          origin: "Indian street refreshers",
          tasteProfile: "Salty, sour, fizzy, cumin-warm, refreshing.",
          preparation: "Mixed fresh over ice.",
          explanation: "More savory than lemonade; great with fried snacks and chaat.",
          priceCents: 520,
          allergens: [],
          tags: [["vegan", "Vegan", true], ["light", "Light"], ...sharedUnderTwenty],
          pairings: [["Papdi chaat", "Echoes the tangy chutneys."]],
        },
        {
          name: "Cardamom Rice Pudding",
          slug: "cardamom-rice-pudding",
          description: "Slow-cooked rice pudding with cardamom, saffron, pistachio, and rose.",
          ingredients: ["rice", "milk", "cardamom", "saffron", "pistachio", "rose"],
          origin: "Indian kheer traditions",
          tasteProfile: "Creamy, floral, aromatic, gently sweet.",
          preparation: "Rice cooks slowly in milk until thick and fragrant.",
          explanation: "A softer dessert than gulab jamun, with perfume-like spice notes.",
          priceCents: 760,
          allergens: [["milk", "Milk", "CONTAINS"], ["tree-nuts", "Tree nuts", "CONTAINS"]],
          tags: [["vegetarian", "Vegetarian", true], ...sharedUnderTwenty],
          pairings: [["Masala chai", "Warm spice with saffron milk."]],
        },
        {
          name: "Masala Chai",
          slug: "masala-chai",
          description: "Black tea simmered with milk, ginger, cardamom, clove, and cinnamon.",
          ingredients: ["black tea", "milk", "ginger", "cardamom", "clove", "cinnamon"],
          origin: "Indian tea stalls",
          tasteProfile: "Milky, spiced, warming, gently sweet.",
          preparation: "Tea and spices are simmered together rather than simply steeped.",
          explanation: "A comforting finish and the best companion for sweet desserts.",
          priceCents: 420,
          allergens: [["milk", "Milk", "CONTAINS"]],
          tags: [["vegetarian", "Vegetarian", true], ...sharedUnderTwenty],
          pairings: [["Gulab jamun", "Balances syrup sweetness."]],
        },
      ],
    },
  ];
}

function makeMenu(seed: SeedRestaurant): RestaurantMenuView {
  const categories = [...seed.categories, ...supplementalCategories(seed.slug)];
  const defaultRestaurantCopy = localizedRestaurantCopy(seed, seed.defaultLocale as DemoLocale);

  return {
    restaurant: {
      id: seed.id,
      name: seed.name,
      slug: seed.slug,
      description: defaultRestaurantCopy.description,
      defaultLocale: seed.defaultLocale,
      currency: "EUR",
      brandColor: seed.theme.accent,
      cuisine: defaultRestaurantCopy.cuisine,
      city: seed.city,
      heroImageUrl: seed.heroImageUrl,
      theme: seed.theme,
      legalNotice: defaultRestaurantCopy.legalNotice,
      translations: itemLocales.map((locale) => ({
        locale,
        ...localizedRestaurantCopy(seed, locale),
      })),
    },
    menu: {
      id: seed.menuId,
      name: "Tasting Menu",
      status: "ACTIVE",
    },
    version: {
      id: seed.versionId,
      version: 1,
      status: "PUBLISHED",
      publishedAt: new Date("2026-04-15T12:00:00.000Z").toISOString(),
      createdAt: new Date("2026-04-15T10:00:00.000Z").toISOString(),
      categories: makeCategories(seed.id, seed.slug, categories),
    },
  };
}

const restaurants: SeedRestaurant[] = [
  {
    id: DEMO_RESTAURANT_ID,
    menuId: DEMO_MENU_ID,
    versionId: DEMO_PUBLISHED_VERSION_ID,
    name: "Demo Bavarian Wirtshaus",
    slug: "demo-bavarian-wirtshaus",
    cuisine: "Bavarian beer hall",
    city: "Munich",
    description:
      "A classic Munich table with rich roasts, dumplings, Alpine cheese, fish, garden plates, beer pairings, and clear explanations for international guests.",
    defaultLocale: "de",
    heroImageUrl: image("photo-1528605248644-14dd04022da1"),
    legalNotice:
      "Please ask staff about severe allergies. Recipes, gravies, and fryer use may change by batch.",
    theme: bavarianTheme,
    categories: [
      {
        name: "Beer Hall Classics",
        items: [
          {
            name: "Schweinshaxe",
            slug: "schweinshaxe",
            description:
              "Crispy roasted pork knuckle with potato dumpling, cabbage, and dark beer gravy.",
            ingredients: ["pork knuckle", "potato dumpling", "red cabbage", "dark beer gravy"],
            origin: "Munich and Upper Bavaria",
            tasteProfile: "Deeply roasted, salty, crisp skin, rich gravy, gentle cabbage sweetness.",
            preparation:
              "Slow-roasted until the skin crackles, then served with dumpling and gravy.",
            spiceLevel: 0,
            explanation:
              "A celebratory beer-hall roast. It is heavy, savory, and best when you want the classic Bavarian experience.",
            priceCents: 2450,
            isPromoted: true,
            allergens: [["gluten", "Gluten", "MAY_CONTAIN", "Gravy recipe varies by batch.", "NEEDS_REVIEW"]],
            tags: [
              ["traditional", "Traditional"],
              ["pork", "Contains pork", true],
              ["best-with-beer", "Best with beer"],
            ],
            pairings: [["Munich Helles", "The malt sweetness balances the roasted crust."]],
          },
          {
            name: "Käsespätzle",
            slug: "kaesespaetzle",
            description:
              "Soft egg noodles folded with mountain cheese, onions, and chives.",
            ingredients: ["egg noodles", "mountain cheese", "onions", "chives"],
            origin: "Swabia and Alpine Bavaria",
            tasteProfile: "Creamy, cheesy, buttery, comforting, with crisp onion sweetness.",
            preparation: "Fresh spaetzle are boiled, folded with cheese, and finished under onions.",
            explanation:
              "Think of it as Alpine macaroni and cheese, but with tender handmade noodles.",
            priceCents: 1690,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["milk", "Milk", "CONTAINS"],
              ["egg", "Egg", "CONTAINS"],
            ],
            tags: [
              ["vegetarian", "Vegetarian", true],
              ["traditional", "Traditional"],
            ],
            pairings: [["Dry Riesling", "Cuts through the richness of the cheese."]],
          },
          {
            name: "Obatzda",
            slug: "obatzda",
            description:
              "Paprika-spiced cheese spread with pretzel, radishes, and onions.",
            ingredients: ["camembert", "butter", "paprika", "pretzel", "radishes"],
            origin: "Bavarian beer gardens",
            tasteProfile: "Creamy, tangy, lightly smoky, salty from the pretzel.",
            preparation: "Ripe soft cheese is mashed with butter, spices, and onions.",
            explanation:
              "A traditional beer snack meant for sharing before heavier mains arrive.",
            priceCents: 1090,
            allergens: [
              ["milk", "Milk", "CONTAINS"],
              ["gluten", "Gluten", "CONTAINS", "Pretzel contains wheat."],
            ],
            tags: [
              ["vegetarian", "Vegetarian", true],
              ["best-with-beer", "Best with beer"],
            ],
            pairings: [["Weissbier", "A classic beer garden pairing."]],
          },
          {
            name: "Nürnberger Rostbratwürstl",
            slug: "nuernberger-rostbratwuerstl",
            description:
              "Small marjoram pork sausages with sauerkraut, mustard, and rye bread.",
            ingredients: ["pork sausages", "marjoram", "sauerkraut", "mustard", "rye bread"],
            origin: "Nuremberg, Franconia",
            tasteProfile: "Savory, herbal, smoky, tangy cabbage, sharp mustard.",
            preparation: "Grilled over high heat and served in a tight row.",
            explanation:
              "These are smaller and more aromatic than standard sausages because marjoram is the signature spice.",
            priceCents: 1590,
            allergens: [
              ["gluten", "Gluten", "CONTAINS", "Served with rye bread."],
              ["mustard", "Mustard", "CONTAINS"],
            ],
            tags: [
              ["traditional", "Traditional"],
              ["pork", "Contains pork", true],
              ["best-with-beer", "Best with beer"],
            ],
            pairings: [["Franconian Kellerbier", "Earthy lager matches the marjoram."]],
          },
        ],
      },
      {
        name: "Fresh, Fish & Garden",
        items: [
          {
            name: "Forelle Müllerin",
            slug: "forelle-muellerin",
            description:
              "Pan-fried trout with lemon butter, parsley potatoes, and cucumber salad.",
            ingredients: ["trout", "lemon butter", "parsley potatoes", "cucumber"],
            origin: "Southern German lake kitchens",
            tasteProfile: "Light, buttery, lemony, tender fish, clean herbs.",
            preparation: "Dusted, pan-fried, and finished with brown lemon butter.",
            explanation:
              "A good lighter choice if you want Bavarian flavors without a heavy roast.",
            priceCents: 2190,
            isPromoted: true,
            allergens: [
              ["fish", "Fish", "CONTAINS"],
              ["milk", "Milk", "CONTAINS", "Lemon butter."],
            ],
            tags: [
              ["light", "Light"],
              ["no-pork", "No pork", true],
            ],
            pairings: [["Franconian Silvaner", "Bright acidity works well with trout."]],
          },
          {
            name: "Rahmschwammerl",
            slug: "rahmschwammerl",
            description:
              "Creamed forest mushrooms with bread dumpling, herbs, and lemon zest.",
            ingredients: ["forest mushrooms", "cream", "bread dumpling", "parsley", "lemon"],
            origin: "Bavarian forest taverns",
            tasteProfile: "Earthy, creamy, herbal, mild lemon brightness.",
            preparation: "Mushrooms are sautéed and simmered in cream sauce.",
            explanation:
              "A vegetarian tavern dish where the dumpling soaks up a rich mushroom sauce.",
            priceCents: 1780,
            allergens: [
              ["milk", "Milk", "CONTAINS"],
              ["gluten", "Gluten", "CONTAINS", "Bread dumpling."],
              ["egg", "Egg", "MAY_CONTAIN", "Dumpling recipe may vary.", "NEEDS_REVIEW"],
            ],
            tags: [
              ["vegetarian", "Vegetarian", true],
              ["traditional", "Traditional"],
            ],
            pairings: [["Pinot Noir", "Soft tannins complement the mushrooms."]],
          },
          {
            name: "Spargelsalat",
            slug: "spargelsalat",
            description:
              "White asparagus salad with herbs, potatoes, pumpkin seed oil, and egg.",
            ingredients: ["white asparagus", "potatoes", "egg", "herbs", "pumpkin seed oil"],
            origin: "Springtime Bavaria",
            tasteProfile: "Fresh, grassy, nutty, lightly acidic, delicate.",
            preparation: "Poached asparagus is chilled and dressed with herb vinaigrette.",
            explanation:
              "White asparagus is a seasonal German favorite with a subtle, elegant taste.",
            priceCents: 1490,
            allergens: [["egg", "Egg", "CONTAINS"]],
            tags: [
              ["vegetarian", "Vegetarian", true],
              ["light", "Light"],
              ["no-pork", "No pork", true],
            ],
            pairings: [["Mineral Weissburgunder", "Keeps the asparagus delicate."]],
          },
          {
            name: "Rote-Bete-Knödel",
            slug: "rote-bete-knoedel",
            description:
              "Beet dumplings with horseradish cream, dill, walnuts, and apple.",
            ingredients: ["beetroot", "bread dumpling", "horseradish", "walnuts", "apple"],
            origin: "Modern Alpine vegetarian kitchens",
            tasteProfile: "Earthy, sweet, sharp horseradish, nutty crunch.",
            preparation: "Beet dumpling mixture is steamed, sliced, and pan-finished.",
            explanation:
              "A colorful modern Bavarian dish that gives dumplings a brighter vegetable-led character.",
            priceCents: 1650,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["tree-nuts", "Tree nuts", "CONTAINS", "Walnuts."],
              ["milk", "Milk", "CONTAINS", "Horseradish cream."],
            ],
            tags: [
              ["vegetarian", "Vegetarian", true],
              ["light", "Light"],
              ["no-pork", "No pork", true],
            ],
            pairings: [["Apple spritz", "Echoes the apple and horseradish freshness."]],
          },
        ],
      },
      {
        name: "Soups, Sides & Sweet Finish",
        items: [
          {
            name: "Leberknödelsuppe",
            slug: "leberknoedelsuppe",
            description: "Clear beef broth with liver dumpling, chives, and root vegetables.",
            ingredients: ["beef broth", "liver dumpling", "chives", "root vegetables"],
            origin: "Bavarian taverns",
            tasteProfile: "Savory broth, iron-rich dumpling, herbal lift.",
            preparation: "Dumplings are simmered gently in clear broth.",
            explanation:
              "A warming soup with a dumpling made from liver and bread; loved by locals, unusual for some visitors.",
            priceCents: 890,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["egg", "Egg", "MAY_CONTAIN", "Dumpling binder may vary.", "NEEDS_REVIEW"],
            ],
            tags: [["traditional", "Traditional"], ["under-20", "Under €20"]],
            pairings: [["Small Helles", "A gentle beer with the clear broth."]],
          },
          {
            name: "Kartoffelknödel",
            slug: "kartoffelknoedel",
            description: "Potato dumplings with toasted bread center and extra gravy.",
            ingredients: ["potatoes", "potato starch", "bread crouton", "gravy"],
            origin: "Bavaria and Bohemia",
            tasteProfile: "Soft, mild, starchy, designed for soaking sauces.",
            preparation: "Potato dough is shaped around croutons and boiled.",
            explanation:
              "Not a main dish for most guests, but the best side for roasts and gravies.",
            priceCents: 690,
            allergens: [["gluten", "Gluten", "MAY_CONTAIN", "Crouton center may contain wheat."]],
            tags: [
              ["vegetarian", "Vegetarian", true],
              ["traditional", "Traditional"],
              ["under-20", "Under €20"],
            ],
            pairings: [["Dark beer gravy", "The classic match."]],
          },
          {
            name: "Apfelstrudel",
            slug: "apfelstrudel",
            description: "Warm apple strudel with vanilla sauce, raisins, and cinnamon.",
            ingredients: ["apples", "strudel pastry", "raisins", "cinnamon", "vanilla sauce"],
            origin: "Austro-Bavarian pastry tradition",
            tasteProfile: "Warm apple, cinnamon, buttery pastry, creamy vanilla.",
            preparation: "Thin pastry is rolled around spiced apples and baked until flaky.",
            explanation:
              "A familiar dessert for many travelers, but here it is softer and more custard-led.",
            priceCents: 890,
            isPromoted: true,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["milk", "Milk", "CONTAINS"],
              ["egg", "Egg", "MAY_CONTAIN", "Pastry may include egg wash.", "NEEDS_REVIEW"],
            ],
            tags: [["vegetarian", "Vegetarian", true], ["under-20", "Under €20"]],
            pairings: [["Coffee", "Balances the sweetness after a heavy meal."]],
          },
          {
            name: "Kaiserschmarrn",
            slug: "kaiserschmarrn",
            description: "Torn caramelized pancake with plum compote and powdered sugar.",
            ingredients: ["pancake batter", "raisins", "butter", "plum compote", "sugar"],
            origin: "Austrian imperial Alpine kitchens",
            tasteProfile: "Fluffy, buttery, caramelized edges, tart plum.",
            preparation: "A thick pancake is torn in the pan and caramelized in butter.",
            explanation:
              "A dessert that eats like a warm, shredded pancake. Great to share.",
            priceCents: 1190,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["milk", "Milk", "CONTAINS"],
              ["egg", "Egg", "CONTAINS"],
            ],
            tags: [["vegetarian", "Vegetarian", true], ["traditional", "Traditional"]],
            pairings: [["Apricot schnapps", "A traditional sweet finish."]],
          },
        ],
      },
    ],
  },
  {
    id: "demo-asian-night-market",
    menuId: "demo-asian-night-market-menu",
    versionId: "demo-asian-night-market-v1",
    name: "Pan-Asian Night Market",
    slug: "demo-asian-night-market",
    cuisine: "Pan-Asian street food",
    city: "Berlin",
    description:
      "A colorful night-market menu crossing Thailand, Japan, Korea, China, and Singapore with clear spice, sauce, and allergen guidance.",
    defaultLocale: "en",
    heroImageUrl: image("photo-1555396273-367ea4eb4db5"),
    legalNotice:
      "Soy, sesame, peanuts, shellfish, and gluten are common in this kitchen. Please ask staff before ordering with severe allergies.",
    theme: asianTheme,
    categories: [
      {
        name: "Small Plates & Street Snacks",
        items: [
          {
            name: "Korean Kimchi Pancake",
            slug: "korean-kimchi-pancake",
            description: "Crisp kimchi pancake with scallion, gochugaru, and soy dipping sauce.",
            ingredients: ["kimchi", "scallion", "wheat batter", "gochugaru", "soy sauce"],
            origin: "Korea, pub-style anju",
            tasteProfile: "Tangy, crispy, lightly spicy, fermented, savory.",
            preparation: "Thin batter is pan-fried until the edges become crisp.",
            spiceLevel: 2,
            explanation:
              "A shareable savory pancake; choose it if you like fermented tang and crunchy edges.",
            priceCents: 1190,
            isPromoted: true,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["soy", "Soy", "CONTAINS"],
              ["fish", "Fish", "MAY_CONTAIN", "Kimchi may include fish sauce.", "NEEDS_REVIEW"],
            ],
            tags: [["spicy", "Spicy"], ["vegetarian", "Vegetarian", true, "NEEDS_REVIEW"]],
            pairings: [["Yuzu lemonade", "Bright citrus cools the chili."]],
          },
          {
            name: "Chicken Karaage",
            slug: "chicken-karaage",
            description: "Japanese fried chicken with ginger, garlic, lemon, and kewpie mayo.",
            ingredients: ["chicken thigh", "ginger", "garlic", "potato starch", "mayo"],
            origin: "Japanese izakaya cooking",
            tasteProfile: "Juicy, crisp, garlicky, lightly sweet marinade.",
            preparation: "Marinated chicken is starch-coated and double-fried.",
            spiceLevel: 0,
            explanation:
              "A very approachable choice: boneless fried chicken with Japanese seasoning.",
            priceCents: 1290,
            allergens: [
              ["egg", "Egg", "CONTAINS", "Kewpie mayo."],
              ["soy", "Soy", "CONTAINS"],
              ["gluten", "Gluten", "MAY_CONTAIN", "Shared fryer and marinade.", "NEEDS_REVIEW"],
            ],
            tags: [["no-pork", "No pork", true], ["comfort", "Comfort food"]],
            pairings: [["Cold lager", "Cuts through the fried coating."]],
          },
          {
            name: "Sichuan Cucumber Smash",
            slug: "sichuan-cucumber-smash",
            description: "Chilled smashed cucumber with black vinegar, chili oil, garlic, and sesame.",
            ingredients: ["cucumber", "black vinegar", "chili oil", "garlic", "sesame"],
            origin: "Sichuan cold dishes",
            tasteProfile: "Cool, sharp, garlicky, nutty, tingling chili oil.",
            preparation: "Cucumber is smashed for texture and tossed in aromatic dressing.",
            spiceLevel: 2,
            explanation:
              "Refreshing but punchy; good as a cooling side next to noodles or grilled dishes.",
            priceCents: 790,
            allergens: [
              ["sesame", "Sesame", "CONTAINS"],
              ["soy", "Soy", "MAY_CONTAIN", "Dressing may include soy.", "NEEDS_REVIEW"],
            ],
            tags: [
              ["vegan", "Vegan", true],
              ["light", "Light"],
              ["spicy", "Spicy"],
              ["under-20", "Under €20"],
            ],
            pairings: [["Jasmine iced tea", "Keeps the dish bright and clean."]],
          },
          {
            name: "Prawn Toast Bites",
            slug: "prawn-toast-bites",
            description: "Sesame prawn toast with sweet chili, lime, and herb salad.",
            ingredients: ["prawn mousse", "toast", "sesame", "sweet chili", "lime"],
            origin: "Hong Kong and British-Chinese restaurants",
            tasteProfile: "Crunchy, savory seafood, nutty sesame, sweet heat.",
            preparation: "Prawn paste is spread on bread, sesame-coated, and fried.",
            spiceLevel: 1,
            explanation:
              "A nostalgic fried snack; richer than it looks because the prawn is almost mousse-like.",
            priceCents: 1180,
            allergens: [
              ["crustaceans", "Crustaceans", "CONTAINS"],
              ["sesame", "Sesame", "CONTAINS"],
              ["gluten", "Gluten", "CONTAINS"],
              ["egg", "Egg", "MAY_CONTAIN", "Binding may vary.", "NEEDS_REVIEW"],
            ],
            tags: [["street-food", "Street food"], ["best-with-beer", "Best with beer"]],
            pairings: [["Crisp pilsner", "Balances the fried sesame coating."]],
          },
        ],
      },
      {
        name: "Noodles, Rice & Bowls",
        items: [
          {
            name: "Pad Thai Tamarind Noodles",
            slug: "pad-thai-tamarind-noodles",
            description: "Rice noodles with tamarind, egg, tofu, bean sprouts, peanuts, and lime.",
            ingredients: ["rice noodles", "tamarind", "egg", "tofu", "peanuts", "lime"],
            origin: "Thailand, central street stalls",
            tasteProfile: "Sweet-sour tamarind, nutty, soft noodles, fresh lime.",
            preparation: "Noodles are wok-tossed quickly so the sauce clings without becoming wet.",
            spiceLevel: 1,
            explanation:
              "One of the easiest Thai dishes to love: balanced, tangy, and not very spicy by default.",
            priceCents: 1690,
            isPromoted: true,
            allergens: [
              ["peanuts", "Peanuts", "CONTAINS"],
              ["egg", "Egg", "CONTAINS"],
              ["soy", "Soy", "CONTAINS"],
              ["fish", "Fish", "MAY_CONTAIN", "Fish sauce can be omitted on request.", "NEEDS_REVIEW"],
            ],
            tags: [["vegetarian", "Vegetarian", true, "NEEDS_REVIEW"], ["under-20", "Under €20"]],
            pairings: [["Thai basil soda", "Fresh herbs echo the lime."]],
          },
          {
            name: "Tokyo Shoyu Ramen",
            slug: "tokyo-shoyu-ramen",
            description: "Soy chicken broth, wheat noodles, egg, bamboo, nori, and chashu pork.",
            ingredients: ["chicken broth", "wheat noodles", "soy tare", "egg", "pork chashu"],
            origin: "Tokyo ramen shops",
            tasteProfile: "Clear savory broth, soy depth, springy noodles, rich pork.",
            preparation: "Broth and tare are combined to order, then noodles are added fast.",
            spiceLevel: 0,
            explanation:
              "A lighter ramen than creamy tonkotsu; the main flavor is soy-seasoned broth.",
            priceCents: 1850,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["soy", "Soy", "CONTAINS"],
              ["egg", "Egg", "CONTAINS"],
            ],
            tags: [["pork", "Contains pork", true], ["comfort", "Comfort food"]],
            pairings: [["Genmaicha", "Toasted rice notes suit the soy broth."]],
          },
          {
            name: "Singapore Laksa",
            slug: "singapore-laksa",
            description: "Coconut curry noodle soup with prawn, tofu puffs, egg, herbs, and chili.",
            ingredients: ["rice noodles", "coconut", "prawn", "tofu puffs", "egg", "laksa paste"],
            origin: "Singapore and Peranakan kitchens",
            tasteProfile: "Creamy coconut, aromatic curry, seafood sweetness, medium heat.",
            preparation: "Spiced coconut broth is simmered and poured over noodles and toppings.",
            spiceLevel: 3,
            explanation:
              "A bowl for guests who want fragrant curry flavor without choosing a dry stir-fry.",
            priceCents: 1990,
            allergens: [
              ["crustaceans", "Crustaceans", "CONTAINS"],
              ["egg", "Egg", "CONTAINS"],
              ["soy", "Soy", "CONTAINS"],
            ],
            tags: [["spicy", "Spicy"], ["no-pork", "No pork", true]],
            pairings: [["Lime leaf iced tea", "Cuts the coconut richness."]],
          },
          {
            name: "Mushroom Bibimbap",
            slug: "mushroom-bibimbap",
            description: "Hot rice bowl with mushrooms, vegetables, sesame, egg, and gochujang.",
            ingredients: ["rice", "mushrooms", "spinach", "carrot", "egg", "gochujang"],
            origin: "Korean mixed rice bowls",
            tasteProfile: "Toasty rice, vegetables, sesame, chili sweetness.",
            preparation: "Rice is served hot and mixed at the table with sauce and toppings.",
            spiceLevel: 2,
            explanation:
              "Bibimbap means mixed rice. Stir everything together for the intended texture and sauce balance.",
            priceCents: 1590,
            allergens: [
              ["egg", "Egg", "CONTAINS"],
              ["sesame", "Sesame", "CONTAINS"],
              ["soy", "Soy", "CONTAINS"],
            ],
            tags: [["vegetarian", "Vegetarian", true], ["under-20", "Under €20"]],
            pairings: [["Sparkling plum drink", "Sweet acidity meets the gochujang."]],
          },
        ],
      },
      {
        name: "Grill, Curry & Wok",
        items: [
          {
            name: "Thai Green Curry Chicken",
            slug: "thai-green-curry-chicken",
            description: "Green curry with chicken, eggplant, bamboo, basil, coconut, and jasmine rice.",
            ingredients: ["chicken", "green curry paste", "coconut", "eggplant", "basil"],
            origin: "Central Thailand",
            tasteProfile: "Herbal, coconut-rich, fragrant, medium-hot, slightly sweet.",
            preparation: "Curry paste is fried in coconut cream before simmering with chicken.",
            spiceLevel: 3,
            explanation:
              "Green curry is aromatic rather than smoky; basil and lime leaf make it bright.",
            priceCents: 1890,
            allergens: [["fish", "Fish", "MAY_CONTAIN", "Curry paste may include fish sauce.", "NEEDS_REVIEW"]],
            tags: [["spicy", "Spicy"], ["no-pork", "No pork", true]],
            pairings: [["Off-dry Riesling", "Sweetness softens the chili."]],
          },
          {
            name: "Char Siu Eggplant",
            slug: "char-siu-eggplant",
            description: "Roasted eggplant glazed with Cantonese char siu sauce and sesame.",
            ingredients: ["eggplant", "soy", "hoisin", "five spice", "sesame", "rice"],
            origin: "Cantonese barbecue flavors, plant-forward style",
            tasteProfile: "Sweet-savory glaze, silky eggplant, warm five spice.",
            preparation: "Eggplant is roasted until soft and lacquered with glaze.",
            spiceLevel: 0,
            explanation:
              "This has the shiny barbecue flavor of char siu without pork; great for a vegetable main.",
            priceCents: 1650,
            allergens: [
              ["soy", "Soy", "CONTAINS"],
              ["sesame", "Sesame", "CONTAINS"],
              ["gluten", "Gluten", "MAY_CONTAIN", "Hoisin brand varies.", "NEEDS_REVIEW"],
            ],
            tags: [["vegan", "Vegan", true], ["no-pork", "No pork", true]],
            pairings: [["Oolong tea", "Roasted tea tones match the glaze."]],
          },
          {
            name: "Miso Black Cod",
            slug: "miso-black-cod",
            description: "Miso-marinated cod with pickled daikon, rice, and cucumber.",
            ingredients: ["black cod", "miso", "mirin", "daikon", "cucumber", "rice"],
            origin: "Japanese modern izakaya style",
            tasteProfile: "Buttery fish, sweet miso, delicate pickle, umami-rich.",
            preparation: "Fish marinates overnight, then broils until lacquered.",
            spiceLevel: 0,
            explanation:
              "A silky, luxurious fish dish; less salty than it sounds because the cod is rich.",
            priceCents: 2850,
            allergens: [
              ["fish", "Fish", "CONTAINS"],
              ["soy", "Soy", "CONTAINS"],
            ],
            tags: [["light", "Light"], ["no-pork", "No pork", true]],
            pairings: [["Junmai sake", "Clean rice notes support the miso."]],
          },
          {
            name: "Sichuan Mapo Tofu",
            slug: "sichuan-mapo-tofu",
            description: "Silken tofu with chili bean paste, fermented black beans, beef, and Sichuan pepper.",
            ingredients: ["tofu", "beef", "doubanjiang", "black beans", "Sichuan pepper"],
            origin: "Chengdu, Sichuan",
            tasteProfile: "Hot, numbing, savory, fermented, silky tofu.",
            preparation: "Tofu is simmered gently in a chili-bean sauce until it absorbs flavor.",
            spiceLevel: 5,
            explanation:
              "The signature sensation is mala: chili heat plus a tingling feeling from Sichuan pepper.",
            priceCents: 1720,
            allergens: [
              ["soy", "Soy", "CONTAINS"],
              ["gluten", "Gluten", "MAY_CONTAIN", "Chili bean paste brand varies.", "NEEDS_REVIEW"],
            ],
            tags: [["spicy", "Very spicy"], ["comfort", "Comfort food"]],
            pairings: [["Cold jasmine tea", "Keeps the heat in balance."]],
          },
        ],
      },
    ],
  },
  {
    id: "demo-vietnamese-house",
    menuId: "demo-vietnamese-house-menu",
    versionId: "demo-vietnamese-house-v1",
    name: "Vietnamese House",
    slug: "demo-vietnamese-house",
    cuisine: "Vietnamese family kitchen",
    city: "Hamburg",
    description:
      "Herb-heavy Vietnamese dishes with broths, rice paper, grilled meats, vegan bowls, bright sauces, and guest-friendly dish explanations.",
    defaultLocale: "en",
    heroImageUrl: image("photo-1504674900247-0877df9cc836"),
    legalNotice:
      "Fish sauce, peanuts, soy, and shellfish are common. Ask staff before ordering with severe allergies.",
    theme: vietnameseTheme,
    categories: [
      {
        name: "Fresh Rolls & Herbs",
        items: [
          {
            name: "Gỏi Cuốn Tôm",
            slug: "goi-cuon-tom",
            description: "Rice paper summer rolls with prawn, herbs, noodles, lettuce, and peanut dip.",
            ingredients: ["rice paper", "prawn", "rice noodles", "mint", "lettuce", "peanut dip"],
            origin: "Southern Vietnam",
            tasteProfile: "Cool, herbal, soft noodles, sweet prawn, nutty dip.",
            preparation: "Ingredients are rolled fresh to order in hydrated rice paper.",
            spiceLevel: 0,
            explanation:
              "These are not fried spring rolls; they are cool, soft, and very herb-forward.",
            priceCents: 950,
            isPromoted: true,
            allergens: [
              ["crustaceans", "Crustaceans", "CONTAINS"],
              ["peanuts", "Peanuts", "CONTAINS"],
            ],
            tags: [["light", "Light"], ["no-pork", "No pork", true], ["under-20", "Under €20"]],
            pairings: [["Lemongrass iced tea", "Keeps the herbs bright."]],
          },
          {
            name: "Bánh Xèo",
            slug: "banh-xeo",
            description: "Crisp turmeric rice crepe with pork, prawn, bean sprouts, herbs, and nước chấm.",
            ingredients: ["rice batter", "turmeric", "pork", "prawn", "bean sprouts", "herbs"],
            origin: "Central and Southern Vietnam",
            tasteProfile: "Crispy edge, savory filling, fresh herbs, sweet-sour fish sauce.",
            preparation: "A thin rice batter crepe is fried until crisp and folded around fillings.",
            spiceLevel: 1,
            explanation:
              "You wrap pieces in lettuce and herbs, then dip. It is crunchy and interactive.",
            priceCents: 1580,
            allergens: [
              ["crustaceans", "Crustaceans", "CONTAINS"],
              ["fish", "Fish", "CONTAINS", "Nước chấm contains fish sauce."],
            ],
            tags: [["traditional", "Traditional"], ["pork", "Contains pork", true]],
            pairings: [["Saigon lager", "Light beer suits the crispy crepe."]],
          },
          {
            name: "Green Papaya Salad",
            slug: "green-papaya-salad",
            description: "Shredded green papaya with herbs, lime, chili, peanuts, and vegan tamarind dressing.",
            ingredients: ["green papaya", "lime", "chili", "peanuts", "mint", "tamarind"],
            origin: "Vietnamese street salads",
            tasteProfile: "Crunchy, sour, sweet, herbal, chili warmth.",
            preparation: "Papaya is shredded and dressed just before serving.",
            spiceLevel: 2,
            explanation:
              "Papaya here is unripe and crisp, closer to a vegetable than a sweet fruit.",
            priceCents: 1090,
            allergens: [["peanuts", "Peanuts", "CONTAINS"]],
            tags: [["vegan", "Vegan", true], ["light", "Light"], ["spicy", "Spicy"]],
            pairings: [["Sparkling lime", "Mirrors the dressing."]],
          },
          {
            name: "Crispy Tofu Lettuce Cups",
            slug: "crispy-tofu-lettuce-cups",
            description: "Fried tofu, pickled carrot, herbs, rice flakes, and ginger-soy sauce.",
            ingredients: ["tofu", "lettuce", "pickled carrot", "mint", "rice flakes", "soy"],
            origin: "Modern Vietnamese vegetarian cooking",
            tasteProfile: "Crisp tofu, fresh herbs, salty-sweet ginger sauce.",
            preparation: "Tofu is crisped and served with cold lettuce for wrapping.",
            spiceLevel: 1,
            explanation:
              "A hands-on starter: build a lettuce wrap and add sauce to your spice comfort.",
            priceCents: 990,
            allergens: [
              ["soy", "Soy", "CONTAINS"],
              ["gluten", "Gluten", "MAY_CONTAIN", "Soy sauce brand varies.", "NEEDS_REVIEW"],
            ],
            tags: [["vegan", "Vegan", true], ["no-pork", "No pork", true], ["under-20", "Under €20"]],
            pairings: [["Cucumber mint cooler", "Freshness for the ginger sauce."]],
          },
        ],
      },
      {
        name: "Phở, Bún & Broths",
        items: [
          {
            name: "Phở Bò Tái",
            slug: "pho-bo-tai",
            description: "Beef noodle soup with rare beef, long-simmered broth, herbs, lime, and chili.",
            ingredients: ["beef broth", "rice noodles", "rare beef", "herbs", "lime", "chili"],
            origin: "Northern Vietnam",
            tasteProfile: "Clear broth, warm spices, fresh herbs, tender beef.",
            preparation: "Bones simmer for hours, then hot broth cooks the rare beef in the bowl.",
            spiceLevel: 1,
            explanation:
              "Phở is mostly about broth aroma. Add herbs and lime gradually so you can taste the base first.",
            priceCents: 1590,
            isPromoted: true,
            allergens: [["fish", "Fish", "MAY_CONTAIN", "Some broth batches use fish sauce.", "NEEDS_REVIEW"]],
            tags: [["traditional", "Traditional"], ["no-pork", "No pork", true]],
            pairings: [["Salted lime soda", "Brightens the warm spices."]],
          },
          {
            name: "Bún Chả Hà Nội",
            slug: "bun-cha-ha-noi",
            description: "Grilled pork patties in sweet-sour broth with noodles, herbs, and pickles.",
            ingredients: ["pork patties", "rice noodles", "fish sauce", "herbs", "green papaya"],
            origin: "Hanoi lunch stalls",
            tasteProfile: "Smoky pork, sweet-sour broth, herb freshness, gentle char.",
            preparation: "Pork is charcoal-grilled and served with separate noodles and herbs.",
            spiceLevel: 1,
            explanation:
              "Dip noodles and herbs into the warm pork broth; it is not a soup bowl, more a dipping meal.",
            priceCents: 1690,
            allergens: [["fish", "Fish", "CONTAINS", "Dipping broth contains fish sauce."]],
            tags: [["traditional", "Traditional"], ["pork", "Contains pork", true]],
            pairings: [["Jasmine tea", "Keeps the grilled pork light."]],
          },
          {
            name: "Bún Bò Huế",
            slug: "bun-bo-hue",
            description: "Spicy lemongrass beef noodle soup with chili oil, herbs, and banana blossom.",
            ingredients: ["beef", "rice noodles", "lemongrass", "chili oil", "banana blossom"],
            origin: "Huế, Central Vietnam",
            tasteProfile: "Spicy, lemongrass-heavy, savory, aromatic, more intense than phở.",
            preparation: "Beef broth is seasoned with lemongrass and annatto chili oil.",
            spiceLevel: 4,
            explanation:
              "Choose this if you want a deeper, spicier soup than phở with lots of lemongrass aroma.",
            priceCents: 1750,
            allergens: [["fish", "Fish", "MAY_CONTAIN", "Seasoning may include fish sauce.", "NEEDS_REVIEW"]],
            tags: [["spicy", "Spicy"], ["traditional", "Traditional"], ["no-pork", "No pork", true, "NEEDS_REVIEW"]],
            pairings: [["Iced lotus tea", "Floral tea softens chili oil."]],
          },
          {
            name: "Vegan Phở Nấm",
            slug: "vegan-pho-nam",
            description: "Mushroom phở with charred onion, ginger, star anise, tofu, and herbs.",
            ingredients: ["mushroom broth", "rice noodles", "tofu", "ginger", "star anise", "herbs"],
            origin: "Plant-based take on northern phở",
            tasteProfile: "Clear, aromatic, mushroom umami, warm spices, fresh herbs.",
            preparation: "Mushrooms, onion, and ginger create the broth depth without bones.",
            spiceLevel: 0,
            explanation:
              "A gentle, aromatic bowl for anyone who wants phở without meat or fish sauce.",
            priceCents: 1490,
            allergens: [["soy", "Soy", "CONTAINS", "Tofu."]],
            tags: [["vegan", "Vegan", true], ["light", "Light"], ["no-pork", "No pork", true]],
            pairings: [["Ginger tea", "Echoes the broth aromatics."]],
          },
        ],
      },
      {
        name: "Grill, Rice & Bánh Mì",
        items: [
          {
            name: "Bánh Mì Đặc Biệt",
            slug: "banh-mi-dac-biet",
            description: "Vietnamese baguette with pâté, pork, pickles, herbs, chili, and mayo.",
            ingredients: ["baguette", "pork", "pâté", "pickles", "cilantro", "mayo"],
            origin: "Vietnamese-French street food",
            tasteProfile: "Crisp bread, savory pâté, sweet pickles, herbs, chili.",
            preparation: "A light baguette is warmed and layered with meats and pickles.",
            spiceLevel: 1,
            explanation:
              "A sandwich with French bread and Vietnamese fillings; the pickles keep it bright.",
            priceCents: 1190,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["egg", "Egg", "CONTAINS", "Mayo."],
            ],
            tags: [["pork", "Contains pork", true], ["street-food", "Street food"]],
            pairings: [["Vietnamese iced coffee", "Bold coffee balances the pâté."]],
          },
          {
            name: "Cơm Tấm Sườn Nướng",
            slug: "com-tam-suon-nuong",
            description: "Broken rice with lemongrass pork chop, egg, pickles, fish sauce, and scallion oil.",
            ingredients: ["broken rice", "pork chop", "lemongrass", "egg", "pickles", "fish sauce"],
            origin: "Southern Vietnamese rice shops",
            tasteProfile: "Smoky grilled pork, sweet fish sauce, soft rice, fresh pickles.",
            preparation: "Pork is marinated in lemongrass and grilled over high heat.",
            spiceLevel: 1,
            explanation:
              "Broken rice has a shorter, softer texture; it is perfect with grilled pork juices.",
            priceCents: 1790,
            allergens: [
              ["fish", "Fish", "CONTAINS"],
              ["egg", "Egg", "CONTAINS"],
            ],
            tags: [["traditional", "Traditional"], ["pork", "Contains pork", true]],
            pairings: [["Lime soda", "Cuts through the grilled pork."]],
          },
          {
            name: "Lemongrass Chicken Rice Bowl",
            slug: "lemongrass-chicken-rice-bowl",
            description: "Grilled chicken with rice, herbs, cucumber, pickles, peanuts, and chili-lime sauce.",
            ingredients: ["chicken", "rice", "lemongrass", "cucumber", "pickles", "peanuts"],
            origin: "Vietnamese family rice plates",
            tasteProfile: "Citrusy grilled chicken, crunchy pickles, nutty topping.",
            preparation: "Chicken marinates in lemongrass and is grilled to order.",
            spiceLevel: 1,
            explanation:
              "A reliable first order if you want grilled protein, rice, and fresh herbs.",
            priceCents: 1590,
            allergens: [["peanuts", "Peanuts", "CONTAINS"]],
            tags: [["no-pork", "No pork", true], ["under-20", "Under €20"]],
            pairings: [["Passionfruit soda", "Matches the lemongrass brightness."]],
          },
          {
            name: "Caramelized Claypot Eggplant",
            slug: "caramelized-claypot-eggplant",
            description: "Silky eggplant with coconut caramel, pepper, herbs, jasmine rice, and chili.",
            ingredients: ["eggplant", "coconut caramel", "pepper", "herbs", "rice", "chili"],
            origin: "Vegetarian claypot-style Vietnamese cooking",
            tasteProfile: "Sweet-salty caramel, soft eggplant, pepper warmth, herb lift.",
            preparation: "Eggplant is simmered until it absorbs caramel sauce.",
            spiceLevel: 2,
            explanation:
              "Vietnamese caramel sauce is savory, not dessert-like; it gives vegetables deep gloss and flavor.",
            priceCents: 1480,
            allergens: [["soy", "Soy", "MAY_CONTAIN", "Sauce recipe varies.", "NEEDS_REVIEW"]],
            tags: [["vegan", "Vegan", true], ["no-pork", "No pork", true], ["under-20", "Under €20"]],
            pairings: [["Roasted rice tea", "Softens the caramel sweetness."]],
          },
        ],
      },
    ],
  },
  {
    id: "demo-indian-spice-room",
    menuId: "demo-indian-spice-room-menu",
    versionId: "demo-indian-spice-room-v1",
    name: "Indian Spice Room",
    slug: "demo-indian-spice-room",
    cuisine: "Regional Indian",
    city: "Cologne",
    description:
      "A regional Indian menu with tandoor, chaats, curries, breads, dosa, biryani, and clear guidance for spices, dairy, nuts, and unfamiliar dishes.",
    defaultLocale: "en",
    heroImageUrl: image("photo-1585937421612-70a008356fbe"),
    legalNotice:
      "Dairy, nuts, mustard, gluten, and shared spice blends are common. Please ask staff before ordering with severe allergies.",
    theme: indianTheme,
    categories: [
      {
        name: "Chaat, Tandoor & Starters",
        items: [
          {
            name: "Papdi Chaat",
            slug: "papdi-chaat",
            description: "Crisp wafers with yogurt, chickpeas, potatoes, tamarind, mint, and sev.",
            ingredients: ["papdi", "yogurt", "chickpeas", "potatoes", "tamarind", "sev"],
            origin: "North Indian street chaat",
            tasteProfile: "Crunchy, creamy, sweet-sour, tangy, herbaceous.",
            preparation: "Layered to order so the wafers stay crisp.",
            spiceLevel: 1,
            explanation:
              "Chaat is about contrast: crunch, yogurt, chutneys, herbs, and a sweet-sour finish.",
            priceCents: 890,
            allergens: [
              ["milk", "Milk", "CONTAINS"],
              ["gluten", "Gluten", "CONTAINS"],
            ],
            tags: [["vegetarian", "Vegetarian", true], ["street-food", "Street food"], ["under-20", "Under €20"]],
            pairings: [["Masala chai", "Warm spice with tangy chutneys."]],
          },
          {
            name: "Paneer Tikka",
            slug: "paneer-tikka",
            description: "Tandoor-grilled paneer with yogurt marinade, peppers, onion, and mint chutney.",
            ingredients: ["paneer", "yogurt", "bell pepper", "onion", "mint chutney"],
            origin: "Punjabi tandoor cooking",
            tasteProfile: "Smoky, creamy paneer, charred vegetables, bright mint.",
            preparation: "Paneer is marinated and cooked in a very hot clay tandoor.",
            spiceLevel: 2,
            explanation:
              "Paneer is a firm fresh cheese. This is a vegetarian grill dish, not a curry.",
            priceCents: 1390,
            isPromoted: true,
            allergens: [["milk", "Milk", "CONTAINS"]],
            tags: [["vegetarian", "Vegetarian", true], ["spicy", "Spicy"]],
            pairings: [["Mango lassi", "Cools the tandoor spice."]],
          },
          {
            name: "Amritsari Fish Fry",
            slug: "amritsari-fish-fry",
            description: "Gram-flour fried fish with ajwain, chili, lime, and onion salad.",
            ingredients: ["white fish", "gram flour", "ajwain", "chili", "lime", "onion"],
            origin: "Amritsar, Punjab",
            tasteProfile: "Crisp, earthy chickpea coating, lime, chili warmth.",
            preparation: "Fish is spice-marinated, gram-flour coated, and fried crisp.",
            spiceLevel: 2,
            explanation:
              "A fragrant fried fish starter; gram flour gives a nutty crust without wheat flour.",
            priceCents: 1490,
            allergens: [
              ["fish", "Fish", "CONTAINS"],
              ["mustard", "Mustard", "MAY_CONTAIN", "Spice blend may vary.", "NEEDS_REVIEW"],
            ],
            tags: [["no-pork", "No pork", true], ["best-with-beer", "Best with beer"]],
            pairings: [["Crisp lager", "Balances the fried spice crust."]],
          },
          {
            name: "Masala Dosa",
            slug: "masala-dosa",
            description: "Crisp fermented rice-lentil crepe with potato masala, sambar, and chutneys.",
            ingredients: ["rice batter", "lentils", "potato", "mustard seed", "sambar", "coconut chutney"],
            origin: "South Indian breakfast houses",
            tasteProfile: "Crisp crepe, tangy fermentation, soft spiced potato, coconut.",
            preparation: "Fermented batter is spread thin on a hot griddle and folded around potato.",
            spiceLevel: 2,
            explanation:
              "Dosa is a large crisp crepe. Tear it by hand and dip into sambar and chutneys.",
            priceCents: 1450,
            allergens: [
              ["mustard", "Mustard", "CONTAINS"],
              ["tree-nuts", "Tree nuts", "MAY_CONTAIN", "Coconut chutney and kitchen nuts.", "NEEDS_REVIEW"],
            ],
            tags: [["vegan", "Vegan", true, "NEEDS_REVIEW"], ["traditional", "Traditional"]],
            pairings: [["Filter coffee", "A classic South Indian pairing."]],
          },
        ],
      },
      {
        name: "Curries & Regional Mains",
        items: [
          {
            name: "Butter Chicken",
            slug: "butter-chicken",
            description: "Tandoori chicken simmered in tomato, butter, cream, fenugreek, and spices.",
            ingredients: ["chicken", "tomato", "butter", "cream", "fenugreek", "spices"],
            origin: "Delhi restaurant kitchens",
            tasteProfile: "Creamy, tomato-rich, mildly sweet, smoky chicken.",
            preparation: "Tandoori chicken is finished in a smooth butter-tomato sauce.",
            spiceLevel: 1,
            explanation:
              "A gentle first curry if you want creamy tomato sauce and mild spice.",
            priceCents: 1890,
            isPromoted: true,
            allergens: [["milk", "Milk", "CONTAINS"]],
            tags: [["no-pork", "No pork", true], ["comfort", "Comfort food"]],
            pairings: [["Garlic naan", "Good for scooping the sauce."]],
          },
          {
            name: "Lamb Rogan Josh",
            slug: "lamb-rogan-josh",
            description: "Kashmiri-style lamb curry with chili, fennel, cardamom, and yogurt.",
            ingredients: ["lamb", "yogurt", "Kashmiri chili", "fennel", "cardamom", "ginger"],
            origin: "Kashmir",
            tasteProfile: "Deep red chili aroma, tender lamb, warming spices, medium heat.",
            preparation: "Lamb is slowly braised until tender in spiced sauce.",
            spiceLevel: 3,
            explanation:
              "The red color looks fiery, but Kashmiri chili is more aromatic than aggressively hot.",
            priceCents: 2190,
            allergens: [["milk", "Milk", "CONTAINS", "Yogurt in sauce."]],
            tags: [["spicy", "Spicy"], ["no-pork", "No pork", true]],
            pairings: [["Jeera rice", "Cumin rice supports the lamb sauce."]],
          },
          {
            name: "Goan Prawn Curry",
            slug: "goan-prawn-curry",
            description: "Coconut-tamarind prawn curry with curry leaves, chili, and steamed rice.",
            ingredients: ["prawns", "coconut", "tamarind", "curry leaves", "chili", "rice"],
            origin: "Goa, coastal India",
            tasteProfile: "Coconut-rich, sour tamarind, seafood sweetness, lively chili.",
            preparation: "Prawns are simmered briefly in spiced coconut-tamarind sauce.",
            spiceLevel: 3,
            explanation:
              "A coastal curry: brighter and tangier than creamy northern curries.",
            priceCents: 2290,
            allergens: [["crustaceans", "Crustaceans", "CONTAINS"]],
            tags: [["spicy", "Spicy"], ["no-pork", "No pork", true]],
            pairings: [["Coconut water", "Softens tamarind and chili."]],
          },
          {
            name: "Baingan Bharta",
            slug: "baingan-bharta",
            description: "Smoked mashed eggplant with tomato, onion, ginger, cumin, and coriander.",
            ingredients: ["eggplant", "tomato", "onion", "ginger", "cumin", "coriander"],
            origin: "North Indian home cooking",
            tasteProfile: "Smoky, soft, earthy, tomato-sweet, gently spiced.",
            preparation: "Eggplant is roasted over flame, peeled, mashed, and cooked with spices.",
            spiceLevel: 2,
            explanation:
              "A smoky vegetable main; the texture is soft like a warm eggplant spread.",
            priceCents: 1590,
            allergens: [["mustard", "Mustard", "MAY_CONTAIN", "Spice mix may vary.", "NEEDS_REVIEW"]],
            tags: [["vegan", "Vegan", true], ["no-pork", "No pork", true], ["under-20", "Under €20"]],
            pairings: [["Tandoori roti", "Earthy bread with smoky eggplant."]],
          },
        ],
      },
      {
        name: "Rice, Bread & Sweets",
        items: [
          {
            name: "Hyderabadi Chicken Biryani",
            slug: "hyderabadi-chicken-biryani",
            description: "Layered basmati rice with chicken, saffron, fried onions, mint, and raita.",
            ingredients: ["basmati rice", "chicken", "saffron", "fried onion", "mint", "raita"],
            origin: "Hyderabad",
            tasteProfile: "Fragrant rice, warm spices, tender chicken, cooling yogurt.",
            preparation: "Rice and marinated chicken are cooked together dum-style under steam.",
            spiceLevel: 3,
            explanation:
              "Biryani is not curry with rice; the rice itself carries the aroma and spice.",
            priceCents: 1950,
            allergens: [
              ["milk", "Milk", "CONTAINS", "Raita."],
              ["tree-nuts", "Tree nuts", "MAY_CONTAIN", "Garnish can vary.", "NEEDS_REVIEW"],
            ],
            tags: [["spicy", "Spicy"], ["no-pork", "No pork", true]],
            pairings: [["Cucumber raita", "Classic cooling side."]],
          },
          {
            name: "Garlic Naan",
            slug: "garlic-naan",
            description: "Tandoor-baked leavened bread with garlic, butter, and cilantro.",
            ingredients: ["wheat flour", "yogurt", "garlic", "butter", "cilantro"],
            origin: "North Indian tandoor restaurants",
            tasteProfile: "Soft, charred edges, buttery garlic, warm bread aroma.",
            preparation: "Dough is slapped onto the tandoor wall and brushed with garlic butter.",
            spiceLevel: 0,
            explanation:
              "The best bread for creamy curries. Tear pieces and use them to scoop sauce.",
            priceCents: 420,
            allergens: [
              ["gluten", "Gluten", "CONTAINS"],
              ["milk", "Milk", "CONTAINS"],
            ],
            tags: [["vegetarian", "Vegetarian", true], ["under-20", "Under €20"]],
            pairings: [["Butter chicken", "The classic sauce-and-bread match."]],
          },
          {
            name: "Mango Kulfi",
            slug: "mango-kulfi",
            description: "Dense Indian ice cream with mango, cardamom, pistachio, and rose.",
            ingredients: ["milk", "mango", "cardamom", "pistachio", "rose"],
            origin: "Indian frozen desserts",
            tasteProfile: "Creamy, dense, fruity mango, floral, nutty.",
            preparation: "Milk is reduced slowly, flavored, frozen, and sliced.",
            spiceLevel: 0,
            explanation:
              "Kulfi is denser than gelato because it is made from reduced milk, not churned airy cream.",
            priceCents: 790,
            allergens: [
              ["milk", "Milk", "CONTAINS"],
              ["tree-nuts", "Tree nuts", "CONTAINS", "Pistachio."],
            ],
            tags: [["vegetarian", "Vegetarian", true], ["under-20", "Under €20"]],
            pairings: [["Masala chai", "Warm spice with cold mango."]],
          },
          {
            name: "Gulab Jamun",
            slug: "gulab-jamun",
            description: "Warm milk dumplings in rose-cardamom syrup with pistachio.",
            ingredients: ["milk solids", "flour", "rose syrup", "cardamom", "pistachio"],
            origin: "North Indian celebration sweets",
            tasteProfile: "Very sweet, syrupy, soft, floral, cardamom-warm.",
            preparation: "Milk dough balls are fried and soaked in fragrant syrup.",
            spiceLevel: 0,
            explanation:
              "A small dessert that is richer and sweeter than it looks; best after a spicy meal.",
            priceCents: 690,
            allergens: [
              ["milk", "Milk", "CONTAINS"],
              ["gluten", "Gluten", "CONTAINS"],
              ["tree-nuts", "Tree nuts", "CONTAINS", "Pistachio garnish."],
            ],
            tags: [["vegetarian", "Vegetarian", true], ["under-20", "Under €20"]],
            pairings: [["Unsweetened chai", "Balances the syrup."]],
          },
        ],
      },
    ],
  },
];

export const demoPublishedMenus = restaurants.map(makeMenu);

export const demoMenusBySlug = Object.fromEntries(
  demoPublishedMenus.map((menu) => [menu.restaurant.slug, menu]),
) as Record<string, RestaurantMenuView>;

export const demoPublishedMenu = demoMenusBySlug["demo-bavarian-wirtshaus"];

export const DEMO_RESTAURANT_IDS = demoPublishedMenus.map((menu) => menu.restaurant.id);

export const demoRestaurantCards = demoPublishedMenus.map((menu) => {
  const itemCount = menu.version.categories.reduce(
    (sum, category) => sum + category.items.length,
    0,
  );

  return {
    id: menu.restaurant.id,
    name: menu.restaurant.name,
    slug: menu.restaurant.slug,
    cuisine: menu.restaurant.cuisine,
    city: menu.restaurant.city,
    description: menu.restaurant.description,
    heroImageUrl: menu.restaurant.heroImageUrl,
    theme: menu.restaurant.theme,
    itemCount,
  };
});

function makeDemoManagerRestaurant(menu: RestaurantMenuView): ManagerRestaurantView {
  const draftVersionId =
    menu.restaurant.id === DEMO_RESTAURANT_ID
      ? DEMO_DRAFT_VERSION_ID
      : `${menu.restaurant.id}-draft-v2`;

  const draftVersion: MenuVersionView = {
    ...menu.version,
    id: draftVersionId,
    version: 2,
    status: "DRAFT",
    publishedAt: null,
    createdAt: new Date("2026-05-01T08:00:00.000Z").toISOString(),
    categories: menu.version.categories.map((category) => ({
      ...category,
      items: category.items.map((item) =>
        item.id === "demo-restaurant-obatzda" ? { ...item, isPromoted: true } : item,
      ),
    })),
  };

  return {
    ...menu,
    draftVersion,
    publishedVersion: menu.version,
    versions: [
      {
        id: draftVersionId,
        version: 2,
        status: "DRAFT",
        publishedAt: null,
        createdAt: new Date("2026-05-01T08:00:00.000Z").toISOString(),
      },
      {
        id: menu.version.id,
        version: 1,
        status: "PUBLISHED",
        publishedAt: menu.version.publishedAt,
        createdAt: menu.version.createdAt,
      },
    ],
  };
}

export const demoManagerRestaurants = demoPublishedMenus.map(makeDemoManagerRestaurant);

export const demoManagerRestaurantsById = Object.fromEntries(
  demoManagerRestaurants.map((restaurant) => [restaurant.restaurant.id, restaurant]),
) as Record<string, ManagerRestaurantView>;

export const demoManagerRestaurant = demoManagerRestaurantsById[DEMO_RESTAURANT_ID];

export const demoAiChangeSets: AiChangeSetView[] = [
  {
    id: "demo-change-set",
    prompt: "Translate the Bavarian classics into clearer English for tourists.",
    status: "PROPOSED",
    riskLevel: "MEDIUM",
    summary: "Prepared friendlier English descriptions and flagged one allergen note for review.",
    warnings: ["Schweinshaxe gravy allergen data needs staff review."],
    createdAt: new Date("2026-05-02T09:30:00.000Z").toISOString(),
    appliedAt: null,
    changes: [
      {
        id: "demo-change-1",
        entityType: "TRANSLATION",
        entityId: "demo-restaurant-schweinshaxe",
        operation: "UPDATE",
        field: "description",
        oldValue: "Crispy roasted pork knuckle with potato dumpling.",
        newValue:
          "A Bavarian beer-hall classic: slow-roasted pork knuckle with crackling skin, potato dumpling, and dark beer gravy.",
        reason: "Clearer for guests unfamiliar with the dish.",
      },
    ],
  },
];

export const demoAnalyticsSummary: AnalyticsSummary = {
  scans: 1284,
  itemViews: 3902,
  allergenViews: 89,
  assistantOpens: 312,
  promotedClicks: 63,
  topLanguages: [
    { locale: "de", count: 612 },
    { locale: "en", count: 410 },
    { locale: "it", count: 96 },
    { locale: "es", count: 72 },
  ],
  topItems: [
    { itemId: "demo-restaurant-schweinshaxe", name: "Schweinshaxe", count: 503 },
    { itemId: "demo-restaurant-kaesespaetzle", name: "Käsespätzle", count: 421 },
    { itemId: "demo-restaurant-obatzda", name: "Obatzda", count: 302 },
  ],
  topFilters: [
    { filter: "traditional", count: 177 },
    { filter: "no-pork", count: 121 },
    { filter: "vegetarian", count: 118 },
  ],
};
