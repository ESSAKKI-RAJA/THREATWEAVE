import React, { Component, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  /** Optional label to show in the error card (e.g. "Threat Feeds") */
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable error boundary that wraps individual widgets.
 * Catches render errors and shows a recovery card instead of crashing the whole page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.label ? ` — ${this.props.label}` : ""}]`,
      error,
      errorInfo,
    );
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <Card className="border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {this.props.label ? `${this.props.label} Error` : "Something went wrong"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {this.state.error?.message ||
                "An unexpected error occurred while rendering this section."}
            </p>
            <Button variant="outline" size="sm" onClick={this.handleRetry}>
              <RefreshCw className="h-3 w-3 mr-1.5" /> Retry
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
