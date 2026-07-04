export class MissingKeyError extends Error {
  constructor(service: string) {
    super(`${service}_API_KEY not configured`);
    this.name = "MissingKeyError";
  }
}

export class CircuitBreakerOpenError extends Error {
  constructor(service: string) {
    super(`${service} circuit breaker is open`);
    this.name = "CircuitBreakerOpenError";
  }
}

export class RateLimitError extends Error {
  constructor(service: string, retryAfter?: number) {
    super(`${service} rate limit exceeded`);
    this.name = "RateLimitError";
  }
}
