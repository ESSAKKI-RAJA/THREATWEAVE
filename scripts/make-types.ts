import * as fs from "fs";
import * as path from "path";

const typesContent = `export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      vendors: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          name: string;
          domain: string;
          risk_score: number | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      scans: {
        Row: {
          id: string;
          vendor_id: string;
          user_id: string;
          scan_date: string;
          crt_sh_data: Json | null;
          shodan_data: Json | null;
          virustotal_data: Json | null;
          narrative: Json | null;
          risk_score: number | null;
          errors: Json | null;
          created_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      threat_signatures: {
        Row: {
          id: string;
          apt_group_name: string;
          description: string | null;
          indicators: Json;
          embedding: any;
          created_at: string;
          updated_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          industry_code: string;
          region: string;
          created_at: string;
          updated_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      profiles: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      vendor_dependencies: {
        Row: {
          id: string;
          source_vendor_id: string;
          target_vendor_id: string;
          relationship_type: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      assets: {
        Row: {
          id: string;
          vendor_id: string;
          ip_address: string;
          hostname: string | null;
          hosting_provider: string | null;
          country_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      exposures: {
        Row: {
          id: string;
          asset_id: string;
          port: number;
          service_name: string | null;
          cpe: string | null;
          banner: string | null;
          last_seen: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      vulnerabilities: {
        Row: {
          id: string;
          asset_id: string;
          cve_id: string;
          cvss_score: number | null;
          epss_score: number | null;
          known_exploited: boolean | null;
          remediation_status: string;
          detected_at: string;
          resolved_at: string | null;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      credential_leaks: {
        Row: {
          id: string;
          vendor_id: string;
          source_repository: string;
          file_path: string;
          leak_url: string;
          matched_pattern: string;
          leak_date: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      threat_matches: {
        Row: {
          id: string;
          scan_id: string;
          threat_signature_id: string;
          similarity_score: number;
          analyst_notes: string | null;
          created_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      benchmarks: {
        Row: {
          id: string;
          vendor_id: string;
          industry_average_score: number;
          regional_average_score: number;
          percentile_rank: number;
          calculated_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      risk_predictions: {
        Row: {
          id: string;
          vendor_id: string;
          days_ahead: number;
          predicted_risk_score: number;
          confidence_interval_low: number;
          confidence_interval_high: number;
          exposure_probability: number;
          leak_probability: number;
          vuln_growth_probability: number;
          calculated_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          ip_address: string | null;
          details: Json | null;
          created_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      abuseipdb_reports: {
        Row: {
          id: string;
          ip_address: string;
          abuse_confidence_score: number | null;
          total_reports: number | null;
          last_reported_at: string | null;
          country: string | null;
          isp: string | null;
          domain: string | null;
          categories: string[] | null;
          full_response: Json | null;
          checked_at: string | null;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      greynoise_ip_context: {
        Row: {
          id: string;
          ip_address: string;
          classification: string | null;
          name: string | null;
          last_seen: string | null;
          metadata: Json | null;
          checked_at: string | null;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      otx_pulses: {
        Row: {
          id: string;
          indicator: string;
          indicator_type: string | null;
          pulse_id: string | null;
          pulse_name: string | null;
          created: string | null;
          tags: string[] | null;
          full_data: Json | null;
          fetched_at: string | null;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      cve_attck_mapping: {
        Row: {
          cve_id: string;
          technique_ids: string[] | null;
          updated_at: string | null;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      nvd_cves: {
        Row: {
          id: string;
          cve_id: string;
          cvss_v3_vector: string | null;
          base_score: number | null;
          severity: string | null;
          published_date: string | null;
          last_modified: string | null;
          full_json: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: any; Update: any; Relationships: any[];
      };
      infrastructure_assets: {
        Row: {
          id: string;
          ip_address: string | null;
          domain_name: string | null;
          created_at: string;
        };
        Insert: any; Update: any; Relationships: any[];
      };
    };
    Views: {
      supply_chain_risk_scores: {
        Row: {
          vendor_id: string;
          avg_downstream_risk: number;
          max_downstream_risk: number;
          downstream_count: number;
          aggregate_risk: number;
        };
        Relationships: any[];
      };
    };
    Functions: {
      refresh_materialized_view: {
        Args: { view_name: string };
        Returns: void;
      };
      get_downstream_vendors: {
        Args: { root_id: string, max_depth?: number };
        Returns: { vendor_id: string; depth: number; path: string[] }[];
      };
    };
    Enums: {
      app_role: "admin" | "analyst" | "user";
      [key: string]: any;
    };
    CompositeTypes: {
      [key: string]: any;
    };
  };
}
`;

fs.writeFileSync(path.join(__dirname, "../src/integrations/supabase/types.ts"), typesContent);
console.log("Updated types.ts");
