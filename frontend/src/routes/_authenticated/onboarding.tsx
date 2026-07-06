import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreateOrganization, useUser, useOrganization } from "@clerk/tanstack-react-start";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Users, Settings, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProvisioning, setIsProvisioning] = useState(false);

  useEffect(() => {
    if (isLoaded && organization && step === 1) {
      setStep(2);
    }
  }, [organization, isLoaded, step]);

  const handleComplete = () => {
    setIsProvisioning(true);
    // Simulate workspace provisioning delay
    setTimeout(() => {
      navigate({ to: "/dashboard" });
    }, 3000);
  };

  if (!isLoaded) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-teal-500" /></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-teal-500" />
          <span className="font-bold tracking-widest uppercase">THREATWEAVE Enterprise</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Stepper Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 w-full h-0.5 bg-slate-800 -z-10" />
              
              <div className="flex flex-col items-center gap-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-teal-500 bg-teal-500/20 text-teal-400' : 'border-slate-700 bg-slate-900 text-slate-500'}`}>
                  <Settings className="h-5 w-5" />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${step >= 1 ? 'text-teal-400' : 'text-slate-500'}`}>Organization</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-teal-500 bg-teal-500/20 text-teal-400' : 'border-slate-700 bg-slate-900 text-slate-500'}`}>
                  <Users className="h-5 w-5" />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${step >= 2 ? 'text-teal-400' : 'text-slate-500'}`}>Team</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-teal-500 bg-teal-500/20 text-teal-400' : 'border-slate-700 bg-slate-900 text-slate-500'}`}>
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${step >= 3 ? 'text-teal-400' : 'text-slate-500'}`}>Provision</span>
              </div>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
            {step === 1 && (
              <div className="flex flex-col items-center">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user?.firstName}</h2>
                  <p className="text-slate-400">Create your enterprise organization to get started.</p>
                </div>
                <CreateOrganization 
                  appearance={{
                    elements: {
                      card: "bg-transparent border-0 shadow-none",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      formButtonPrimary: "bg-teal-600 hover:bg-teal-500 text-white w-full",
                      formFieldLabel: "text-slate-300",
                      formFieldInput: "bg-slate-950 border-slate-800 text-slate-100 focus:ring-teal-500",
                      logoImage: "border border-slate-800",
                      logoImageDropzone: "bg-slate-950 border-slate-800",
                    }
                  }}
                  routing="hash"
                />
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Invite your team</h2>
                  <p className="text-slate-400">Add analysts, SOC managers, and administrators.</p>
                </div>
                
                {/* Note: In a real app we'd use OrganizationProfile or a custom invite form here. For now we provide a simplified flow */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-6 mb-8 text-center">
                  <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">You can skip this step and invite team members later from the Settings console.</p>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => setStep(3)}>
                    Skip for now
                  </Button>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setStep(3)} className="bg-teal-600 hover:bg-teal-500 text-white">
                    Continue to Provisioning
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center text-center py-8">
                {isProvisioning ? (
                  <>
                    <Loader2 className="h-16 w-16 text-teal-500 animate-spin mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Provisioning Workspace</h2>
                    <p className="text-slate-400 max-w-sm">
                      Initializing threat intelligence engines, generating encryption keys, and provisioning your isolated enterprise environment...
                    </p>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-16 w-16 text-teal-500 mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch</h2>
                    <p className="text-slate-400 mb-8 max-w-sm">
                      Your organization structure is ready. We will now provision your dedicated Threatweave Enterprise workspace.
                    </p>
                    <Button size="lg" onClick={handleComplete} className="bg-teal-600 hover:bg-teal-500 text-white px-8">
                      Provision Environment
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
