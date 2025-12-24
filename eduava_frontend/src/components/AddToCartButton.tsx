import { Note } from "@/types";

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
}: AddToCartButtonProps) => {
  if (!note || !note.r2Path || !category) return null;
  if (isUnlocked) return null;

  // Temporarily hide add-to-cart while checkout is disabled
  return null;
};

export default AddToCartButton;
