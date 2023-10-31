import { useEffect, useMemo, useState } from "react";
import {
  Button,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSignInOut } from "@src/api/auth";
import { useAuth } from "@src/features/auth/useAuth";
import { Page } from "@src/components/page/Page";
import { useUserProfile } from "@src/api/user-profiles";
import { PaperStack } from "@src/components/paper-stack/PaperStack";
import { useQueryClient } from "react-query";
import { QUERY_KEY } from "@src/types";

type ProfileFormValues = {
  name: string;
  monthlySpendingLimit: number;
};

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { signOut } = useSignInOut();

  const {
    userProfile,
    updateUserProfile,
    isUpdatingUserProfile,
    isUserProfileUpdateError,
  } = useUserProfile(user?.id, {
    onSuccess: onUpdateProfileSuccess,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileFormValues, setProfileFormValues] = useState<ProfileFormValues>(
    {
      name: userProfile?.name ?? "",
      monthlySpendingLimit: userProfile?.monthly_spending_limit ?? 0,
    }
  );

  function onUpdateProfileSuccess() {
    queryClient.invalidateQueries(QUERY_KEY.user_profiles);
    setIsEditing(false);
  }

  function updateInput(key: keyof ProfileFormValues, value: string) {
    if (key === "name" && value.length > 20) {
      return;
    }

    if (key === "monthlySpendingLimit" && Number.isNaN(Number(value))) {
      return;
    }

    setProfileFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user || !userProfile) {
      return;
    }

    updateUserProfile({
      user_id: user.id,
      updates: {
        name: profileFormValues.name,
        monthly_spending_limit: Number(profileFormValues.monthlySpendingLimit),
      },
    });
  }

  useEffect(() => {
    if (userProfile) {
      setProfileFormValues({
        name: userProfile.name ?? "",
        monthlySpendingLimit: userProfile.monthly_spending_limit,
      });
    }
  }, [userProfile]);

  const disableSaveButton = useMemo(() => {
    return (
      profileFormValues.name === userProfile?.name &&
      profileFormValues.monthlySpendingLimit ===
        userProfile?.monthly_spending_limit
    );
  }, [profileFormValues, userProfile]);

  if (!user || !userProfile) {
    return null;
  }

  return (
    <Page>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h1">Profile</Typography>

        <Button
          variant="contained"
          onClick={() => signOut()}
          disabled={isEditing}
        >
          Sign Out
        </Button>
      </Stack>

      <PaperStack>
        <Stack
          component="form"
          autoComplete="off"
          onSubmit={handleUpdateProfile}
          width="100%"
          spacing={2}
        >
          <FormGroup>
            <FormLabel htmlFor="name">Name</FormLabel>
            {isEditing ? (
              <TextField
                id="name"
                placeholder={"Name"}
                value={profileFormValues.name}
                onChange={(e) => updateInput("name", e.target.value)}
                disabled={!isEditing}
              />
            ) : (
              <Typography sx={{ py: 1, px: 1.75 }}>
                {userProfile?.name}
              </Typography>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="monthlySpendingLimit">
              Monthly spending limit
            </FormLabel>
            {isEditing ? (
              <TextField
                id="monthlySpendingLimit"
                placeholder={
                  userProfile?.monthly_spending_limit?.toString() ?? "0"
                }
                value={profileFormValues.monthlySpendingLimit}
                onChange={(e) =>
                  updateInput("monthlySpendingLimit", e.target.value)
                }
                disabled={!isEditing}
              />
            ) : (
              <Typography sx={{ py: 1, px: 1.75 }}>
                {userProfile?.monthly_spending_limit ?? 0} kr
              </Typography>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel>Email</FormLabel>

            {isEditing ? (
              <TextField
                id="email"
                placeholder={user?.email ?? ""}
                value={user?.email ?? ""}
                helperText="Email cannot be changed"
                disabled
              />
            ) : (
              <Typography sx={{ py: 1, px: 1.75 }}>{user?.email}</Typography>
            )}
          </FormGroup>

          {isUserProfileUpdateError && (
            <Typography variant="body2" color="error" textAlign="center">
              Something went wrong. Please try again.
            </Typography>
          )}

          <Stack
            direction="row"
            justifyContent="center"
            flex={1}
            spacing={2}
            p={1}
          >
            <Button
              variant={isEditing ? "outlined" : "text"}
              onClick={() => setIsEditing((prev) => !prev)}
              disabled={isUpdatingUserProfile}
            >
              {isEditing ? "Cancel" : "Edit profile"}
            </Button>

            {isEditing && (
              <Button
                type="submit"
                variant="contained"
                disabled={disableSaveButton || isUpdatingUserProfile}
              >
                Save
              </Button>
            )}
          </Stack>
        </Stack>
      </PaperStack>
    </Page>
  );
}
