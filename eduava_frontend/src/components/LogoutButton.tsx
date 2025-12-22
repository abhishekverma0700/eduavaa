import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default () => (
  <Button variant="outline" onClick={() => signOut(auth)}>
    Logout
  </Button>
);
