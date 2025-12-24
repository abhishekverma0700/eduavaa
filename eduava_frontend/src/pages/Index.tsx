import Layout from "@/components/Layout";
import BranchCard from "@/components/BranchCard";
import CategoryCard from "@/components/CategoryCard";
import { allCategories } from "@/data/categories";
import { branches } from "@/data/branches";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Shield, Download, CheckCircle, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout
      title="AKTU Notes, Quantum & Question Papers | Eduavaa"
      description="Download AKTU notes, quantum PDFs, question papers, and unit-wise notes for APJ Abdul Kalam Technical University. Preview before buying, pay securely, and access instantly."
      keywords="AKTU notes, AKTU quantum, AKTU question papers, APJ Abdul Kalam Technical University notes, AKTU unit wise notes, AKTU engineering notes PDF"
    >
      {/* Hero Section - Professional Academic Design */}
      <section className="relative overflow-hidden perspective">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-purple-50/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(246_75%_48%_/_0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(168_80%_52%_/_0.06),transparent_50%)]" />
        
        {/* 3D Animated Background Elements */}
        {/* Floating Orb 1 - Indigo */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animate-float-slow" />
        
        {/* Floating Orb 2 - Purple */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float-slower" style={{ animationDelay: '2s' }} />
        
        {/* Floating Orb 3 - Mint */}
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        
        {/* Rotating 3D Element */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-40 h-40 border border-indigo-200/30 rounded-lg animate-rotate-3d" style={{ animationDuration: '25s' }} />
        </div>
        
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/60 rounded-full text-indigo-700 text-sm font-medium border border-indigo-200/60">
              <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              Trusted by AKTU Students
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 leading-tight">
                AKTU Notes, Quantum &
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                  Question Papers for Every Branch
                </span>
              </h1>
              
              {/* Slogan */}
              <p className="text-lg md:text-xl text-slate-600 font-medium">
                Curated resources for disciplined learning
              </p>
            </div>
            
            {/* Description */}
            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Access premium, well-researched PDF notes from APJ Abdul Kalam Technical University. 
              Browse AKTU quantum, unit-wise notes, and question papers with previews, secure payment, and instant unlocks.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/categories" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all">
                  <BookOpen className="h-5 w-5" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/#about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full gap-2 h-12 rounded-lg border-2 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-8 md:flex md:items-center md:justify-center md:gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 text-green-600 mb-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <p className="text-xs md:text-sm font-medium text-slate-700">Preview First</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100 text-blue-600 mb-2">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="text-xs md:text-sm font-medium text-slate-700">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100 text-purple-600 mb-2">
                  <Download className="h-6 w-6" />
                </div>
                <p className="text-xs md:text-sm font-medium text-slate-700">Instant Access</p>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center pt-8">
              <Link 
                to="/#categories" 
                className="text-slate-400 hover:text-slate-600 transition-colors animate-bounce"
              >
                <ArrowDown className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 md:py-28 bg-white relative overflow-hidden">
        {/* Subtle Background Animation */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-float-slower" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-4 animate-fade-in">
              Study Materials by Category
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose from our curated collection of unit notes, question papers, and comprehensive quantum materials.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCategories().map((c, i) => (
              <CategoryCard key={c.key} category={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section - Hidden */}
      {/* <section id="branches" className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Choose Your Branch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select your engineering branch to explore available subjects and notes.
              We cover all major AKTU branches with comprehensive study materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch, index) => (
              <BranchCard key={branch.id} branch={branch} index={index} />
            ))}
          </div>
        </div>
      </section> */}

      {/* About Section */}
      <section id="about" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="animate-slide-up">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-4">
                  Why Choose Eduavaa?
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  AKTU students deserve better study materials. Instead of scattered, inconsistent notes across platforms, 
                  we've created a trusted space for high-quality, comprehensive resources.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    icon: BookOpen,
                    title: "Curated Quality",
                    description: "Notes that cover syllabi comprehensively, not just random collections"
                  },
                  {
                    icon: Shield,
                    title: "Preview & Trust",
                    description: "View PDF previews before purchasing to ensure quality"
                  },
                  {
                    icon: Download,
                    title: "Instant Unlock",
                    description: "Download immediately after secure payment—no waiting"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 flex-shrink-0">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-float">
              <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow duration-300 perspective">
                <div className="text-center p-8 animate-scale-in">
                  <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>📚</div>
                  <h3 className="font-serif font-bold text-3xl text-slate-900 mb-2">
                    Eduavaa
                  </h3>
                  <p className="text-slate-600 text-lg font-medium">
                    Your trusted study companion
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-indigo-600 text-white px-6 py-4 rounded-xl shadow-xl font-semibold text-sm animate-pulse-glow">
                ✨ Premium Quality
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
              AKTU Notes for All Branches
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Eduavaa is built for students of APJ Abdul Kalam Technical University (AKTU). We curate engineering notes, quantum PDFs, and previous question papers so you can revise faster with trusted material. Every PDF is organized unit-wise to make exam preparation simpler.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Explore subject-wise and branch-wise resources, preview before paying, and download instantly once unlocked. Our focus is quality, clarity, and coverage across the AKTU syllabus.
            </p>
          </div>

          <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Quick Links</h3>
            <ul className="space-y-2 text-slate-700">
              <li>
                <Link to="/category/notes" className="hover:text-teal-700 font-medium">Browse AKTU Notes</Link>
              </li>
              <li>
                <Link to="/category/quantum" className="hover:text-teal-700 font-medium">Download AKTU Quantum PDFs</Link>
              </li>
              <li>
                <Link to="/category/question-papers" className="hover:text-teal-700 font-medium">AKTU Question Papers with Solutions</Link>
              </li>
              <li>
                <Link to="/category/all-unit-notes" className="hover:text-teal-700 font-medium">All Unit Notes for AKTU</Link>
              </li>
            </ul>
            <div className="pt-2 text-sm text-slate-600 leading-relaxed">
              These links keep navigation simple and help you find the right AKTU engineering notes PDF in seconds.
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Ready to Ace AKTU Exams?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Start browsing AKTU notes, quantum PDFs, and question papers to find exactly what you need for your subjects.
          </p>
          <Button variant="secondary" size="xl" asChild>
            <Link to="/category/notes">
              <BookOpen className="h-5 w-5 mr-2" />
              Browse All Notes
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
