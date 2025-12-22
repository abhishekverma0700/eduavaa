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
      className="group relative block p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-lg hover:border-accent/50 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Icon + count */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary group-hover:bg-accent/10 transition-colors">
          <FileText className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
        </div>

        <Badge variant="secondary" className="text-xs">
          {totalNotes} Notes
        </Badge>
      </div>

      {/* Subject name */}
      <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-accent transition-colors mb-2 capitalize">
        {subject.name}
      </h3>

      {/* Description (optional safe) */}
      {subject.description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {subject.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          View notes
        </span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

export default SubjectCard;
