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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="font-serif font-bold text-xl text-slate-900">Complete Purchase</h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={processing} className="text-slate-500 hover:text-slate-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-serif font-bold text-xl text-slate-900 mb-2">
                Payment Successful!
              </h4>
              <p className="text-slate-600">
                Your download is starting...
              </p>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div className="bg-secondary/30 rounded-xl p-4 space-y-3 border border-slate-100">
                <h4 className="font-semibold text-slate-900">Order Summary</h4>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{note.label}</p>
                    <p className="text-sm text-slate-600">PDF Download</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 flex items-center">
                      <IndianRupee className="h-4 w-4" />{note.price}
                    </p>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="font-bold text-lg text-slate-900 flex items-center">
                    <IndianRupee className="h-4 w-4" />{note.price}
                  </span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900">Payment Method</h4>
                <div className="grid gap-3">
                  <button className="flex items-center gap-3 p-4 border-2 border-indigo-200 rounded-xl bg-indigo-50/70 transition-all hover:border-indigo-300 hover:bg-indigo-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-indigo-200">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-slate-900">UPI / Card / Netbanking</p>
                      <p className="text-sm text-slate-600">All payment methods supported</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="h-4 w-4 text-indigo-600" />
                  Secure Payment
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Instant Download
                </div>
              </div>

              {/* Pay Button */}
              <Button 
                size="lg" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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

              <p className="text-xs text-center text-slate-500">
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
