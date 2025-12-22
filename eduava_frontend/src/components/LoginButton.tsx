import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

const LoginButton = () => {
  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  return <Button onClick={login}>Sign in with Google</Button>;
};

export default LoginButton;
