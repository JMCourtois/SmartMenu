import type {
  MenuCategoryView,
  MenuDisplayMode,
  MenuItemView,
  RestaurantMenuView,
} from "@/types/menu";

export const menuDisplayModes = ["photo", "classic"] as const satisfies readonly MenuDisplayMode[];
export const SUPPORTED_LOCALES = ["en", "es", "de", "it", "fr", "ru", "ja", "ko", "zh-CN"] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number];

export const localeOptions = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
    numberLocale: "en-GB",
  },
  {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    flag: "🇪🇸",
    numberLocale: "es-ES",
  },
  {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    flag: "🇩🇪",
    numberLocale: "de-DE",
  },
  {
    code: "it",
    label: "Italian",
    nativeLabel: "Italiano",
    flag: "🇮🇹",
    numberLocale: "it-IT",
  },
  {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    flag: "🇫🇷",
    numberLocale: "fr-FR",
  },
  {
    code: "ru",
    label: "Russian",
    nativeLabel: "Русский",
    flag: "🇷🇺",
    numberLocale: "ru-RU",
  },
  {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
    flag: "🇯🇵",
    numberLocale: "ja-JP",
  },
  {
    code: "ko",
    label: "Korean",
    nativeLabel: "한국어",
    flag: "🇰🇷",
    numberLocale: "ko-KR",
  },
  {
    code: "zh-CN",
    label: "Chinese",
    nativeLabel: "简体中文",
    flag: "🇨🇳",
    numberLocale: "zh-CN",
  },
] as const satisfies ReadonlyArray<{
  code: LocaleCode;
  label: string;
  nativeLabel: string;
  flag: string;
  numberLocale: string;
}>;

export const quickIntents = [
  { value: "traditional" },
  { value: "vegetarian" },
  { value: "vegan" },
  { value: "no-pork" },
  { value: "gluten-free" },
  { value: "light" },
  { value: "spicy" },
  { value: "under-20" },
  { value: "best-with-beer" },
] as const;

export type QuickIntentValue = (typeof quickIntents)[number]["value"];
export type LocalizedMenuItemField =
  | "name"
  | "description"
  | "origin"
  | "tasteProfile"
  | "preparation"
  | "explanation";

type LocalizedRestaurantField = "description" | "cuisine" | "legalNotice";

type GuestCopy = {
  searchPlaceholder: string;
  openMenu: string;
  showSignatureDishes: string;
  askAiWhatToOrder: string;
  getRecommendation: string;
  guideMe: string;
  aiCtaHelper: string;
  photoView: string;
  classicView: string;
  photoViewDescription: string;
  classicViewDescription: string;
  quickFilters: string;
  noDishesTitle: string;
  noDishesDescription: string;
  recommendedNow: string;
  recommendedDescription: string;
  info: string;
  askAiAboutDish: string;
  askStaff: string;
  unavailable: string;
  promoted: string;
  allergens: string;
  dietary: string;
  ingredients: string;
  ingredientsPrefix: string;
  origin: string;
  tasteProfile: string;
  preparation: string;
  spiceLevel: string;
  pairings: string;
  explanation: string;
  safetyNotice: string;
  chooseLanguage: string;
  ai: {
    title: string;
    subtitle: string;
    oneClickDemos: string;
    filterPreferences: string;
    activeContext: string;
    noActiveContext: string;
    resetFilters: string;
    resetVisit: string;
    preferenceSummary: string;
    messagePlaceholder: string;
    send: string;
    thinking: string;
    recommendations: string;
    safetyNotes: string;
    followUps: string;
    budget: string;
    spice: string;
    mild: string;
    medium: string;
    hot: string;
    visibleMenu: string;
    demoPrompts: Array<{ label: string; prompt: string; description: string }>;
  };
  intents: Record<QuickIntentValue, string>;
};

