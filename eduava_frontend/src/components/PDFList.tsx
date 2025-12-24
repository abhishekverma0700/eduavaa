import NoteCard from "@/components/NoteCard";
import PDFPreview from "@/components/PDFPreview";
import { useState } from "react";
import { Note } from "@/types";
import { R2_BASE_URL } from "@/config/r2";

type Props = {
  notes: Note[];
  unlocked: string[];
  loadingUnlocks: boolean;
  payingNote: string | null;
  onPay: (note: Note) => void;
};

const PDFList = ({ notes, unlocked, loadingUnlocks, payingNote, onPay }: Props) => {
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
              />
              {loadingUnlocks ? <p className="text-xs text-muted-foreground">Checking access…</p> : null}
            </div>
          );
        })}
      </div>

      {preview && (
        <PDFPreview note={preview} onClose={() => setPreview(null)} />
      )}
    </>
  );
};

export default PDFList;
