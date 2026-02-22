import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useConnectionTest } from "./useConnectionTest";

describe("useConnectionTest", () => {
  const mockOnTest = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts with testing false and testResult null", () => {
    const { result } = renderHook(() => useConnectionTest({ onTest: mockOnTest }));

    expect(result.current.testing).toBe(false);
    expect(result.current.testResult).toBeNull();
  });

  it("sets testing true during runTest and false after", async () => {
    mockOnTest.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 10))
    );

    const { result } = renderHook(() => useConnectionTest({ onTest: mockOnTest }));

    let testPromise: Promise<unknown>;
    await act(async () => {
      testPromise = result.current.runTest();
    });

    expect(result.current.testing).toBe(true);

    await act(async () => {
      await testPromise;
    });

    expect(result.current.testing).toBe(false);
  });

  it("sets testResult on successful test", async () => {
    const successResult = { success: true };
    mockOnTest.mockResolvedValue(successResult);

    const { result } = renderHook(() => useConnectionTest({ onTest: mockOnTest }));

    await act(async () => {
      await result.current.runTest();
    });

    expect(result.current.testResult).toEqual(successResult);
  });

  it("sets testResult on failed test", async () => {
    const errorResult = { success: false, error: "Connection refused" };
    mockOnTest.mockResolvedValue(errorResult);

    const { result } = renderHook(() => useConnectionTest({ onTest: mockOnTest }));

    await act(async () => {
      await result.current.runTest();
    });

    expect(result.current.testResult).toEqual(errorResult);
  });

  it("calls onSuccess when test succeeds and onSuccess is provided", async () => {
    mockOnTest.mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useConnectionTest({ onTest: mockOnTest, onSuccess: mockOnSuccess })
    );

    await act(async () => {
      await result.current.runTest();
    });

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it("does not call onSuccess when test fails", async () => {
    mockOnTest.mockResolvedValue({ success: false, error: "Failed" });

    const { result } = renderHook(() =>
      useConnectionTest({ onTest: mockOnTest, onSuccess: mockOnSuccess })
    );

    await act(async () => {
      await result.current.runTest();
    });

    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("handles thrown errors and returns error result", async () => {
    mockOnTest.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useConnectionTest({ onTest: mockOnTest }));

    let returned: { success: boolean; error?: string } | undefined;
    await act(async () => {
      returned = await result.current.runTest();
    });

    expect(returned).toEqual({ success: false, error: "Network error" });
    expect(result.current.testResult).toEqual({
      success: false,
      error: "Network error",
    });
  });

  it("setTestResult updates testResult", () => {
    const { result } = renderHook(() => useConnectionTest({ onTest: mockOnTest }));

    act(() => {
      result.current.setTestResult({ success: false, error: "Manual override" });
    });

    expect(result.current.testResult).toEqual({
      success: false,
      error: "Manual override",
    });
  });
});
