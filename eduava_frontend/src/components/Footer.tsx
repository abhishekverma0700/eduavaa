import { Link } from "react-router-dom";
import { BookOpen, Heart, Shield, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-md">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-serif font-bold text-foreground">Eduava</span>
                <span className="text-[10px] text-muted-foreground -mt-1">AKTU Notes</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for quality AKTU notes. Download genuine, well-structured PDF notes for all branches.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#branches" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse Notes
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Branches */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-foreground">Popular Branches</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/cse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link to="/ece" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Electronics & Communication
                </Link>
              </li>
              <li>
                <Link to="/me" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Mechanical Engineering
                </Link>
              </li>
              <li>
                <Link to="/ee" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Electrical Engineering
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-foreground">Trust & Security</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-accent" />
                Secure Payments
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 text-accent" />
                Genuine Notes
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                support@eduava.in
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Eduava. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-destructive fill-destructive" /> for AKTU Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
