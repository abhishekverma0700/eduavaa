import { Link } from "react-router-dom";
import { BookOpen, Heart, Shield, Mail, Github, Twitter, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-card mt-auto">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-slate-900">Eduavaa</span>
                <span className="text-[11px] text-indigo-600 font-medium -mt-1">Quality AKTU Notes</span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              Curated resources for disciplined learning. Premium AKTU notes trusted by thousands of students.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-slate-900">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Search by Category
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Branches */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-slate-900">Popular</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/cse" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link to="/ece" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/me" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Mechanical
                </Link>
              </li>
              <li>
                <Link to="/ee" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                  Electrical
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-slate-900">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/refund-cancellation" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">Refund & Cancellation</Link>
              </li>
              <li>
                <Link to="/shipping-delivery" className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">Shipping / Delivery (Instant digital delivery)</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-slate-900">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <a href="mailto:eduavaa0700@gmail.com" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">eduavaa0700@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <a href="tel:+919452601372" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">+91 9452601372</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <a href="tel:+917268070709" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">+91 7268070709</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Eduavaa. All rights reserved.
          </p>
          <p className="text-sm text-slate-600 flex items-center gap-2">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> for AKTU Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
