import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface RazorpaySDKContextType {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

const RazorpaySDKContext = createContext<RazorpaySDKContextType>({
  isLoaded: false,
  isLoading: true,
  error: null,
});

export const useRazorpaySDK = () => {
  const context = useContext(RazorpaySDKContext);
  if (!context) {
    throw new Error("useRazorpaySDK must be used within RazorpaySDKProvider");
  }
  return context;
};

interface RazorpaySDKProviderProps {
  children: ReactNode;
}

export const RazorpaySDKProvider = ({ children }: RazorpaySDKProviderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if SDK is already loaded
    if ((window as any).Razorpay) {
      console.log("✅ Razorpay SDK already loaded");
      setIsLoaded(true);
      setIsLoading(false);
      return;
    }

    // Wait for SDK to load from the script tag in index.html
    const checkSDKLoaded = () => {
      if ((window as any).Razorpay) {
        console.log("✅ Razorpay SDK loaded successfully");
        setIsLoaded(true);
        setIsLoading(false);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkSDKLoaded()) {
      return;
    }

    // Poll for SDK availability
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait (50 * 100ms)
    
    const pollInterval = setInterval(() => {
      attempts++;
      
      if (checkSDKLoaded()) {
        clearInterval(pollInterval);
      } else if (attempts >= maxAttempts) {
        console.error("❌ Razorpay SDK failed to load after timeout");
        setError("Failed to load payment system. Please refresh the page.");
        setIsLoading(false);
        clearInterval(pollInterval);
      }
    }, 100);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  return (
    <RazorpaySDKContext.Provider value={{ isLoaded, isLoading, error }}>
      {children}
    </RazorpaySDKContext.Provider>
  );
};
