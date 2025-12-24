import NoteCard from "@/components/NoteCard";
import { lazy, Suspense, useState } from "react";
import { Note } from "@/types";
import { R2_BASE_URL } from "@/config/r2";

// Lazy load PDFPreview to reduce initial bundle size
const PDFPreview = lazy(() => import("@/components/PDFPreview"));

type Props = {
  notes: Note[];
  unlocked: string[];
  loadingUnlocks: boolean;
  payingNote: string | null;
  onPay: (note: Note) => void;
  category?: string; // Added for cart functionality
};

const PDFList = ({ notes, unlocked, loadingUnlocks, payingNote, onPay, category }: Props) => {
  const [preview, setPreview] = useState<Note | null>(null);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, index) => {
          const isUnlocked = unlocked.includes(note.r2Path);
          const isPaying = payingNote === note.r2Path;
          const downloadHref = isUnlocked ? `${R2_BASE_URL}/${note.r2Path}` : undefined;
          return (
            <div key={note.r2Path} className="space-y-3">
              <NoteCard
                note={note}
                index={index}
                onPreview={setPreview}
                onPay={onPay}
                // Prefer item-level lock state
                locked={!isUnlocked}
                downloadHref={downloadHref}
                paying={isPaying}
                category={category}
              />
              {loadingUnlocks ? <p className="text-xs text-muted-foreground">Checking access…</p> : null}
            </div>
          );
        })}
      </div>

      {preview && (
        <Suspense fallback={null}>
          <PDFPreview note={preview} onClose={() => setPreview(null)} />
        </Suspense>
      )}
    </>
  );
};

export default PDFList;
