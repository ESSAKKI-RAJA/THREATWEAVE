import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@clerk/tanstack-react-start";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Activity, Network, FileSearch, ArrowRight, Shield, Globe, Lock, CheckCircle2, ChevronRight, BarChart3, Database } from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (import.meta.env.VITE_BYPASS_AUTH === "true") {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "THREATWEAVE Enterprise | Supply Chain Cyber Risk Intelligence" },
      {
        name: "description",
        content: "Enterprise-grade supply chain contamination detection and threat intelligence platform.",
      },
    ],
  }),
  ssr: false,
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const isBypass = import.meta.env.VITE_BYPASS_AUTH === "true";

  useEffect(() => {
    if (isBypass || (isLoaded && isSignedIn)) {
      navigate({ to: "/dashboard" });
    }
  }, [navigate, isLoaded, isSignedIn, isBypass]);

  const destRoute = "/login";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-teal-500/30">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold tracking-widest text-slate-100">
            <ShieldAlert className="h-6 w-6 text-teal-500" />
            <span className="uppercase">THREATWEAVE</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#platform" className="hover:text-teal-400 transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-teal-400 transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
            <a href="#docs" className="hover:text-teal-400 transition-colors">Documentation</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to={destRoute}>
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                Sign In
              </Button>
            </Link>
            <Link to={destRoute}>
              <Button className="bg-teal-600 hover:bg-teal-500 text-white border-0 shadow-[0_0_15px_rgba(13,148,136,0.5)]">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-slate-950"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-sm font-medium text-teal-400 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 mr-2 animate-pulse"></span>
            THREATWEAVE Enterprise v2.0 is now available
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            See the threats <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-600">already inside</span> your supply chain.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Enterprise-grade cyber risk intelligence. We map structural fingerprints, expose Nth-party vendor vulnerabilities, and generate CISO-ready narratives in seconds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to={destRoute}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-500 text-white px-8 h-12 text-base">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 h-12 text-base bg-slate-900/50">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Logos */}
      <section className="border-y border-slate-800/60 bg-slate-900/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 mb-8">
            Trusted by security teams at leading enterprises
          </p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale transition-all hover:grayscale-0">
            {/* Placeholder SVGs for Enterprise Logos */}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Shield className="h-6 w-6"/> SECURECORP</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Globe className="h-6 w-6"/> GLOBALDEFENSE</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Database className="h-6 w-6"/> DATAVAULT</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Activity className="h-6 w-6"/> CYBERMETRICS</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-300"><Network className="h-6 w-6"/> NETGUARD</div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="platform" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-teal-400">Mission Control</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to secure your ecosystem
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-400">
              THREATWEAVE fuses petabytes of OSINT data with predictive AI to deliver actionable intelligence before a breach occurs.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col bg-slate-900/50 rounded-2xl p-8 border border-slate-800 transition-all hover:border-teal-500/50 hover:bg-slate-800/50">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <ShieldAlert className="h-5 w-5 text-teal-400" />
                  </div>
                  Cyber Threat Intelligence
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                  <p className="flex-auto">Continuous monitoring of Dark Web chatter, leaked credentials, exposed infrastructure, and emerging CVEs correlated directly to your assets.</p>
                </dd>
              </div>

              <div className="flex flex-col bg-slate-900/50 rounded-2xl p-8 border border-slate-800 transition-all hover:border-teal-500/50 hover:bg-slate-800/50">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <Network className="h-5 w-5 text-teal-400" />
                  </div>
                  Supply Chain Risk
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                  <p className="flex-auto">Interactive Nth-party dependency mapping. Visualize blast radius, uncover shadow IT, and assess vendor risk scores dynamically.</p>
                </dd>
              </div>

              <div className="flex flex-col bg-slate-900/50 rounded-2xl p-8 border border-slate-800 transition-all hover:border-teal-500/50 hover:bg-slate-800/50">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <BarChart3 className="h-5 w-5 text-teal-400" />
                  </div>
                  Executive Intelligence
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-400">
                  <p className="flex-auto">AI-generated CISO narratives that translate technical vulnerabilities into business risk. Instantly export boardroom-ready reports.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-slate-900 py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.teal.900),theme(colors.slate.950))] opacity-50"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to secure your enterprise?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Join the organizations using THREATWEAVE to proactively manage vendor risk and stop supply chain attacks.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to={destRoute}>
                <Button size="lg" className="bg-teal-600 hover:bg-teal-500 text-white h-12 px-8">
                  Start Free Trial
                </Button>
              </Link>
              <Link to={destRoute}>
                <Button variant="link" className="text-teal-400 hover:text-teal-300">
                  Contact Sales <span aria-hidden="true">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold tracking-widest text-slate-100">
            <ShieldAlert className="h-5 w-5 text-teal-500" />
            <span className="uppercase text-sm">THREATWEAVE</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Threatweave Enterprise. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-teal-400">Privacy Policy</a>
            <a href="#" className="hover:text-teal-400">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

