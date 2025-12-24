import Layout from "@/components/Layout";
import SearchBar from "@/components/SearchBar";
import PDFList from "@/components/PDFList";
import { Badge } from "@/components/ui/badge";
import { getCategory, allCategories, CategoryKey } from "@/data/categories";
import manifest from "@/data/notes-manifest.json";
import { useAuth } from "@/context/AuthContext";
import { Note } from "@/types";
import { startPayment } from "@/lib/payment";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

type ManifestStructure = {
  notes: string[];
  "question-papers": string[];
  quantum: string[];
  "all-units": string[];
};

type IndexedItem = {
  note: Note;
  tokens: string[]; // normalized search tokens
};

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const extractMetaFromPath = (r2Path: string) => {
  const parts = r2Path.split("/");
  const file = parts[parts.length - 1] || "";

  // Subject guess: take parent folder if available
  const subjectRaw = parts.length > 2 ? parts[parts.length - 2] : file.replace(/\.pdf$/i, "");
  const subjectName = subjectRaw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Short name guess from initials of words
  const shortName = subjectName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // Subject code like KCS-601, etc.
  const codeMatch = file.match(/[A-Z]{2,4}-?\d{3}/i);
  const subjectCode = codeMatch ? codeMatch[0].toUpperCase() : "";

  const label = file.replace(/_/g, " ").replace(/\.pdf$/i, "");

  return { subjectName, shortName, subjectCode, label };
};

const buildIndex = (paths: string[], price: number): IndexedItem[] => {
  return paths.map((p) => {
    const meta = extractMetaFromPath(p);
    const note: Note = {
      id: p,
      type: "all",
      label: meta.label || meta.subjectName,
      price,
      r2Path: p,
      isAvailable: true,
    };

    const tokens = [
      meta.subjectName,
      meta.shortName,
      meta.subjectCode,
      p,
      note.label,
    ]
      .filter(Boolean)
      .map(normalize);

    return { note, tokens };
  });
};

const filterByQuery = (index: IndexedItem[], query: string) => {
  const q = normalize(query);
  if (!q) return index.map((i) => i.note);
  return index.filter((i) => i.tokens.some((t) => t.includes(q))).map((i) => i.note);
};

const CATEGORY_SEO: Record<Exclude<CategoryKey, never>, {
  title: string;
  description: string;
  h1: string;
  intro: string;
}> = {
  notes: {
    title: "AKTU Notes PDF for All Branches | Eduavaa",
    description: "Download AKTU notes PDF for every branch of APJ Abdul Kalam Technical University. Unit-wise engineering notes with previews and secure payments.",
    h1: "AKTU Notes for All Branches",
    intro: "Browse AKTU engineering notes PDF organized unit wise. Preview before buying and download instantly after secure checkout.",
  },
  quantum: {
    title: "AKTU Quantum PDFs – Unit Wise Notes | Eduavaa",
    description: "Get AKTU quantum PDFs and unit-wise notes with solved answers. Ideal for quick revision across APJ Abdul Kalam Technical University branches.",
    h1: "AKTU Quantum PDFs – Unit Wise",
    intro: "Access AKTU quantum material with concise answers for every unit. Perfect for rapid revision and last-minute prep.",
  },
  "question-papers": {
    title: "AKTU Question Papers with Solutions | Eduavaa",
    description: "Download previous AKTU question papers and solutions. Practice APJ Abdul Kalam Technical University exams with organized PDFs.",
    h1: "AKTU Question Papers with Solutions",
    intro: "Solve past AKTU question papers to score higher. PDFs are organized by subject and branch for faster practice.",
  },
  "all-unit-notes": {
    title: "AKTU All Unit Notes PDF | Eduavaa",
    description: "Unit-wise AKTU notes compiled in one PDF. Comprehensive coverage for APJ Abdul Kalam Technical University subjects.",
    h1: "AKTU All Unit Notes (Complete PDFs)",
    intro: "Download combined unit-wise notes for AKTU subjects. Ideal when you need a single PDF with complete coverage.",
  },
};

