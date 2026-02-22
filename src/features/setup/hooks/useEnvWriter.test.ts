import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEnvWriter } from "./useEnvWriter";
import * as envWriterService from "../services/envWriterService";

vi.mock("../services/envWriterService");

describe("useEnvWriter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with envWritten false and writingEnv false", () => {
    const { result } = renderHook(() => useEnvWriter());

    expect(result.current.envWritten).toBe(false);
    expect(result.current.writingEnv).toBe(false);
  });

  it("sets envWritten true when writeEnv succeeds", async () => {
    vi.mocked(envWriterService.writeEnvVariables).mockResolvedValue({
      success: true,
    });

    const { result } = renderHook(() => useEnvWriter());

    await act(async () => {
      await result.current.writeEnv({ VITE_TEST: "value" });
    });

    expect(result.current.envWritten).toBe(true);
    expect(envWriterService.writeEnvVariables).toHaveBeenCalledWith({
      VITE_TEST: "value",
    });
  });

  it("returns success when writeEnv succeeds", async () => {
    vi.mocked(envWriterService.writeEnvVariables).mockResolvedValue({
      success: true,
    });

    const { result } = renderHook(() => useEnvWriter());

    let writeResult: { success: boolean; error?: string } | undefined;
    await act(async () => {
      writeResult = await result.current.writeEnv({ VITE_TEST: "value" });
    });

    expect(writeResult).toEqual({ success: true });
  });

  it("returns failure and calls onError when writeEnv fails", async () => {
    const onError = vi.fn();
    vi.mocked(envWriterService.writeEnvVariables).mockResolvedValue({
      success: false,
      error: "Write failed",
    });

    const { result } = renderHook(() => useEnvWriter({ onError }));

    let writeResult: { success: boolean; error?: string } | undefined;
    await act(async () => {
      writeResult = await result.current.writeEnv({ VITE_TEST: "value" });
    });

    expect(writeResult).toEqual({ success: false, error: "Write failed" });
    expect(onError).toHaveBeenCalledWith("Write failed");
    expect(result.current.envWritten).toBe(false);
  });

  it("handles thrown errors and calls onError", async () => {
    const onError = vi.fn();
    vi.mocked(envWriterService.writeEnvVariables).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useEnvWriter({ onError }));

    let writeResult: { success: boolean; error?: string } | undefined;
    await act(async () => {
      writeResult = await result.current.writeEnv({ VITE_TEST: "value" });
    });

    expect(writeResult).toEqual({
      success: false,
      error: "Network error",
    });
    expect(onError).toHaveBeenCalledWith("Network error");
  });
});
