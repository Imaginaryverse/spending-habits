import { useMutation } from "react-query";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "./client";

type SignInWithPasswordParams = {
  email: string;
  password: string;
};

type SignInResponse = {
  user: User | null;
  session: Session | null;
};

async function signInUser({
  email,
  password,
}: SignInWithPasswordParams): Promise<SignInResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get the current signed in user
 * @returns {Promise<User | null>} The current signed in user, or null if no user is signed in
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();

  return data?.user ?? null;
}

async function signOutUser(): Promise<void> {
  await supabase.auth.signOut();
}

function useSignIn() {
  const {
    mutateAsync,
    isLoading: isSigningIn,
    error: signInError,
    isError: isSignInError,
    isSuccess: isSignInSuccess,
  } = useMutation<SignInResponse, AuthError, SignInWithPasswordParams>(
    signInUser
  );

  return {
    signIn: mutateAsync,
    isSigningIn,
    signInError,
    isSignInError,
    isSignInSuccess,
  };
}

function useSignOut() {
  const {
    mutateAsync,
    isLoading: isSigningOut,
    error: signOutError,
    isSuccess: signOutSuccess,
  } = useMutation(signOutUser);

  return {
    signOut: mutateAsync,
    isSigningOut,
    signOutError,
    signOutSuccess,
  };
}

export function useSignInOut() {
  return {
    ...useSignIn(),
    ...useSignOut(),
  };
}
