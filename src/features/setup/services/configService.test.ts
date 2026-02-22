import { describe, it, expect, vi, beforeEach } from "vitest";
import { syncConfiguration } from "./configService";

vi.mock("@utils/setupUtils", () => ({
  getSetupSectionsState: vi.fn(() => ({
    supabase: "completed",
    airtable: "not-started",
    hosting: "not-started",
    theme: "not-started",
  })),
  getEnabledFeatures: vi.fn(() => ["supabase"]),
  isSetupComplete: vi.fn(() => false),
}));

vi.mock("@shared/theme/themeLoader", () => ({
  getCustomTheme: vi.fn(() => null),
}));

describe("configService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns success when read-env and write-config succeed", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            env: {
              VITE_SUPABASE_URL: "https://test.supabase.co",
              VITE_SUPABASE_PUBLISHABLE_KEY: "key",
            },
          }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response);

    const result = await syncConfiguration();

    expect(result).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(1, "/api/read-env");
    expect(fetch).toHaveBeenNthCalledWith(2, "/api/write-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: expect.any(String),
    });
  });

  it("returns failure when write-config returns success false", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            env: { VITE_SUPABASE_URL: "url", VITE_SUPABASE_PUBLISHABLE_KEY: "key" },
          }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: false,
            message: "Permission denied",
          }),
      } as Response);

    const result = await syncConfiguration();

    expect(result).toEqual({
      success: false,
      error: "Permission denied",
    });
  });

  it("returns failure when write-config response is not ok", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            env: {},
          }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            success: false,
            message: "Server error",
          }),
      } as Response);

    const result = await syncConfiguration();

    expect(result).toEqual({
      success: false,
      error: "Server error",
    });
  });

  it("returns failure with default message when API returns no message", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, env: {} }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({}),
      } as Response);

    const result = await syncConfiguration();

    expect(result).toEqual({
      success: false,
      error: "Failed to write configuration",
    });
  });

  it("returns failure when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network unavailable"));

    const result = await syncConfiguration();

    expect(result).toEqual({
      success: false,
      error: "Network unavailable",
    });
  });
});
