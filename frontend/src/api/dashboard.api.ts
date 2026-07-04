import * as fs from "node:fs";
import * as path from "node:path";
import * as crypto from "node:crypto";

const MOCK_DB_PATH = path.resolve(process.cwd(), "src/integrations/supabase/mock-db.json");

// Helper to read Mock DB
export function readMockDb() {
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const defaultDb = { vendors: [], scans: [], threat_signatures: [], activities: [] };
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(defaultDb, null, 2), "utf-8");
    return defaultDb;
  }
  return JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf-8"));
}

// Helper to write Mock DB
export function writeMockDb(db: any) {
  fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// Ensure the 5 dashboard mockup vendors exist in the mock database
export function seedMockupVendors() {
  try {
    const db = readMockDb();
    const mockupVendors = [
      {
        id: "acme-corp-id-1111",
        user_id: "demo-user",
        name: "Acme Corporation",
        domain: "acme.com",
        sector: "Technology",
        tags: ["SaaS", "Cloud", "Core"],
        description: "Enterprise software supplier for manufacturing",
        risk_score: 72,
        status: "scanning",
        scan_progress: 42,
        last_successful_scan: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "globex-inc-id-2222",
        user_id: "demo-user",
        name: "Globex Inc.",
        domain: "globex.com",
        sector: "Finance",
        tags: ["Core", "Critical"],
        description: "Primary financial transaction processor",
        risk_score: 45,
        status: "completed",
        scan_progress: 100,
        last_successful_scan: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: "soylent-corp-id-3333",
        user_id: "demo-user",
        name: "Soylent Corp.",
        domain: "soylent.com",
        sector: "Healthcare",
        tags: ["Non-Core"],
        description: "Staff wellness program provider",
        risk_score: 23,
        status: "completed",
        scan_progress: 100,
        last_successful_scan: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "initech-id-4444",
        user_id: "demo-user",
        name: "Initech",
        domain: "initech.com",
        sector: "Technology",
        tags: ["SaaS", "Legacy"],
        description: "External bug tracking infrastructure",
        risk_score: 58, // UI screenshot says 58, wait, Initech is 58 risk score, let's keep it!
        status: "failed",
        scan_progress: 100,
        last_successful_scan: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: "umbrella-corp-id-5555",
        user_id: "demo-user",
        name: "Umbrella Corp.",
        domain: "umbrella.com",
        sector: "Pharma",
        tags: ["Critical", "RD"],
        description: "Medical research supply chain partner",
        risk_score: 65,
        status: "queued",
        scan_progress: 0,
        last_successful_scan: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    let updated = false;
    mockupVendors.forEach((v) => {
      const existsIdx = db.vendors.findIndex((x: any) => x.domain === v.domain);
      if (existsIdx === -1) {
        db.vendors.push(v);
        updated = true;
      } else {
        // Overlay properties to preserve existing custom scans if any, but ensure fields are set
        db.vendors[existsIdx] = {
          ...v,
          ...db.vendors[existsIdx],
          // Always ensure these UI fields match screenshot at boot
          sector: db.vendors[existsIdx].sector || v.sector,
          tags: db.vendors[existsIdx].tags || v.tags,
          description: db.vendors[existsIdx].description || v.description,
          status: db.vendors[existsIdx].status || v.status,
          scan_progress:
            db.vendors[existsIdx].scan_progress !== undefined
              ? db.vendors[existsIdx].scan_progress
              : v.scan_progress,
        };
        updated = true;
      }
    });

    if (updated) {
      writeMockDb(db);
    }
  } catch (err) {
    console.error("Failed to seed mockup vendors:", err);
  }
}

// Map of running scans to avoid duplicating intervals
const activeScanTimers = new Map<string, NodeJS.Timeout>();

// Run a simulated background scanning progress incrementer
function simulateScanProgress(vendorId: string) {
  if (activeScanTimers.has(vendorId)) return;

  let progress = 0;
  const interval = setInterval(() => {
    try {
      const db = readMockDb();
      const vendorIdx = db.vendors.findIndex((v: any) => v.id === vendorId);

      if (vendorIdx === -1) {
        clearInterval(interval);
        activeScanTimers.delete(vendorId);
        return;
      }

      const vendor = db.vendors[vendorIdx];
      progress += Math.floor(Math.random() * 15) + 15; // Increment by 15-30%

      if (progress >= 100) {
        progress = 100;
        vendor.status = "completed";
        vendor.scan_progress = 100;
        // Generate risk score between 15 and 90
        vendor.risk_score = Math.floor(Math.random() * 75) + 15;
        vendor.last_successful_scan = new Date().toISOString();
        vendor.updated_at = new Date().toISOString();

        // Create a mock scan history record
        const scanRecord = {
          id: crypto.randomUUID(),
          vendor_id: vendorId,
          user_id: "demo-user",
          scan_date: new Date().toISOString(),
          risk_score: vendor.risk_score,
          confidence: Math.floor(Math.random() * 30) + 60,
          created_at: new Date().toISOString(),
          shodan_data: { ports: [80, 443, 22, 8080], vulns: ["CVE-2023-3824", "CVE-2024-21626"] },
          virustotal_data: { reputation: Math.floor(Math.random() * 5) },
          crt_sh_data: [{ issuer_name: "Let's Encrypt" }],
        };
        db.scans.push(scanRecord);

        // Add a recent activity or alert if the risk is high
        clearInterval(interval);
        activeScanTimers.delete(vendorId);
      } else {
        vendor.status = "scanning";
        vendor.scan_progress = progress;
        vendor.updated_at = new Date().toISOString();
      }

      writeMockDb(db);
    } catch (err) {
      console.error("Error in simulated scan interval:", err);
      clearInterval(interval);
      activeScanTimers.delete(vendorId);
    }
  }, 1500);

  activeScanTimers.set(vendorId, interval);
}

// REST API router dispatcher
export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const method = request.method;

  // Ensure mock vendors are seeded
  seedMockupVendors();

  // Helper for JSON responses
  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  };

  try {
    // 1. GET /api/vendors
    if (method === "GET" && pathParts.length === 2 && pathParts[1] === "vendors") {
      const db = readMockDb();
      return jsonResponse(db.vendors);
    }

    // 2. POST /api/vendors
    if (method === "POST" && pathParts.length === 2 && pathParts[1] === "vendors") {
      const body = await request.json();
      if (!body.domain) {
        return jsonResponse({ error: "Domain is required" }, 400);
      }

      const db = readMockDb();
      const domainNormalized = body.domain.trim().toLowerCase();

      // Check if vendor already exists
      let vendor = db.vendors.find((v: any) => v.domain === domainNormalized);

      if (vendor) {
        // Reset status to queued/scanning if requesting rescanning
        vendor.status = "queued";
        vendor.scan_progress = 0;
        vendor.updated_at = new Date().toISOString();
      } else {
        vendor = {
          id: crypto.randomUUID(),
          user_id: "demo-user",
          name: body.name || domainNormalized,
          domain: domainNormalized,
          sector: body.sector || "Uncategorized",
          tags: body.tags || [],
          description: body.description || "",
          risk_score: 0,
          status: "queued",
          scan_progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        db.vendors.push(vendor);
      }

      writeMockDb(db);
      simulateScanProgress(vendor.id);

      return jsonResponse({ success: true, vendor });
    }

    // 3. POST /api/vendors/:id/scan
    if (
      method === "POST" &&
      pathParts.length === 4 &&
      pathParts[1] === "vendors" &&
      pathParts[3] === "scan"
    ) {
      const vendorId = pathParts[2];
      const db = readMockDb();
      const vendor = db.vendors.find((v: any) => v.id === vendorId);

      if (!vendor) {
        return jsonResponse({ error: "Vendor not found" }, 404);
      }

      vendor.status = "queued";
      vendor.scan_progress = 0;
      vendor.updated_at = new Date().toISOString();
      writeMockDb(db);

      simulateScanProgress(vendorId);
      return jsonResponse({ success: true, message: "Scan triggered", vendor });
    }

    // 4. GET /api/vendors/:id/scan/status
    if (
      method === "GET" &&
      pathParts.length === 5 &&
      pathParts[1] === "vendors" &&
      pathParts[3] === "scan" &&
      pathParts[4] === "status"
    ) {
      const vendorId = pathParts[2];
      const db = readMockDb();
      const vendor = db.vendors.find((v: any) => v.id === vendorId);

      if (!vendor) {
        return jsonResponse({ error: "Vendor not found" }, 404);
      }

      return jsonResponse({
        id: vendor.id,
        status: vendor.status,
        scan_progress: vendor.scan_progress,
        last_successful_scan: vendor.last_successful_scan,
      });
    }

    // 5. GET /api/dashboard/summary
    if (
      method === "GET" &&
      pathParts.length === 3 &&
      pathParts[1] === "dashboard" &&
      pathParts[2] === "summary"
    ) {
      const db = readMockDb();
      const vendors = db.vendors;
      const total = vendors.length;
      const critical = vendors.filter((v: any) => v.risk_score >= 75).length;
      const avgRisk =
        total > 0
          ? Math.round(
              vendors.reduce((acc: number, curr: any) => acc + (curr.risk_score || 0), 0) / total,
            )
          : 0;
      const dataSourcesConnected = 12;
      const dataSourcesTotal = 15;

      return jsonResponse({
        portfolioRiskScore: avgRisk,
        criticalExposure: critical,
        monitoredEntities: total,
        activeAlerts: 9, // mock count
        dataSourcesConnected,
        dataSourcesTotal,
      });
    }

    // 6. GET /api/dashboard/alerts
    if (
      method === "GET" &&
      pathParts.length === 3 &&
      pathParts[1] === "dashboard" &&
      pathParts[2] === "alerts"
    ) {
      const mockAlerts = [
        {
          id: "a1",
          title: "CVE-2024-38112 detected",
          severity: "critical",
          time: "2m ago",
          vendor: "acme.com",
        },
        {
          id: "a2",
          title: "Ransomware campaign detected",
          severity: "high",
          time: "15m ago",
          vendor: "globex.com",
        },
        {
          id: "a3",
          title: "New vendor added: Acme Corp",
          severity: "medium",
          time: "32m ago",
          vendor: "acme.com",
        },
        {
          id: "a4",
          title: "Unusual open port detected",
          severity: "low",
          time: "1h ago",
          vendor: "umbrella.com",
        },
      ];
      return jsonResponse(mockAlerts);
    }

    // 7. GET /api/pipeline/status
    if (
      method === "GET" &&
      pathParts.length === 3 &&
      pathParts[1] === "pipeline" &&
      pathParts[2] === "status"
    ) {
      const mockPipeline = [
        { name: "OSINT", status: "connected", details: "15 open feeds active" },
        { name: "Public Sources", status: "syncing", details: "Importing crt.sh logs" },
        { name: "Processing", status: "processing", details: "Analyzing data signatures" },
        { name: "Database", status: "healthy", details: "All perimeters stored" },
      ];
      return jsonResponse(mockPipeline);
    }

    // 8. DELETE /api/vendors/:id
    if (method === "DELETE" && pathParts.length === 3 && pathParts[1] === "vendors") {
      const vendorId = pathParts[2];
      const db = readMockDb();
      const initialLength = db.vendors.length;
      db.vendors = db.vendors.filter((v: any) => v.id !== vendorId);
      if (db.vendors.length !== initialLength) {
        // Add audit log entry
        db.activities = db.activities || [];
        db.activities.push({
          type: "delete",
          vendor_id: vendorId,
          user_id: "demo-user",
          timestamp: new Date().toISOString(),
        });
        writeMockDb(db);
        return jsonResponse({ success: true });
      } else {
        return jsonResponse({ error: "Vendor not found" }, 404);
      }
    }

    // CSV Export endpoint for Single Vendor
    if (method === "GET" && pathParts.length === 5 && pathParts[1] === "vendors" && pathParts[3] === "export") {
      const vendorId = pathParts[2];
      const db = readMockDb();
      const vendor = db.vendors.find((v: any) => v.id === vendorId);
      if (!vendor) return jsonResponse({ error: "Vendor not found" }, 404);
      const csv = `id,name,domain,risk_score,status,scan_progress\n${vendor.id},${vendor.name},${vendor.domain},${vendor.risk_score},${vendor.status},${vendor.scan_progress}`;
      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="vendor_${vendor.id}.csv"`,
        },
      });
    }

    // CSV Export endpoint for Entire Dashboard
    if (method === "GET" && pathParts.length === 3 && pathParts[1] === "dashboard" && pathParts[2] === "export") {
      const db = readMockDb();
      const vendors = db.vendors || [];
      let csvContent = "Name,Domain,Sector,Risk Score,Status\r\n";
      vendors.forEach((v: any) => {
        csvContent += `"${v.name}","${v.domain}","${v.sector}",${v.risk_score ?? 0},"${v.status}"\r\n`;
      });
      return new Response(csvContent, {
        status: 200,
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="threatweave_dashboard_${new Date().getTime()}.csv"`,
        },
      });
    }

    // Catch-all
    return jsonResponse({ error: "Endpoint not found" }, 404);
  } catch (err) {
    console.error("API error:", err);
    return jsonResponse({ error: "Internal server error", details: String(err) }, 500);
  }
}
