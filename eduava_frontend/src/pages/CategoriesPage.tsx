import Layout from "@/components/Layout";
import CategoryCard from "@/components/CategoryCard";
import { allCategories } from "@/data/categories";

const CategoriesPage = () => {
  return (
    <Layout
      title={"Search Material by Category | Eduavaa"}
      description={"Browse AKTU notes, quantum, question papers, and all unit notes by category. Preview PDFs, pay securely, and download instantly."}
      keywords={"AKTU notes, categories, AKTU quantum, AKTU question papers, AKTU unit wise notes"}
    >
      <section className="py-12 bg-white border-b">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">
            Search Material by Category
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Choose a category to find AKTU engineering notes PDF, quantum, question papers, or combined unit-wise notes.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCategories().map((c, i) => (
              <CategoryCard key={c.key} category={c} index={i} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoriesPage;
