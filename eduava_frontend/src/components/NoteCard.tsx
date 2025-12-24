import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Lock, Loader2, IndianRupee } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

interface NoteCardProps {
  note: Note;
  index: number;
  onPreview: (note: Note) => void;
  onPay: (note: Note) => void;
  // Legacy prop from SubjectPage – if provided, will be used to derive lock state
  isUnlocked?: boolean;
  // Preferred explicit lock state at item level
  locked?: boolean;
  // Optional direct download link when unlocked; keeps monetization at item-level
  downloadHref?: string;
  paying?: boolean;
  category?: string; // Added for cart functionality
}

const NoteCard = ({
  note,
  index,
  onPreview,
  onPay,
  isUnlocked,
  locked,
  downloadHref,
  paying = false,
  category = "Notes", // Default category
}: NoteCardProps) => {
  const isLocked = typeof locked === "boolean" ? locked : !(isUnlocked ?? false);
  
  return (
    <div
      className="group relative p-5 bg-card border border-slate-100 rounded-lg shadow-sm hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 animate-slide-up overflow-hidden"
      aria-label={`AKTU notes PDF card for ${note.label}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge className="bg-teal-100 text-teal-700 border-0 whitespace-nowrap font-medium">PDF</Badge>
            {isLocked && (
              <Badge className="bg-amber-100 text-amber-700 border-0 font-semibold whitespace-nowrap flex items-center gap-1">
                <IndianRupee className="h-3 w-3" />
                {note.price}
              </Badge>
            )}
          </div>

          <h4 className="font-semibold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-700 transition-colors">
            {note.label}
          </h4>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Preview */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(note)}
              className="gap-1.5 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>

            {/* Add to Cart Button */}
            <AddToCartButton 
              note={note} 
              category={category} 
              isUnlocked={!isLocked}
            />

            {/* Monetization strictly at item level */}
            {isLocked ? (
              <Button
                size="sm"
                onClick={() => onPay(note)}
                disabled={paying}
                className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {paying ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Pay & Unlock
                  </>
                )}
              </Button>
            ) : downloadHref ? (
              <a
                href={downloadHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
              >
                🔓 Download
              </a>
            ) : (
              <Badge className="bg-green-100 text-green-700 border-0 font-medium">
                Free Access
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
