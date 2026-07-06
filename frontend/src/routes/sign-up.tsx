import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/sign-up")({
  component: SignUpComponent,
});

function SignUpComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-slate-100 uppercase tracking-widest">
            THREATWEAVE
          </h1>
          <p className="text-sm font-semibold text-teal-500 tracking-[0.2em] uppercase mt-1">
            Enterprise
          </p>
        </div>

        <SignUp
          appearance={{
            elements: {
              card: "bg-slate-900 border border-slate-800 shadow-2xl",
              headerTitle: "text-slate-100",
              headerSubtitle: "text-slate-400",
              formButtonPrimary: "bg-teal-600 hover:bg-teal-500 text-white",
              formFieldLabel: "text-slate-300",
              formFieldInput:
                "bg-slate-950 border-slate-800 text-slate-100 focus:ring-teal-500 focus:border-teal-500",
              footerActionText: "text-slate-400",
              footerActionLink: "text-teal-500 hover:text-teal-400",
              identityPreviewText: "text-slate-300",
              identityPreviewEditButton: "text-teal-500 hover:text-teal-400",
              dividerLine: "bg-slate-800",
              dividerText: "text-slate-500",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/login"
          fallbackRedirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}
