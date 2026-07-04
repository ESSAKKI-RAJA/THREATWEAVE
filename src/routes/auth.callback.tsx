import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setError(error.message);
      } else if (data.session) {
        navigate({ to: "/dashboard", replace: true });
      } else {
        // If there's no session and no hash in the URL, this might be a direct visit
        // We can just redirect back to auth
        navigate({ to: "/login", replace: true });
      }
    });
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <p className="text-destructive mb-4 text-sm font-medium">{error}</p>
        <button
          onClick={() => navigate({ to: "/login", replace: true })}
          className="text-primary text-sm hover:underline"
        >
          Return to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="mt-4 text-sm text-muted-foreground">Completing sign in...</span>
    </div>
  );
}