const guestCopyByLocale: Record<LocaleCode, GuestCopy> = {
  en: {
    searchPlaceholder: "Search dishes, ingredients, allergens...",
    openMenu: "Open menu",
    showSignatureDishes: "Show signature dishes",
    askAiWhatToOrder: "Get a recommendation",
    getRecommendation: "Get a recommendation",
    guideMe: "Guide me",
    aiCtaHelper: "Tell us taste, budget, allergies",
    photoView: "Photo menu",
    classicView: "Classic menu",
    photoViewDescription: "Large cards with photos, tags, and quick actions.",
    classicViewDescription: "A real-menu style layout with compact details.",
    quickFilters: "Quick filters",
    noDishesTitle: "No matching dishes",
    noDishesDescription: "Try another filter or ask the AI concierge for a softer match.",
    recommendedNow: "Recommended now",
    recommendedDescription: "Good starting points from the visible menu.",
    info: "Info",
    askAiAboutDish: "Ask AI about this dish",
    askStaff: "Ask staff",
    unavailable: "Unavailable",
    promoted: "Featured",
    allergens: "Allergens",
    dietary: "Dietary",
    ingredients: "Ingredients",
    ingredientsPrefix: "Ingredients",
    origin: "Origin",
    tasteProfile: "Taste",
    preparation: "Preparation",
    spiceLevel: "Spice",
    pairings: "Pairings",
    explanation: "What to expect",
    safetyNotice: "For severe allergies, confirm ingredients and cross-contact risk with staff.",
    chooseLanguage: "Choose language",
    ai: {
      title: "Menu guide",
      subtitle: "Get a confident first order from this menu.",
      oneClickDemos: "Try one-tap recommendations",
      filterPreferences: "Filter preferences",
      activeContext: "Active context",
      noActiveContext: "No preferences selected yet",
      resetFilters: "Reset filters",
      resetVisit: "Reset visit",
      preferenceSummary: "Using your current preferences",
      messagePlaceholder: "Ask what to order, avoid, pair, or understand...",
      send: "Send",
      thinking: "Checking the menu...",
      recommendations: "Recommended dishes",
      safetyNotes: "Safety notes",
      followUps: "Ask next",
      budget: "Budget",
      spice: "Spice",
      mild: "Mild",
      medium: "Medium",
      hot: "Hot",
      visibleMenu: "visible dishes",
      demoPrompts: [
        {
          label: "Choose for me",
          prompt: "I'm new here, choose for me.",
          description: "Balanced first order",
        },
        {
          label: "Vegetarian and fresh",
          prompt: "I want something vegetarian and fresh.",
          description: "Light, bright options",
        },
        {
          label: "Spicy but no pork",
          prompt: "I want something spicy but no pork.",
          description: "Heat with guardrails",
        },
        {
          label: "Under €20",
          prompt: "What should I order under €20?",
          description: "Budget-friendly picks",
        },
        {
          label: "Most traditional",
          prompt: "Explain the most traditional dish and what it tastes like.",
          description: "Culture and pairing context",
        },
      ],
    },
    intents: {
      traditional: "Traditional",
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      "no-pork": "No pork",
      "gluten-free": "Gluten-free",
      light: "Light",
      spicy: "Spicy",
      "under-20": "Under €20",
      "best-with-beer": "Best pairing",
    },
  },
  es: {
    searchPlaceholder: "Buscar platos, ingredientes, alérgenos...",
    openMenu: "Abrir menú",
    showSignatureDishes: "Ver especialidades",
    askAiWhatToOrder: "Recibir recomendación",
    getRecommendation: "Recibir recomendación",
    guideMe: "Guíame",
    aiCtaHelper: "Dinos gustos, presupuesto y alergias",
    photoView: "Menú con fotos",
    classicView: "Menú clásico",
    photoViewDescription: "Tarjetas grandes con fotos, etiquetas y acciones rápidas.",
    classicViewDescription: "Formato de carta real con detalles compactos.",
    quickFilters: "Filtros rápidos",
    noDishesTitle: "No hay platos compatibles",
    noDishesDescription: "Prueba otro filtro o pregunta al concierge de IA.",
    recommendedNow: "Recomendado ahora",
    recommendedDescription: "Buenas opciones para empezar según el menú visible.",
    info: "Info",
    askAiAboutDish: "Preguntar a la IA sobre este plato",
    askStaff: "Preguntar al personal",
    unavailable: "No disponible",
    promoted: "Destacado",
    allergens: "Alérgenos",
    dietary: "Dietas",
    ingredients: "Ingredientes",
    ingredientsPrefix: "Ingredientes",
    origin: "Origen",
    tasteProfile: "Sabor",
    preparation: "Preparación",
    spiceLevel: "Picante",
    pairings: "Maridajes",
    explanation: "Qué esperar",
    safetyNotice: "Para alergias severas, confirma ingredientes y contaminación cruzada con el personal.",
    chooseLanguage: "Elegir idioma",
    ai: {
      title: "Guía del menú",
      subtitle: "Encuentra un primer pedido seguro en esta carta.",
      oneClickDemos: "Prueba recomendaciones rápidas",
      filterPreferences: "Filtrar preferencias",
      activeContext: "Contexto activo",
      noActiveContext: "Todavía no hay preferencias",
      resetFilters: "Restablecer filtros",
      resetVisit: "Reiniciar visita",
      preferenceSummary: "Usando tus preferencias actuales",
      messagePlaceholder: "Pregunta qué pedir, evitar, maridar o entender...",
      send: "Enviar",
      thinking: "Revisando el menú...",
      recommendations: "Platos recomendados",
      safetyNotes: "Notas de seguridad",
      followUps: "Preguntar después",
      budget: "Presupuesto",
      spice: "Picante",
      mild: "Suave",
      medium: "Medio",
      hot: "Fuerte",
      visibleMenu: "platos visibles",
      demoPrompts: [
        {
          label: "Elige por mí",
          prompt: "Soy nuevo aquí, elige por mí.",
          description: "Primera opción equilibrada",
        },
        {
          label: "Vegetariano y fresco",
          prompt: "Quiero algo vegetariano y fresco.",
          description: "Opciones ligeras",
        },
        {
          label: "Picante sin cerdo",
          prompt: "Quiero algo picante pero sin cerdo.",
          description: "Sabor intenso con cuidado",
        },
        {
          label: "Menos de €20",
          prompt: "¿Qué debería pedir por menos de €20?",
          description: "Opciones económicas",
        },
        {
          label: "Más tradicional",
          prompt: "Explícame el plato más tradicional y cómo sabe.",
          description: "Contexto cultural",
        },
      ],
    },
    intents: {
      traditional: "Tradicional",
      vegetarian: "Vegetariano",
      vegan: "Vegano",
      "no-pork": "Sin cerdo",
      "gluten-free": "Sin gluten",
      light: "Ligero",
      spicy: "Picante",
      "under-20": "Menos de €20",
      "best-with-beer": "Mejor maridaje",
    },
  },
  de: {
    searchPlaceholder: "Gerichte, Zutaten, Allergene suchen...",
    openMenu: "Menü öffnen",
    showSignatureDishes: "Signature-Gerichte zeigen",
    askAiWhatToOrder: "Empfehlung erhalten",
    getRecommendation: "Empfehlung erhalten",
    guideMe: "Hilf mir wählen",
    aiCtaHelper: "Geschmack, Budget, Allergien angeben",
    photoView: "Fotomenü",
    classicView: "Klassische Karte",
    photoViewDescription: "Große Karten mit Fotos, Tags und schnellen Aktionen.",
    classicViewDescription: "Wie eine echte Speisekarte mit kompakten Details.",
    quickFilters: "Schnellfilter",
    noDishesTitle: "Keine passenden Gerichte",
    noDishesDescription: "Probiere einen anderen Filter oder frage den KI-Concierge.",
    recommendedNow: "Jetzt empfohlen",
    recommendedDescription: "Gute Startpunkte aus der sichtbaren Karte.",
    info: "Info",
    askAiAboutDish: "KI zu diesem Gericht fragen",
    askStaff: "Personal fragen",
    unavailable: "Nicht verfügbar",
    promoted: "Empfohlen",
    allergens: "Allergene",
    dietary: "Ernährung",
    ingredients: "Zutaten",
    ingredientsPrefix: "Zutaten",
    origin: "Herkunft",
    tasteProfile: "Geschmack",
    preparation: "Zubereitung",
    spiceLevel: "Schärfe",
    pairings: "Empfehlungen",
    explanation: "Was dich erwartet",
    safetyNotice: "Bei starken Allergien bitte Zutaten und Kreuzkontakt beim Personal bestätigen.",
    chooseLanguage: "Sprache wählen",
    ai: {
      title: "Menüguide",
      subtitle: "Finde eine sichere erste Bestellung aus dieser Karte.",
      oneClickDemos: "Schnelle Empfehlungen testen",
      filterPreferences: "Präferenzen filtern",
      activeContext: "Aktiver Kontext",
      noActiveContext: "Noch keine Präferenzen ausgewählt",
      resetFilters: "Filter zurücksetzen",
      resetVisit: "Besuch zurücksetzen",
      preferenceSummary: "Mit deinen aktuellen Präferenzen",
      messagePlaceholder: "Frag, was du bestellen, meiden, kombinieren oder verstehen sollst...",
      send: "Senden",
      thinking: "Menü wird geprüft...",
      recommendations: "Empfohlene Gerichte",
      safetyNotes: "Sicherheitshinweise",
      followUps: "Weiter fragen",
      budget: "Budget",
      spice: "Schärfe",
      mild: "Mild",
      medium: "Mittel",
      hot: "Scharf",
      visibleMenu: "sichtbare Gerichte",
      demoPrompts: [
        {
          label: "Wähl für mich",
          prompt: "Ich bin neu hier, wähle für mich.",
          description: "Ausgewogener Start",
        },
        {
          label: "Vegetarisch & frisch",
          prompt: "Ich möchte etwas Vegetarisches und Frisches.",
          description: "Leichte Optionen",
        },
        {
          label: "Scharf ohne Schwein",
          prompt: "Ich möchte etwas Scharfes, aber ohne Schwein.",
          description: "Schärfe mit Grenzen",
        },
        {
          label: "Unter €20",
          prompt: "Was sollte ich unter €20 bestellen?",
          description: "Budgetfreundlich",
        },
        {
          label: "Am traditionellsten",
          prompt: "Erkläre das traditionellste Gericht und wie es schmeckt.",
          description: "Kultur und Pairing",
        },
      ],
    },
    intents: {
      traditional: "Traditionell",
      vegetarian: "Vegetarisch",
      vegan: "Vegan",
      "no-pork": "Ohne Schwein",
      "gluten-free": "Glutenfrei",
      light: "Leicht",
      spicy: "Scharf",
      "under-20": "Unter €20",
      "best-with-beer": "Beste Begleitung",
    },
  },
  it: {
    searchPlaceholder: "Cerca piatti, ingredienti, allergeni...",
    openMenu: "Apri menu",
    showSignatureDishes: "Mostra specialità",
    askAiWhatToOrder: "Ricevi un consiglio",
    getRecommendation: "Ricevi un consiglio",
    guideMe: "Guidami",
    aiCtaHelper: "Indica gusti, budget e allergie",
    photoView: "Menu con foto",
    classicView: "Menu classico",
    photoViewDescription: "Schede grandi con foto, etichette e azioni rapide.",
    classicViewDescription: "Un layout compatto simile a un vero menu stampato.",
    quickFilters: "Filtri rapidi",
    noDishesTitle: "Nessun piatto corrisponde",
    noDishesDescription: "Prova un altro filtro o chiedi al concierge AI.",
    recommendedNow: "Consigliati ora",
    recommendedDescription: "Buoni punti di partenza dal menu visibile.",
    info: "Info",
    askAiAboutDish: "Chiedi all'AI di questo piatto",
    askStaff: "Chiedi allo staff",
    unavailable: "Non disponibile",
    promoted: "In evidenza",
    allergens: "Allergeni",
    dietary: "Diete",
    ingredients: "Ingredienti",
    ingredientsPrefix: "Ingredienti",
    origin: "Origine",
    tasteProfile: "Gusto",
    preparation: "Preparazione",
    spiceLevel: "Piccantezza",
    pairings: "Abbinamenti",
    explanation: "Cosa aspettarsi",
    safetyNotice: "Per allergie gravi, conferma ingredienti e rischio di contaminazione con lo staff.",
    chooseLanguage: "Scegli lingua",
    ai: {
      title: "Guida al menu",
      subtitle: "Scegli con sicurezza il primo ordine da questo menu.",
      oneClickDemos: "Prova consigli rapidi",
      filterPreferences: "Filtra preferenze",
      activeContext: "Contesto attivo",
      noActiveContext: "Nessuna preferenza selezionata",
      resetFilters: "Reimposta filtri",
      resetVisit: "Reimposta visita",
      preferenceSummary: "Uso le tue preferenze attuali",
      messagePlaceholder: "Chiedi cosa ordinare, evitare, abbinare o capire...",
      send: "Invia",
      thinking: "Controllo il menu...",
      recommendations: "Piatti consigliati",
      safetyNotes: "Note di sicurezza",
      followUps: "Chiedi dopo",
      budget: "Budget",
      spice: "Piccante",
      mild: "Delicato",
      medium: "Medio",
      hot: "Forte",
      visibleMenu: "piatti visibili",
      demoPrompts: [
        { label: "Scegli tu", prompt: "Sono nuovo qui, scegli tu per me.", description: "Primo ordine equilibrato" },
        { label: "Vegetariano fresco", prompt: "Vorrei qualcosa di vegetariano e fresco.", description: "Opzioni leggere" },
        { label: "Piccante senza maiale", prompt: "Vorrei qualcosa di piccante ma senza maiale.", description: "Piccante con attenzione" },
        { label: "Sotto €20", prompt: "Cosa dovrei ordinare sotto i €20?", description: "Scelte convenienti" },
        { label: "Più tradizionale", prompt: "Spiegami il piatto più tradizionale e che sapore ha.", description: "Cultura e abbinamento" },
      ],
    },
    intents: {
      traditional: "Tradizionale",
      vegetarian: "Vegetariano",
      vegan: "Vegano",
      "no-pork": "Senza maiale",
      "gluten-free": "Senza glutine",
      light: "Leggero",
      spicy: "Piccante",
      "under-20": "Sotto €20",
      "best-with-beer": "Miglior abbinamento",
    },
  },
  fr: {
    searchPlaceholder: "Rechercher plats, ingrédients, allergènes...",
    openMenu: "Ouvrir le menu",
    showSignatureDishes: "Voir les spécialités",
    askAiWhatToOrder: "Recevoir une recommandation",
    getRecommendation: "Recevoir une recommandation",
    guideMe: "Guide-moi",
    aiCtaHelper: "Indiquez goûts, budget et allergies",
    photoView: "Menu photo",
    classicView: "Menu classique",
    photoViewDescription: "Grandes cartes avec photos, étiquettes et actions rapides.",
    classicViewDescription: "Un affichage compact proche d'une vraie carte imprimée.",
    quickFilters: "Filtres rapides",
    noDishesTitle: "Aucun plat correspondant",
    noDishesDescription: "Essayez un autre filtre ou demandez au concierge IA.",
    recommendedNow: "Recommandé maintenant",
    recommendedDescription: "Bons choix de départ dans le menu visible.",
    info: "Info",
    askAiAboutDish: "Demander à l'IA ce plat",
    askStaff: "Demander au personnel",
    unavailable: "Indisponible",
    promoted: "Mis en avant",
    allergens: "Allergènes",
    dietary: "Régimes",
    ingredients: "Ingrédients",
    ingredientsPrefix: "Ingrédients",
    origin: "Origine",
    tasteProfile: "Goût",
    preparation: "Préparation",
    spiceLevel: "Épices",
    pairings: "Accords",
    explanation: "À quoi s'attendre",
    safetyNotice: "En cas d'allergie sévère, confirmez les ingrédients et les risques de contact croisé avec le personnel.",
    chooseLanguage: "Choisir la langue",
    ai: {
      title: "Guide du menu",
      subtitle: "Choisissez une première commande avec confiance.",
      oneClickDemos: "Essayer des recommandations rapides",
      filterPreferences: "Filtrer les préférences",
      activeContext: "Contexte actif",
      noActiveContext: "Aucune préférence sélectionnée",
      resetFilters: "Réinitialiser les filtres",
      resetVisit: "Réinitialiser la visite",
      preferenceSummary: "Avec vos préférences actuelles",
      messagePlaceholder: "Demandez quoi commander, éviter, accorder ou comprendre...",
      send: "Envoyer",
      thinking: "Analyse du menu...",
      recommendations: "Plats recommandés",
      safetyNotes: "Notes de sécurité",
      followUps: "Demander ensuite",
      budget: "Budget",
      spice: "Épices",
      mild: "Doux",
      medium: "Moyen",
      hot: "Fort",
      visibleMenu: "plats visibles",
      demoPrompts: [
        { label: "Choisissez pour moi", prompt: "Je découvre ce lieu, choisissez pour moi.", description: "Premier choix équilibré" },
        { label: "Végétarien frais", prompt: "Je veux quelque chose de végétarien et frais.", description: "Options légères" },
        { label: "Épicé sans porc", prompt: "Je veux quelque chose d'épicé mais sans porc.", description: "Du piquant avec limites" },
        { label: "Moins de 20 €", prompt: "Que commander pour moins de 20 € ?", description: "Choix économiques" },
        { label: "Plus traditionnel", prompt: "Expliquez le plat le plus traditionnel et son goût.", description: "Culture et accord" },
      ],
    },
    intents: {
      traditional: "Traditionnel",
      vegetarian: "Végétarien",
      vegan: "Végan",
      "no-pork": "Sans porc",
      "gluten-free": "Sans gluten",
      light: "Léger",
      spicy: "Épicé",
      "under-20": "Moins de 20 €",
      "best-with-beer": "Meilleur accord",
    },
  },
  ru: {
    searchPlaceholder: "Искать блюда, ингредиенты, аллергены...",
    openMenu: "Открыть меню",
    showSignatureDishes: "Показать фирменные блюда",
    askAiWhatToOrder: "Получить рекомендацию",
    getRecommendation: "Получить рекомендацию",
    guideMe: "Помогите выбрать",
    aiCtaHelper: "Укажите вкус, бюджет и аллергии",
    photoView: "Меню с фото",
    classicView: "Классическое меню",
    photoViewDescription: "Большие карточки с фото, метками и быстрыми действиями.",
    classicViewDescription: "Компактный вид, похожий на настоящую печатную карту.",
    quickFilters: "Быстрые фильтры",
    noDishesTitle: "Подходящих блюд нет",
    noDishesDescription: "Попробуйте другой фильтр или спросите ИИ-консьержа.",
    recommendedNow: "Рекомендуем сейчас",
    recommendedDescription: "Хорошие варианты для начала из видимого меню.",
    info: "Инфо",
    askAiAboutDish: "Спросить ИИ об этом блюде",
    askStaff: "Уточнить у персонала",
    unavailable: "Недоступно",
    promoted: "Рекомендуем",
    allergens: "Аллергены",
    dietary: "Диеты",
    ingredients: "Ингредиенты",
    ingredientsPrefix: "Ингредиенты",
    origin: "Происхождение",
    tasteProfile: "Вкус",
    preparation: "Приготовление",
    spiceLevel: "Острота",
    pairings: "Сочетания",
    explanation: "Чего ожидать",
    safetyNotice: "При тяжелой аллергии уточните ингредиенты и риск перекрестного контакта у персонала.",
    chooseLanguage: "Выбрать язык",
    ai: {
      title: "Гид по меню",
      subtitle: "Поможем уверенно выбрать первый заказ.",
      oneClickDemos: "Быстрые рекомендации",
      filterPreferences: "Фильтр предпочтений",
      activeContext: "Активные условия",
      noActiveContext: "Предпочтения еще не выбраны",
      resetFilters: "Сбросить фильтры",
      resetVisit: "Сбросить визит",
      preferenceSummary: "Учитываем текущие предпочтения",
      messagePlaceholder: "Спросите, что заказать, избегать, сочетать или понять...",
      send: "Отправить",
      thinking: "Проверяю меню...",
      recommendations: "Рекомендованные блюда",
      safetyNotes: "Заметки о безопасности",
      followUps: "Следующий вопрос",
      budget: "Бюджет",
      spice: "Острота",
      mild: "Мягко",
      medium: "Средне",
      hot: "Остро",
      visibleMenu: "видимых блюд",
      demoPrompts: [
        { label: "Выбери за меня", prompt: "Я здесь впервые, выбери за меня.", description: "Сбалансированный первый заказ" },
        { label: "Вегетарианское и свежее", prompt: "Хочу что-то вегетарианское и свежее.", description: "Легкие варианты" },
        { label: "Остро, без свинины", prompt: "Хочу что-то острое, но без свинины.", description: "Острота с ограничениями" },
        { label: "До €20", prompt: "Что заказать до €20?", description: "Бюджетные варианты" },
        { label: "Самое традиционное", prompt: "Объясни самое традиционное блюдо и его вкус.", description: "Культура и сочетания" },
      ],
    },
    intents: {
      traditional: "Традиционное",
      vegetarian: "Вегетарианское",
      vegan: "Веганское",
      "no-pork": "Без свинины",
      "gluten-free": "Без глютена",
      light: "Легкое",
      spicy: "Острое",
      "under-20": "До €20",
      "best-with-beer": "Лучшее сочетание",
    },
  },
  ja: {
    searchPlaceholder: "料理、食材、アレルゲンを検索...",
    openMenu: "メニューを開く",
    showSignatureDishes: "看板料理を見る",
    askAiWhatToOrder: "おすすめを見る",
    getRecommendation: "おすすめを見る",
    guideMe: "選ぶのを手伝う",
    aiCtaHelper: "好み・予算・アレルギーを伝える",
    photoView: "写真メニュー",
    classicView: "クラシックメニュー",
    photoViewDescription: "写真、タグ、クイック操作があるカード表示。",
    classicViewDescription: "実際の紙メニューに近いコンパクトな表示。",
    quickFilters: "クイックフィルター",
    noDishesTitle: "該当する料理がありません",
    noDishesDescription: "別の条件にするか、AIコンシェルジュに聞いてください。",
    recommendedNow: "今のおすすめ",
    recommendedDescription: "表示中のメニューから選びやすい料理です。",
    info: "詳細",
    askAiAboutDish: "この料理をAIに聞く",
    askStaff: "スタッフに確認",
    unavailable: "売り切れ",
    promoted: "おすすめ",
    allergens: "アレルゲン",
    dietary: "食事条件",
    ingredients: "食材",
    ingredientsPrefix: "食材",
    origin: "由来",
    tasteProfile: "味わい",
    preparation: "調理",
    spiceLevel: "辛さ",
    pairings: "相性",
    explanation: "どんな料理か",
    safetyNotice: "重いアレルギーがある場合は、食材と交差接触をスタッフに確認してください。",
    chooseLanguage: "言語を選択",
    ai: {
      title: "メニューガイド",
      subtitle: "このメニューから安心して最初の一品を選びます。",
      oneClickDemos: "ワンタップで試す",
      filterPreferences: "好みを絞り込む",
      activeContext: "現在の条件",
      noActiveContext: "まだ条件がありません",
      resetFilters: "条件をリセット",
      resetVisit: "訪問をリセット",
      preferenceSummary: "現在の好みを使っています",
      messagePlaceholder: "何を頼むか、避けるもの、相性、料理の意味を質問...",
      send: "送信",
      thinking: "メニューを確認中...",
      recommendations: "おすすめ料理",
      safetyNotes: "安全メモ",
      followUps: "次に聞く",
      budget: "予算",
      spice: "辛さ",
      mild: "控えめ",
      medium: "普通",
      hot: "辛い",
      visibleMenu: "表示中の料理",
      demoPrompts: [
        {
          label: "選んで",
          prompt: "初めてなので、私に合う料理を選んでください。",
          description: "バランスの良い一皿",
        },
        {
          label: "野菜で爽やか",
          prompt: "ベジタリアンでさっぱりしたものが食べたいです。",
          description: "軽い選択肢",
        },
        {
          label: "辛い・豚なし",
          prompt: "辛いものがいいですが、豚肉は避けたいです。",
          description: "辛さと条件",
        },
        {
          label: "20ユーロ以下",
          prompt: "20ユーロ以下なら何を頼むべきですか？",
          description: "予算に合う料理",
        },
        {
          label: "伝統料理",
          prompt: "一番伝統的な料理と味を説明してください。",
          description: "文化と相性",
        },
      ],
    },
    intents: {
      traditional: "伝統的",
      vegetarian: "ベジタリアン",
      vegan: "ヴィーガン",
      "no-pork": "豚肉なし",
      "gluten-free": "グルテンなし",
      light: "軽め",
      spicy: "辛い",
      "under-20": "20ユーロ以下",
      "best-with-beer": "相性が良い",
    },
  },
  ko: {
    searchPlaceholder: "음식, 재료, 알레르겐 검색...",
    openMenu: "메뉴 열기",
    showSignatureDishes: "대표 메뉴 보기",
    askAiWhatToOrder: "추천 받기",
    getRecommendation: "추천 받기",
    guideMe: "골라줘",
    aiCtaHelper: "취향, 예산, 알레르기를 알려주세요",
    photoView: "사진 메뉴",
    classicView: "클래식 메뉴",
    photoViewDescription: "사진, 태그, 빠른 동작이 있는 카드형 메뉴입니다.",
    classicViewDescription: "실제 종이 메뉴처럼 읽기 쉬운 구성입니다.",
    quickFilters: "빠른 필터",
    noDishesTitle: "맞는 메뉴가 없습니다",
    noDishesDescription: "다른 필터를 선택하거나 AI 컨시어지에게 물어보세요.",
    recommendedNow: "지금 추천",
    recommendedDescription: "현재 보이는 메뉴에서 시작하기 좋은 선택입니다.",
    info: "정보",
    askAiAboutDish: "이 메뉴를 AI에게 묻기",
    askStaff: "직원에게 확인",
    unavailable: "품절",
    promoted: "추천",
    allergens: "알레르겐",
    dietary: "식단",
    ingredients: "재료",
    ingredientsPrefix: "재료",
    origin: "유래",
    tasteProfile: "맛",
    preparation: "조리",
    spiceLevel: "맵기",
    pairings: "페어링",
    explanation: "무엇을 기대할지",
    safetyNotice: "심한 알레르기가 있다면 재료와 교차 접촉 위험을 직원에게 확인하세요.",
    chooseLanguage: "언어 선택",
    ai: {
      title: "메뉴 가이드",
      subtitle: "이 메뉴에서 자신 있게 첫 주문을 고를 수 있어요.",
      oneClickDemos: "원터치 추천",
      filterPreferences: "선호도 필터",
      activeContext: "활성 조건",
      noActiveContext: "아직 선택한 조건이 없습니다",
      resetFilters: "필터 초기화",
      resetVisit: "방문 초기화",
      preferenceSummary: "현재 선호도를 반영합니다",
      messagePlaceholder: "무엇을 주문할지, 피할지, 곁들일지, 이해할지 물어보세요...",
      send: "보내기",
      thinking: "메뉴를 확인하는 중...",
      recommendations: "추천 메뉴",
      safetyNotes: "안전 안내",
      followUps: "다음 질문",
      budget: "예산",
      spice: "맵기",
      mild: "순한맛",
      medium: "보통",
      hot: "매운맛",
      visibleMenu: "보이는 메뉴",
      demoPrompts: [
        {
          label: "대신 골라줘",
          prompt: "처음 왔어요. 저에게 맞는 메뉴를 골라주세요.",
          description: "균형 잡힌 첫 주문",
        },
        {
          label: "채식과 신선함",
          prompt: "채식이면서 신선한 메뉴를 원해요.",
          description: "가벼운 선택",
        },
        {
          label: "매운맛, 돼지고기 제외",
          prompt: "매운 메뉴를 원하지만 돼지고기는 피하고 싶어요.",
          description: "조건 있는 매운맛",
        },
        {
          label: "20유로 이하",
          prompt: "20유로 이하라면 무엇을 주문하면 좋을까요?",
          description: "예산 친화적",
        },
        {
          label: "가장 전통적인 메뉴",
          prompt: "가장 전통적인 메뉴와 맛을 설명해주세요.",
          description: "문화와 페어링",
        },
      ],
    },
    intents: {
      traditional: "전통",
      vegetarian: "채식",
      vegan: "비건",
      "no-pork": "돼지고기 제외",
      "gluten-free": "글루텐 없음",
      light: "가벼움",
      spicy: "매운맛",
      "under-20": "20유로 이하",
      "best-with-beer": "좋은 페어링",
    },
  },
  "zh-CN": {
    searchPlaceholder: "搜索菜品、食材、过敏原...",
    openMenu: "打开菜单",
    showSignatureDishes: "查看招牌菜",
    askAiWhatToOrder: "获取推荐",
    getRecommendation: "获取推荐",
    guideMe: "帮我选",
    aiCtaHelper: "告诉我们口味、预算和过敏情况",
    photoView: "图片菜单",
    classicView: "经典菜单",
    photoViewDescription: "带图片、标签和快捷操作的大卡片菜单。",
    classicViewDescription: "像纸质菜单一样紧凑易读的布局。",
    quickFilters: "快速筛选",
    noDishesTitle: "没有匹配的菜品",
    noDishesDescription: "试试其他筛选，或询问 AI 菜单助手。",
    recommendedNow: "现在推荐",
    recommendedDescription: "从当前可见菜单中挑选的入门好选择。",
    info: "详情",
    askAiAboutDish: "问 AI 这道菜",
    askStaff: "询问店员",
    unavailable: "暂不可点",
    promoted: "推荐",
    allergens: "过敏原",
    dietary: "饮食偏好",
    ingredients: "食材",
    ingredientsPrefix: "食材",
    origin: "来源",
    tasteProfile: "味道",
    preparation: "做法",
    spiceLevel: "辣度",
    pairings: "搭配",
    explanation: "可以期待什么",
    safetyNotice: "如有严重过敏，请向店员确认食材和交叉接触风险。",
    chooseLanguage: "选择语言",
    ai: {
      title: "菜单指南",
      subtitle: "帮你从这份菜单里安心选择第一单。",
      oneClickDemos: "一键试试推荐",
      filterPreferences: "筛选偏好",
      activeContext: "当前条件",
      noActiveContext: "尚未选择偏好",
      resetFilters: "重置筛选",
      resetVisit: "重置本次访问",
      preferenceSummary: "使用当前偏好",
      messagePlaceholder: "询问点什么、避开什么、如何搭配或理解菜品...",
      send: "发送",
      thinking: "正在查看菜单...",
      recommendations: "推荐菜品",
      safetyNotes: "安全提示",
      followUps: "继续提问",
      budget: "预算",
      spice: "辣度",
      mild: "清淡",
      medium: "中等",
      hot: "偏辣",
      visibleMenu: "道可见菜品",
      demoPrompts: [
        { label: "帮我选", prompt: "我第一次来，请帮我选一道适合的菜。", description: "均衡的第一单" },
        { label: "素食清爽", prompt: "我想要素食而且清爽的菜。", description: "轻盈选择" },
        { label: "辣但不含猪肉", prompt: "我想吃辣的，但不要猪肉。", description: "有条件的辣味" },
        { label: "20欧以内", prompt: "20欧以内我应该点什么？", description: "预算友好" },
        { label: "最传统", prompt: "请解释最传统的菜以及它的味道。", description: "文化与搭配" },
      ],
    },
    intents: {
      traditional: "传统",
      vegetarian: "素食",
      vegan: "纯素",
      "no-pork": "不含猪肉",
      "gluten-free": "无麸质",
      light: "清淡",
      spicy: "辣",
      "under-20": "20欧以内",
      "best-with-beer": "适合搭配",
    },
  },
};

