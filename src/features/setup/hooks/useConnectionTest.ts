import { useState } from "react";

export interface ConnectionTestResult {
  success: boolean;
  error?: string;
}

interface UseConnectionTestOptions {
  onTest: () => Promise<ConnectionTestResult>;
  onSuccess?: () => void;
}

export const useConnectionTest = ({ onTest, onSuccess }: UseConnectionTestOptions) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  const runTest = async (): Promise<ConnectionTestResult> => {
    setTesting(true);
    setTestResult(null);

    try {
      const result = await onTest();
      setTestResult(result);
      if (result.success && onSuccess) {
        onSuccess();
      }
      return result;
    } catch (error) {
      const err: ConnectionTestResult = {
        success: false,
        error: error instanceof Error ? error.message : "Test failed",
      };
      setTestResult(err);
      return err;
    } finally {
      setTesting(false);
    }
  };

  return {
    testing,
    testResult,
    runTest,
    setTestResult,
  };
};
