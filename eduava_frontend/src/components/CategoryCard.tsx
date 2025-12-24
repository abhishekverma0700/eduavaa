import { Link } from "react-router-dom";
import { Category } from "@/data/categories";
import { BookOpen, FileText, Calculator, Layers, Sparkles } from "lucide-react";

type Props = {
  category: Category;
  index?: number;
};

const CategoryCard = ({ category, index = 0 }: Props) => {
  const iconMap = {
    notes: BookOpen,
    "question-papers": FileText,
    quantum: Calculator,
    "all-units": Layers,
  } as const;

  const colorMap = {
    notes: {
      bg: "bg-sky-100",
      text: "text-sky-700",
      ring: "ring-sky-200",
      hoverRing: "hover:ring-sky-300",
    },
    "question-papers": {
      bg: "bg-amber-100",
      text: "text-amber-700",
      ring: "ring-amber-200",
      hoverRing: "hover:ring-amber-300",
    },
    quantum: {
      bg: "bg-violet-100",
      text: "text-violet-700",
      ring: "ring-violet-200",
      hoverRing: "hover:ring-violet-300",
    },
    "all-units": {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      ring: "ring-emerald-200",
      hoverRing: "hover:ring-emerald-300",
    },
  } as const;

  const Icon = (iconMap as any)[category.key] || Layers;
  const colors = (colorMap as any)[category.key] || colorMap.notes;

  const subTitleMap: Record<string, string> = {
    notes: "Unit-wise AKTU notes",
    "question-papers": "Previous year question papers",
    quantum: "Quick revision quantum PDFs",
    "all-units": "Complete set for a subject",
  };

  const badgeMap: Record<string, string | undefined> = {
    notes: "Popular",
    quantum: "Recommended",
    "question-papers": "Most Used",
    "all-units": undefined,
  };

  const badge = badgeMap[category.key];

  return (
    <Link
      to={`/category/${category.key}`}
      aria-label={`Open ${category.label} category`}
      className={`group block rounded-xl border border-slate-200 bg-card shadow-sm ${
        colors.ring
      } ${colors.hoverRing} ring-0 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer active:translate-y-0 transition-all duration-300 animate-slide-up overflow-hidden relative`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-6 sm:p-7">
        {/* Icon */}
        <div
          className={`mx-auto sm:mx-0 ${colors.bg} ${colors.text} rounded-2xl h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center shadow-inner`}
        >
          <Icon className="h-9 w-9 sm:h-12 sm:w-12" />
        </div>

        {/* Content */}
        <div className="mt-5 sm:mt-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-2xl font-serif font-bold text-foreground tracking-tight">
              {category.label}
            </h3>
            {badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 text-secondary-foreground px-3 py-1 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" /> {badge}
              </span>
            )}
          </div>

          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            {subTitleMap[category.key]}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="font-semibold text-primary">₹{category.price.toFixed(2)}</span>
            <span className="text-muted-foreground">per file</span>
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 rounded-xl ring-1 ring-primary/10" />
      </div>
    </Link>
  );
};

export default CategoryCard;
