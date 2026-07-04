export interface ThreatFeedConnector {
  /**
   * Initialize the connector with API keys or configurations.
   */
  initialize(): void;

  /**
   * Query the threat feed for an IP address.
   */
  checkIp(ip: string): Promise<any>;

  /**
   * Query the threat feed for a domain or hostname.
   */
  checkDomain(domain: string): Promise<any>;
}
