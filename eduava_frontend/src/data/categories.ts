export type CategoryKey = "notes" | "question-papers" | "quantum" | "all-unit-notes";

export type Category = {
  key: CategoryKey;
  label: string;
  // Top-level directory name in R2 bucket
  dir: string;
  price: number; // INR
  // Suggested categories to try if search is empty
  suggestions?: CategoryKey[];
};

export const CATEGORIES: Record<CategoryKey, Category> = {
  notes: {
    key: "notes",
    label: "Notes",
    dir: "Notes",
    price: 4.5,
    suggestions: ["quantum", "all-unit-notes"],
  },
  "question-papers": {
    key: "question-papers",
    label: "Question Papers",
    dir: "Question-Papers",
    price: 2.5,
    suggestions: ["notes", "quantum"],
  },
  quantum: {
    key: "quantum",
    label: "Quantum",
    dir: "Quantum",
    price: 16.5,
    suggestions: ["all-unit-notes", "notes"],
  },
  "all-unit-notes": {
    key: "all-unit-notes",
    label: "All Unit Notes",
    dir: "All-Unit-Notes",
    price: 16.5,
    suggestions: ["quantum", "notes"],
  },
};

export const getCategory = (key: string | undefined): Category | undefined => {
  if (!key) return undefined;
  const k = key.toLowerCase() as CategoryKey;
  return (CATEGORIES as any)[k] as Category | undefined;
};

export const allCategories = (): Category[] => Object.values(CATEGORIES);
