import { useCallback } from "react";
import { validateEmail, validatePassword } from "@/features/auth/services/authValidation";

/**
 * Bridges auth validation services for EmailAuthForm (components must not import services directly).
 */
export const useEmailAuthValidation = () => {
  const validateEmailField = useCallback((email: string) => validateEmail(email), []);
  const validatePasswordField = useCallback((password: string) => validatePassword(password), []);

  return { validateEmailField, validatePasswordField };
};
