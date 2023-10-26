import { useQuery, useMutation, QueryObserverOptions } from "react-query";
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

export function useFetchUserProfile(
  user_id?: string,
  options?: QueryObserverOptions<UserProfile>
) {
  const { data: userProfile = null, isFetching: isFetchingUserProfile } =
    useQuery({
      queryKey: ["user_profiles", user_id],
      queryFn: () => fetchUserProfile(user_id),
      ...options,
    });

  return {
    userProfile,
    isFetchingUserProfile,
  };
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

export function useUpdateUserProfile() {
  const {
    mutateAsync,
    isLoading: isUpdatingUserProfile,
    isSuccess: isUserProfileUpdated,
  } = useMutation(updateUserProfile);

  return {
    updateUserProfile: mutateAsync,
    isUpdatingUserProfile,
    isUserProfileUpdated,
  };
}
