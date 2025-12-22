import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-secondary mb-6">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-6xl font-serif font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back to finding those notes!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/#branches">
              Browse Notes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
