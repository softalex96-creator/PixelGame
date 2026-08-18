export const categories = ["Templates", "Design Resources", "Business Tools"] as const;

export type Category = (typeof categories)[number];

export type MarketplaceProduct = {
  id: string;
  slug: string;
  title: string;
  category: Category;
  price: number;
  description: string;
  longDescription: string;
  creator: string;
  creatorInitials: string;
  image: string;
  accent: "violet" | "cyan" | "indigo" | "lilac";
  includes: string[];
};

export type Creator = {
  name: string;
  initials: string;
  productCount: number;
  role: string;
  accent: "violet" | "cyan" | "indigo" | "lilac";
};

const templateImage = "/manus-storage/pixelshelf-template-vault_dafcf821.png";
const designImage = "/manus-storage/pixelshelf-design-assets_29cbf395.png";
const businessImage = "/manus-storage/pixelshelf-business-toolkit_3104fce3.png";

export const products: MarketplaceProduct[] = [
  {
    id: "product-launchpad",
    slug: "launchpad-landing-page-kit",
    title: "Launchpad Landing Page Kit",
    category: "Templates",
    price: 24,
    description: "A bright, modular page system for your next launch.",
    longDescription:
      "Launchpad gives product teams a flexible set of landing-page sections designed for clear messaging, quick iteration, and a crisp handoff. Adapt the storytelling flow, then make the kit your own.",
    creator: "Northstar Studio",
    creatorInitials: "NS",
    image: templateImage,
    accent: "violet",
    includes: ["12 responsive page sections", "Editable design tokens", "Launch checklist"],
  },
  {
    id: "product-studiofolio",
    slug: "studiofolio-portfolio-template",
    title: "Studiofolio Portfolio Template",
    category: "Templates",
    price: 18,
    description: "A focused portfolio framework for independent creatives.",
    longDescription:
      "Studiofolio is a deliberately simple portfolio template that leaves space for the work. Use it to shape project stories, establish a visual system, and build a memorable first impression.",
    creator: "Lumen House",
    creatorInitials: "LH",
    image: templateImage,
    accent: "indigo",
    includes: ["Project case-study layouts", "Portfolio home variations", "Style guide starter"],
  },
  {
    id: "product-halo-gradients",
    slug: "halo-gradient-objects",
    title: "Halo Gradient Objects",
    category: "Design Resources",
    price: 16,
    description: "Tactile 3D forms and luminous gradients for expressive work.",
    longDescription:
      "Halo is a compact collection of dimensional shapes, smooth color surfaces, and versatile background pieces. It is made for presentations, social concepts, landing pages, and experimental visual systems.",
    creator: "Mira Sol",
    creatorInitials: "MS",
    image: designImage,
    accent: "cyan",
    includes: ["36 3D objects", "Gradient background set", "PNG and SVG exports"],
  },
  {
    id: "product-orbit-icons",
    slug: "orbit-icon-library",
    title: "Orbit Icon Library",
    category: "Design Resources",
    price: 12,
    description: "A playful, purposeful icon set with a forward-looking edge.",
    longDescription:
      "Orbit pairs clean geometry with lively visual details. The library provides a consistent starting point for product interfaces, editorial layouts, and creative brand touchpoints.",
    creator: "Mira Sol",
    creatorInitials: "MS",
    image: designImage,
    accent: "lilac",
    includes: ["160 scalable icons", "Outline and filled styles", "Figma-ready library"],
  },
  {
    id: "product-client-os",
    slug: "client-os-workspace",
    title: "Client OS Workspace",
    category: "Business Tools",
    price: 28,
    description: "A practical project hub for focused client work.",
    longDescription:
      "Client OS makes a demanding service workflow feel more manageable. Organize delivery, priorities, notes, and conversations in one adaptable workspace made for a small studio or solo operation.",
    creator: "Northstar Studio",
    creatorInitials: "NS",
    image: businessImage,
    accent: "cyan",
    includes: ["Project overview dashboard", "Client onboarding flow", "Weekly planning pages"],
  },
  {
    id: "product-focus-plan",
    slug: "focus-plan-toolkit",
    title: "Focus Plan Toolkit",
    category: "Business Tools",
    price: 14,
    description: "A gentle operating system for goals, habits, and next actions.",
    longDescription:
      "Focus Plan offers structured, low-friction templates for planning a week, reviewing priorities, and keeping high-value tasks visible without turning your day into a complex system.",
    creator: "Lumen House",
    creatorInitials: "LH",
    image: businessImage,
    accent: "violet",
    includes: ["Weekly planning template", "Goal review prompts", "Lightweight KPI tracker"],
  },
];

export const creators: Creator[] = [
  { name: "Northstar Studio", initials: "NS", productCount: 14, role: "Digital systems", accent: "violet" },
  { name: "Mira Sol", initials: "MS", productCount: 9, role: "Visual resources", accent: "cyan" },
  { name: "Lumen House", initials: "LH", productCount: 11, role: "Creative templates", accent: "indigo" },
  { name: "Kite & Co.", initials: "KC", productCount: 7, role: "Business tools", accent: "lilac" },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function filterProducts(productsToFilter: MarketplaceProduct[], category: Category | "All", query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  return productsToFilter.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const searchable = `${product.title} ${product.category} ${product.creator} ${product.description}`.toLowerCase();
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}
