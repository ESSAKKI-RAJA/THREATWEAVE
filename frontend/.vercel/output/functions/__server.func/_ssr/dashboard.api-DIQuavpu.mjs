import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.api-DIQuavpu.js
var MOCK_DB_PATH = path.resolve(process.cwd(), "src/integrations/supabase/mock-db.json");
function readMockDb() {
	if (!fs.existsSync(MOCK_DB_PATH)) {
		const defaultDb = {
			vendors: [],
			scans: [],
			threat_signatures: [],
			activities: []
		};
		fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(defaultDb, null, 2), "utf-8");
		return defaultDb;
	}
	return JSON.parse(fs.readFileSync(MOCK_DB_PATH, "utf-8"));
}
function writeMockDb(db) {
	fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
var hasSeeded = false;
function seedMockupVendors() {
	if (hasSeeded) return;
	hasSeeded = true;
	try {
		const db = readMockDb();
		const mockupVendors = [
			{
				id: "acme-corp-id-1111",
				user_id: "demo-user",
				name: "Acme Corporation",
				domain: "acme.com",
				sector: "Technology",
				tags: [
					"SaaS",
					"Cloud",
					"Core"
				],
				description: "Enterprise software supplier for manufacturing",
				risk_score: 72,
				status: "scanning",
				scan_progress: 42,
				last_successful_scan: (/* @__PURE__ */ new Date(Date.now() - 120 * 1e3)).toISOString(),
				created_at: (/* @__PURE__ */ new Date(Date.now() - 1440 * 60 * 1e3)).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
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
				last_successful_scan: (/* @__PURE__ */ new Date(Date.now() - 3600 * 1e3)).toISOString(),
				created_at: (/* @__PURE__ */ new Date(Date.now() - 2880 * 60 * 1e3)).toISOString(),
				updated_at: (/* @__PURE__ */ new Date(Date.now() - 3600 * 1e3)).toISOString()
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
				last_successful_scan: (/* @__PURE__ */ new Date(Date.now() - 10800 * 1e3)).toISOString(),
				created_at: (/* @__PURE__ */ new Date(Date.now() - 7200 * 60 * 1e3)).toISOString(),
				updated_at: (/* @__PURE__ */ new Date(Date.now() - 10800 * 1e3)).toISOString()
			},
			{
				id: "initech-id-4444",
				user_id: "demo-user",
				name: "Initech",
				domain: "initech.com",
				sector: "Technology",
				tags: ["SaaS", "Legacy"],
				description: "External bug tracking infrastructure",
				risk_score: 58,
				status: "failed",
				scan_progress: 100,
				last_successful_scan: (/* @__PURE__ */ new Date(Date.now() - 600 * 1e3)).toISOString(),
				created_at: (/* @__PURE__ */ new Date(Date.now() - 14400 * 60 * 1e3)).toISOString(),
				updated_at: (/* @__PURE__ */ new Date(Date.now() - 600 * 1e3)).toISOString()
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
				last_successful_scan: (/* @__PURE__ */ new Date(Date.now() - 300 * 1e3)).toISOString(),
				created_at: (/* @__PURE__ */ new Date(Date.now() - 360 * 60 * 60 * 1e3)).toISOString(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}
		];
		let updated = false;
		mockupVendors.forEach((v) => {
			const existsIdx = db.vendors.findIndex((x) => x.domain === v.domain);
			if (existsIdx === -1) {
				db.vendors.push(v);
				updated = true;
			} else {
				db.vendors[existsIdx] = {
					...v,
					...db.vendors[existsIdx],
					sector: db.vendors[existsIdx].sector || v.sector,
					tags: db.vendors[existsIdx].tags || v.tags,
					description: db.vendors[existsIdx].description || v.description,
					status: db.vendors[existsIdx].status || v.status,
					scan_progress: db.vendors[existsIdx].scan_progress !== void 0 ? db.vendors[existsIdx].scan_progress : v.scan_progress
				};
				updated = true;
			}
		});
		if (updated) writeMockDb(db);
	} catch (err) {
		console.error("Failed to seed mockup vendors:", err);
	}
}
var activeScanTimers = /* @__PURE__ */ new Map();
function simulateScanProgress(vendorId) {
	if (activeScanTimers.has(vendorId)) return;
	let progress = 0;
	const interval = setInterval(() => {
		try {
			const db = readMockDb();
			const vendorIdx = db.vendors.findIndex((v) => v.id === vendorId);
			if (vendorIdx === -1) {
				clearInterval(interval);
				activeScanTimers.delete(vendorId);
				return;
			}
			const vendor = db.vendors[vendorIdx];
			progress += Math.floor(Math.random() * 15) + 15;
			if (progress >= 100) {
				progress = 100;
				vendor.status = "completed";
				vendor.scan_progress = 100;
				vendor.risk_score = Math.floor(Math.random() * 75) + 15;
				vendor.last_successful_scan = (/* @__PURE__ */ new Date()).toISOString();
				vendor.updated_at = (/* @__PURE__ */ new Date()).toISOString();
				const scanRecord = {
					id: crypto.randomUUID(),
					vendor_id: vendorId,
					user_id: "demo-user",
					scan_date: (/* @__PURE__ */ new Date()).toISOString(),
					risk_score: vendor.risk_score,
					confidence: Math.floor(Math.random() * 30) + 60,
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					shodan_data: {
						ports: [
							80,
							443,
							22,
							8080
						],
						vulns: ["CVE-2023-3824", "CVE-2024-21626"]
					},
					virustotal_data: { reputation: Math.floor(Math.random() * 5) },
					crt_sh_data: [{ issuer_name: "Let's Encrypt" }]
				};
				db.scans.push(scanRecord);
				clearInterval(interval);
				activeScanTimers.delete(vendorId);
			} else {
				vendor.status = "scanning";
				vendor.scan_progress = progress;
				vendor.updated_at = (/* @__PURE__ */ new Date()).toISOString();
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
async function handleApiRequest(request) {
	const pathParts = new URL(request.url).pathname.split("/").filter(Boolean);
	const method = request.method;
	seedMockupVendors();
	const jsonResponse = (data, status = 200) => {
		return new Response(JSON.stringify(data), {
			status,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Headers": "Content-Type"
			}
		});
	};
	try {
		if (method === "GET" && pathParts.length === 2 && pathParts[1] === "vendors") return jsonResponse(readMockDb().vendors);
		if (method === "POST" && pathParts.length === 2 && pathParts[1] === "vendors") {
			const body = await request.json();
			if (!body.domain) return jsonResponse({ error: "Domain is required" }, 400);
			const db = readMockDb();
			const domainNormalized = body.domain.trim().toLowerCase();
			let vendor = db.vendors.find((v) => v.domain === domainNormalized);
			if (vendor) {
				vendor.status = "queued";
				vendor.scan_progress = 0;
				vendor.updated_at = (/* @__PURE__ */ new Date()).toISOString();
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
					created_at: (/* @__PURE__ */ new Date()).toISOString(),
					updated_at: (/* @__PURE__ */ new Date()).toISOString()
				};
				db.vendors.push(vendor);
			}
			writeMockDb(db);
			simulateScanProgress(vendor.id);
			return jsonResponse({
				success: true,
				vendor
			});
		}
		if (method === "POST" && pathParts.length === 4 && pathParts[1] === "vendors" && pathParts[3] === "scan") {
			const vendorId = pathParts[2];
			const db = readMockDb();
			const vendor = db.vendors.find((v) => v.id === vendorId);
			if (!vendor) return jsonResponse({ error: "Vendor not found" }, 404);
			vendor.status = "queued";
			vendor.scan_progress = 0;
			vendor.updated_at = (/* @__PURE__ */ new Date()).toISOString();
			writeMockDb(db);
			simulateScanProgress(vendorId);
			return jsonResponse({
				success: true,
				message: "Scan triggered",
				vendor
			});
		}
		if (method === "GET" && pathParts.length === 5 && pathParts[1] === "vendors" && pathParts[3] === "scan" && pathParts[4] === "status") {
			const vendorId = pathParts[2];
			const vendor = readMockDb().vendors.find((v) => v.id === vendorId);
			if (!vendor) return jsonResponse({ error: "Vendor not found" }, 404);
			return jsonResponse({
				id: vendor.id,
				status: vendor.status,
				scan_progress: vendor.scan_progress,
				last_successful_scan: vendor.last_successful_scan
			});
		}
		if (method === "GET" && pathParts.length === 3 && pathParts[1] === "dashboard" && pathParts[2] === "summary") {
			const vendors = readMockDb().vendors;
			const total = vendors.length;
			const critical = vendors.filter((v) => v.risk_score >= 75).length;
			return jsonResponse({
				portfolioRiskScore: total > 0 ? Math.round(vendors.reduce((acc, curr) => acc + (curr.risk_score || 0), 0) / total) : 0,
				criticalExposure: critical,
				monitoredEntities: total,
				activeAlerts: 9,
				dataSourcesConnected: 12,
				dataSourcesTotal: 15
			});
		}
		if (method === "GET" && pathParts.length === 3 && pathParts[1] === "dashboard" && pathParts[2] === "alerts") return jsonResponse([
			{
				id: "a1",
				title: "CVE-2024-38112 detected",
				severity: "critical",
				time: "2m ago",
				vendor: "acme.com"
			},
			{
				id: "a2",
				title: "Ransomware campaign detected",
				severity: "high",
				time: "15m ago",
				vendor: "globex.com"
			},
			{
				id: "a3",
				title: "New vendor added: Acme Corp",
				severity: "medium",
				time: "32m ago",
				vendor: "acme.com"
			},
			{
				id: "a4",
				title: "Unusual open port detected",
				severity: "low",
				time: "1h ago",
				vendor: "umbrella.com"
			}
		]);
		if (method === "GET" && pathParts.length === 3 && pathParts[1] === "pipeline" && pathParts[2] === "status") return jsonResponse([
			{
				name: "OSINT",
				status: "connected",
				details: "15 open feeds active"
			},
			{
				name: "Public Sources",
				status: "syncing",
				details: "Importing crt.sh logs"
			},
			{
				name: "Processing",
				status: "processing",
				details: "Analyzing data signatures"
			},
			{
				name: "Database",
				status: "healthy",
				details: "All perimeters stored"
			}
		]);
		if (method === "DELETE" && pathParts.length === 3 && pathParts[1] === "vendors") {
			const vendorId = pathParts[2];
			const db = readMockDb();
			const initialLength = db.vendors.length;
			db.vendors = db.vendors.filter((v) => v.id !== vendorId);
			if (db.vendors.length !== initialLength) {
				db.activities = db.activities || [];
				db.activities.push({
					type: "delete",
					vendor_id: vendorId,
					user_id: "demo-user",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				});
				writeMockDb(db);
				return jsonResponse({ success: true });
			} else return jsonResponse({ error: "Vendor not found" }, 404);
		}
		if (method === "GET" && pathParts.length === 5 && pathParts[1] === "vendors" && pathParts[3] === "export") {
			const vendorId = pathParts[2];
			const vendor = readMockDb().vendors.find((v) => v.id === vendorId);
			if (!vendor) return jsonResponse({ error: "Vendor not found" }, 404);
			const csv = `id,name,domain,risk_score,status,scan_progress\n${vendor.id},${vendor.name},${vendor.domain},${vendor.risk_score},${vendor.status},${vendor.scan_progress}`;
			return new Response(csv, {
				status: 200,
				headers: {
					"Content-Type": "text/csv",
					"Content-Disposition": `attachment; filename="vendor_${vendor.id}.csv"`
				}
			});
		}
		if (method === "GET" && pathParts.length === 3 && pathParts[1] === "dashboard" && pathParts[2] === "export") {
			const vendors = readMockDb().vendors || [];
			let csvContent = "Name,Domain,Sector,Risk Score,Status\r\n";
			vendors.forEach((v) => {
				csvContent += `"${v.name}","${v.domain}","${v.sector}",${v.risk_score ?? 0},"${v.status}"\r\n`;
			});
			return new Response(csvContent, {
				status: 200,
				headers: {
					"Content-Type": "text/csv",
					"Content-Disposition": `attachment; filename="threatweave_dashboard_${(/* @__PURE__ */ new Date()).getTime()}.csv"`
				}
			});
		}
		return jsonResponse({ error: "Endpoint not found" }, 404);
	} catch (err) {
		console.error("API error:", err);
		return jsonResponse({
			error: "Internal server error",
			details: String(err)
		}, 500);
	}
}
//#endregion
export { handleApiRequest, readMockDb, writeMockDb };
