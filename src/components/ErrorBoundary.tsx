import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground max-w-md">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;