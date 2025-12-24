import { useParams, Link } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import NoteCard from "@/components/NoteCard";
import { getBranchBySlug } from "@/data/branches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, FileText, Zap, BookOpen, AlertCircle } from "lucide-react";
import { getNotesForSubject } from "@/lib/notes";
import { R2_BASE_URL } from "@/config/r2";
import { Note } from "@/types";
import { startPayment } from "@/lib/payment";
import { useAuth } from "@/context/AuthContext";
import { fetchWithTimeout, safeArray } from "@/lib/apiUtils";
import { useToast } from "@/hooks/use-toast";
import { PDFListSkeleton } from "@/components/SkeletonLoaders";

// Lazy load PDFPreview to reduce initial bundle size
const PDFPreview = lazy(() => import("@/components/PDFPreview"));

const NOTE_PRICE = 4.5;

const SubjectPage = () => {
  const { branchSlug, subjectSlug } = useParams<{
    branchSlug: string;
    subjectSlug: string;
  }>();

  const { user } = useAuth();
  const { toast } = useToast();

  const [previewNote, setPreviewNote] = useState<Note | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loadingUnlocks, setLoadingUnlocks] = useState(false);
  const [payingNote, setPayingNote] = useState<string | null>(null);
  const [unlocksError, setUnlocksError] = useState(false);

  if (!branchSlug || !subjectSlug) return null;

  const branch = getBranchBySlug(branchSlug);
  const notes = getNotesForSubject(branchSlug, subjectSlug);

  /* ---------------- LOAD UNLOCKED NOTES (DB) WITH RETRY & ERROR HANDLING ---------------- */
  useEffect(() => {
    if (!user) {
      // Don't fetch if user is not logged in - saves API call on page load
      setUnlocked([]);
      setUnlocksError(false);
      setLoadingUnlocks(false);
      return;
    }

    const fetchUnlocks = async () => {
      try {
        setLoadingUnlocks(true);
        setUnlocksError(false);

        const data = await fetchWithTimeout(
          `${import.meta.env.VITE_API_BASE_URL}/user-unlocks/${user.uid}`,
          {
            timeout: 8000,
            retries: 1, // One retry on network failure
          }
        );

        // Defensive: ensure data.unlockedNotes is an array
        const unlockedNotes = safeArray(data?.unlockedNotes, []);
        setUnlocked(unlockedNotes);
      } catch (err) {
        console.error("Failed to load unlocked notes:", err);
        setUnlocksError(true);
        // Keep page functional with empty unlocks
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
    
    // Determine category based on note type
    const category = note.type === "quantum" 
      ? "Quantum" 
      : note.type === "all" 
      ? "All Unit Notes" 
      : "Unit Notes";

    return (
      <div key={note.r2Path} className="space-y-3">
        <NoteCard
          note={note}
          index={index}
          onPreview={setPreviewNote}
          onPay={handlePay}
          isUnlocked={isUnlocked}
          paying={isPaying}
          category={category}
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
      title={String(`${subjectName || 'Subject'} AKTU Notes & Quantum PDFs | Eduavaa`)}
      description={String(`Download ${subjectName || 'subject'} AKTU notes, quantum PDFs, and question papers for APJ Abdul Kalam Technical University. Unit-wise PDFs with previews and instant unlocks.`)}
      keywords={String(`${subjectName || 'subject'} AKTU notes, AKTU quantum, AKTU question papers, APJ Abdul Kalam Technical University notes, AKTU unit wise notes, AKTU engineering notes PDF`)}
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
                {subjectName} AKTU Notes
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl mt-2">
                Unit-wise AKTU engineering notes, quantum PDFs, and question papers for APJ Abdul Kalam Technical University students.
              </p>
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
          {/* Error state for failed unlocks fetch */}
          {unlocksError && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">Unable to load access status</p>
                <p className="text-sm text-amber-800">
                  Some notes may appear locked. Refresh the page if the issue persists.
                </p>
              </div>
            </div>
          )}

          {allNotes.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                AKTU Complete Notes (Unit Wise)
              </h2>
              {loadingUnlocks ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <PDFListSkeleton count={2} />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {allNotes.map(renderNoteCard)}
                </div>
              )}
            </div>
          )}

          {quantumNotes.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AKTU Quantum PDFs – Unit Wise
              </h2>
              {loadingUnlocks ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <PDFListSkeleton count={2} />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {quantumNotes.map(renderNoteCard)}
                </div>
              )}
            </div>
          )}

          {unitNotes.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                AKTU Unit Wise Notes
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unitNotes.map(renderNoteCard)}
              </div>
            </div>
          )}
        </div>
      </section>

      {previewNote && (
        <Suspense fallback={null}>
          <PDFPreview
            note={previewNote}
            onClose={() => setPreviewNote(null)}
          />
        </Suspense>
      )}
    </Layout>
  );
};

export default SubjectPage;
