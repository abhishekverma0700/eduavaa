import { Note } from "@/types";
import { X, Lock } from "lucide-react";
import { R2_BASE_URL } from "@/config/r2";

interface PDFPreviewProps {
  note: Note;
  onClose: () => void;
}

const PDFPreview = ({ note, onClose }: PDFPreviewProps) => {
  // 🔒 Force ONLY page 1 of PDF
  const pdfUrl = `${R2_BASE_URL}/${note.r2Path}#page=1&view=FitH`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-background w-full max-w-4xl rounded-xl overflow-hidden relative my-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-slate-100 bg-card sticky top-0 z-10">
          <h3 className="font-semibold text-xs sm:text-sm truncate">
            Preview – {note.label} (Page 1 only)
          </h3>
          <button onClick={onClose} className="flex-shrink-0 ml-2 p-1 hover:bg-secondary rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* PREVIEW AREA (HARD LOCKED) */}
        <div
          className="relative w-full"
          style={{
            height: "clamp(300px, 60vh, 70vh)",
            overflow: "hidden",
            touchAction: "none",
            overscrollBehavior: "none",
          }}
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
        >
          {/* PDF iframe (interaction disabled) */}
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            aria-label={`Preview of AKTU notes PDF ${note.label}`}
            className="w-full h-full"
            style={{
              pointerEvents: "none",
            }}
          />

          {/* FADE MASK */}
          <div className="absolute inset-x-0 bottom-0 h-32 sm:h-48 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />

          {/* LOCK MESSAGE */}
          <div className="absolute inset-x-0 bottom-2 sm:bottom-6 flex justify-center px-2 sm:px-0">
            <div className="bg-background/95 backdrop-blur px-3 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl text-center shadow-lg border border-slate-100 max-w-xs sm:max-w-none">
              <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2 text-indigo-600">
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">
                  Preview Locked
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 leading-tight">
                Only first page is visible.
                <br className="sm:hidden" />
                Purchase to unlock full PDF.
              </p>
              <button
                disabled
                className="w-full px-3 sm:px-4 py-2 rounded text-xs sm:text-sm bg-indigo-600 text-white opacity-60 cursor-not-allowed transition-opacity font-medium"
              >
                Purchase to Unlock
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PDFPreview;
