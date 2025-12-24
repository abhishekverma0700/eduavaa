import { Link } from "react-router-dom";
import { Category } from "@/data/categories";

type Props = {
  category: Category;
  index?: number;
};

const CategoryCard = ({ category, index = 0 }: Props) => {
  return (
    <Link
      to={`/category/${category.key}`}
      className="group block p-6 bg-card border border-slate-100 rounded-lg shadow-sm hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 animate-slide-up overflow-hidden relative"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{category.label}</h3>
          <p className="text-slate-600 text-sm flex items-center gap-1">
            <span className="text-indigo-600 font-semibold">₹{category.price}</span>
            <span>per file</span>
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