const CategoryPage = () => {
  const { categoryKey } = useParams();
  const category = getCategory(categoryKey);
  const { user } = useAuth();

  const defaultSeo = {
    title: "AKTU Study Materials | Eduavaa",
    description: "Download AKTU study materials including notes, quantum PDFs, and question papers.",
    h1: "AKTU Study Materials",
    intro: "Browse curated PDFs for AKTU students across branches.",
  };

  const currentSeo = category ? CATEGORY_SEO[category.key as CategoryKey] || defaultSeo : defaultSeo;
  const sharedKeywords = "AKTU notes, AKTU quantum, AKTU question papers, APJ Abdul Kalam Technical University notes, AKTU unit wise notes, AKTU engineering notes PDF";

  const [query, setQuery] = useState("");
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loadingUnlocks, setLoadingUnlocks] = useState(false);
  const [payingNote, setPayingNote] = useState<string | null>(null);

  const manifestObj = manifest as ManifestStructure;

  // Get PDFs for current category from manifest
  const currentCategoryPaths = useMemo(() => {
    if (!category) return [] as string[];
    return manifestObj[category.key as keyof ManifestStructure] || [];
  }, [category, manifestObj]);

  const currentIndex = useMemo(() => {
    return category ? buildIndex(currentCategoryPaths, category.price) : [];
  }, [currentCategoryPaths, category]);

  const allFilteredNotes = useMemo(() => filterByQuery(currentIndex, query), [currentIndex, query]);

  // Display logic: show limited results by default, all results when searching
  const displayedNotes = useMemo(() => {
    if (query.trim()) {
      // Search active: show all matching results
      return allFilteredNotes;
    }
    // No search: show only first 15 PDFs
    return allFilteredNotes.slice(0, 15);
  }, [allFilteredNotes, query]);

  // Build quick counts for suggestions in other categories
  const otherCategoryMatches = useMemo(() => {
    if (!query) return [] as { key: string; label: string; count: number }[];
    const items: { key: string; label: string; count: number }[] = [];
    const others = allCategories().filter((c) => c.key !== category?.key);
    for (const c of others) {
      const paths = manifestObj[c.key as keyof ManifestStructure] || [];
      if (!paths.length) continue;
      const idx = buildIndex(paths, c.price);
      const results = filterByQuery(idx, query);
      if (results.length) items.push({ key: c.key, label: c.label, count: results.length });
    }
    return items;
  }, [manifestObj, category?.key, query]);

  useEffect(() => {
    if (!user) {
      setUnlocked([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        setLoadingUnlocks(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user-unlocks/${user.uid}`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data.unlockedNotes)) {
          setUnlocked(data.unlockedNotes);
        }
      } catch (e) {
        if (!cancelled) setUnlocked([]);
      } finally {
        if (!cancelled) setLoadingUnlocks(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handlePay = (note: Note) => {
    if (!user) {
      alert("Please sign in with Google to continue");
      return;
    }
    if (!category) return;
    if (payingNote === note.r2Path) return;
    setPayingNote(note.r2Path);
    startPayment({
      amount: category.price,
      note,
      user,
      onSuccess: () => {
        setUnlocked((prev) => (prev.includes(note.r2Path) ? prev : [...prev, note.r2Path]));
        setPayingNote(null);
        alert("Payment successful! PDF unlocked.");
      },
      onFailure: () => {
        setPayingNote(null);
        alert("Payment cancelled or failed.");
      },
    });
  };

  if (!category) {
    return (
      <Layout title="Category Not Found – Eduava">
        <div className="container py-20 text-center space-y-4">
          <h1 className="text-3xl font-serif font-bold">Category Not Found</h1>
          <Link className="underline" to="/">Go Home</Link>
        </div>
      </Layout>
    );
  }

  const seoDescription = `${currentSeo.description} Price ₹${category.price || 0} per file. Preview before purchase, secure checkout, instant download.`;
  const seoKeywords = `${sharedKeywords}, ${category.label || 'AKTU'} notes PDF, ${category.label || 'AKTU'} study material, ${category.key || 'aktu'} PDFs`;

  return (
    <Layout 
      title={String(currentSeo.title)} 
      description={String(seoDescription || "Download AKTU study materials")}
      keywords={String(seoKeywords || sharedKeywords)}
    >
      {/* Header */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="capitalize">{category.label}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Badge className="mb-1">AKTU {category.label}</Badge>
              <h1 className="text-3xl font-serif font-bold">{currentSeo.h1}</h1>
              <p className="text-sm text-muted-foreground max-w-2xl">
                {currentSeo.intro} APJ Abdul Kalam Technical University students can preview PDFs, pay securely, and access downloads instantly.
              </p>
              <p className="text-xs text-muted-foreground">Price per file: ₹{category.price} • Branch-ready PDFs</p>
            </div>
            <div className="px-4 py-2 bg-card border rounded-xl text-center">
              <p className="text-2xl font-bold">{currentCategoryPaths.length}</p>
              <p className="text-xs text-muted-foreground">PDFs available</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Intro */}
      <section className="py-8 bg-white border-b">
        <div className="container grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              {category.label} for APJ Abdul Kalam Technical University
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Find {category.label.toLowerCase()} tailored for AKTU branches. Materials are organized unit wise to help you revise faster and cover the syllabus without guesswork.
            </p>
            <h3 className="text-lg font-semibold text-slate-900">How to use</h3>
            <p className="text-slate-600 leading-relaxed">
              Use the search bar for subject name, code, or short name. Preview the first page, then unlock full PDFs securely. Ideal for AKTU exams, assignments, and quick revision.
            </p>
          </div>
          <div className="space-y-2 bg-secondary/30 border border-slate-100 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-slate-900">Explore more AKTU resources</h3>
            <div className="space-y-1 text-sm text-slate-700">
              <Link to="/category/notes" className="block hover:text-indigo-700">Browse AKTU Notes</Link>
              <Link to="/category/quantum" className="block hover:text-indigo-700">Download AKTU Quantum PDFs</Link>
              <Link to="/category/question-papers" className="block hover:text-indigo-700">AKTU Question Papers with solutions</Link>
              <Link to="/category/all-unit-notes" className="block hover:text-indigo-700">All Unit Notes for AKTU</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search (sticky on mobile) */}
      <section className="py-0 border-b">
        <div className="container">
          <div className="sticky top-16 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 py-4">
            <SearchBar value={query} onChange={setQuery} debounceMs={300} />
            <p className="text-xs text-muted-foreground mt-2">
              Tips: Try full subject name (e.g. Compiler Design), short name (CD), or code (KCS-601).
            </p>
          </div>
        </div>
      </section>

      {/* Results (ensure comfortable space for keyboard) */}
      <section className="py-12 pb-24 min-h-[50svh]">
        <div className="container space-y-8">
          {displayedNotes.length > 0 ? (
            <>
              <PDFList
                notes={displayedNotes}
                unlocked={unlocked}
                loadingUnlocks={loadingUnlocks}
                payingNote={payingNote}
                onPay={handlePay}
                category={category?.label || categoryKey || "Notes"}
              />

              {/* Performance stats */}
              <div className="text-center py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{displayedNotes.length}</span> of{" "}
                  <span className="font-semibold text-foreground">{currentCategoryPaths.length}</span> PDFs
                  {query.trim() && (
                    <>
                      {" "}
                      (
                      <span className="text-accent">
                        {allFilteredNotes.length} matches for "{query}"
                      </span>
                      )
                    </>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-secondary/20">
              <h3 className="font-serif font-bold text-xl mb-2">No matches here</h3>
              <p className="text-muted-foreground mb-6">
                {category.suggestions?.length ? "Not found here. Try these categories:" : "Try a different query."}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {category.suggestions?.map((k) => (
                  <Link key={k} to={`/category/${k}`} className="px-4 py-2 rounded border bg-card hover:bg-secondary transition-colors">
                    {getCategory(k)?.label}
                  </Link>
                ))}
              </div>
              {otherCategoryMatches.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">We found partial matches in:</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    {otherCategoryMatches.map((m) => (
                      <Link key={m.key} to={`/category/${m.key}`} className="text-sm underline">
                        {m.label} ({m.count})
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
