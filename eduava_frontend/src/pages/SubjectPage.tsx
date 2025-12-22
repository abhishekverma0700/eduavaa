import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import NoteCard from "@/components/NoteCard";
import PDFPreview from "@/components/PDFPreview";
import { getBranchBySlug } from "@/data/branches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, Zap, BookOpen } from "lucide-react";
import { getNotesForSubject } from "@/lib/notes";
import { R2_BASE_URL } from "@/config/r2";
import { Note } from "@/types";
import { startPayment } from "@/lib/payment";
import { useAuth } from "@/context/AuthContext";

const NOTE_PRICE = 4.5;

const SubjectPage = () => {
  const { branchSlug, subjectSlug } = useParams<{
    branchSlug: string;
    subjectSlug: string;
  }>();

  const { user } = useAuth();

  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loadingUnlocks, setLoadingUnlocks] = useState(false);
  const [payingNote, setPayingNote] = useState<string | null>(null);

  if (!branchSlug || !subjectSlug) return null;

  const branch = getBranchBySlug(branchSlug);
  const notes = getNotesForSubject(branchSlug, subjectSlug);

  /* ---------------- LOAD UNLOCKED NOTES (DB) ---------------- */
  useEffect(() => {
    if (!user) {
      setUnlocked([]);
      return;
    }

    const fetchUnlocks = async () => {
      try {
        setLoadingUnlocks(true);
        const res = await fetch(
          `http://localhost:5000/user-unlocks/${user.uid}`
        );
        const data = await res.json();

        if (Array.isArray(data.unlockedNotes)) {
          setUnlocked(data.unlockedNotes);
        }
      } catch (err) {
        console.error("Failed to load unlocks", err);
        setUnlocked([]);
      } finally {
        setLoadingUnlocks(false);
      }
    };

    fetchUnlocks();
  }, [user]);

  if (!branch || notes.length === 0) {
    return (
      <Layout title="Subject Not Found – Eduava">
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">
            Subject Not Found
          </h1>
          <Button asChild>
            <Link to="/">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const subjectName = subjectSlug.replace(/-/g, " ");

  const unitNotes = notes.filter(n => n.type === "unit");
  const quantumNotes = notes.filter(n => n.type === "quantum");
  const allNotes = notes.filter(n => n.type === "all");

  /* ---------------- PAYMENT HANDLER (FINAL & SAFE) ---------------- */
  const handlePay = (note: Note) => {
    if (!user) {
      alert("Please sign in with Google to continue");
      return;
    }

    if (payingNote === note.r2Path) return;

    setPayingNote(note.r2Path);

    startPayment({
      amount: NOTE_PRICE,
      note,   // ✅ FULL note object
      user,   // ✅ FULL firebase user

      onSuccess: () => {
        setUnlocked(prev =>
          prev.includes(note.r2Path) ? prev : [...prev, note.r2Path]
        );
        setPayingNote(null);
        alert("Payment successful! PDF unlocked.");
      },

      onFailure: () => {
        setPayingNote(null);
        alert("Payment cancelled or failed.");
      },
    });
  };

  /* ---------------- RENDER NOTE ---------------- */
  const renderNoteCard = (note: Note, index: number) => {
    const isUnlocked = unlocked.includes(note.r2Path);
    const isPaying = payingNote === note.r2Path;

    return (
      <div key={note.r2Path} className="space-y-3">
        <NoteCard
          note={note}
          index={index}
          onPreview={setPreviewNote}
          onPay={handlePay}
          isUnlocked={isUnlocked}
          paying={isPaying}
        />

        {loadingUnlocks ? (
          <p className="text-xs text-muted-foreground">Checking access…</p>
        ) : isUnlocked ? (
          <a
            href={`${R2_BASE_URL}/${note.r2Path}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 rounded bg-primary text-primary-foreground text-sm"
          >
            Download PDF
          </a>
        ) : null}
      </div>
    );
  };

  return (
    <Layout
      title={`${subjectName} Notes AKTU | Eduava`}
      description={`Download genuine ${subjectName} notes for AKTU.`}
      keywords={`${subjectName} notes AKTU, ${subjectName} PDF`}
    >
      {/* Header */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to={`/${branchSlug}`}>{branch.name}</Link>
            <span>/</span>
            <span className="capitalize">{subjectName}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-2">{branch.name}</Badge>
              <h1 className="text-3xl font-serif font-bold">
                {subjectName}
              </h1>
            </div>

            <div className="px-4 py-2 bg-card border rounded-xl text-center">
              <p className="text-2xl font-bold">{notes.length}</p>
              <p className="text-xs text-muted-foreground">
                Notes Available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notes */}
      <section className="py-12">
        <div className="container space-y-12">

          {allNotes.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Complete Notes
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {allNotes.map(renderNoteCard)}
              </div>
            </div>
          )}

          {quantumNotes.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quantum Notes
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quantumNotes.map(renderNoteCard)}
              </div>
            </div>
          )}

          {unitNotes.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Unit Wise Notes
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unitNotes.map(renderNoteCard)}
              </div>
            </div>
          )}
        </div>
      </section>

      {previewNote && (
        <PDFPreview
          note={previewNote}
          onClose={() => setPreviewNote(null)}
        />
      )}
    </Layout>
  );
};

export default SubjectPage;
