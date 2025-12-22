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
      className="group relative block p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-3xl group-hover:scale-110 transition-transform duration-300">
          {branch.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-accent transition-colors mb-1">
            {branch.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {branch.description}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
};

export default BranchCard;
