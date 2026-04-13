import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { computeStepValidation } from "./airtableWizardStepValidation";
import { useAirtableDialogFlow } from "./useAirtableDialogFlow";
import * as envWriterService from "../services/envWriterService";

vi.mock("../services/envWriterService");

describe("computeStepValidation", () => {
  const baseCtx = {
    airtableApiKey: "",
    airtableBaseId: "",
    airtableTableId: "",
    tableStructure: null,
    loadingStructure: false,
    structureError: null as string | null,
    envWritten: false,
    writingEnv: false,
  };

  it("step 0 requires API key", () => {
    expect(computeStepValidation(0, baseCtx).canProceed).toBe(false);
    expect(computeStepValidation(0, { ...baseCtx, airtableApiKey: "k" }).canProceed).toBe(true);
  });

  it("step 2 requires successful structure fetch", () => {
    expect(
      computeStepValidation(2, {
        ...baseCtx,
        airtableApiKey: "k",
        airtableBaseId: "b",
        airtableTableId: "t",
        tableStructure: null,
        loadingStructure: true,
      }).canProceed
    ).toBe(false);

    expect(
      computeStepValidation(2, {
        ...baseCtx,
        airtableApiKey: "k",
        airtableBaseId: "b",
        airtableTableId: "t",
        tableStructure: { fields: [] },
        loadingStructure: false,
        structureError: null,
      }).canProceed
    ).toBe(true);
  });
});

describe("useAirtableDialogFlow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(envWriterService.writeEnvVariables).mockResolvedValue({ success: true });
  });

  it("advances from step 0 to 1 when PAT is set and save is invoked", async () => {
    const onClose = vi.fn();
    const { result } = renderHook(() =>
      useAirtableDialogFlow({
        open: true,
        onClose,
        onStatusChange: vi.fn(),
      })
    );

    act(() => {
      result.current.setAirtableApiKey("pat");
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.activeStep).toBe(1);
  });

  it("resets fields when dialog closes", () => {
    const { result, rerender } = renderHook(
      ({ open }: { open: boolean }) =>
        useAirtableDialogFlow({
          open,
          onClose: vi.fn(),
          onStatusChange: vi.fn(),
        }),
      { initialProps: { open: true } }
    );

    act(() => {
      result.current.setAirtableApiKey("x");
    });

    rerender({ open: false });

    expect(result.current.airtableApiKey).toBe("");
  });
});
