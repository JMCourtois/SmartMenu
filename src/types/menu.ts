export type AiRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "BLOCKED";
export type AiChangeStatus =
  | "PROCESSING"
  | "PROPOSED"
  | "APPROVED"
  | "REJECTED"
  | "APPLIED"
  | "FAILED";

export type VerificationStatus = "UNVERIFIED" | "VERIFIED" | "NEEDS_REVIEW";

export type MenuItemTranslationView = {
  id: string;
  locale: string;
  name: string;
  description: string | null;
  ingredients?: string[];
  origin?: string | null;
  tasteProfile?: string | null;
  preparation?: string | null;
  explanation?: string | null;
  ctaPrompts?: string[];
};

export type MenuItemAllergenView = {
  code: string;
  name: string;
  status: "CONTAINS" | "MAY_CONTAIN" | "DOES_NOT_CONTAIN" | "UNKNOWN";
  verificationStatus: VerificationStatus;
  note: string | null;
};

export type MenuItemDietaryTagView = {
  code: string;
  name: string;
  safetySensitive: boolean;
  verificationStatus: VerificationStatus;
};

export type PairingSuggestionView = {
  id: string;
  pairedItemName: string;
  reason: string | null;
  priority: number;
};

export type MenuDisplayMode = "photo" | "classic";

export type RestaurantThemeView = {
  accent: string;
  accentDark: string;
  accentSoft: string;
  secondary: string;
  secondarySoft: string;
  ink: string;
  paper: string;
  muted: string;
};

export type MenuItemView = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ingredients: string[];
  origin: string | null;
  tasteProfile: string | null;
  preparation: string | null;
  spiceLevel: number;
  explanation: string | null;
  ctaPrompts: string[];
  priceCents: number;
  isAvailable: boolean;
  isPromoted: boolean;
  sortOrder: number;
  imageUrl: string | null;
  translations: MenuItemTranslationView[];
  allergens: MenuItemAllergenView[];
  dietaryTags: MenuItemDietaryTagView[];
  pairings: PairingSuggestionView[];
};

export type MenuCategoryView = {
  id: string;
  name: string;
  sortOrder: number;
  translations?: Array<{
    locale: string;
    name: string;
  }>;
  items: MenuItemView[];
};

export type MenuVersionView = {
  id: string;
  version: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
  categories: MenuCategoryView[];
};

export type RestaurantMenuView = {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    defaultLocale: string;
    currency: string;
    brandColor: string;
    cuisine: string;
    city: string;
    heroImageUrl: string | null;
    theme: RestaurantThemeView;
    legalNotice: string | null;
    translations?: Array<{
      locale: string;
      description?: string | null;
      cuisine?: string | null;
      legalNotice?: string | null;
    }>;
  };
  menu: {
    id: string;
    name: string;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  };
  version: MenuVersionView;
};

export type ManagerRestaurantView = RestaurantMenuView & {
  draftVersion: MenuVersionView;
  publishedVersion: MenuVersionView | null;
  versions: Array<{
    id: string;
    version: number;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishedAt: string | null;
    createdAt: string;
  }>;
};

export type AiProposedChangeView = {
  id: string;
  entityType: string;
  entityId: string | null;
  operation: string;
  field: string | null;
  oldValue: unknown;
  newValue: unknown;
  reason: string | null;
};

export type AiChangeSetView = {
  id: string;
  prompt: string;
  status: AiChangeStatus;
  riskLevel: AiRiskLevel;
  summary: string | null;
  warnings: string[];
  createdAt: string;
  appliedAt: string | null;
  changes: AiProposedChangeView[];
};

export type AnalyticsSummary = {
  scans: number;
  itemViews: number;
  allergenViews: number;
  assistantOpens: number;
  promotedClicks: number;
  topLanguages: Array<{ locale: string; count: number }>;
  topItems: Array<{ itemId: string; name: string; count: number }>;
  topFilters: Array<{ filter: string; count: number }>;
};
