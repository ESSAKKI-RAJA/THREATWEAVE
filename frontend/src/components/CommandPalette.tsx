import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { Search, Globe, Shield, Activity, Layers, Settings, FileText } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-surface-container border border-outline-variant rounded-xl shadow-2xl overflow-hidden shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
        <Command
          label="Global Command Palette"
          className="w-full flex flex-col overflow-hidden"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Escape") {
              e.preventDefault();
              setOpen(false);
            }
          }}
        >
          <div className="flex items-center border-b border-outline-variant px-3 py-4">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <Command.Input
              autoFocus
              className="flex-1 bg-transparent outline-none border-none text-white px-3 placeholder-slate-500 font-mono text-sm"
              placeholder="Type a command or search (e.g., 'scan vendor')"
            />
            <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-outline-variant bg-background px-2 font-mono text-[10px] font-medium text-slate-400 opacity-100">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-[#1f2937] scrollbar-track-transparent">
            <Command.Empty className="py-6 text-center text-sm text-slate-400 font-mono">
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Navigation"
              className="px-2 py-2 text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider"
            >
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/dashboard" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <Activity className="w-4 h-4" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/threats" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <Shield className="w-4 h-4" />
                <span>Threat Intelligence</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/supply-chain" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <Layers className="w-4 h-4" />
                <span>Supply Chain</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/intelligence" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <Shield className="w-4 h-4" />
                <span>Threat Intelligence (IOC)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/alerts" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <Activity className="w-4 h-4" />
                <span>Live Alerts</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/investigations" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <FileText className="w-4 h-4" />
                <span>Active Investigations</span>
              </Command.Item>
            </Command.Group>

            <Command.Group
              heading="Quick Actions"
              className="px-2 py-2 text-xs font-semibold text-slate-500 font-mono uppercase tracking-wider border-t border-outline-variant mt-2"
            >
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/dashboard" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Launch Global Scan</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/dashboard" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <FileText className="w-4 h-4 text-green-400" />
                <span>Generate Executive Report</span>
              </Command.Item>
              <Command.Item
                onSelect={() => runCommand(() => navigate({ to: "/settings" }))}
                className="flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-slate-300 rounded-lg hover:bg-outline-variant hover:text-white cursor-pointer transition-colors aria-selected:bg-outline-variant aria-selected:text-white"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Organization Settings</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
      {/* Background click to close */}
      <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
    </div>
  );
}
