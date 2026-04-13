import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { removeEnvVarsViaApi, resetSetupSection } from "./configurationResetService";
import * as setupUtils from "@utils/setupUtils";
import * as configService from "./configService";

vi.mock("@utils/setupUtils", () => ({
  updateSetupSectionStatus: vi.fn(),
}));

vi.mock("./configService", () => ({
  syncConfiguration: vi.fn(),
}));

describe("configurationResetService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      })
    );
    vi.mocked(configService.syncConfiguration).mockResolvedValue({ success: true });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("removeEnvVarsViaApi", () => {
    it("no-ops when variables list is empty", async () => {
      await removeEnvVarsViaApi([]);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("POSTs to remove-env-vars and throws on failure", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ success: false, error: "nope" }),
        })
      );

      await expect(removeEnvVarsViaApi(["VITE_SUPABASE_URL"])).rejects.toThrow("nope");
    });
  });

  describe("resetSetupSection", () => {
    it("removes env vars, updates status, and syncs for supabase", async () => {
      await resetSetupSection("supabase");

      expect(fetch).toHaveBeenCalledWith(
        "/api/remove-env-vars",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            variables: [
              "VITE_SUPABASE_URL",
              "VITE_SUPABASE_PUBLISHABLE_KEY",
              "VITE_SUPABASE_ANON_KEY",
            ],
          }),
        })
      );
      expect(setupUtils.updateSetupSectionStatus).toHaveBeenCalledWith("supabase", "not-started");
      expect(configService.syncConfiguration).toHaveBeenCalled();
    });

    it("clears custom theme in localStorage for theme section", async () => {
      const removeItem = vi.spyOn(Storage.prototype, "removeItem");
      await resetSetupSection("theme");
      expect(removeItem).toHaveBeenCalledWith("customTheme");
      removeItem.mockRestore();
    });

    it("throws when sync fails", async () => {
      vi.mocked(configService.syncConfiguration).mockResolvedValue({
        success: false,
        error: "sync bad",
      });

      await expect(resetSetupSection("hosting")).rejects.toThrow("sync bad");
    });
  });
});
