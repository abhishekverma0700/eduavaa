import React, { ReactNode, ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console for debugging
    console.error("❌ Error caught by boundary:", error);
    console.error("Error details:", errorInfo);

    // Optional: Log to error tracking service (Sentry, LogRocket, etc.)
    // captureException(error, { extra: errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-red-100">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-2xl font-serif font-bold text-slate-900">
                Something Went Wrong
              </h1>
              <p className="text-slate-600">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-mono text-red-700 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={this.handleReload}
                className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>

            {/* Support Message */}
            <p className="text-xs text-slate-500 text-center mt-6">
              If the issue persists, please contact support at{" "}
              <a href="mailto:support@eduava.in" className="text-indigo-600 hover:underline">
                support@eduava.in
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
