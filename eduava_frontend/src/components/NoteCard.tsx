import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Lock, Loader2 } from "lucide-react";

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
}: NoteCardProps) => {
  const isLocked = typeof locked === "boolean" ? locked : !(isUnlocked ?? false);
  return (
    <div
      className="group relative p-5 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary flex-shrink-0">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">PDF</Badge>
          </div>

          <h4 className="font-semibold text-foreground mb-3 line-clamp-2">
            {note.label}
          </h4>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Preview */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(note)}
              className="gap-1.5"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Button>

            {/* Monetization strictly at item level */}
            {isLocked ? (
              <Button
                size="sm"
                onClick={() => onPay(note)}
                disabled={paying}
                className="gap-1.5"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm"
              >
                🔓 Read / Download
              </a>
            ) : (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Unlocked
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
