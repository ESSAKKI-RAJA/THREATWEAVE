import { logger } from "../src/lib/logger";

/**
 * Basic HTTP load testing script to stress test the API endpoints
 * This simulates concurrent connections for performance validation.
 */

const TARGET_URL = process.env.TARGET_URL || "http://localhost:3000";
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "50", 10);
const REQUESTS_PER_WORKER = parseInt(process.env.REQUESTS_PER_WORKER || "10", 10);

async function makeRequest(workerId: number, requestId: number) {
  const start = performance.now();
  try {
    const res = await fetch(`${TARGET_URL}/api/health`);
    const duration = performance.now() - start;
    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }
    return { success: true, duration };
  } catch (err: any) {
    const duration = performance.now() - start;
    return { success: false, duration, error: err.message };
  }
}

async function runWorker(workerId: number) {
  let successCount = 0;
  let failCount = 0;
  let totalDuration = 0;

  for (let i = 0; i < REQUESTS_PER_WORKER; i++) {
    const result = await makeRequest(workerId, i);
    totalDuration += result.duration;
    if (result.success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  return { successCount, failCount, totalDuration };
}

async function runLoadTest() {
  logger.info(`Starting Load Test against ${TARGET_URL}`, {
    concurrency: CONCURRENCY,
    requestsPerWorker: REQUESTS_PER_WORKER,
    totalRequests: CONCURRENCY * REQUESTS_PER_WORKER,
  });

  const startTime = performance.now();

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => runWorker(i));
  const results = await Promise.all(workers);

  const totalTime = performance.now() - startTime;

  let totalSuccess = 0;
  let totalFail = 0;
  let sumDurations = 0;

  for (const r of results) {
    totalSuccess += r.successCount;
    totalFail += r.failCount;
    sumDurations += r.totalDuration;
  }

  const avgLatency = sumDurations / (totalSuccess + totalFail);
  const throughput = ((totalSuccess + totalFail) / (totalTime / 1000)).toFixed(2);

  logger.info("Load Test Complete", {
    totalTimeMs: totalTime.toFixed(2),
    totalSuccess,
    totalFail,
    avgLatencyMs: avgLatency.toFixed(2),
    throughputReqSec: throughput,
  });

  if (totalFail > 0) {
    logger.warn(`Load test experienced ${totalFail} failures!`);
  }
}

runLoadTest();
