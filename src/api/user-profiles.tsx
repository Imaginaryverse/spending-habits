import { useQuery, useMutation } from "react-query";
import { supabase } from "./client";
import { UserProfile } from "@src/types";

async function fetchUserProfile(user_id?: string): Promise<UserProfile> {
  const { data: userProfile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }

  return userProfile[0] as UserProfile;
}

async function createInitialUserProfile(user_id: string): Promise<UserProfile> {
  const { data: userProfile, error } = await supabase
    .from("user_profiles")
    .insert({ user_id })
    .single();

  if (error) {
    throw error;
  }

  return userProfile as UserProfile;
}

type UpdateUserProfileParams = {
  user_id: string;
  updates: Partial<UserProfile>;
};

async function updateUserProfile(
  params: UpdateUserProfileParams
): Promise<UserProfile> {
  const { data: userProfile, error } = await supabase
    .from("user_profiles")
    .update(params.updates)
    .eq("user_id", params.user_id)
    .single();

  if (error) {
    throw error;
  }

  return userProfile as UserProfile;
}

export function useCreateInitialUserProfile() {
  const {
    mutateAsync,
    isError: isCreateInitialUserError,
    isSuccess: isCreateInitialUserSuccess,
  } = useMutation(createInitialUserProfile);

  return {
    createInitialUserProfile: mutateAsync,
    isCreateInitialUserError,
    isCreateInitialUserSuccess,
  };
}

export function useUserProfile(user_id?: string) {
  const {
    data: userProfile = null,
    isLoading: isLoadingUserProfile,
    refetch: refetchUserProfile,
  } = useQuery(["user_profiles", user_id], () => fetchUserProfile(user_id), {
    enabled: !!user_id,
  });

  const {
    mutateAsync,
    isLoading: isUpdatingUserProfile,
    isSuccess: isUserProfileUpdated,
    isError: isUserProfileUpdateError,
  } = useMutation(updateUserProfile);

  return {
    userProfile,
    isLoadingUserProfile,
    refetchUserProfile,
    updateUserProfile: mutateAsync,
    isUpdatingUserProfile,
    isUserProfileUpdated,
    isUserProfileUpdateError,
  };
}
