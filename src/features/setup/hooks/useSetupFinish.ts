import { useState, useEffect } from "react";
import { migrateOldSetupState } from "@utils/setupUtils";
import { finishSetup } from "../services/setupService";

/**
 * Hook for managing setup finish flow.
 * Handles dialog state, migration, and finish logic.
 */
export const useSetupFinish = () => {
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Migrate old state on mount
  useEffect(() => {
    migrateOldSetupState();
  }, []);

  const handleOpenDialog = () => {
    setFinishDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!finishing) {
      setFinishDialogOpen(false);
    }
  };

  const handleFinish = async () => {
    setFinishing(true);
    try {
      await finishSetup();
      // finishSetup will reload the page, so we don't need to handle success here
    } catch {
      alert("Failed to finish setup. Please try again.");
      setFinishing(false);
    }
  };

  return {
    finishDialogOpen,
    finishing,
    handleOpenDialog,
    handleCloseDialog,
    handleFinish,
  };
};
