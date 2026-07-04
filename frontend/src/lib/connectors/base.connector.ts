export abstract class OSINTConnector<T> {
  abstract name: string;
  abstract timeout: number;

  protected circuitBreaker = {
    failures: 0,
    threshold: 3,
    open: false,
    lastFailureTime: 0,
    resetTimeout: 60000, // 1 minute
  };

  /**
   * Main fetch method. Must be implemented by subclasses.
   */
  abstract fetch(domain: string, ip?: string): Promise<T>;

  /**
   * Parse the raw response into the expected type T.
   */
  abstract parse(raw: unknown): T;

  /**
   * Execute the connector with circuit breaker and fallback.
   */
  public async execute(
    domain: string,
    ip?: string,
  ): Promise<{ data: T; fallbackUsed: boolean; error?: string }> {
    const DEBUG = process.env.NODE_ENV === "development";

    // Check if circuit breaker is open
    if (this.circuitBreaker.open) {
      if (DEBUG) console.warn(`⚠️ [${this.name}] Circuit breaker is open. Bypassing fetch.`);
      const now = Date.now();
      if (now - this.circuitBreaker.lastFailureTime > this.circuitBreaker.resetTimeout) {
        // Half-open state (reset and try again)
        this.circuitBreaker.open = false;
        this.circuitBreaker.failures = 0;
      } else {
        // Fast fail to fallback
        return this.handleFallback(domain, new Error(`Circuit breaker open for ${this.name}`));
      }
    }

    try {
      if (DEBUG) console.log(`🔍 [${this.name}] Fetching data for ${domain}...`);
      const data = await this.retry(() => this.fetch(domain, ip), 3);
      if (DEBUG) console.log(`✅ [${this.name}] Success.`);
      // Success, reset breaker
      this.circuitBreaker.failures = 0;
      this.circuitBreaker.open = false;
      return { data, fallbackUsed: false };
    } catch (error) {
      const err = error as Error;

      // MissingKeyError = no point retrying or recording circuit breaker failure
      if (err.name === "MissingKeyError") {
        if (DEBUG)
          console.warn(`⚠️ [${this.name}] Missing API key — skipping retries, using fallback`);
        return this.handleFallback(domain, err);
      }

      if (DEBUG) {
        console.error(`❌ [${this.name}] Error:`, err.message);
      }

      // Record failure
      this.circuitBreaker.failures += 1;
      this.circuitBreaker.lastFailureTime = Date.now();

      if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
        this.circuitBreaker.open = true;
      }

      return this.handleFallback(domain, err);
    }
  }

  /**
   * Handle fallback when fetch fails or circuit is open.
   * Connectors should override this if they have specific fallback logic.
   */
  protected async handleFallback(
    domain: string,
    error: Error,
  ): Promise<{ data: T; fallbackUsed: boolean; error?: string }> {
    throw error; // By default, throw. Implementations can catch and return fallback data.
  }

  /**
   * Exponential backoff retry wrapper
   */
  protected async retry<R>(fn: () => Promise<R>, retries = 3): Promise<R> {
    let lastError: Error;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
      }
    }
    throw lastError!;
  }
}
