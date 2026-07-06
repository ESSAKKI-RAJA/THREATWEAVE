import { toast } from "sonner";

// Mock local state for settings until connected to real backend
let localSettings = {
  shodan: "gbnJo1VQl1kv2vYWKrUsUiR0mp0rfnKU",
  virustotal: "e7e17464d665491f51e5c54595b1b254ea6f8ac173d25d1f748ebc056fea702d",
  greynoise: "7e522856cb2f91ff6449c145edd8c17d22447a8f09a0a21620d83095805027a3",
  security_strict_ip: false,
  webhook_url: "",
};

export async function fetchOrganizationSettings() {
  // In a real environment with DATABASE_URL, this would fetch from /api/v1/settings
  try {
    const res = await fetch("/api/v1/settings");
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    // Fallback to mock state if backend is offline/degraded
    console.warn("Backend unavailable, using local settings cache.");
  }
  return { ...localSettings };
}

export async function updateOrganizationSettings(newSettings: Partial<typeof localSettings>) {
  try {
    const res = await fetch("/api/v1/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSettings),
    });

    if (res.ok) {
      localSettings = { ...localSettings, ...newSettings };
      return true;
    }
  } catch (e) {
    console.warn("Backend unavailable, updating local settings cache.");
  }

  // Fallback to mock state
  localSettings = { ...localSettings, ...newSettings };
  return true;
}
