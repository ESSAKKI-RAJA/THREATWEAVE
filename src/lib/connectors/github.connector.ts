import { OSINTConnector } from "./base.connector";
import { fetchWithRetry } from "../rate-limit";
import type { GithubLeakResult } from "../osint-types";
import { getMockGithubData } from "../mock-data";

export class GithubConnector extends OSINTConnector<GithubLeakResult> {
  name = "GitHub Secrets";
  timeout = 12000;

  async fetch(domain: string): Promise<GithubLeakResult> {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      console.warn("⚠️ [GitHub] GITHUB_TOKEN not configured — using mock fallback");
      const err = new Error("GITHUB_TOKEN not configured — code search disabled");
      err.name = "MissingKeyError";
      throw err;
    }

    const q = `"${domain}" (api_key OR apikey OR secret OR password OR token OR "Bearer ") in:file`;
    const url = `https://api.github.com/search/code?q=${encodeURIComponent(q)}&per_page=20`;

    const res = await fetchWithRetry(
      url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "threatweave-scanner",
        },
      },
      { retries: 1, timeoutMs: this.timeout },
    );

    if (!res.ok) {
      throw new Error(`GitHub API HTTP ${res.status}`);
    }

    const body = (await res.json()) as {
      total_count: number;
      incomplete_results: boolean;
      items: Array<{
        name: string;
        path: string;
        html_url: string;
        score: number;
        repository: { full_name: string };
      }>;
    };

    return {
      total_count: body.total_count,
      truncated: body.incomplete_results,
      hits: body.items.slice(0, 10).map((i) => ({
        repository: i.repository.full_name,
        path: i.path,
        html_url: i.html_url,
        score: i.score,
      })),
    };
  }

  parse(raw: unknown): GithubLeakResult {
    return raw as GithubLeakResult;
  }

  protected async handleFallback(
    domain: string,
    error: Error,
  ): Promise<{ data: GithubLeakResult; fallbackUsed: boolean; error?: string }> {
    return {
      data: getMockGithubData(domain),
      fallbackUsed: true,
      error: `GitHub scanner failed or unavailable (${error.message})`,
    };
  }
}
