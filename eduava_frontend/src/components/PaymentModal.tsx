import { useState } from "react";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { X, CreditCard, Shield, CheckCircle, IndianRupee, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDownloadUrl } from "@/config/r2";

interface PaymentModalProps {
  note: Note;
  onClose: () => void;
}

const PaymentModal = ({ note, onClose }: PaymentModalProps) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessing(false);
    setSuccess(true);
    
    toast({
      title: "Payment Successful!",
      description: "Your download will start automatically.",
    });

    // Trigger download after success
    setTimeout(() => {
      const downloadUrl = getDownloadUrl(note.r2Path);
      window.open(downloadUrl, "_blank");
      onClose();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="font-serif font-bold text-xl text-foreground">Complete Purchase</h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={processing}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h4 className="font-serif font-bold text-xl text-foreground mb-2">
                Payment Successful!
              </h4>
              <p className="text-muted-foreground">
                Your download is starting...
              </p>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-foreground">Order Summary</h4>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{note.label}</p>
                    <p className="text-sm text-muted-foreground">PDF Download</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground flex items-center">
                      <IndianRupee className="h-4 w-4" />{note.price}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-lg text-foreground flex items-center">
                    <IndianRupee className="h-4 w-4" />{note.price}
                  </span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Payment Method</h4>
                <div className="grid gap-3">
                  <button className="flex items-center gap-3 p-4 border-2 border-accent rounded-xl bg-accent/5 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <CreditCard className="h-5 w-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">UPI / Card / Netbanking</p>
                      <p className="text-sm text-muted-foreground">All payment methods supported</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-accent" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Instant Download
                </div>
              </div>

              {/* Pay Button */}
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay <IndianRupee className="h-4 w-4 ml-1" />{note.price}
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to our Terms of Service
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
