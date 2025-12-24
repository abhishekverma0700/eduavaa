import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";

const CartIcon = () => {
  const { cartCount } = useCart();
  
  // Safe count with fallback
  const safeCount = typeof cartCount === 'number' ? cartCount : 0;

  return (
    <Link to="/cart">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        aria-label={`Shopping cart with ${safeCount} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {safeCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            variant="destructive"
          >
            {safeCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
};

export default CartIcon;
