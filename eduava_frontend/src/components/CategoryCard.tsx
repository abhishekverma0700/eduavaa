import { Link } from "react-router-dom";
import { Category } from "@/data/categories";

type Props = {
  category: Category;
  index?: number;
};

const CategoryCard = ({ category, index = 0 }: Props) => {
  return (
    <Link
      to={`/category/${category.key}`}
      className="group block p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-1">{category.label}</h3>
          <p className="text-muted-foreground text-sm">Price per file: ₹{category.price}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-primary text-sm">
          Browse →
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
