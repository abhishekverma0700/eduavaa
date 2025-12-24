import { useCart } from "@/context/CartContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ShoppingCart, IndianRupee, ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Ensure cart is always an array
  const safeCart = Array.isArray(cart) ? cart : [];

  if (!cartCount || cartCount === 0 || safeCart.length === 0) {
    return (
      <Layout>
        <Helmet>
          <title>{String("Shopping Cart - Eduava")}</title>
        </Helmet>

        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="container max-w-2xl">
            <div className="text-center space-y-6">
              {/* Empty Cart Icon */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center justify-center h-28 w-28 rounded-full bg-secondary/50">
                  <ShoppingCart className="h-14 w-14 text-muted-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                  Your Cart is Empty
                </h1>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Browse our collection of AKTU notes, question papers, and study materials to get started.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Link to="/" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Browse Notes
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{String(`Shopping Cart (${cartCount || 0}) - Eduava`)}</title>
      </Helmet>

      <div className="container py-8 md:py-12 pb-24 md:pb-12">
        {/* Page Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Shopping Cart
          </h1>
          <p className="text-muted-foreground text-lg">
            {cartCount} {cartCount === 1 ? "item" : "items"} ready for checkout
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart Button - Mobile */}
            <div className="flex md:hidden mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="gap-2 ml-auto"
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>

            {/* Cart Items */}
            {(safeCart || []).map((item, idx) => {
              if (!item || !item.r2Path) return null;
              return (
                <Card key={item.r2Path} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex gap-4">
                      {/* Icon - Desktop Only */}
                      <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 text-primary flex-shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>

                      {/* Item Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title & Badges */}
                        <div className="mb-3">
                          <h3 className="font-semibold text-foreground text-base md:text-lg leading-snug line-clamp-2 mb-2">
                            {item.label}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs font-medium">
                              {item.category}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className="text-xs font-medium bg-background"
                            >
                              {item.type === "unit"
                                ? "Unit Notes"
                                : item.type === "quantum"
                                ? "Quantum"
                                : "All Units"}
                            </Badge>
                          </div>
                        </div>

                        {/* Price and Remove Row */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4 md:h-5 md:w-5 text-primary font-bold" />
                            <span className="text-lg md:text-xl font-bold text-foreground">
                              {item.price.toFixed(2)}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.r2Path)}
                            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/5 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-xs md:text-sm">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary - Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-5 pb-4">
                {/* Summary Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})</span>
                    <span className="font-medium text-foreground">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between text-base">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-lg text-primary">₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-accent/5 border border-accent/10 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    All PDFs unlock instantly after payment. No waiting!
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 pt-2">
                  <Button 
                    size="lg" 
                    className="w-full gap-2 h-12 text-base"
                    disabled={processingPayment}
                    onClick={() => setProcessingPayment(true)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {processingPayment ? "Processing..." : "Proceed to Pay"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full gap-2 h-12"
                    asChild
                  >
                    <Link to="/">
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile: Order Summary Card Below Items */}
        <div className="lg:hidden mt-8 mb-24">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold">Order Summary</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4 pb-4">
              {/* Summary Details */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{cartCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between text-base">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary text-lg">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-accent/5 border border-accent/10 rounded-lg p-3 flex gap-2">
                <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  PDFs unlock instantly after successful payment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile: Sticky Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-card border-t border-border/50 shadow-2xl z-40">
          <div className="container px-4 py-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-primary">₹{cartTotal.toFixed(2)}</p>
            </div>
            <Button 
              size="lg" 
              className="gap-2 h-12 px-6"
              disabled={processingPayment}
              onClick={() => setProcessingPayment(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Pay Now</span>
              <span className="sm:hidden">Pay</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
