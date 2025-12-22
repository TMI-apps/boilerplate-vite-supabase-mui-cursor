import { getSupabase } from "@shared/services/supabaseService";
import type { User, LoginCredentials, SignUpCredentials } from "../types/auth.types";

export const login = async (
  credentials: LoginCredentials
): Promise<{ user: User | null; error: Error | null }> => {
  try {
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { user: null, error };
    }

    const user: User | null = data.user
      ? {
          id: data.user.id,
          email: data.user.email || "",
          created_at: data.user.created_at,
        }
      : null;

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error("Login failed"),
    };
  }
};

export const signUp = async (
  credentials: SignUpCredentials
): Promise<{ user: User | null; error: Error | null }> => {
  try {
    const { data, error } = await getSupabase().auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return { user: null, error };
    }

    const user: User | null = data.user
      ? {
          id: data.user.id,
          email: data.user.email || "",
          created_at: data.user.created_at,
        }
      : null;

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error("Sign up failed"),
    };
  }
};

export const logout = async (): Promise<{ error: Error | null }> => {
  try {
    const { error } = await getSupabase().auth.signOut();
    return { error: error || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Logout failed"),
    };
  }
};

export const getCurrentUser = async (): Promise<{
  user: User | null;
  error: Error | null;
}> => {
  try {
    const {
      data: { user: authUser },
      error,
    } = await getSupabase().auth.getUser();

    if (error) {
      return { user: null, error };
    }

    const user: User | null = authUser
      ? {
          id: authUser.id,
          email: authUser.email || "",
          created_at: authUser.created_at,
        }
      : null;

    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error("Get user failed"),
    };
  }
};
