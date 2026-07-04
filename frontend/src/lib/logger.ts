export const logger = {
  info: (msg: string, meta?: Record<string, unknown>, timeMs?: number) => {
    const timeStr = timeMs !== undefined ? ` [${Math.round(timeMs)}ms]` : "";
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console.log(`[INFO] ${msg}${timeStr}${metaStr}`);
  },
  error: (msg: string, err?: unknown, meta?: Record<string, unknown>) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console.error(`[ERROR] ${msg}${metaStr}`, err);
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    console.warn(`[WARN] ${msg}${metaStr}`);
  },
};
