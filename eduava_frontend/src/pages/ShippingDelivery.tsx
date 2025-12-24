import Layout from "@/components/Layout";

const ShippingDelivery = () => {
  return (
    <Layout
      title={"Shipping & Delivery Policy | Eduavaa"}
      description={"Shipping and delivery policy for digital AKTU notes (instant digital delivery)."}
      keywords={"shipping, delivery, policy, instant digital delivery, Eduavaa"}
    >
      <section className="py-12 bg-white border-b">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">Shipping & Delivery Policy</h1>
          <p className="text-slate-600 max-w-3xl">Eduavaa provides digital products. There is no physical shipping. After successful payment, your AKTU notes are available immediately for download. This is <strong>Instant digital delivery</strong>.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container prose prose-slate max-w-3xl">
          <h2>Access</h2>
          <p>Unlocked PDFs can be downloaded instantly and accessed from your device.</p>
          <h2>Issues</h2>
          <p>If your download does not start, contact support and we will re-issue access promptly.</p>
          <h2>Contact</h2>
          <p>Email: <a href="mailto:eduavaa0700@gmail.com">eduavaa0700@gmail.com</a></p>
        </div>
      </section>
    </Layout>
  );
};

export default ShippingDelivery;
