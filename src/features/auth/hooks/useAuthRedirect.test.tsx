import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { renderHookWithProviders, createDefaultAuthContextValue } from "tests/test-utils";
import { useAuthRedirect } from "./useAuthRedirect";
import { useAuthContext } from "@/shared/context/AuthContext";
import * as redirectUtils from "@/shared/utils/redirectUtils";

vi.mock("@/shared/context/AuthContext");
vi.mock("@/shared/utils/redirectUtils");

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("useAuthRedirect", () => {
  const defaultAuthContext = createDefaultAuthContextValue();

  beforeEach(() => {
    vi.clearAllMocks();
    try {
      sessionStorage.removeItem("auth_redirect_path");
    } catch {
      // Ignore errors
    }
    mockNavigate.mockClear();
    vi.mocked(useAuthContext).mockReturnValue(defaultAuthContext);
  });

  it("should redirect to stored path when user logs in successfully", async () => {
    const mockGetAndClearRedirectPath = vi.spyOn(redirectUtils, "getAndClearRedirectPath");
    mockGetAndClearRedirectPath.mockReturnValue("/dashboard");

    const { rerender } = renderHookWithProviders(() => useAuthRedirect(), {
      withQueryClient: false,
    });

    vi.mocked(useAuthContext).mockReturnValue({
      ...defaultAuthContext,
      user: { id: "123", email: "test@example.com", created_at: "2024-01-01" },
    });

    rerender();

    await waitFor(() => {
      expect(mockGetAndClearRedirectPath).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  it("should redirect to home when no stored path exists", async () => {
    const mockGetAndClearRedirectPath = vi.spyOn(redirectUtils, "getAndClearRedirectPath");
    mockGetAndClearRedirectPath.mockReturnValue(null);

    const { rerender } = renderHookWithProviders(() => useAuthRedirect(), {
      withQueryClient: false,
    });

    vi.mocked(useAuthContext).mockReturnValue({
      ...defaultAuthContext,
      user: { id: "123", email: "test@example.com", created_at: "2024-01-01" },
    });

    rerender();

    await waitFor(() => {
      expect(mockGetAndClearRedirectPath).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("should not redirect when user is loading", () => {
    const mockGetAndClearRedirectPath = vi.spyOn(redirectUtils, "getAndClearRedirectPath");

    vi.mocked(useAuthContext).mockReturnValue({
      ...defaultAuthContext,
      user: { id: "123", email: "test@example.com", created_at: "2024-01-01" },
      loading: true,
    });

    renderHookWithProviders(() => useAuthRedirect(), { withQueryClient: false });

    expect(mockGetAndClearRedirectPath).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should not redirect when there is an error", () => {
    const mockGetAndClearRedirectPath = vi.spyOn(redirectUtils, "getAndClearRedirectPath");

    vi.mocked(useAuthContext).mockReturnValue({
      ...defaultAuthContext,
      user: { id: "123", email: "test@example.com", created_at: "2024-01-01" },
      error: "Login failed",
    });

    renderHookWithProviders(() => useAuthRedirect(), { withQueryClient: false });

    expect(mockGetAndClearRedirectPath).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should not redirect multiple times when hook re-renders", async () => {
    const mockGetAndClearRedirectPath = vi.spyOn(redirectUtils, "getAndClearRedirectPath");
    mockGetAndClearRedirectPath.mockReturnValue("/dashboard");

    vi.mocked(useAuthContext).mockReturnValue({
      ...defaultAuthContext,
      user: { id: "123", email: "test@example.com", created_at: "2024-01-01" },
    });

    const { rerender } = renderHookWithProviders(() => useAuthRedirect(), {
      withQueryClient: false,
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    rerender();
    rerender();
    rerender();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  it("should reset redirect flag when user logs out", async () => {
    const mockGetAndClearRedirectPath = vi.spyOn(redirectUtils, "getAndClearRedirectPath");
    mockGetAndClearRedirectPath.mockReturnValue("/dashboard");

    const { rerender } = renderHookWithProviders(() => useAuthRedirect(), {
      withQueryClient: false,
    });

    vi.mocked(useAuthContext).mockReturnValue({
      ...defaultAuthContext,
      user: { id: "123", email: "test@example.com", created_at: "2024-01-01" },
    });

    rerender();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    mockNavigate.mockClear();
    mockGetAndClearRedirectPath.mockClear();
    mockGetAndClearRedirectPath.mockReturnValue("/dashboard");

    vi.mocked(useAuthContext).mockReturnValue({
      ...defaultAuthContext,
      user: null,
    });

    rerender();

    vi.mocked(useAuthContext).mockReturnValue({
      ...defaultAuthContext,
      user: { id: "123", email: "test@example.com", created_at: "2024-01-01" },
    });

    rerender();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  it("should return a function to reset redirect flag", () => {
    vi.mocked(useAuthContext).mockReturnValue(defaultAuthContext);

    const { result } = renderHookWithProviders(() => useAuthRedirect(), {
      withQueryClient: false,
    });

    expect(typeof result.current).toBe("function");
    expect(() => result.current()).not.toThrow();
  });
});
