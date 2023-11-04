import { useQuery, useMutation, UseMutationOptions } from "react-query";
import { supabase } from "./client";
import { QUERY_KEY, UserProfile } from "@src/types";
import { useDemo } from "@src/features/demo/useDemo";

async function fetchUserProfile(user_id?: string): Promise<UserProfile> {
  const { data: userProfile, error } = await supabase
    .from(QUERY_KEY.user_profiles)
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    throw error;
  }

  return userProfile[0] as UserProfile;
}

async function createInitialUserProfile(user_id: string): Promise<UserProfile> {
  const { data: userProfile, error } = await supabase
    .from(QUERY_KEY.user_profiles)
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
    .from(QUERY_KEY.user_profiles)
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

export function useUserProfile(
  user_id?: string,
  mutationOptions?: UseMutationOptions<
    UserProfile,
    unknown,
    UpdateUserProfileParams
  >
) {
  const { isDemo, demoUserProfile, setDemoUserProfile } = useDemo();

  function fetchDemoUserProfile(user_id?: string): UserProfile {
    if (!user_id) {
      throw new Error("User not found");
    }

    return demoUserProfile;
  }

  const {
    data: userProfile = null,
    isLoading: isLoadingUserProfile,
    refetch: refetchUserProfile,
  } = useQuery(
    [QUERY_KEY.user_profiles, user_id, demoUserProfile],
    () => (isDemo ? fetchDemoUserProfile(user_id) : fetchUserProfile(user_id)),
    {
      enabled: !!user_id,
    }
  );

  async function updateDemoUserProfile(
    params: UpdateUserProfileParams
  ): Promise<UserProfile> {
    if (!params.user_id) {
      throw new Error("User not found");
    }

    const updatedUserProfile = {
      ...demoUserProfile,
      ...params.updates,
    };

    setDemoUserProfile(updatedUserProfile);

    return updatedUserProfile;
  }

  const {
    mutateAsync,
    isLoading: isUpdatingUserProfile,
    isSuccess: isUserProfileUpdated,
    isError: isUserProfileUpdateError,
  } = useMutation(
    isDemo ? updateDemoUserProfile : updateUserProfile,
    mutationOptions
  );

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
