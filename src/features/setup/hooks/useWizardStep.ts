import { useState, useCallback } from "react";

interface UseWizardStepOptions {
  totalSteps: number;
  onReset?: () => void;
}

interface UseWizardStepReturn {
  activeStep: number;
  goToNext: () => Promise<void>;
  goToPrevious: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

/**
 * Hook for managing wizard step state and navigation
 *
 * @param totalSteps - Total number of steps in the wizard
 * @param onReset - Optional callback when wizard is reset
 * @returns Step management functions and state
 */
export const useWizardStep = ({
  totalSteps,
  onReset,
}: UseWizardStepOptions): UseWizardStepReturn => {
  const [activeStep, setActiveStep] = useState(0);

  const goToNext = useCallback(async () => {
    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const goToPrevious = useCallback(() => {
    setActiveStep((prev) => {
      const newStep = Math.max(prev - 1, 0);
      // Call reset callback when going back from last step
      if (prev === totalSteps - 1 && onReset) {
        onReset();
      }
      return newStep;
    });
  }, [totalSteps, onReset]);

  const goToStep = useCallback(
    (step: number) => {
      setActiveStep(Math.max(0, Math.min(step, totalSteps - 1)));
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setActiveStep(0);
    onReset?.();
  }, [onReset]);

  return {
    activeStep,
    goToNext,
    goToPrevious,
    goToStep,
    reset,
    isFirstStep: activeStep === 0,
    isLastStep: activeStep === totalSteps - 1,
  };
};
