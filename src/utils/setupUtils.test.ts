import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSetupSectionsState,
  updateSetupSectionStatus,
  getEnabledFeatures,
  isSetupComplete,
  isSupabaseSkipped,
  skipSupabaseSetup,
  resetAirtableSetup,
  resetAllSetupSections,
} from "./setupUtils";

const SETUP_SECTIONS_STORAGE_KEY = "setup_sections_state";
const SETUP_COMPLETE_KEY = "setup_complete";

describe("setupUtils", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  describe("getSetupSectionsState", () => {
    it("returns default state when nothing is stored", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      const state = getSetupSectionsState();

      expect(state).toEqual({
        supabase: "not-started",
        airtable: "not-started",
        hosting: "not-started",
        theme: "not-started",
      });
    });

    it("returns parsed state from localStorage", () => {
      const stored = {
        supabase: "completed",
        airtable: "in-progress",
        hosting: "not-started",
        theme: "skipped",
      };
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(stored));

      const state = getSetupSectionsState();

      expect(state).toEqual(stored);
    });

    it("returns default state when parse fails", () => {
      vi.mocked(localStorage.getItem).mockReturnValue("invalid json");

      const state = getSetupSectionsState();

      expect(state).toEqual({
        supabase: "not-started",
        airtable: "not-started",
        hosting: "not-started",
        theme: "not-started",
      });
    });
  });

  describe("updateSetupSectionStatus", () => {
    it("updates a single section and persists to localStorage", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          supabase: "not-started",
          airtable: "not-started",
          hosting: "not-started",
          theme: "not-started",
        })
      );

      updateSetupSectionStatus("supabase", "completed");

      expect(localStorage.setItem).toHaveBeenCalledWith(
        SETUP_SECTIONS_STORAGE_KEY,
        JSON.stringify({
          supabase: "completed",
          airtable: "not-started",
          hosting: "not-started",
          theme: "not-started",
        })
      );
    });

    it("preserves other sections when updating one", () => {
      const existing = {
        supabase: "completed",
        airtable: "in-progress",
        hosting: "not-started",
        theme: "skipped",
      };
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(existing));

      updateSetupSectionStatus("hosting", "completed");

      expect(localStorage.setItem).toHaveBeenCalledWith(
        SETUP_SECTIONS_STORAGE_KEY,
        JSON.stringify({
          ...existing,
          hosting: "completed",
        })
      );
    });
  });

  describe("getEnabledFeatures", () => {
    it("returns section ids with completed status", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          supabase: "completed",
          airtable: "not-started",
          hosting: "completed",
          theme: "skipped",
        })
      );

      const features = getEnabledFeatures();

      expect(features).toEqual(["supabase", "hosting"]);
    });

    it("returns empty array when no sections completed", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          supabase: "not-started",
          airtable: "not-started",
          hosting: "not-started",
          theme: "not-started",
        })
      );

      const features = getEnabledFeatures();

      expect(features).toEqual([]);
    });
  });

  describe("isSetupComplete", () => {
    it("returns true when setup_complete is 'true'", () => {
      vi.mocked(localStorage.getItem).mockImplementation((key) =>
        key === SETUP_COMPLETE_KEY ? "true" : null
      );

      expect(isSetupComplete()).toBe(true);
    });

    it("returns false when setup_complete is not 'true'", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      expect(isSetupComplete()).toBe(false);
    });
  });

  describe("isSupabaseSkipped", () => {
    it("returns true when supabase section is skipped", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          supabase: "skipped",
          airtable: "not-started",
          hosting: "not-started",
          theme: "not-started",
        })
      );

      expect(isSupabaseSkipped()).toBe(true);
    });

    it("returns false when supabase section is not skipped", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          supabase: "completed",
          airtable: "not-started",
          hosting: "not-started",
          theme: "not-started",
        })
      );

      expect(isSupabaseSkipped()).toBe(false);
    });
  });

  describe("skipSupabaseSetup", () => {
    it("sets supabase section to skipped", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          supabase: "not-started",
          airtable: "not-started",
          hosting: "not-started",
          theme: "not-started",
        })
      );

      skipSupabaseSetup();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        SETUP_SECTIONS_STORAGE_KEY,
        expect.stringContaining('"supabase":"skipped"')
      );
    });
  });

  describe("resetAirtableSetup", () => {
    it("sets airtable section to not-started", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({
          supabase: "completed",
          airtable: "completed",
          hosting: "not-started",
          theme: "not-started",
        })
      );

      resetAirtableSetup();

      expect(localStorage.setItem).toHaveBeenCalledWith(
        SETUP_SECTIONS_STORAGE_KEY,
        expect.stringContaining('"airtable":"not-started"')
      );
    });
  });

  describe("resetAllSetupSections", () => {
    it("removes setup sections from localStorage", () => {
      resetAllSetupSections();

      expect(localStorage.removeItem).toHaveBeenCalledWith(SETUP_SECTIONS_STORAGE_KEY);
    });
  });
});
