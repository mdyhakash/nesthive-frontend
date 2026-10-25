/**
 * Safely extracts the payload data from an API response or direct data.
 */
export function extractData<T>(res: any): T {
  if (!res) return res;
  if (typeof res === "object" && "data" in res && res.data !== undefined) {
    return res.data as T;
  }
  return res as T;
}