export function normalizeMenuDisplayMode(value: string | undefined): MenuDisplayMode {
  return value === "classic" ? "classic" : "photo";
}

export function normalizeLocale(value: string | null | undefined): LocaleCode {
  return SUPPORTED_LOCALES.includes(value as LocaleCode) ? (value as LocaleCode) : "en";
}

export function getGuestCopy(locale: string | null | undefined) {
  return guestCopyByLocale[normalizeLocale(locale)];
}

export function getLocaleOption(locale: string | null | undefined) {
  const code = normalizeLocale(locale);
  return localeOptions.find((option) => option.code === code) ?? localeOptions[0];
}

export function formatLocalizedPrice(cents: number, currency: string, locale: string | null | undefined) {
  const option = getLocaleOption(locale);
  return new Intl.NumberFormat(option.numberLocale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatPrice(cents: number, currency: string) {
  return formatLocalizedPrice(cents, currency, "de");
}

export function localizedItemField(
  item: MenuItemView,
  locale: string | null | undefined,
  field: LocalizedMenuItemField,
) {
  const localeCode = normalizeLocale(locale);
  const fallbackTranslation = item.translations.find((translation) => translation.locale === "en");
  const localeTranslation =
    item.translations.find((translation) => translation.locale === localeCode) ?? fallbackTranslation;
  const directValue = item[field];
  const translatedValue = localeTranslation?.[field];

  return translatedValue || directValue || fallbackTranslation?.[field] || "";
}

export function localizedName(item: MenuItemView, locale: string) {
  return localizedItemField(item, locale, "name");
}

export function localizedDescription(item: MenuItemView, locale: string) {
  return localizedItemField(item, locale, "description");
}

export function localizedIngredients(item: MenuItemView, locale: string | null | undefined) {
  const localeCode = normalizeLocale(locale);
  return (
    item.translations.find((translation) => translation.locale === localeCode)?.ingredients ??
    item.translations.find((translation) => translation.locale === "en")?.ingredients ??
    item.ingredients
  );
}

export function localizedIngredientLine(
  item: MenuItemView,
  locale: string | null | undefined,
  limit = 5,
) {
  const ingredients = localizedIngredients(item, locale).slice(0, limit);
  const separator = normalizeLocale(locale) === "ja" || normalizeLocale(locale) === "zh-CN" ? "、" : ", ";
  return ingredients.join(separator);
}

export function localizedCtaPrompts(item: MenuItemView, locale: string | null | undefined) {
  const localeCode = normalizeLocale(locale);
  return (
    item.translations.find((translation) => translation.locale === localeCode)?.ctaPrompts ??
    item.translations.find((translation) => translation.locale === "en")?.ctaPrompts ??
    item.ctaPrompts
  );
}

export type DietaryTagIconKey =
  | "badge-check"
  | "beer"
  | "coin"
  | "flame"
  | "leaf"
  | "no-pork"
  | "shield-alert"
  | "sparkles"
  | "utensils"
  | "wheat-off";

export type DietaryTagTone = "accent" | "danger" | "fresh" | "gold" | "neutral" | "spicy";

export function getDietaryTagVisual(code: string): {
  icon: DietaryTagIconKey;
  tone: DietaryTagTone;
} {
  const visuals: Record<string, { icon: DietaryTagIconKey; tone: DietaryTagTone }> = {
    vegetarian: { icon: "leaf", tone: "fresh" },
    vegan: { icon: "leaf", tone: "fresh" },
    "no-pork": { icon: "no-pork", tone: "danger" },
    pork: { icon: "shield-alert", tone: "danger" },
    "gluten-free": { icon: "wheat-off", tone: "fresh" },
    spicy: { icon: "flame", tone: "spicy" },
    light: { icon: "sparkles", tone: "fresh" },
    traditional: { icon: "badge-check", tone: "accent" },
    "best-with-beer": { icon: "beer", tone: "gold" },
    "under-20": { icon: "coin", tone: "gold" },
    "street-food": { icon: "utensils", tone: "accent" },
    comfort: { icon: "utensils", tone: "neutral" },
  };

  return visuals[code] ?? { icon: "utensils", tone: "neutral" };
}

export function localizedCategoryName(category: MenuCategoryView, locale: string | null | undefined) {
  const localeCode = normalizeLocale(locale);
  return (
    category.translations?.find((translation) => translation.locale === localeCode)?.name ??
    category.translations?.find((translation) => translation.locale === "en")?.name ??
    category.name
  );
}

export function localizedRestaurantField(
  restaurant: RestaurantMenuView["restaurant"],
  locale: string | null | undefined,
  field: LocalizedRestaurantField,
) {
  const localeCode = normalizeLocale(locale);
  return (
    restaurant.translations?.find((translation) => translation.locale === localeCode)?.[field] ??
    restaurant.translations?.find((translation) => translation.locale === "en")?.[field] ??
    restaurant[field] ??
    ""
  );
}

const dietaryTagLabels: Record<string, Partial<Record<LocaleCode, string>>> = {
  vegetarian: {
    en: "Vegetarian",
    es: "Vegetariano",
    de: "Vegetarisch",
    it: "Vegetariano",
    fr: "Végétarien",
    ru: "Вегетарианское",
    ja: "ベジタリアン",
    ko: "채식",
    "zh-CN": "素食",
  },
  vegan: {
    en: "Vegan",
    es: "Vegano",
    de: "Vegan",
    it: "Vegano",
    fr: "Végan",
    ru: "Веганское",
    ja: "ヴィーガン",
    ko: "비건",
    "zh-CN": "纯素",
  },
  "no-pork": {
    en: "No pork",
    es: "Sin cerdo",
    de: "Ohne Schwein",
    it: "Senza maiale",
    fr: "Sans porc",
    ru: "Без свинины",
    ja: "豚肉なし",
    ko: "돼지고기 제외",
    "zh-CN": "不含猪肉",
  },
  pork: {
    en: "Contains pork",
    es: "Contiene cerdo",
    de: "Enthält Schwein",
    it: "Contiene maiale",
    fr: "Contient du porc",
    ru: "Содержит свинину",
    ja: "豚肉を含む",
    ko: "돼지고기 포함",
    "zh-CN": "含猪肉",
  },
  spicy: {
    en: "Spicy",
    es: "Picante",
    de: "Scharf",
    it: "Piccante",
    fr: "Épicé",
    ru: "Острое",
    ja: "辛い",
    ko: "매운맛",
    "zh-CN": "辣",
  },
  light: {
    en: "Light",
    es: "Ligero",
    de: "Leicht",
    it: "Leggero",
    fr: "Léger",
    ru: "Легкое",
    ja: "軽め",
    ko: "가벼움",
    "zh-CN": "清淡",
  },
  traditional: {
    en: "Traditional",
    es: "Tradicional",
    de: "Traditionell",
    it: "Tradizionale",
    fr: "Traditionnel",
    ru: "Традиционное",
    ja: "伝統的",
    ko: "전통",
    "zh-CN": "传统",
  },
  "gluten-free": {
    en: "Gluten-free",
    es: "Sin gluten",
    de: "Glutenfrei",
    it: "Senza glutine",
    fr: "Sans gluten",
    ru: "Без глютена",
    ja: "グルテンなし",
    ko: "글루텐 없음",
    "zh-CN": "无麸质",
  },
  "best-with-beer": {
    en: "Best with beer",
    es: "Mejor con cerveza",
    de: "Passt zu Bier",
    it: "Ottimo con birra",
    fr: "Idéal avec bière",
    ru: "Лучше с пивом",
    ja: "ビールに合う",
    ko: "맥주와 잘 어울림",
    "zh-CN": "适合配啤酒",
  },
  "street-food": {
    en: "Street food",
    es: "Comida callejera",
    de: "Streetfood",
    it: "Street food",
    fr: "Street food",
    ru: "Уличная еда",
    ja: "屋台料理",
    ko: "길거리 음식",
    "zh-CN": "街头小吃",
  },
  comfort: {
    en: "Comfort food",
    es: "Comida reconfortante",
    de: "Wohlfühlessen",
    it: "Comfort food",
    fr: "Plat réconfortant",
    ru: "Комфортная еда",
    ja: "ほっとする料理",
    ko: "편안한 음식",
    "zh-CN": "暖心菜",
  },
  "under-20": {
    en: "Under €20",
    es: "Menos de €20",
    de: "Unter €20",
    it: "Sotto €20",
    fr: "Moins de 20 €",
    ru: "До €20",
    ja: "20ユーロ以下",
    ko: "20유로 이하",
    "zh-CN": "20欧以内",
  },
};

const allergenLabels: Record<string, Partial<Record<LocaleCode, string>>> = {
  gluten: { es: "Gluten", de: "Gluten", it: "Glutine", fr: "Gluten", ru: "Глютен", ja: "グルテン", ko: "글루텐", "zh-CN": "麸质" },
  milk: { es: "Leche", de: "Milch", it: "Latte", fr: "Lait", ru: "Молоко", ja: "乳", ko: "우유", "zh-CN": "牛奶" },
  egg: { es: "Huevo", de: "Ei", it: "Uovo", fr: "Œuf", ru: "Яйцо", ja: "卵", ko: "달걀", "zh-CN": "鸡蛋" },
  peanuts: { es: "Cacahuetes", de: "Erdnüsse", it: "Arachidi", fr: "Arachides", ru: "Арахис", ja: "ピーナッツ", ko: "땅콩", "zh-CN": "花生" },
  peanut: { es: "Cacahuete", de: "Erdnuss", it: "Arachide", fr: "Arachide", ru: "Арахис", ja: "ピーナッツ", ko: "땅콩", "zh-CN": "花生" },
  "tree-nuts": { es: "Frutos secos", de: "Baumnüsse", it: "Frutta a guscio", fr: "Fruits à coque", ru: "Орехи", ja: "木の実", ko: "견과류", "zh-CN": "坚果" },
  soy: { es: "Soja", de: "Soja", it: "Soia", fr: "Soja", ru: "Соя", ja: "大豆", ko: "대두", "zh-CN": "大豆" },
  sesame: { es: "Sésamo", de: "Sesam", it: "Sesamo", fr: "Sésame", ru: "Кунжут", ja: "ごま", ko: "참깨", "zh-CN": "芝麻" },
  shellfish: { es: "Marisco", de: "Schalentiere", it: "Crostacei", fr: "Crustacés", ru: "Моллюски и ракообразные", ja: "甲殻類", ko: "갑각류", "zh-CN": "贝类/甲壳类" },
  crustaceans: { es: "Crustáceos", de: "Krustentiere", it: "Crostacei", fr: "Crustacés", ru: "Ракообразные", ja: "甲殻類", ko: "갑각류", "zh-CN": "甲壳类" },
  fish: { es: "Pescado", de: "Fisch", it: "Pesce", fr: "Poisson", ru: "Рыба", ja: "魚", ko: "생선", "zh-CN": "鱼" },
  mustard: { es: "Mostaza", de: "Senf", it: "Senape", fr: "Moutarde", ru: "Горчица", ja: "マスタード", ko: "겨자", "zh-CN": "芥末" },
};

export function localizedDietaryTagName(
  tag: MenuItemView["dietaryTags"][number],
  locale: string | null | undefined,
) {
  const code = normalizeLocale(locale);
  return dietaryTagLabels[tag.code]?.[code] ?? dietaryTagLabels[tag.code]?.en ?? tag.name;
}

export function localizedAllergenName(
  allergen: MenuItemView["allergens"][number],
  locale: string | null | undefined,
) {
  const code = normalizeLocale(locale);
  return allergenLabels[allergen.code]?.[code] ?? allergenLabels[allergen.code]?.en ?? allergen.name;
}

export function hasTag(item: MenuItemView, tag: string) {
  return item.dietaryTags.some((entry) => entry.code === tag);
}

function verifiedDoesNotContain(item: MenuItemView, allergenCode: string) {
  const entry = item.allergens.find((allergen) => allergen.code === allergenCode);
  return entry?.status === "DOES_NOT_CONTAIN" && entry.verificationStatus === "VERIFIED";
}

export function matchesIntent(item: MenuItemView, intent: string | null) {
  if (!intent) {
    return true;
  }

  if (intent === "under-20") {
    return item.priceCents < 2000;
  }

  if (intent === "gluten-free") {
    return hasTag(item, "gluten-free") || verifiedDoesNotContain(item, "gluten");
  }

  return hasTag(item, intent);
}

export function getAllMenuItems(menu: RestaurantMenuView) {
  return menu.version.categories.flatMap((category) => category.items);
}

export function filterMenuCategories({
  categories,
  query,
  intent,
  locale,
}: {
  categories: MenuCategoryView[];
  query: string;
  intent: string | null;
  locale: string;
}) {
  const normalizedQuery = query.trim().toLowerCase();

  return categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => {
        const text = [
          item.name,
          item.description,
          localizedName(item, locale),
          localizedDescription(item, locale),
          item.ingredients.join(" "),
          localizedIngredients(item, locale).join(" "),
          item.origin,
          item.tasteProfile,
          item.preparation,
          item.explanation,
          localizedItemField(item, locale, "origin"),
          localizedItemField(item, locale, "tasteProfile"),
          localizedItemField(item, locale, "preparation"),
          localizedItemField(item, locale, "explanation"),
          ...item.dietaryTags.map((tag) => tag.name),
          ...item.allergens.map((allergen) => allergen.name),
          ...item.pairings.map((pairing) => pairing.pairedItemName),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
        return matchesQuery && matchesIntent(item, intent);
      }),
    }))
    .filter((category) => category.items.length > 0);
}

export function getRecommendations({
  items,
  intent,
  limit = 3,
}: {
  items: MenuItemView[];
  intent: string | null;
  limit?: number;
}) {
  const pool = intent
    ? items.filter((item) => matchesIntent(item, intent))
    : items.filter((item) => item.isPromoted);

  return pool
    .filter((item) => item.isAvailable)
    .sort((a, b) => Number(b.isPromoted) - Number(a.isPromoted) || a.priceCents - b.priceCents)
    .slice(0, limit);
}
