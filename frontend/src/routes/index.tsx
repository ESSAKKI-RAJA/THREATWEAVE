import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@clerk/tanstack-react-start";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Activity, Network, FileSearch } from "lucide-react";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (import.meta.env.VITE_BYPASS_AUTH === "true") {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "THREATWEAVE — Supply Chain Cyber Risk Intelligence" },
      {
        name: "description",
        content:
          "Detect hidden supply chain contamination by mapping structural fingerprints that connect vendors to known threat actors.",
      },
      { property: "og:title", content: "THREATWEAVE — Supply Chain Cyber Risk Intelligence" },
      {
        property: "og:description",
        content:
          "B2B platform that surfaces vendor exposure using OSINT signal fusion + AI narrative.",
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
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <ShieldAlert className="h-5 w-5 text-primary" />
          THREATWEAVE
        </div>
        <Link to={destRoute}>
          <Button size="sm">Sign in</Button>
        </Link>
      </header>
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Supply chain OSINT
        </p>
        <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
          See the threats <span className="text-primary">already inside</span> your supply chain.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-muted-foreground">
          THREATWEAVE maps structural fingerprints — TLS certificates, exposed ports, malware
          reputation, leaked credentials — that connect your vendors to known threat actors. One
          domain in, a CISO-ready narrative out.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to={destRoute}>
            <Button size="lg">Start scanning</Button>
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-24 sm:grid-cols-3">
        {[
          {
            Icon: Network,
            title: "Certificate graph",
            body: "crt.sh subdomain & issuer enumeration.",
          },
          { Icon: Activity, title: "Network surface", body: "Shodan InternetDB ports & CVEs." },
          {
            Icon: FileSearch,
            title: "AI narrative",
            body: "Plain-English brief with severity-ranked indicators.",
          },
        ].map(({ Icon, title, body }) => (
          <div key={title} className="rounded-lg border border-border bg-card p-5">
            <Icon className="mb-3 h-5 w-5 text-primary" />
            <div className="font-medium text-foreground">{title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{body}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
