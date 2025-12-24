import Layout from "@/components/Layout";

const Terms = () => {
  return (
    <Layout
      title={"Terms & Conditions | Eduavaa"}
      description={"Terms & Conditions for using Eduavaa (AKTU notes platform)."}
      keywords={"terms, conditions, Eduavaa, AKTU notes"}
    >
      <section className="py-12 bg-white border-b">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">Terms & Conditions</h1>
          <p className="text-slate-600 max-w-3xl">By using Eduavaa, you agree to access purchased PDFs for personal academic use. Redistribution or commercial use is not permitted. All materials are provided for learning purposes.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container prose prose-slate max-w-3xl">
          <h2>Usage</h2>
          <p>Use the platform responsibly and comply with your university’s policies.</p>
          <h2>Payments</h2>
          <p>Payments are processed securely via integrated gateways. Keep your transaction IDs for support.</p>
          <h2>Support</h2>
          <p>For assistance, email <a href="mailto:eduavaa0700@gmail.com">eduavaa0700@gmail.com</a>.</p>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
