import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SignInPanel } from "./SignInPanel";
import { useAuthContext } from "@/shared/context/AuthContext";
import { useSupabaseConfig } from "@/shared/hooks/useSupabaseConfig";

vi.mock("@/shared/context/AuthContext");
vi.mock("@/shared/hooks/useSupabaseConfig");
vi.mock("@/features/auth/hooks/useAuthRedirect", () => ({
  useAuthRedirect: () => vi.fn(),
}));

describe("SignInPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthContext).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      login: vi.fn(),
      signUp: vi.fn(),
      logout: vi.fn(),
      signInWithGoogle: vi.fn(),
      requestPasswordReset: vi.fn(),
      updatePassword: vi.fn(),
      clearAuthError: vi.fn(),
      setAuthError: vi.fn(),
    });
    vi.mocked(useSupabaseConfig).mockReturnValue({
      isConfigured: true,
    });
  });

  it("renders key sign-in controls", () => {
    render(<SignInPanel />);

    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
    expect(screen.getByText("or")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with email/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /privacy/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /terms/i })).toBeInTheDocument();
  });

  it("shows configuration info and preview controls when Supabase is not configured", () => {
    vi.mocked(useSupabaseConfig).mockReturnValue({
      isConfigured: false,
    });

    render(<SignInPanel />);

    expect(screen.getByText(/authentication requires supabase configuration/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /sign in with email/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /sign in$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });
});
