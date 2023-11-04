import { useMutation } from "react-query";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "./client";
import { useDemo } from "@src/features/demo/useDemo";

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

export function useSignInOut() {
  const { isDemo, setIsDemo } = useDemo();

  const {
    mutateAsync: signInMutation,
    isLoading: isSigningIn,
    error: signInError,
    isError: isSignInError,
    isSuccess: isSignInSuccess,
  } = useMutation<SignInResponse, AuthError, SignInWithPasswordParams>(
    signInUser
  );

  const {
    mutateAsync: signOutMutation,
    isLoading: isSigningOut,
    error: signOutError,
    isSuccess: signOutSuccess,
  } = useMutation(signOutUser);

  async function signIn({ email, password }: SignInWithPasswordParams) {
    if (isDemo) {
      // if a user signs in while demo mode is active, disable demo mode
      setIsDemo(false);
    }

    return signInMutation({ email, password });
  }

  async function signOut() {
    if (isDemo) {
      // if demo mode is active, disable demo mode
      setIsDemo(false);
    }

    return signOutMutation();
  }

  return {
    signIn,
    isSigningIn,
    signInError,
    isSignInError,
    isSignInSuccess,
    signOut,
    isSigningOut,
    signOutError,
    signOutSuccess,
  };
}
