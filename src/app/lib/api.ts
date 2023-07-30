// should be replaced with an (environment?) variable if we separate the API and frontend processes
export const megateams_api_base_url = window.location.origin;

export function makeMegateamsApiRequest(endpoint: string, options?: RequestInit): Request {
    const api_endpoint_url = new URL(endpoint, megateams_api_base_url)
    return new Request(api_endpoint_url, options);
}
