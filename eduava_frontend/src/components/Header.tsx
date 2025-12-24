import { Link } from "react-router-dom";
import { BookOpen, Menu, X, LogIn, LogOut, ShoppingCart, User, History, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import logoImg from "@/assests/logo.jpeg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, login, logout } = useAuth();
  const { cartCount } = useCart();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeCartCount = typeof cartCount === 'number' ? cartCount : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/98 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 transition-transform hover:scale-105"
        >
          <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 bg-white shadow-sm">
            <img
              src={logoImg}
              alt="Eduavaa logo - book with leaf and circuits"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xl font-serif font-bold text-foreground">
              Eduavaa
            </span>
            <span className="text-[10px] text-muted-foreground -mt-0.5 tracking-wide">
              Curated Resources
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/#categories"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Categories
          </Link>
          <Link
            to="/#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse
          </Link>
          <Link
            to="/#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>

        {/* Right Section - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <Link to="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-secondary"
            >
              <ShoppingCart className="h-5 w-5" />
              {safeCartCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
                  variant="destructive"
                >
                  {safeCartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="hover:bg-secondary"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 origin-top-right z-50">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-border/50 bg-secondary/30">
                      <p className="text-sm font-semibold text-foreground">{user.displayName || "User"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                    </div>
                    <nav className="flex flex-col">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-3"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-3"
                      >
                        <History className="h-4 w-4" />
                        My Orders
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setIsProfileOpen(false)}
                        className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-3"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Cart {safeCartCount > 0 && <Badge variant="secondary">{safeCartCount}</Badge>}
                      </Link>
                      <div className="border-t border-border/50" />
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors flex items-center gap-3 w-full text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </nav>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      login();
                      setIsProfileOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors flex items-center gap-2 justify-center"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile: Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart" className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-secondary"
            >
              <ShoppingCart className="h-5 w-5" />
              {safeCartCount > 0 && (
                <Badge
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
                  variant="destructive"
                >
                  {safeCartCount}
                </Badge>
              )}
            </Button>
          </Link>
          <button
            className="p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close" : "Open profile menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <User className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-sm animate-in fade-in-0 slide-in-from-top">
          <nav className="container py-4 flex flex-col gap-1">
            <Link
              to="/"
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/#categories"
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/#"
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Notes
            </Link>
            <Link
              to="/#about"
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="border-t border-border/50 my-2" />

            {!user ? (
              <Button
                onClick={() => {
                  login();
                  setIsMenuOpen(false);
                }}
                className="w-full gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            ) : (
              <>
                <div className="px-4 py-2 text-xs text-muted-foreground">
                  Logged in as {user.displayName?.split(" ")[0]}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors flex items-center gap-2 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
