import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { getBranchBySlug } from "@/data/branches";
import { getSubjectsByBranch } from "@/data/subjects";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen } from "lucide-react";

const BranchPage = () => {
  const { branchSlug } = useParams<{ branchSlug: string }>();

  const branch = branchSlug ? getBranchBySlug(branchSlug) : undefined;
  const subjects = branchSlug ? getSubjectsByBranch(branchSlug) : [];

  if (!branch) {
    return (
      <Layout title="Branch Not Found – Eduava">
        <div className="container py-20 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">
            Branch Not Found
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

  return (
    <Layout
      title={`${branch.name} Notes AKTU | Eduava`}
      description={`Download genuine ${branch.name} notes for AKTU. Unit wise PDFs, instant access.`}
      keywords={`${branch.name} notes AKTU, AKTU ${branch.name} PDF`}
    >
      {/* Header */}
      <section className="bg-secondary/30 py-12">
        <div className="container">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Branches
          </Link>

          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            {branch.name}
          </h1>
          <p className="text-muted-foreground mt-1">
            {subjects.length} subjects available
          </p>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-12">
        <div className="container">
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map(subject => (
                <Link
                  key={subject.slug}
                  to={`/${branchSlug}/${subject.slug}`}
                  className="block p-6 rounded-xl border bg-card hover:bg-accent/5 transition"
                >
                  <h3 className="text-lg font-serif font-bold capitalize">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View notes
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card border rounded-2xl">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif font-bold text-xl mb-2">
                Coming Soon
              </h3>
              <p className="text-muted-foreground">
                Notes for {branch.name} will be added soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BranchPage;
