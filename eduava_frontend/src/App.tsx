import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import Index from "./pages/Index";
import BranchPage from "./pages/BranchPage";
import SubjectPage from "./pages/SubjectPage";
import NotFound from "./pages/NotFound";
import AdminPage from "@/pages/AdminPage";
import CategoryPage from "@/pages/CategoryPage";
import CartPage from "@/pages/CartPage";
import CategoriesPage from "@/pages/CategoriesPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import RefundCancellation from "@/pages/RefundCancellation";
import ShippingDelivery from "@/pages/ShippingDelivery";



const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/category/:categoryKey" element={<CategoryPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refund-cancellation" element={<RefundCancellation />} />
              <Route path="/shipping-delivery" element={<ShippingDelivery />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/:branchSlug" element={<BranchPage />} />
              <Route path="/:branchSlug/:subjectSlug" element={<SubjectPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
