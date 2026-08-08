

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center surface-card--glass m-4 border-error/20">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>
          <h2 className="headline-sm text-on-surface mb-2">Something went wrong</h2>
          <p className="body-md text-muted mb-8 max-w-md">
            The dashboard encountered an unexpected error. This has been logged, 
            and we're working to fix it.
          </p>
          <button 
            onClick={this.handleReset}
            className="btn btn-primary h-12 gap-3"
          >
            <RefreshCw size={18} />
            Reload Dashboard
          </button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-black/5 rounded text-left overflow-auto max-w-full">
              <code className="text-[10px] text-error">
                {this.state.error?.message}
              </code>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
