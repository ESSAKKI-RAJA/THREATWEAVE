import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrganizationSettings, updateOrganizationSettings } from "../../api/settings.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Shield,
  Key,
  Users,
  Bell,
  Building,
  CheckCircle2,
  AlertTriangle,
  Monitor,
  Sliders,
  Server,
  Link as LinkIcon,
  Database,
  HardDrive,
  Lock,
  History,
  Activity,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchOrganizationSettings,
  });

  // Integrations State
  const [apiKeys, setApiKeys] = useState({
    shodan: "",
    virustotal: "",
    greynoise: "",
    censys: "",
    abuseipdb: "",
    alienvault: "",
    opencti: "",
    misp: "",
    sentinel: "",
    splunk: "",
    qradar: "",
    elastic: "",
    crowdstrike: "",
    defender: "",
  });

  // Organization State
  const [org, setOrg] = useState({
    name: "Acme Corporation",
    timezone: "UTC",
    language: "en-US",
    primaryColor: "#3b82f6",
    webhookUrl: "",
  });

  // Security State
  const [security, setSecurity] = useState({
    strictIp: false,
    mfaRequired: true,
    ssoEnabled: false,
    scimEnabled: false,
    sessionTimeout: "60",
    passwordLength: "12",
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    email: true,
    slack: true,
    teams: false,
    discord: false,
    pagerduty: true,
    alertsOnly: false,
  });

  useEffect(() => {
    if (settingsData) {
      setApiKeys((prev) => ({
        ...prev,
        shodan: settingsData.shodan || "",
        virustotal: settingsData.virustotal || "",
        greynoise: settingsData.greynoise || "",
      }));
      setSecurity((prev) => ({ ...prev, strictIp: settingsData.security_strict_ip || false }));
      setOrg((prev) => ({ ...prev, webhookUrl: settingsData.webhook_url || "" }));
    }
  }, [settingsData]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (section: string) => {
      // Simulate real API latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      return updateOrganizationSettings({
        shodan: apiKeys.shodan,
        virustotal: apiKeys.virustotal,
        greynoise: apiKeys.greynoise,
        security_strict_ip: security.strictIp,
        webhook_url: org.webhookUrl,
      });
    },
    onSuccess: (success, section) => {
      if (success) {
        toast.success(`${section} settings saved successfully.`);
        queryClient.invalidateQueries({ queryKey: ["settings"] });
      } else {
        toast.error(`Failed to save ${section} settings.`);
      }
    },
    onError: (err, section) => {
      toast.error(`Error saving ${section} settings: ${err}`);
    },
  });

  const handleSave = (e: React.FormEvent | null, section: string) => {
    if (e) e.preventDefault();
    updateSettingsMutation.mutate(section);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-on-surface-variant font-mono text-sm uppercase tracking-wider">
            Loading Enterprise Config...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "organization", label: "Organization", icon: Building },
    { id: "profile", label: "Profile & Account", icon: Users },
    { id: "security", label: "Platform Security", icon: Shield },
    { id: "integrations", label: "Integrations & API", icon: LinkIcon },
    { id: "notifications", label: "Alerts & Webhooks", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Sliders },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-outline-variant pb-6">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-wider uppercase flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            Enterprise Settings
          </h1>
          <p className="text-on-surface-variant text-sm mt-1 max-w-2xl">
            Manage your organization's security posture, integrations, and platform configurations.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Vertical Tabs Sidebar */}
        <div className="w-full md:w-64 flex flex-col gap-1 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono uppercase tracking-wide transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary font-bold shadow-[inset_4px_0_0_0_rgba(59,130,246,1)]"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 w-full space-y-6 min-h-[600px]">
          {/* ORGANIZATION TAB */}
          {activeTab === "organization" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider">
                    General Information
                  </CardTitle>
                  <CardDescription>Basic details about your enterprise workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input
                      id="orgName"
                      aria-label="Organization Name"
                      value={org.name}
                      onChange={(e) => setOrg({ ...org, name: e.target.value })}
                      className="bg-background border-outline-variant focus-visible:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgTimezone">Timezone</Label>
                      <select
                        id="orgTimezone"
                        aria-label="Organization Timezone"
                        value={org.timezone}
                        onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
                        className="w-full bg-background border border-outline-variant rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgLanguage">Language</Label>
                      <select
                        id="orgLanguage"
                        aria-label="Organization Language"
                        value={org.language}
                        onChange={(e) => setOrg({ ...org, language: e.target.value })}
                        className="w-full bg-background border border-outline-variant rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Spanish (ES)</option>
                        <option value="fr-FR">French (FR)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-outline-variant pt-6">
                  <Button
                    onClick={() => handleSave(null, "Organization")}
                    disabled={updateSettingsMutation.isPending}
                    className="bg-blue-700 text-white hover:bg-blue-800 font-mono font-bold uppercase tracking-wider text-sm min-w-[140px]"
                  >
                    {updateSettingsMutation.isPending &&
                    updateSettingsMutation.variables === "Organization" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider">
                    Branding & White-labeling
                  </CardTitle>
                  <CardDescription>
                    Customize the dashboard appearance for exported reports.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryBrandColor">Primary Brand Color (Hex)</Label>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded border border-outline-variant shadow-inner"
                        style={{ backgroundColor: org.primaryColor }}
                      ></div>
                      <Input
                        id="primaryBrandColor"
                        aria-label="Primary Brand Color"
                        value={org.primaryColor}
                        onChange={(e) => setOrg({ ...org, primaryColor: e.target.value })}
                        className="bg-background border-outline-variant max-w-[150px]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label>Company Logo</Label>
                    <div className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors cursor-pointer bg-background">
                      <Monitor className="w-8 h-8 text-on-surface-variant" />
                      <p className="text-sm text-on-surface-variant">Click to upload SVG or PNG</p>
                      <p className="text-xs text-muted-foreground">Max 2MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider">
                    My Account
                  </CardTitle>
                  <CardDescription>Manage your personal profile and sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-outline-variant">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Admin User</h3>
                      <p className="text-sm text-on-surface-variant">admin@threatweave.com</p>
                      <div className="mt-2 flex gap-2">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-mono uppercase tracking-wider rounded border border-blue-500/30">
                          Super Admin
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h4 className="font-mono text-sm uppercase tracking-wider text-on-surface-variant">
                      Active Sessions
                    </h4>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-outline-variant">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Windows 11 • Chrome</p>
                          <p className="text-xs text-on-surface-variant">
                            192.168.1.100 • Current Session
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled className="text-xs">
                        Active
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-outline-variant">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            macOS • Safari
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            10.0.0.5 • Last active 2h ago
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10"
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider">
                    Personal API Tokens
                  </CardTitle>
                  <CardDescription>
                    Generate tokens for programmatic access to the THREATWEAVE API.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 border-2 border-dashed border-outline-variant rounded-lg bg-background">
                    <Key className="w-10 h-10 text-on-surface-variant mx-auto mb-3" />
                    <p className="text-sm text-on-surface-variant mb-4">
                      No active API tokens found.
                    </p>
                    <Button
                      variant="outline"
                      className="font-mono uppercase text-xs tracking-wider border-primary/50 text-primary hover:bg-primary/10"
                    >
                      Generate New Token
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider text-red-400 flex items-center gap-2">
                    <Lock className="w-5 h-5" /> Enterprise Policies
                  </CardTitle>
                  <CardDescription>
                    Global security policies enforced for all users in the organization.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                    <div>
                      <h4 className="font-semibold">Require Multi-Factor Authentication (MFA)</h4>
                      <p className="text-sm text-on-surface-variant">
                        Enforce TOTP or WebAuthn for all user logins.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.mfaRequired}
                        onChange={(e) =>
                          setSecurity({ ...security, mfaRequired: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                    <div>
                      <h4 className="font-semibold">IP Allowlisting (Strict Mode)</h4>
                      <p className="text-sm text-on-surface-variant">
                        Restrict dashboard access to approved corporate IP ranges.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.strictIp}
                        onChange={(e) => setSecurity({ ...security, strictIp: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                    <div>
                      <h4 className="font-semibold">SAML / SSO Integration</h4>
                      <p className="text-sm text-on-surface-variant">
                        Allow login via Okta, Entra ID, or PingIdentity.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.ssoEnabled}
                        onChange={(e) => setSecurity({ ...security, ssoEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label>Session Timeout (Minutes)</Label>
                      <Input
                        type="number"
                        value={security.sessionTimeout}
                        onChange={(e) =>
                          setSecurity({ ...security, sessionTimeout: e.target.value })
                        }
                        className="bg-background border-outline-variant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Password Length</Label>
                      <Input
                        type="number"
                        value={security.passwordLength}
                        onChange={(e) =>
                          setSecurity({ ...security, passwordLength: e.target.value })
                        }
                        className="bg-background border-outline-variant"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-outline-variant pt-6">
                  <Button
                    onClick={() => handleSave(null, "Security Policies")}
                    disabled={updateSettingsMutation.isPending}
                    className="bg-blue-700 text-white hover:bg-blue-800 font-mono font-bold uppercase tracking-wider text-sm min-w-[160px]"
                  >
                    {updateSettingsMutation.isPending &&
                    updateSettingsMutation.variables === "Security Policies" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Enforce Policies
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider flex items-center gap-2">
                    <History className="w-5 h-5" /> Audit Logs
                  </CardTitle>
                  <CardDescription>
                    Compliance record of all administrative actions (90-day retention).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        action: "Policy Updated",
                        detail: "MFA Enforced globally",
                        time: "2 hours ago",
                        user: "admin@threatweave.com",
                      },
                      {
                        action: "API Key Generated",
                        detail: "CI/CD Pipeline Service Account",
                        time: "1 day ago",
                        user: "system",
                      },
                      {
                        action: "Vendor Removed",
                        detail: "acme.com deleted from monitoring",
                        time: "3 days ago",
                        user: "admin@threatweave.com",
                      },
                    ].map((log, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 rounded bg-background border border-outline-variant"
                      >
                        <div>
                          <p className="text-sm font-semibold">{log.action}</p>
                          <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                            {log.detail}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{log.time}</p>
                          <p className="text-[10px] text-primary font-mono mt-0.5">{log.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-outline-variant font-mono uppercase text-xs tracking-wider"
                  >
                    Export Full Audit Trail (CSV)
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === "integrations" && (
            <form
              onSubmit={(e) => handleSave(e, "Integrations")}
              className="space-y-6 animate-in slide-in-from-right-4 duration-300"
            >
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3 text-sm text-blue-200">
                <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                <p>
                  Provide API keys to enable deep scanning connectors. Without these, THREATWEAVE
                  will rely entirely on passive OSINT collection.
                </p>
              </div>

              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider">
                    OSINT & Threat Intel
                  </CardTitle>
                  <CardDescription>
                    Connect external intelligence databases for enriched scan data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      id: "shodan",
                      label: "Shodan API Key",
                      icon: Server,
                      desc: "For exposed port and service footprinting.",
                    },
                    {
                      id: "virustotal",
                      label: "VirusTotal API Key",
                      icon: Shield,
                      desc: "For malware signature correlation.",
                    },
                    {
                      id: "greynoise",
                      label: "GreyNoise API Key",
                      icon: Activity,
                      desc: "For internet background noise filtering.",
                    },
                    {
                      id: "censys",
                      label: "Censys API ID/Secret",
                      icon: Database,
                      desc: "For certificate and host discovery.",
                    },
                    {
                      id: "alienvault",
                      label: "AlienVault OTX Key",
                      icon: Key,
                      desc: "For community pulse indicators.",
                    },
                  ].map((field) => (
                    <div
                      key={field.id}
                      className="space-y-1.5 pb-4 border-b border-outline-variant last:border-0 last:pb-0"
                    >
                      <Label className="flex items-center gap-2">
                        <field.icon className="w-4 h-4 text-on-surface-variant" /> {field.label}
                      </Label>
                      <p className="text-xs text-on-surface-variant mb-2">{field.desc}</p>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="••••••••••••••••••••••••"
                          value={apiKeys[field.id as keyof typeof apiKeys]}
                          onChange={(e) => setApiKeys({ ...apiKeys, [field.id]: e.target.value })}
                          className="bg-background border-outline-variant font-mono placeholder-on-surface-variant focus:border-primary pr-10"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5 text-on-surface-variant hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider">
                    SIEM / SOAR Ingestion
                  </CardTitle>
                  <CardDescription>
                    Push alerts and risk intelligence directly to your security perimeter.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: "sentinel", label: "Microsoft Sentinel Workspace ID" },
                    { id: "splunk", label: "Splunk HEC Token" },
                    { id: "qradar", label: "IBM QRadar Authorization Token" },
                    { id: "crowdstrike", label: "CrowdStrike Falcon API Client ID" },
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label>{field.label}</Label>
                      <Input
                        type="password"
                        placeholder="Not configured"
                        value={apiKeys[field.id as keyof typeof apiKeys]}
                        onChange={(e) => setApiKeys({ ...apiKeys, [field.id]: e.target.value })}
                        className="bg-background border-outline-variant font-mono"
                      />
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t border-outline-variant pt-6">
                  <Button
                    type="submit"
                    disabled={updateSettingsMutation.isPending}
                    className="bg-blue-700 text-white hover:bg-blue-800 font-mono font-bold uppercase tracking-wider text-sm min-w-[170px]"
                  >
                    {updateSettingsMutation.isPending &&
                    updateSettingsMutation.variables === "Integrations" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Save Integrations
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-5 h-5" /> Alert Routing
                  </CardTitle>
                  <CardDescription>
                    Configure how and where critical supply chain threats are broadcasted.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        id: "email",
                        label: "Email Summaries",
                        desc: "Daily digest of portfolio risk.",
                      },
                      {
                        id: "slack",
                        label: "Slack Integration",
                        desc: "Real-time alerts to #security-ops.",
                      },
                      { id: "teams", label: "Microsoft Teams", desc: "Push to Teams Webhook." },
                      {
                        id: "pagerduty",
                        label: "PagerDuty Incidents",
                        desc: "Trigger on Critical CVEs only.",
                      },
                    ].map((notif) => (
                      <div
                        key={notif.id}
                        className="flex items-start gap-3 p-4 border border-outline-variant rounded-lg bg-background"
                      >
                        <label className="relative inline-flex items-center cursor-pointer mt-1">
                          <input
                            type="checkbox"
                            checked={
                              notifications[notif.id as keyof typeof notifications] as boolean
                            }
                            onChange={(e) =>
                              setNotifications({ ...notifications, [notif.id]: e.target.checked })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                        <div>
                          <h4 className="font-semibold text-sm">{notif.label}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5">{notif.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4 border-t border-outline-variant">
                    <Label>Custom Webhook URL</Label>
                    <p className="text-xs text-on-surface-variant mb-2">
                      Send JSON payloads for every scan completion and alert generation.
                    </p>
                    <Input
                      placeholder="https://api.yourcompany.com/webhooks/threatweave"
                      value={org.webhookUrl}
                      onChange={(e) => setOrg({ ...org, webhookUrl: e.target.value })}
                      className="bg-background border-outline-variant font-mono"
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-outline-variant pt-6">
                  <Button
                    onClick={() => handleSave(null, "Notification")}
                    disabled={updateSettingsMutation.isPending}
                    className="bg-blue-700 text-white hover:bg-blue-800 font-mono font-bold uppercase tracking-wider text-sm min-w-[170px]"
                  >
                    {updateSettingsMutation.isPending &&
                    updateSettingsMutation.variables === "Notification" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Save Routing Rules
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === "appearance" && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Card className="bg-surface border-outline-variant">
                <CardHeader>
                  <CardTitle className="font-mono text-lg uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-5 h-5" /> UI Preferences
                  </CardTitle>
                  <CardDescription>Customize your personal viewing experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Theme</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 border border-primary bg-primary/10 px-4 py-2 rounded cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-black border border-white/20"></div>
                        <span className="text-sm font-medium">Dark (Default)</span>
                      </div>
                      <div className="flex items-center gap-2 border border-outline-variant bg-background px-4 py-2 rounded cursor-not-allowed opacity-50">
                        <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                        <span className="text-sm font-medium">Light</span>
                      </div>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Note: THREATWEAVE Enterprise strictly enforces Dark Mode to minimize operator
                      eye strain during night-ops.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-outline-variant">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        aria-label="Timezone"
                        className="w-full bg-background border border-outline-variant rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="utc">UTC (Universal Coordinated Time)</option>
                        <option value="est">EST (Eastern Standard Time)</option>
                        <option value="pst">PST (Pacific Standard Time)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="density">Data Density</Label>
                      <select
                        id="density"
                        aria-label="Data Density"
                        className="w-full bg-background border border-outline-variant rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="comfortable">Comfortable (Recommended)</option>
                        <option value="compact">Compact (For high-volume dashboards)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                    <div>
                      <h4 className="font-semibold text-sm">Reduced Motion</h4>
                      <p className="text-xs text-on-surface-variant">
                        Disable radar sweeps and transition animations.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
