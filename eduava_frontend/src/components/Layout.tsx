import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
}

const Layout = ({ 
  children, 
  title = "Eduava – AKTU Notes Download",
  description = "Download genuine AKTU notes PDF with preview. Trusted notes platform for Abdul Kalam Technical University students.",
  keywords = "AKTU notes, AKTU helper, AKTU PDF notes, Abdul Kalam Technical University notes"
}: LayoutProps) => {
  // Ensure title is always a string
  const safeTitle = String(title || "Eduava – AKTU Notes Download");
  const safeDescription = String(description || "Download genuine AKTU notes PDF with preview.");
  const safeKeywords = String(keywords || "AKTU notes");
  const siteUrl = String(import.meta.env.VITE_SITE_URL || "https://eduavaa.in").replace(/\/$/, "");
  const canonical = typeof window !== "undefined" ? `${siteUrl}${window.location.pathname}${window.location.search}` : siteUrl;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Eduavaa',
        url: siteUrl,
        description: 'AKTU notes, quantum, and question papers for APJ Abdul Kalam Technical University students.',
        inLanguage: 'en',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Eduavaa',
        url: siteUrl,
        description: 'Platform for AKTU notes, quantum PDFs, and question papers with previews and instant downloads.',
        sameAs: [siteUrl],
      },
    ],
  };
  
  return (
    <>
      <Helmet>
        <title>{safeTitle}</title>
        <meta name="description" content={safeDescription} />
        <meta name="keywords" content={safeKeywords} />
        <meta property="og:title" content={safeTitle} />
        <meta property="og:description" content={safeDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={safeTitle} />
        <meta name="twitter:description" content={safeDescription} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <div className="flex flex-col min-h-[100svh] animate-fade-in">
        <Header />
        <main className="flex-1 animate-fade-in">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
