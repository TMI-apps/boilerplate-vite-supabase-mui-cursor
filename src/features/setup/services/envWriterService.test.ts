import { describe, it, expect, vi, beforeEach } from "vitest";
import { writeEnvVariables } from "./envWriterService";

describe("envWriterService", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns success when API responds with success true", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          message: "Written",
          written: ["VITE_TEST"],
        }),
    } as Response);

    const result = await writeEnvVariables({ VITE_TEST: "value" });

    expect(result).toEqual({
      success: true,
      message: "Written",
      written: ["VITE_TEST"],
    });
    expect(fetch).toHaveBeenCalledWith("/api/write-env", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ VITE_TEST: "value" }),
    });
  });

  it("returns failure when API responds with success false", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          success: false,
          message: "Invalid variable name",
        }),
    } as Response);

    const result = await writeEnvVariables({ INVALID: "value" });

    expect(result).toEqual({
      success: false,
      error: "Invalid variable name",
    });
  });

  it("returns failure when response is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          success: false,
          message: "Server error",
        }),
    } as Response);

    const result = await writeEnvVariables({ VITE_TEST: "value" });

    expect(result).toEqual({
      success: false,
      error: "Server error",
    });
  });

  it("returns failure with default message when API returns no message", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    } as Response);

    const result = await writeEnvVariables({ VITE_TEST: "value" });

    expect(result).toEqual({
      success: false,
      error: "Failed to write environment variables",
    });
  });

  it("returns failure when fetch throws", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

    const result = await writeEnvVariables({ VITE_TEST: "value" });

    expect(result).toEqual({
      success: false,
      error: "Network error",
    });
  });
});
