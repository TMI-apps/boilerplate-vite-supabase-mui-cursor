import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useConfigurationReset } from "./useConfigurationReset";
import * as configurationResetService from "../services/configurationResetService";

vi.mock("../services/configurationResetService");

describe("useConfigurationReset", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls resetSetupSection and onSuccess on success", async () => {
    vi.mocked(configurationResetService.resetSetupSection).mockResolvedValue(undefined);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useConfigurationReset("airtable", onSuccess));

    await act(async () => {
      await result.current.reset();
    });

    expect(configurationResetService.resetSetupSection).toHaveBeenCalledWith("airtable");
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.resetting).toBe(false);
  });

  it("sets error and rethrows when resetSetupSection fails", async () => {
    vi.mocked(configurationResetService.resetSetupSection).mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useConfigurationReset("supabase"));

    await act(async () => {
      await expect(result.current.reset()).rejects.toThrow("boom");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("boom");
    });
    expect(result.current.resetting).toBe(false);
  });
});
