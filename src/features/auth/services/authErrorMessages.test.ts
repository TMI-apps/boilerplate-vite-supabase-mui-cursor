import { describe, it, expect } from "vitest";
import { mapAuthError } from "./authErrorMessages";

describe("mapAuthError", () => {
  it("maps invalid credentials", () => {
    expect(mapAuthError(new Error("Invalid login credentials"))).toBe("Invalid email or password.");
  });

  it("maps email not confirmed", () => {
    expect(mapAuthError({ code: "email_not_confirmed", message: "Email not confirmed" })).toBe(
      "Please confirm your email address before signing in."
    );
  });

  it("maps duplicate registration", () => {
    expect(mapAuthError(new Error("User already registered"))).toBe(
      "An account with this email already exists. Sign in with Google or reset your password."
    );
  });

  it("maps weak password", () => {
    expect(
      mapAuthError({ code: "weak_password", message: "Password should be at least 6 characters" })
    ).toBe("Password is too weak. Use at least 6 characters.");
  });

  it("maps rate limits", () => {
    expect(mapAuthError(new Error("Request rate limit reached"))).toBe(
      "Too many attempts. Please wait a few minutes and try again."
    );
  });

  it("maps network errors", () => {
    expect(mapAuthError(new Error("Failed to fetch"))).toBe(
      "Network error. Please check your connection and try again."
    );
  });

  it("falls back to a generic message", () => {
    expect(mapAuthError({})).toBe("Something went wrong. Please try again.");
  });
});
