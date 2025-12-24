import Layout from "@/components/Layout";

const RefundCancellation = () => {
  return (
    <Layout
      title={"Refund & Cancellation Policy | Eduavaa"}
      description={"Refund & cancellation policy for digital AKTU notes on Eduavaa."}
      keywords={"refund, cancellation, policy, Eduavaa, AKTU notes"}
    >
      <section className="py-12 bg-white border-b">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">Refund & Cancellation Policy</h1>
          <p className="text-slate-600 max-w-3xl">Eduavaa delivers digital PDFs instantly after successful payment. As digital goods are accessible immediately, refunds are generally not possible. If you face any technical issue, contact support and we will help resolve it promptly.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container prose prose-slate max-w-3xl">
          <h2>Eligibility</h2>
          <p>Refunds are considered only for duplicate transactions or failed unlocks verified by our system.</p>
          <h2>How to request</h2>
          <p>Email <a href="mailto:eduavaa0700@gmail.com">eduavaa0700@gmail.com</a> with your order details and a brief description.</p>
          <h2>Timeline</h2>
          <p>Valid cases are processed within 5-7 business days.</p>
        </div>
      </section>
    </Layout>
  );
};

export default RefundCancellation;
