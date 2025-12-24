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
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-subtle">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(172_66%_35%_/_0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(217_91%_22%_/_0.05),transparent_50%)]" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium animate-fade-in">
              <GraduationCap className="h-4 w-4" />
              Trusted by AKTU Students
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight animate-slide-up">
              Quality <span className="text-accent">AKTU Notes</span>
              <br />for Every Branch
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
              Download genuine, well-structured PDF notes for Abdul Kalam Technical University. 
              Preview before you buy, pay securely, download instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Button variant="hero" size="xl" asChild>
                <a href="#branches">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Browse Notes
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#about">
                  Learn More
                </a>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success" />
                Preview First
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-accent" />
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="h-4 w-4 text-primary" />
                Instant Download
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12 animate-bounce">
            <a href="#branches" className="text-muted-foreground hover:text-accent transition-colors">
              <ArrowDown className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore PDFs grouped by type. Prices are per file and shown on each category.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCategories().map((c, i) => (
              <CategoryCard key={c.key} category={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section id="branches" className="py-20 bg-background">
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
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Why Students Trust Eduava
              </h2>
              <p className="text-muted-foreground">
                We understand the challenges AKTU students face during exam preparation. 
                That's why we've created a simple, trustworthy platform for quality notes.
              </p>
              
              <div className="space-y-4">
                {[
                  {
                    icon: BookOpen,
                    title: "Genuine Notes",
                    description: "Carefully curated notes covering syllabus comprehensively"
                  },
                  {
                    icon: Shield,
                    title: "Preview Before Purchase",
                    description: "See exactly what you're getting with our PDF preview feature"
                  },
                  {
                    icon: Download,
                    title: "Instant Downloads",
                    description: "Get your notes immediately after secure payment"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="font-serif font-bold text-2xl text-foreground mb-2">
                    AKTU Helper
                  </h3>
                  <p className="text-muted-foreground">
                    Your trusted companion for exam success
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground px-6 py-3 rounded-xl shadow-lg font-semibold">
                ✨ Quality Guaranteed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Start browsing our collection of AKTU notes and find exactly what you need for your subjects.
          </p>
          <Button variant="secondary" size="xl" asChild>
            <Link to="/#branches">
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
