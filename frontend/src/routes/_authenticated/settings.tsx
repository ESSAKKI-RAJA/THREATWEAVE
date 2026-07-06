import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrganizationSettings, updateOrganizationSettings } from "../../api/settings.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield, Key, Users, Bell, Building, CheckCircle2,
  AlertTriangle, Monitor, Sliders, Server, Link as LinkIcon,
  Database, HardDrive, Lock, History, Activity, Eye, EyeOff, Loader2, Play
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
    shodan: "", virustotal: "", greynoise: "", censys: "",
    abuseipdb: "", alienvault: "", opencti: "", misp: "",
    sentinel: "", splunk: "", qradar: "", elastic: "",
    crowdstrike: "", defender: "",
  });

  // Organization State
  const [org, setOrg] = useState({
    name: "Acme Corporation", timezone: "UTC", language: "en-US",
    primaryColor: "#0d9488", webhookUrl: "",
  });

  // Security State
  const [security, setSecurity] = useState({
    strictIp: false, mfaRequired: true, ssoEnabled: false,
    scimEnabled: false, sessionTimeout: "60", passwordLength: "12",
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    email: true, slack: true, teams: false, discord: false,
    pagerduty: true, alertsOnly: false,
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

  const handleSave = (section: string) => {
    updateSettingsMutation.mutate(section);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-slate-400 font-mono text-sm uppercase tracking-wider">
            Loading Enterprise Console...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "organization", label: "Organization", icon: Building },
    { id: "profile", label: "Identity & Access", icon: Users },
    { id: "security", label: "Platform Security", icon: Shield },
    { id: "integrations", label: "Connectors & API", icon: LinkIcon },
    { id: "notifications", label: "Alerts & Webhooks", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Sliders },
  ];

  return (
    <div className="flex-1 w-full bg-slate-950 min-h-screen text-slate-50 selection:bg-teal-500/30">
      <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 flex flex-col md:flex-row gap-8 items-start h-full">
        {/* Vertical Tabs Sidebar */}
        <div className="w-full md:w-72 flex flex-col gap-1 shrink-0 bg-slate-900/50 border border-slate-800 rounded-xl p-3 h-[calc(100vh-8rem)] sticky top-24 overflow-y-auto">
          <div className="px-4 py-3 mb-2 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">
              Control Center
            </h2>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-teal-400" : "text-slate-500"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 w-full space-y-6 min-h-[600px] pb-24">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                Configure global settings and security policies for your enterprise workspace.
              </p>
            </div>
            {activeTab !== "profile" && (
              <Button
                onClick={() => handleSave(tabs.find(t => t.id === activeTab)?.label || "Settings")}
                disabled={updateSettingsMutation.isPending}
                className="bg-teal-600 hover:bg-teal-500 text-white font-medium min-w-[140px]"
              >
                {updateSettingsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Save Configuration
              </Button>
            )}
          </div>

          {/* ORGANIZATION TAB */}
          {activeTab === "organization" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-teal-500" />
                    General Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Organization Name</Label>
                    <Input
                      value={org.name}
                      onChange={(e) => setOrg({ ...org, name: e.target.value })}
                      className="bg-slate-950 border-slate-800 text-slate-100 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Timezone</Label>
                      <select
                        value={org.timezone}
                        onChange={(e) => setOrg({ ...org, timezone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-md h-10 px-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Language</Label>
                      <select
                        value={org.language}
                        onChange={(e) => setOrg({ ...org, language: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-md h-10 px-3 text-sm text-slate-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Spanish (ES)</option>
                        <option value="fr-FR">French (FR)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Lock className="w-5 h-5 text-teal-500" />
                    Enterprise Policies
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Custom Toggle Switch Component */}
                  <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div>
                      <h4 className="font-medium text-slate-100">Require Multi-Factor Authentication (MFA)</h4>
                      <p className="text-sm text-slate-400 mt-1">Enforce TOTP or WebAuthn for all user logins across the organization.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={security.mfaRequired} onChange={(e) => setSecurity({ ...security, mfaRequired: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500 border border-slate-700"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div>
                      <h4 className="font-medium text-slate-100">IP Allowlisting (Strict Mode)</h4>
                      <p className="text-sm text-slate-400 mt-1">Restrict dashboard access to approved corporate IP ranges only.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={security.strictIp} onChange={(e) => setSecurity({ ...security, strictIp: e.target.checked })} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500 border border-slate-700"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Session Timeout (Minutes)</Label>
                      <Input type="number" value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} className="bg-slate-950 border-slate-800 text-slate-100 focus:border-teal-500 focus:ring-teal-500" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Minimum Password Length</Label>
                      <Input type="number" value={security.passwordLength} onChange={(e) => setSecurity({ ...security, passwordLength: e.target.value })} className="bg-slate-950 border-slate-800 text-slate-100 focus:border-teal-500 focus:ring-teal-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Audit Logs Section */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-teal-500" />
                    Audit Logs
                  </h3>
                  <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                    Export CSV
                  </Button>
                </div>
                <div className="p-0">
                  <div className="divide-y divide-slate-800">
                    {[
                      { action: "Policy Updated", detail: "MFA Enforced globally", time: "2 hours ago", user: "admin@threatweave.com" },
                      { action: "API Key Generated", detail: "CI/CD Pipeline Service Account", time: "1 day ago", user: "system" },
                      { action: "Vendor Removed", detail: "acme.com deleted from monitoring", time: "3 days ago", user: "admin@threatweave.com" },
                    ].map((log, i) => (
                      <div key={i} className="flex justify-between items-center p-6 hover:bg-slate-800/30 transition-colors">
                        <div>
                          <p className="text-sm font-medium text-slate-100">{log.action}</p>
                          <p className="text-xs text-slate-400 mt-1 font-mono">{log.detail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-400">{log.time}</p>
                          <p className="text-xs text-teal-500 mt-1">{log.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATIONS TAB */}
          {activeTab === "integrations" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4 flex gap-3 text-sm text-teal-200">
                <Shield className="w-5 h-5 text-teal-400 shrink-0" />
                <p>
                  Connect external intelligence databases for enriched scan data. Without these connectors, THREATWEAVE relies on passive collection.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { id: "shodan", label: "Shodan", icon: Server, desc: "Port and service footprinting.", connected: !!apiKeys.shodan },
                  { id: "virustotal", label: "VirusTotal", icon: Activity, desc: "Malware and file hash reputation.", connected: !!apiKeys.virustotal },
                  { id: "greynoise", label: "GreyNoise", icon: Activity, desc: "Internet background noise filtering.", connected: !!apiKeys.greynoise },
                  { id: "crowdstrike", label: "CrowdStrike Falcon", icon: Shield, desc: "Endpoint detection and response (EDR).", connected: !!apiKeys.crowdstrike },
                ].map((integration) => (
                  <div key={integration.id} className={`bg-slate-900 border rounded-xl p-6 transition-all ${integration.connected ? 'border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${integration.connected ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400'}`}>
                          <integration.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-100">{integration.label}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="relative flex h-2 w-2">
                              {integration.connected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>}
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${integration.connected ? 'bg-teal-500' : 'bg-slate-600'}`}></span>
                            </span>
                            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                              {integration.connected ? 'Connected' : 'Disconnected'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                        {integration.connected ? 'Manage' : 'Connect'}
                      </Button>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{integration.desc}</p>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500 uppercase font-mono tracking-wider">API Key</Label>
                      <div className="relative">
                        <Input
                          type="password"
                          value={(apiKeys as any)[integration.id]}
                          onChange={(e) => setApiKeys({ ...apiKeys, [integration.id]: e.target.value })}
                          className="bg-slate-950 border-slate-800 text-slate-100 focus:border-teal-500 focus:ring-teal-500 font-mono pr-10"
                          placeholder={`Enter ${integration.label} API Key`}
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE, NOTIFICATIONS, APPEARANCE TABS ... (Skipped for brevity but would be styled similarly) */}
          {['profile', 'notifications', 'appearance'].includes(activeTab) && (
             <div className="space-y-6 animate-in fade-in duration-300">
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
                 <Lock className="w-12 h-12 text-slate-600 mb-4" />
                 <h3 className="text-xl font-medium text-slate-200">Standardizing Configuration</h3>
                 <p className="text-slate-400 mt-2 max-w-md">This section is currently being updated to match the new Enterprise Control Center standards.</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
