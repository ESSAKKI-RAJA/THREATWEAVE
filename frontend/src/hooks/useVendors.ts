import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { runScan } from "@/lib/scan.functions";
import { generateNarrative } from "@/lib/narrative.functions";
import { matchThreats } from "@/lib/threats.functions";

export const useVendorsList = () => {
  return useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 60000,
  });
};

export const useVendor = (domain: string) => {
  return useQuery({
    queryKey: ["vendor", domain],
    queryFn: async () => {
      const res = await fetch("/api/vendors");
      if (!res.ok) throw new Error("Failed to fetch vendors");
      const vendors = await res.json();
      const vendor = vendors.find((v: any) => v.domain === domain);
      if (!vendor) throw new Error("Vendor not found");
      return vendor;
    },
    enabled: !!domain,
  });
};

export const useVendorScan = (vendorId?: string) => {
  return useQuery({
    queryKey: ["vendorScan", vendorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .eq("vendor_id", vendorId!)
        .order("scan_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error; // ignore no rows
      return data;
    },
    enabled: !!vendorId,
  });
};

export const useVendorActions = () => {
  const queryClient = useQueryClient();

  const rescanMutation = useMutation({
    mutationFn: async (domain: string) => {
      const res = await runScan({ data: { domain } });
      if (!res) throw new Error("Scan failed to complete");
      return res;
    },
    onSuccess: (_, domain) => {
      queryClient.invalidateQueries({ queryKey: ["vendor", domain] });
      queryClient.invalidateQueries({ queryKey: ["vendorScan"] });
      toast.success("Intelligence scan complete");
    },
    onError: () => {
      toast.error("Error running scan");
    },
  });

  const narrateMutation = useMutation({
    mutationFn: async (scanId: string) => {
      const res = await generateNarrative({ data: { scanId } });
      if (!res) throw new Error("Failed to generate report");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorScan"] });
      toast.success("Analyst report generated");
    },
    onError: () => {
      toast.error("Error generating narrative");
    },
  });

  const matchMutation = useMutation({
    mutationFn: async (scanId: string) => {
      await matchThreats({ data: { scanId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorScan"] });
      toast.success("Threat matching complete");
    },
    onError: () => {
      toast.error("Threat match failed");
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: async (vendorId: string) => {
      const { error } = await supabase.from("vendors").delete().eq("id", vendorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor deleted");
    },
  });

  return { rescanMutation, narrateMutation, matchMutation, deleteVendorMutation };
};
