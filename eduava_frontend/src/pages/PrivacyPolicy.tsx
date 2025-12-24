import Layout from "@/components/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout
      title={"Privacy Policy | Eduavaa"}
      description={"Privacy Policy for Eduavaa (AKTU notes platform). We respect user privacy and handle data responsibly."}
      keywords={"privacy policy, Eduavaa, AKTU notes"}
    >
      <section className="py-12 bg-white border-b">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-600 max-w-3xl">This page explains how Eduavaa collects and uses information. We only use essential data to operate the platform, process payments, and improve the experience. No unnecessary tracking. Contact us for any questions.</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container prose prose-slate max-w-3xl">
          <h2>Information We Collect</h2>
          <p>Account information (Google sign-in), purchase records, and technical logs required to run the service.</p>
          <h2>Use of Information</h2>
          <p>To deliver digital PDFs, verify payments, provide support, and maintain security.</p>
          <h2>Data Security</h2>
          <p>We use industry-standard safeguards. Payment details are handled by payment gateways.</p>
          <h2>Contact</h2>
          <p>Email: <a href="mailto:eduavaa0700@gmail.com">eduavaa0700@gmail.com</a></p>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
