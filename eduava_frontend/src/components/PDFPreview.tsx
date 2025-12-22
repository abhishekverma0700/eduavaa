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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-background w-full max-w-4xl rounded-xl overflow-hidden relative">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm truncate">
            Preview – {note.label} (Page 1 only)
          </h3>
          <button onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* PREVIEW AREA (HARD LOCKED) */}
        <div
          className="relative"
          style={{
            height: "78vh",
            overflow: "hidden",
            touchAction: "none",          // 🚫 mobile gestures
            overscrollBehavior: "none",   // 🚫 scroll chaining
          }}
          onWheel={(e) => e.preventDefault()}      // 🚫 mouse scroll
          onTouchMove={(e) => e.preventDefault()}  // 🚫 mobile swipe
        >
          {/* PDF iframe (interaction disabled) */}
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            className="w-full h-full"
            style={{
              pointerEvents: "none",   // 🚫 no zoom / scroll / click
            }}
          />

          {/* FADE MASK */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />

          {/* LOCK MESSAGE */}
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <div className="bg-background/95 backdrop-blur px-6 py-4 rounded-xl text-center shadow-lg border">
              <div className="flex items-center justify-center gap-2 mb-2 text-primary">
                <Lock className="h-4 w-4" />
                <span className="font-semibold">
                  Preview Locked
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Only first page is visible.  
                Purchase to unlock full PDF.
              </p>
              <button
                disabled
                className="px-4 py-2 rounded bg-primary text-primary-foreground opacity-60 cursor-not-allowed"
              >
                Purchase (Coming Soon)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PDFPreview;
