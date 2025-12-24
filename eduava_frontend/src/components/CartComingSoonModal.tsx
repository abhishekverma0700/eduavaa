import { X, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CartComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartComingSoonModal = ({ isOpen, onClose }: CartComingSoonModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          {/* Icon */}
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-2">
            <Rocket className="h-8 w-8 text-indigo-600" />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Bulk Checkout Coming Soon 🚀
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              We're working on making bulk checkout even better for you!
            </p>
          </div>

          {/* Alt Solution */}
          <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-4">
            <p className="text-sm text-slate-700">
              <span className="font-semibold text-indigo-700">Quick tip:</span> You can still purchase notes one by one easily. Just open any note and click <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-indigo-200">Pay & Unlock</span> to get instant access!
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2">
            <Link to="/">
              <Button 
                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
                onClick={onClose}
              >
                Browse Notes
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onClose}
            >
              Okay, Got It
            </Button>
          </div>

          {/* Footer Message */}
          <p className="text-xs text-slate-500">
            We appreciate your patience! Check back soon.
          </p>
        </div>
      </div>
    </div>
  );
};
