import { describe, it, expect } from "vitest";
import { mapAuthError } from "./authErrorMessages";

describe("mapAuthError", () => {
  it("should map invalid credentials when login fails", () => {
    expect(mapAuthError(new Error("Invalid login credentials"))).toBe("Invalid email or password.");
  });

  it("should map email not confirmed when confirmation is pending", () => {
    expect(mapAuthError({ code: "email_not_confirmed", message: "Email not confirmed" })).toBe(
      "Please confirm your email address before signing in."
    );
  });

  it("should map duplicate registration when user already exists", () => {
    expect(mapAuthError(new Error("User already registered"))).toBe(
      "An account with this email already exists. Sign in with Google or reset your password."
    );
  });

  it("should map weak password when policy rejects password", () => {
    expect(
      mapAuthError({ code: "weak_password", message: "Password should be at least 6 characters" })
    ).toBe("Password is too weak. Use at least 6 characters.");
  });

  it("should map rate limits when too many attempts", () => {
    expect(mapAuthError(new Error("Request rate limit reached"))).toBe(
      "Too many attempts. Please wait a few minutes and try again."
    );
  });

  it("should map network errors when fetch fails", () => {
    expect(mapAuthError(new Error("Failed to fetch"))).toBe(
      "Network error. Please check your connection and try again."
    );
  });

  it("should fall back to a generic message when error is unknown", () => {
    expect(mapAuthError({})).toBe("Something went wrong. Please try again.");
  });
});
