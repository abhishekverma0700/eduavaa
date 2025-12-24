import { Link } from "react-router-dom";
import { Branch } from "@/types";
import { ArrowRight } from "lucide-react";

interface BranchCardProps {
  branch: Branch;
  index: number;
}

const BranchCard = ({ branch, index }: BranchCardProps) => {
  return (
    <Link
      to={`/${branch.slug}`}
      className="group relative block p-6 bg-card border border-slate-100 rounded-lg shadow-sm hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 animate-slide-up overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-100 text-3xl group-hover:scale-110 group-hover:bg-indigo-200 transition-all duration-300">
          {branch.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors mb-1">
            {branch.name}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">
            {branch.description}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
};

export default BranchCard;
