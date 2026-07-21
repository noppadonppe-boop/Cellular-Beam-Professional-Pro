type AssetBinding = { fetch: (request: Request) => Promise<Response> };
type WorkerEnvironment = { ASSETS: AssetBinding };

export default {
  async fetch(request: Request, environment: WorkerEnvironment): Promise<Response> {
    const assetResponse = await environment.ASSETS.fetch(request);
    if (assetResponse.status !== 404) return assetResponse;

    const url = new URL(request.url);
    if (request.method === "GET" && !url.pathname.includes(".")) {
      url.pathname = "/index.html";
      return environment.ASSETS.fetch(new Request(url, request));
    }
    return assetResponse;
  },
};
