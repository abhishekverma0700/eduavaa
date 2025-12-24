import { Link } from "react-router-dom";
import { Subject } from "@/types";
import { FileText, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SubjectCardProps {
  subject: Subject;
  branchSlug: string;
  index: number;
}

const SubjectCard = ({ subject, branchSlug, index }: SubjectCardProps) => {
  // 🔥 Manifest-driven count (truth only)
  const totalNotes = subject.notes.length;

  return (
    <Link
      to={`/${branchSlug}/${subject.slug}`}
      className="group relative block p-6 bg-card border border-slate-100 rounded-lg shadow-sm hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 animate-slide-up overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Icon + count */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
          <FileText className="h-6 w-6 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
        </div>

        <Badge className="text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
          {totalNotes} Note{totalNotes !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Subject name */}
      <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-indigo-700 transition-colors mb-2 capitalize">
        {subject.name}
      </h3>

      {/* Description (optional safe) */}
      {subject.description && (
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {subject.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600 group-hover:text-indigo-600 transition-colors">
          View notes
        </span>
        <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

export default SubjectCard;
