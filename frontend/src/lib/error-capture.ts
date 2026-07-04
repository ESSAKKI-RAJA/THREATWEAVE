let lastError: Error | null = null;

export function consumeLastCapturedError(): Error | null {
  const err = lastError;
  lastError = null;
  return err;
}

export function captureError(err: Error): void {
  lastError = err;
}

// Side-effect: capture unhandled rejections and exceptions on the server
if (typeof process !== "undefined") {
  process.on("unhandledRejection", (reason) => {
    lastError = reason instanceof Error ? reason : new Error(String(reason));
  });
  process.on("uncaughtException", (err) => {
    lastError = err;
  });
}
