import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  note: Note;
  category: string;
  isUnlocked?: boolean;
  className?: string;
}

const AddToCartButton = ({
  note,
  category,
  isUnlocked = false,
  className = "",
}: AddToCartButtonProps) => {
  // Safety checks
  if (!note || !note.r2Path || !category) {
    return null;
  }

  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  
  // Safe cart check with fallback
  const inCart = isInCart ? isInCart(note.r2Path) : false;

  // Don't show button for unlocked PDFs
  if (isUnlocked) {
    return null;
  }

  const handleAddToCart = () => {
    try {
      if (!addToCart) {
        console.warn("addToCart function not available");
        return;
      }
      
      const success = addToCart(note, category);
      if (success && toast) {
        toast({
          title: "Added to cart",
          description: `${note.label} has been added to your cart.`,
        });
      } else if (!success && toast) {
        toast({
          title: "Already in cart",
          description: "This item is already in your cart.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <Button
      variant={inCart ? "secondary" : "outline"}
      size="sm"
      onClick={handleAddToCart}
      disabled={inCart}
      className={`gap-1.5 ${className}`}
    >
      {inCart ? (
        <>
          <Check className="h-3.5 w-3.5" />
          In Cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-3.5 w-3.5" />
          Add to Cart
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
