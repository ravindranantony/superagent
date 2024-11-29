import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { RateLimiter } from '../utils/RateLimiter';

export class APIConnector {
  private client: AxiosInstance;
  private rateLimiters: Map<string, RateLimiter>;

  constructor() {
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.rateLimiters = new Map();
  }

  async request(
    endpoint: string,
    params: Record<string, any>,
    config: AxiosRequestConfig = {}
  ): Promise<any> {
    const domain = new URL(endpoint).hostname;
    await this.checkRateLimit(domain);

    try {
      const response = await this.client.request({
        ...config,
        url: endpoint,
        params
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          this.updateRateLimit(domain, error.response.headers);
        }
        throw new Error(`API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  private async checkRateLimit(domain: string): Promise<void> {
    const limiter = this.getRateLimiter(domain);
    await limiter.waitForToken();
  }

  private getRateLimiter(domain: string): RateLimiter {
    if (!this.rateLimiters.has(domain)) {
      this.rateLimiters.set(domain, new RateLimiter(60, 60)); // Default: 60 requests per minute
    }
    return this.rateLimiters.get(domain)!;
  }

  private updateRateLimit(domain: string, headers: Record<string, string>): void {
    const limit = parseInt(headers['x-ratelimit-limit'] || '60');
    const windowSeconds = parseInt(headers['x-ratelimit-window'] || '60');
    this.rateLimiters.set(domain, new RateLimiter(limit, windowSeconds));
  }
}