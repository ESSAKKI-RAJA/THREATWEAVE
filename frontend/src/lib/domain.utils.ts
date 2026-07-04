export function normalizeDomain(input: string): string {
  let domain = input.trim().toLowerCase();
  // Strip asterisks, quotes, backticks (e.g. if copy-pasted from markdown)
  domain = domain.replace(/[*'`"]/g, "");
  // Strip protocols
  domain = domain.replace(/^https?:\/\//, "");
  // Strip www.
  domain = domain.replace(/^www\./, "");
  // Strip paths and query strings
  domain = domain.split("/")[0];
  domain = domain.split("?")[0];
  return domain;
}

export function isValidDomain(domain: string): boolean {
  // Simple regex for valid root/sub domains. Rejects localhost or plain IPs easily unless explicitly coded.
  return /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(domain);
}
